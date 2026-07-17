/**
 * CREATE JOB FAIR FORM — FINAL VERSION
 * Clean, validated, stable, with +91 prefix phone inputs.
 */

import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../config";

const CreateJobFairForm = ({
  setShowJobFairModal,
  setJobFairs,
  admin,
  adminId: propAdminId,
}) => {
  const { adminId: paramsAdminId } = useParams();

  const finalAdminId = propAdminId || paramsAdminId;
const validateFileSize = (file) => {
  if (!file) return null;
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size > maxSize ? "File exceeds 5MB" : null;
};

  // ---------------------------
  // STATES
  // ---------------------------
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [jobCards, setJobCards] = useState([
    {
      companyLogo: null,
      companyName: "",
      jobProfile: "",
      candidatesRequired: "",
      jobLocation: "",
    },
  ]);
  const [companyLogoFiles, setCompanyLogoFiles] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [errors, setErrors] = useState({});
  const [selectedState, setSelectedState] = useState("");

  const [formData, setFormData] = useState({
    adminId: finalAdminId,
    jobFairName: "",
    organizedBy: "",
    fairType: "",
    registrationDateTime: "",
    jobFairStart: "",
    jobFairEnd: "",
    whatsappNumber: "",
    venue: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      nearestBusStop: "",
      nearestAirport: "",
      nearestTrainStation: "",
    },
    locationUrl: "",
    phone: "",
    additionalPhone: "",
    additionalPhone2: "",
    additionalPhone3: "",
    email: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    description: "",
    eligibility: "",
    fairBanner: null,
    fairLogo: null,
    instructionPDF: null,
    companies: "",
    jobRoles: "",
    activeParticipants: "",
    totalStates: "",
    totalCities: "",
    totalHallTickets: "",
  });

  // ---------------------------
  // STATES LIST
  // ---------------------------
  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Jammu",
    "Ladakh","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
    "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttarakhand","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands",
    "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Lakshadweep",
    "Delhi","Puducherry",
  ];

  // ---------------------------------------------------------
  // HELPER: SHOW ERROR
  // ---------------------------------------------------------
  const showError = (field) =>
    errors[field] ? (
      <div className="text-danger" style={{ fontSize: "13px" }}>
        {errors[field]}
      </div>
    ) : null;

  // ---------------------------------------------------------
  // INPUT HANDLERS
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("venue[")) {
      const key = name.match(/venue\[(.*?)\]/)[1];
      setFormData((prev) => ({
        ...prev,
        venue: { ...prev.venue, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setFormData((prev) => ({
      ...prev,
      venue: { ...prev.venue, state: e.target.value },
    }));
    setErrors((prev) => ({ ...prev, "venue.state": "" }));
  };

 const handleFileChange = (e) => {
  const { name, files } = e.target;
  const file = files[0];

  // check size
  const sizeError = validateFileSize(file);

  setErrors((prev) => ({
    ...prev,
    [name]: sizeError ? "File must be under 5MB" : "",
  }));

  setFormData((prev) => ({
    ...prev,
    [name]: sizeError ? null : file, // prevent invalid file storing
  }));
};


  // ---------------------------------------------------------
  // PHONE INPUT WITH +91 PREFIX
  // ---------------------------------------------------------
  const PhoneInput = ({ label, name, value }) => (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">
        {label}
      </label>

      <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <span className="flex items-center px-3 bg-gray-100 text-gray-500 border-r border-gray-300">+91</span>
        <input
          type="text"
          maxLength={10}
          className="flex-1 px-3 py-2 outline-none w-full"
          placeholder="10-digit number"
          name={name}
          value={value}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, [name]: e.target.value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
          }}
        />
      </div>

      {showError(name)}
    </div>
  );

  // ---------------------------------------------------------
  // JOB CARDS
  // ---------------------------------------------------------
  const handleJobCardChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...jobCards];
    updated[index][name] = value;
    setJobCards(updated);

    setErrors((prev) => ({ ...prev, [`${name}_${index}`]: "" }));
  };

  const handleAddJobCard = () => {
    setJobCards([
      ...jobCards,
      {
        companyLogo: null,
        companyName: "",
        jobProfile: "",
        candidatesRequired: "",
        jobLocation: "",
      },
    ]);
  };

  const removeJobCard = (idx) => {
    const updated = jobCards.filter((_, i) => i !== idx);
    setJobCards(updated);
  };

  // ---------------------------------------------------------
  // FAQ
  // ---------------------------------------------------------
  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...faqs];
    updated[index][name] = value;
    setFaqs(updated);

    setErrors((prev) => ({ ...prev, [`faq_${name}_${index}`]: "" }));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFAQ = (idx) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  // ---------------------------------------------------------
  // MASTER VALIDATION
  // ---------------------------------------------------------
  const validateForm = () => {
    let temp = {};

    const required = [
      "jobFairName",
      "organizedBy",
      "fairType",
      "registrationDateTime",
      "jobFairStart",
      "jobFairEnd",
      "locationUrl",
      "description",
      "eligibility",
      "companies",
      "jobRoles",
      "email",
    ];

    required.forEach((f) => {
      if (!formData[f] || formData[f].trim() === "") {
        temp[f] = "This field is required";
      }
    });

    // Phone validation
["whatsappNumber", "phone", "additionalPhone"].forEach((p) => {
  if (!formData[p] || formData[p].trim() === "") {
    temp[p] = "This field is required";
  } else if (!/^\d{10}$/.test(formData[p])) {
    temp[p] = "Enter valid 10-digit number";
  }
});

    // Venue validation
    const venueReq = [
      "address",
      "city",
      "state",
      "pinCode",
      "nearestBusStop",
      "nearestAirport",
      "nearestTrainStation",
    ];
    venueReq.forEach((k) => {
     if (!formData.venue[k] || formData.venue[k].trim() === "") {
  temp[`venue.${k}`] = "This field is required";
}
    });

    // Pincode
    if (!/^\d{6}$/.test(formData.venue.pinCode)) {
      temp["venue.pinCode"] = "Pincode must be 6 digits";
    }

    // URLs
    // REQUIRED social links
["facebook", "instagram"].forEach((key) => {
  if (!formData[key] || formData[key].trim() === "") {
    temp[key] = "This field is required";
  } else if (!/^https?:\/\/.+\..+/i.test(formData[key])) {
    temp[key] = "Enter a valid URL";
  }
});

   // Only validate linkedin + twitter if entered
["linkedin", "twitter"].forEach((key) => {
  if (formData[key] && !/^https?:\/\/.+\..+/i.test(formData[key])) {
    temp[key] = "Enter a valid URL";
  }
});


["fairBanner", "fairLogo", "instructionPDF"].forEach((fileKey) => {
  if (!formData[fileKey]) {
    temp[fileKey] = "This file is required";
  }
});


    // Job cards
    jobCards.forEach((c, i) => {
      if (!companyLogoFiles[i]) temp[`jobCardLogo_${i}`] = "Company logo required";
      if (!c.companyName) temp[`companyName_${i}`] = "Company name required";
      if (!c.jobProfile) temp[`jobProfile_${i}`] = "Job description required";
      if (!c.candidatesRequired) temp[`candidatesRequired_${i}`] = "Vacancies required";
      if (!c.jobLocation) temp[`jobLocation_${i}`] = "Job location required";
    });

    // FAQ
    faqs.forEach((f, i) => {
      if (!f.question) temp[`faq_q_${i}`] = "Question required";
      if (!f.answer) temp[`faq_a_${i}`] = "Answer required";
    });

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  // ---------------------------------------------------------
  // FORM DATA BUILDER
  // ---------------------------------------------------------
  const getFormDataToSend = () => {
    const fd = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "venue") {
        fd.append(key, formData[key]);
      }
    });

    fd.append("venue", JSON.stringify(formData.venue));
    fd.append("faq", JSON.stringify(faqs));
    fd.append("fairJobCards", JSON.stringify(jobCards));

    companyLogoFiles.forEach((file) => {
      if (file) fd.append("companyLogo", file);
    });

    return fd;
  };

  // ---------------------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setModalMessage("Please correct all highlighted errors.");
      setShowModal(true);
      return;
    }

    try {
  const fd = getFormDataToSend();

  await axios.post(`${SERVER_URL}/api/jobFair/create`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // SUCCESS — reset form
  setModalMessage("Job Fair Created Successfully!");
  setShowModal(true);

  setFormData({
    adminId: finalAdminId,
    jobFairName: "",
    organizedBy: "",
    fairType: "",
    registrationDateTime: "",
    jobFairStart: "",
    jobFairEnd: "",
    whatsappNumber: "",
    venue: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      nearestBusStop: "",
      nearestAirport: "",
      nearestTrainStation: "",
    },
    locationUrl: "",
    phone: "",
    additionalPhone: "",
    additionalPhone2: "",
    additionalPhone3: "",
    email: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    description: "",
    eligibility: "",
    fairBanner: null,
    fairLogo: null,
    instructionPDF: null,
    companies: "",
    jobRoles: "",
    activeParticipants: "",
    totalStates: "",
    totalCities: "",
    totalHallTickets: "",
  });

  setCompanyLogoFiles([]);
  setJobCards([
    {
      companyLogo: null,
      companyName: "",
      jobProfile: "",
      candidatesRequired: "",
      jobLocation: "",
    },
  ]);
  setFaqs([{ question: "", answer: "" }]);
} catch (err) {
  // ERROR — don't reset form
  setModalMessage("Error Occurred. Try again!");
  setShowModal(true);
}

  };

  const handleCloseModal = () => {
  setShowModal(false);

  // Reset only if success message appeared
  if (modalMessage === "Job Fair Created Successfully!") {

    setFormData({
      adminId: finalAdminId,
      jobFairName: "",
      organizedBy: "",
      fairType: "",
      registrationDateTime: "",
      jobFairStart: "",
      jobFairEnd: "",
      whatsappNumber: "",
      venue: {
        address: "",
        city: "",
        state: "",
        pinCode: "",
        nearestBusStop: "",
        nearestAirport: "",
        nearestTrainStation: "",
      },
      locationUrl: "",
      phone: "",
      additionalPhone: "",
      additionalPhone2: "",
      additionalPhone3: "",
      email: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      description: "",
      eligibility: "",
      fairBanner: null,
      fairLogo: null,
      instructionPDF: null,
      companies: "",
      jobRoles: "",
      activeParticipants: "",
      totalStates: "",
      totalCities: "",
      totalHallTickets: "",
    });

    setCompanyLogoFiles([]);
    setJobCards([
      {
        companyLogo: null,
        companyName: "",
        jobProfile: "",
        candidatesRequired: "",
        jobLocation: "",
      },
    ]);
    setFaqs([{ question: "", answer: "" }]);
  }
};


  // ---------------------------------------------------------
  // JSX UI (CLEAN + VALIDATED)
  // ---------------------------------------------------------
  return (
    <>
      <form onSubmit={handleSubmit} className="p-3">
        {/* BASIC DETAILS */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">Job Fair Details</h3>
            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <label className="block text-gray-700 font-bold mb-2">Job Fair Name</label>
                <input
                  type="text"
                  name="jobFairName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.jobFairName}
                  onChange={handleChange}
                />
                {showError("jobFairName")}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block text-gray-700 font-bold mb-2">Organized By</label>
                <input
                  type="text"
                  name="organizedBy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.organizedBy}
                  onChange={handleChange}
                />
                {showError("organizedBy")}
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <label className="block text-gray-700 font-bold mb-2">Registration Deadline</label>
                <input
                  type="datetime-local"
                  name="registrationDateTime"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.registrationDateTime}
                  onChange={handleChange}
                />
                {showError("registrationDateTime")}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <PhoneInput
                  label="WhatsApp Number"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <label className="block text-gray-700 font-bold mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  name="jobFairStart"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.jobFairStart}
                  onChange={handleChange}
                />
                {showError("jobFairStart")}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block text-gray-700 font-bold mb-2">End Date</label>
                <input
                  type="datetime-local"
                  name="jobFairEnd"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.jobFairEnd}
                  onChange={handleChange}
                />
                {showError("jobFairEnd")}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-bold mb-2">Fair Type</label>
              <select
                name="fairType"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={formData.fairType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Career Fair">Career Fair</option>
                <option value="Education Fair">Education Fair</option>
                <option value="Career & Education Fair">Career & Education Fair</option>
                <option value="Conference">Conference</option>
              </select>
              {showError("fairType")}
            </div>
          </div>
        </div>

        {/* VENUE */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">Venue Details</h3>
            
            <div className="mb-3">
              <label className="block text-gray-700 font-bold mb-2">Address</label>
              <input
                type="text"
                name="venue[address]"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={formData.venue.address}
                onChange={handleChange}
              />
              {showError("venue.address")}
            </div>

            <div className="flex flex-wrap -mx-3 mb-3 mt-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <input
                  type="text"
                  name="venue[city]"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.venue.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                {showError("venue.city")}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <input
                  type="text"
                  name="venue[pinCode]"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.venue.pinCode}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
                {showError("venue.pinCode")}
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-3 mt-3">
              <div className="w-full md:w-1/3 px-3 mb-3 md:mb-0">
                <input
                  type="text"
                  name="venue[nearestBusStop]"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Nearest Bus Stop"
                  value={formData.venue.nearestBusStop}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-3 md:mb-0">
                <input
                  type="text"
                  name="venue[nearestAirport]"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Nearest Airport"
                  value={formData.venue.nearestAirport}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-3">
                <input
                  type="text"
                  name="venue[nearestTrainStation]"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Nearest Train Station"
                  value={formData.venue.nearestTrainStation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3 mt-3">
              <label className="block text-gray-700 font-bold mb-2">Location URL</label>
              <input
                type="text"
                name="locationUrl"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={formData.locationUrl}
                onChange={handleChange}
                placeholder="Google Maps URL"
              />
              {showError("locationUrl")}
            </div>

            <div className="mb-3 mt-3">
              <label className="block text-gray-700 font-bold mb-2">State</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">Choose a state</option>
                {states.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
              {showError("venue.state")}
            </div>
          </div>
        </div>

        {/* JOB FAIR STATISTICS */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">Job Fair Statistics</h3>

            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <label className="block text-gray-700 font-bold mb-2">Total number of companies</label>
                <input
                  type="number"
                  name="companies"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.companies}
                  onChange={handleChange}
                />
                {showError("companies")}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block text-gray-700 font-bold mb-2">Total number of Job Roles</label>
                <input
                  type="number"
                  name="jobRoles"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.jobRoles}
                  onChange={handleChange}
                />
                {showError("jobRoles")}
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <label className="block text-gray-700 font-bold mb-2">Total number of active participants</label>
                <input
                  type="number"
                  name="activeParticipants"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.activeParticipants}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block text-gray-700 font-bold mb-2">Number of states participating</label>
                <input
                  type="number"
                  name="totalStates"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.totalStates}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <label className="block text-gray-700 font-bold mb-2">Number of cities participating</label>
                <input
                  type="number"
                  name="totalCities"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.totalCities}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block text-gray-700 font-bold mb-2">Number of hall tickets generated</label>
                <input
                  type="number"
                  name="totalHallTickets"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.totalHallTickets}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>


        {/* CONTACT INFO */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">Contact Information</h3>

            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <PhoneInput
                  label="Primary Phone"
                  name="phone"
                  value={formData.phone}
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <PhoneInput
                  label="Additional Phone"
                  name="additionalPhone"
                  value={formData.additionalPhone}
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <PhoneInput
                  label="Additional Number 2"
                  name="additionalPhone2"
                  value={formData.additionalPhone2}
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <PhoneInput
                  label="Additional Number 3"
                  name="additionalPhone3"
                  value={formData.additionalPhone3}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
              {showError("email")}
            </div>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">Social Media</h3>

            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <input
                  type="url"
                  name="facebook"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Facebook URL"
                  value={formData.facebook}
                  onChange={handleChange}
                />
                {showError("facebook")}
              </div>

              <div className="w-full md:w-1/2 px-3">
                <input
                  type="url"
                  name="instagram"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Instagram URL"
                  value={formData.instagram}
                  onChange={handleChange}
                />
                {showError("instagram")}
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-3 mt-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <input
                  type="url"
                  name="linkedin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
                {showError("linkedin")}
              </div>

              <div className="w-full md:w-1/2 px-3">
                <input
                  type="url"
                  name="twitter"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Twitter URL"
                  value={formData.twitter}
                  onChange={handleChange}
                />
                {showError("twitter")}
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION & ELIGIBILITY */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <div className="mb-3">
              <label className="block text-gray-700 font-bold mb-2">Description</label>
              <textarea
                rows={5}
                name="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={formData.description}
                onChange={handleChange}
              />
              {showError("description")}
            </div>

            <div className="mb-3 mt-3">
              <label className="block text-gray-700 font-bold mb-2">Eligibility</label>
              <textarea
                rows={5}
                name="eligibility"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={formData.eligibility}
                onChange={handleChange}
              />
              {showError("eligibility")}
            </div>
          </div>
        </div>

        {/* UPLOADS */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">Uploads</h3>

            <div className="mb-3">
              <label className="block text-gray-700 font-bold mb-2">Fair Banner</label>
              <input
                type="file"
                name="fairBanner"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onChange={handleFileChange}
              />
              {formData.fairBanner && !errors.fairBanner && (
                <div style={{ color: "green", fontSize: "13px" }}>
                  Banner file size OK ({(formData.fairBanner.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {errors.fairBanner && (
                <div style={{ color: "#d63444", fontSize: "13px" }}>{errors.fairBanner}</div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <label className="block text-gray-700 font-bold mb-2">Fair Logo</label>
              <input
                type="file"
                name="fairLogo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onChange={handleFileChange}
              />
              {formData.fairLogo && !errors.fairLogo && (
                <div style={{ color: "green", fontSize: "13px" }}>
                  Logo file size OK ({(formData.fairLogo.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {errors.fairLogo && (
                <div style={{ color: "#d63444", fontSize: "13px" }}>{errors.fairLogo}</div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <label className="block text-gray-700 font-bold mb-2">Instruction PDF</label>
              <input
                type="file"
                name="instructionPDF"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onChange={handleFileChange}
              />
              {formData.instructionPDF && !errors.instructionPDF && (
                <div style={{ color: "green", fontSize: "13px" }}>
                  Instruction file size OK ({(formData.instructionPDF.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {errors.instructionPDF && (
                <div style={{ color: "#d63444", fontSize: "13px" }}>{errors.instructionPDF}</div>
              )}
            </div>
          </div>
        </div>

        {/* JOB CARDS */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">Job Cards</h3>

            {jobCards.map((job, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md mb-4 bg-gray-50">
                <div className="flex flex-wrap -mx-3 mb-3">
                  <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                    <label className="block text-gray-700 font-bold mb-2">Company Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const sizeError = validateFileSize(file);

                        // update UI error
                        setErrors((prev) => ({
                          ...prev,
                          [`jobCardLogo_${index}`]: sizeError ? "Logo must be under 5MB" : "",
                        }));

                        const files = [...companyLogoFiles];
                        files[index] = sizeError ? null : file;
                        setCompanyLogoFiles(files);
                      }}
                    />
                    {companyLogoFiles[index] && !errors[`jobCardLogo_${index}`] && (
                      <div style={{ color: "green" , fontSize: "13px" }}>
                        Logo OK ({(companyLogoFiles[index].size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                    {errors[`jobCardLogo_${index}`] && (
                      <div style={{ color: "#d63444", fontSize: "13px" }}>{errors[`jobCardLogo_${index}`]}</div>
                    )}
                  </div>

                  <div className="w-full md:w-1/2 px-3">
                    <label className="block text-gray-700 font-bold mb-2">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      value={job.companyName}
                      onChange={(e) => handleJobCardChange(index, e)}
                    />
                    {showError(`companyName_${index}`)}
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <label className="block text-gray-700 font-bold mb-2">Job Description</label>
                  <textarea
                    rows={3}
                    name="jobProfile"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    value={job.jobProfile}
                    onChange={(e) => handleJobCardChange(index, e)}
                  />
                  {showError(`jobProfile_${index}`)}
                </div>

                <div className="flex flex-wrap -mx-3 mb-3 mt-3">
                  <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                    <label className="block text-gray-700 font-bold mb-2">Vacancies</label>
                    <input
                      type="number"
                      name="candidatesRequired"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      value={job.candidatesRequired}
                      onChange={(e) => handleJobCardChange(index, e)}
                    />
                    {showError(`candidatesRequired_${index}`)}
                  </div>

                  <div className="w-full md:w-1/2 px-3">
                    <label className="block text-gray-700 font-bold mb-2">Job Location</label>
                    <input
                      type="text"
                      name="jobLocation"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      value={job.jobLocation}
                      onChange={(e) => handleJobCardChange(index, e)}
                    />
                    {showError(`jobLocation_${index}`)}
                  </div>
                </div>

                {jobCards.length > 1 && (
                  <button
                    type="button"
                    className="mt-3 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    onClick={() => removeJobCard(index)}
                  >
                    Remove Job Card
                  </button>
                )}
              </div>
            ))}

            <button 
              type="button"
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" 
              onClick={handleAddJobCard}
            >
              + Add Job Card
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h3 className="text-xl font-medium mb-3">FAQs</h3>

            {faqs.map((faq, index) => (
              <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50" key={index}>
                <div className="mb-3">
                  <label className="block text-gray-700 font-bold mb-2">Question</label>
                  <input
                    type="text"
                    name="question"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, e)}
                  />
                  {showError(`faq_q_${index}`)}
                </div>

                <div className="mb-3 mt-2">
                  <label className="block text-gray-700 font-bold mb-2">Answer</label>
                  <textarea
                    rows={3}
                    name="answer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, e)}
                  />
                  {showError(`faq_a_${index}`)}
                </div>

                {faqs.length > 1 && (
                  <button
                    type="button"
                    className="mt-2 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    onClick={() => removeFAQ(index)}
                  >
                    Remove FAQ
                  </button>
                )}
              </div>
            ))}

            <button 
              type="button"
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" 
              onClick={handleAddFaq}
            >
              + Add FAQ
            </button>
          </div>
        </div>

        <div className="text-right">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
            Submit
          </button>
        </div>
      </form>

      {/* MODAL */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[1050] flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black/50 outline-none focus:outline-none"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-auto max-w-lg p-4 mx-auto my-6 bg-white rounded shadow-lg flex flex-col w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-4 border-b border-solid rounded-t border-blueGray-200">
              <h3 className="text-xl font-semibold">Status</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={handleCloseModal}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                {modalMessage}
              </p>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
              <button
                className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleCloseModal}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateJobFairForm;


// /**
//  * Function is used to create the Job fairs. It contains the details of job fairs.
//  */
// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { Form, Button, Row, Col, Card, Modal } from "react-bootstrap";
// import axios from "axios";
// // Constant
// import { SERVER_URL } from "../../App";

// const CreateJobFairForm = ({ setShowJobFairModal, setJobFairs, admin, adminId: propAdminId}) => {
//   const { adminId } = useParams();
//   const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [jobCards, setJobCards] = useState([
//     {
//       companyLogo: "",
//       companyName: "",
//       jobProfile: "",
//       candidatesRequired: "",
//       jobLocation: "",
//     },
//   ]);
//   const [formData, setFormData] = useState({
//     adminId: propAdminId,
//     jobFairName: "",
//     organizedBy: "",
//     fairType: "",
//     registrationDateTime: "",
//     jobFairStart: "",
//     jobFairEnd: "",
//     whatsappNumber: "",
//     venue: {
//       address: "",
//       city: "",
//       state: "",
//       pinCode: "",
//       nearestBusStop: "",
//       nearestAirport: "",
//       nearestTrainStation: "",
//     },
//     phone: "",
//     additionalPhone: "",
//     additionalPhone2: "",
//     additionalPhone3: "",
//     email: "",
//     // Flattened social links
//     facebook: "",
//     instagram: "",
//     linkedin: "",
//     twitter: "",
//     // Moved outside venue
//     locationUrl: "",
//     description: "",
//     eligibility: "",
//     faq: [],
//     fairBanner: "",
//     fairLogo: "",
//     fairJobCards: [],
//     instructionPDF: null,
//     companies: "",
//     jobRoles: "",
//     activeParticipants: "",
//     totalStates: "",
//     totalCities: "",
//     totalHallTickets: "",
//   });
//   const [companyLogoFiles, setCompanyLogoFiles] = useState([]);
//   const [selectedState, setSelectedState] = useState("");

//   // Options for the states select
//   const states = [
//     "Andhra Pradesh",
//     "Arunachal Pradesh",
//     "Assam",
//     "Bihar",
//     "Chhattisgarh",
//     "Goa",
//     "Gujarat",
//     "Haryana",
//     "Himachal Pradesh",
//     "Jharkhand",
//     "Jammu",
//     "Ladakh",
//     "Karnataka",
//     "Kerala",
//     "Madhya Pradesh",
//     "Maharashtra",
//     "Manipur",
//     "Meghalaya",
//     "Mizoram",
//     "Nagaland",
//     "Odisha",
//     "Punjab",
//     "Rajasthan",
//     "Sikkim",
//     "Tamil Nadu",
//     "Telangana",
//     "Tripura",
//     "Uttarakhand",
//     "Uttar Pradesh",
//     "West Bengal",
//     "Andaman and Nicobar Islands",
//     "Chandigarh",
//     "Dadra and Nagar Haveli and Daman and Diu",
//     "Lakshadweep",
//     "Delhi",
//     "Puducherry",
//   ];

//   /**
//    * Function is used to handle the state change in the 'state' field as it is select field.
//    */
//   const handleStateChange = (e) => {
//     const stateValue = e.target.value;
//     setSelectedState(stateValue); // still updates dropdown visually
//     setFormData((prevState) => ({
//       ...prevState,
//       venue: { ...prevState.venue, state: stateValue }, // ✅ syncs with actual data sent
//     }));
//   };

//   /**
//    * Function is used to handle the change in the text input fields.
//    */
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.includes("venue[")) {
//       const key = name.match(/venue\[(.*?)\]/)[1];
//       setFormData((prev) => ({
//         ...prev,
//         venue: { ...prev.venue, [key]: value },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   /**
//    * Function is used to handle the file change when file is uploaded.
//    */
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files[0],
//     });
//   };

//   /**
//    * Function is used to fetch the job fairs data from the API.
//    */
//   const fetchAllJobFairs = async () => {
//     try {
//       const res = await axios.get(`${SERVER_URL}/api/jobFair/all`);
//       setJobFairs(res.data);
//     } catch (err) {
//       console.error("Error fetching job fairs:", err);
//     }
//   };

//   /**
//    * Function is used to fetch the job fairs as per the admin id.
//    */
//   const fetchJobFairs = async () => {
//     try {
//       const response = await axios.get(
//         `${SERVER_URL}/api/jobFair/admin/${adminId}`
//       );
//       setJobFairs(response.data);
//     } catch (error) {
//       console.error("Error fetching job fairs:", error);
//     }
//   };

//   const handleAddFaq = () => {
//     setFaqs([...faqs, { question: "", answer: "" }]);
//   };
//   const handleFaqChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedFaqs = [...faqs];
//     updatedFaqs[index][name] = value;
//     setFaqs(updatedFaqs);
//   };

//   const handleAddJobCard = () => {
//     setJobCards([
//       ...jobCards,
//       {
//         companyLogo: "",
//         companyName: "",
//         jobProfile: "",
//         candidatesRequired: "",
//         jobLocation: "",
//       },
//     ]);
//   };

//   /**
//    * Function is used to create the handle job card change .
//    */
//   const handleJobCardChange = (index, event) => {
//     const { name, value, files } = event.target;
//     const updatedJobCards = [...jobCards];
//     if (files && files[0]) {
//       const file = files[0];
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         updatedJobCards[index][name] = reader.result;
//         setJobCards(updatedJobCards);
//       };
//     } else {
//       updatedJobCards[index][name] = value;
//       setJobCards(updatedJobCards);
//     }
//   };

//   function getFormDataToSend() {
//     const formDataToSend = new FormData();

//     // ✅ 1. Append top-level fields except nested objects
//     Object.keys(formData).forEach((key) => {
//       if (key !== "venue" && key !== "faq" && key !== "fairJobCards") {
//         formDataToSend.append(key, formData[key] ?? "");
//       }
//     });

//     // ✅ 2. Append venue fields (main fix)
//     // ✅ Append venue as JSON string (new way)
//     formDataToSend.append("venue", JSON.stringify(formData.venue));

//     // ✅ 3. Explicitly append social links (flattened)
//     const socialKeys = ["facebook", "instagram", "linkedin", "twitter"];
//     socialKeys.forEach((key) =>
//       formDataToSend.append(key, formData[key] ?? "")
//     );

//     // ✅ 4. Add FAQs and Job Cards as JSON
//     formDataToSend.append("faq", JSON.stringify(faqs));
//     formDataToSend.append("fairJobCards", JSON.stringify(jobCards));

//     // ✅ 5. Add company logos (files)
//     companyLogoFiles.forEach((file) => {
//       if (file) formDataToSend.append("companyLogo", file);
//     });

//     // ✅ 6. Debugging log before sending (super helpful)
//     console.log("📤 FINAL FORMDATA BEFORE SUBMIT:");
//     for (let [key, value] of formDataToSend.entries()) {
//       console.log("📤", key, "→", value);
//     }

//     return formDataToSend;
//   }

//   /**
//    * Function is used to handle the form submission. It will generate and create the job fair and then it will fetch all the form data from the state.
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("📍 Final Venue Data Before Submit →", formData.venue);
//       const formDataToSend = getFormDataToSend();
//       const response = await axios.post(
//         `${SERVER_URL}/api/jobFair/create`,
//         formDataToSend,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       if (!response.data || Object.keys(response.data).length === 0) {
//         console.error("Empty response from server");
//         return;
//       }
//       setShowModal(true);
//       setModalMessage("Job Fair succesfully Created!");
//       if (admin === "admin") {
//         fetchJobFairs();
//       } else {
//         fetchAllJobFairs();
//       }
//     } catch (error) {
//       setShowModal(true);
//       setModalMessage("Error Occured: Try again later!");
//     }
//   };

//   /**
//    * Function is used to remove the job cards from the create modal.
//    * @param {number} index
//    */
//   const removeJobCard = (index) => {
//     const updatedJobCards = jobCards.filter((_, i) => i !== index);
//     setJobCards(updatedJobCards);
//   };

//   /**
//    * Function is used to handle the FAQ as it is used to remove faq from it
//    */
//   const removeFAQ = (index) => {
//     const updatedFaq = faqs.filter((_, i) => i !== index);
//     setFaqs(updatedFaq);
//   };

//   /** Close the modal */
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setShowJobFairModal(false); // Now move it here
//   };

//   /**
//    * Function is used to display the modal when any event (API is hit)
//    */
//   const renderModal = () => (
//     <Modal show={showModal} onHide={handleCloseModal}>
//       <Modal.Header closeButton>
//         <Modal.Title>Message</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>{modalMessage}</Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleCloseModal}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );

//   return (
//     <>
//       <Form onSubmit={handleSubmit} className="p-3">
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Card.Title className="mb-3">Job Fair Details</Card.Title>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="jobFairName">
//                   <Form.Label>
//                     <strong>Job Fair Name</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter Job Fair Name"
//                     name="jobFairName"
//                     value={formData.jobFairName}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="organizedBy">
//                   <Form.Label>
//                     <strong>Organized By</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Organizer Name"
//                     name="organizedBy"
//                     value={formData.organizedBy}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="registrationDateTime">
//                   <Form.Label>
//                     <strong>Registration Deadline</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="datetime-local"
//                     name="registrationDateTime"
//                     value={formData.registrationDateTime}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="whatsappNumber">
//                   <Form.Label>
//                     <strong>Organizer WhatsApp Number</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="whatsappNumber"
//                     placeholder="+91 9876543210"
//                     value={formData.whatsappNumber}
//                     onChange={handleChange}
//                   />
//                   <Form.Text className="text-muted">
//                     This number will be used for WhatsApp queries.
//                   </Form.Text>
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="jobFairStart">
//                   <Form.Label>
//                     <strong>Start Date</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="datetime-local"
//                     name="jobFairStart"
//                     value={formData.jobFairStart}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="jobFairEnd">
//                   <Form.Label>
//                     <strong>End Date</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="datetime-local"
//                     name="jobFairEnd"
//                     value={formData.jobFairEnd}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Form.Group className="mb-3" controlId="fairType">
//               <Form.Label>
//                 <strong>Fair Type</strong>
//               </Form.Label>
//               <Form.Select
//                 name="fairType"
//                 value={formData.fairType || ""}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">-- Select Fair Type --</option>
//                 <option value="Career Fair">Career Fair</option>
//                 <option value="Education Fair">Education Fair</option>
//                 <option value="Career & Education Fair">
//                   Career & Education Fair
//                 </option>
//                 <option value="Conference">Conference</option>
//               </Form.Select>
//             </Form.Group>
//           </Card.Body>
//         </Card>
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Card.Title className="mb-3">Venue Details</Card.Title>
//             <Form.Group controlId="venueAddress" className="mb-3">
//               <Form.Label>
//                 <strong>Address</strong>
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Address Line 1"
//                 name="venue[address]"
//                 value={formData.venue.address}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Control
//                   type="text"
//                   placeholder="City"
//                   name="venue[city]"
//                   value={formData.venue.city}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Control
//                   type="number"
//                   placeholder="Pin Code"
//                   name="venue[pinCode]"
//                   value={formData.venue.pinCode}
//                   onChange={handleChange}
//                   required
//                 />
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <Form.Control
//                   type="text"
//                   placeholder="Nearest bus stop"
//                   name="venue[nearestBusStop]"
//                   value={formData.venue.nearestBusStop}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <Form.Control
//                   type="text"
//                   placeholder="Nearest Airport"
//                   name="venue[nearestAirport]"
//                   value={formData.venue.nearestAirport}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <Form.Control
//                   type="text"
//                   placeholder="Nearest Train station"
//                   name="venue[nearestTrainStation]"
//                   value={formData.venue.nearestTrainStation}
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>
//             <Form.Label>
//               <strong>Location URL</strong>
//             </Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Location URL (google maps)"
//               name="locationUrl" // ✅ top-level field now
//               value={formData.locationUrl}
//               onChange={handleChange}
//               className="mb-3"
//               required
//             />
//             <Form.Control
//               as="select"
//               value={selectedState}
//               onChange={handleStateChange}
//               name="venue[state]"
//               required
//             >
//               <option value="">Choose a State</option>
//               {states.map((state, index) => (
//                 <option key={index} value={state}>
//                   {state}
//                 </option>
//               ))}
//             </Form.Control>
//           </Card.Body>
//         </Card>
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Card.Title className="mb-3">Job Fair Statistics</Card.Title>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="companies">
//                   <Form.Label>
//                     <strong>Total number of companies</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="companies"
//                     value={formData.companies}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="jobRoles">
//                   <Form.Label>
//                     <strong>Total number of JobRoles</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="jobRoles"
//                     value={formData.jobRoles}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="activeParticipants">
//                   <Form.Label>
//                     <strong>Total number of active participants</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="activeParticipants"
//                     value={formData.activeParticipants}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="totalStates">
//                   <Form.Label>
//                     <strong>Number of states participating</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="totalStates"
//                     value={formData.totalStates}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="totalCities">
//                   <Form.Label>
//                     <strong>Number of cities participating</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="totalCities"
//                     value={formData.totalCities}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="totalHallTickets">
//                   <Form.Label>
//                     <strong>Number of halltickets generated</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="totalHallTickets"
//                     value={formData.totalHallTickets}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Card.Title className="mb-3">Contact Information</Card.Title>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="phone">
//                   <Form.Label>
//                     <strong>Phone</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="phone"
//                     value={formData.phone || ""}
//                     onChange={handleChange}
//                     required
//                     pattern="^(\+91[\s]?)?\d{10}$"
//                     placeholder="+91 88888 88888"
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="additionalPhone">
//                   <Form.Label>
//                     <strong>Additional Phone</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="additionalPhone"
//                     value={formData.additionalPhone || ""}
//                     onChange={handleChange}
//                     pattern="^(\+91[\s]?)?\d{10}$"
//                     placeholder="+91 88888 88888"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Row>
//               <Col md={6}>
//                 <Form.Group controlId="additionalPhone2">
//                   <Form.Label>
//                     <strong>Additional Number 2</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="additionalPhone2"
//                     placeholder="+91 9000000002"
//                     value={formData.additionalPhone2}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="additionalPhone3">
//                   <Form.Label>
//                     <strong>Additional Number 3</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="additionalPhone3"
//                     placeholder="+91 9000000003"
//                     value={formData.additionalPhone3}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group controlId="emailId">
//               <Form.Label>
//                 <strong>Email</strong>
//               </Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Card.Body>
//         </Card>
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Card.Title className="mb-3">Social Media</Card.Title>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Control
//                   type="url"
//                   placeholder="Facebook"
//                   name="facebook"
//                   value={formData.facebook}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Control
//                   type="url"
//                   placeholder="Instagram"
//                   name="instagram"
//                   value={formData.instagram}
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Control
//                   type="url"
//                   placeholder="LinkedIn"
//                   name="linkedin"
//                   value={formData.linkedin}
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <Form.Control
//                   type="url"
//                   placeholder="x"
//                   name="twitter"
//                   value={formData.twitter}
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Form.Group controlId="description" className="mb-3">
//               <Form.Label>
//                 <strong>Description</strong>
//               </Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={6}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="eligibility">
//               <Form.Label>
//                 <strong>Eligibility</strong>
//               </Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={6}
//                 name="eligibility"
//                 value={formData.eligibility}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Card.Body>
//         </Card>
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Card.Title className="mb-3">Uploads</Card.Title>
//             <Form.Group controlId="fairBanner" className="mb-3">
//               <Form.Label>
//                 <strong>Banner (JPEG, PNG, 5MB)</strong>
//               </Form.Label>
//               <Form.Control
//                 type="file"
//                 name="fairBanner"
//                 accept=".jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="fairLogo" className="mb-3">
//               <Form.Label>
//                 <strong>Logo (JPEG, PNG, 1MB)</strong>
//               </Form.Label>
//               <Form.Control
//                 type="file"
//                 name="fairLogo"
//                 accept=".jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//               />
//             </Form.Group>
//             <Form.Group controlId="instructionPDF">
//               <Form.Label>
//                 <strong>Instruction PDF (5MB)</strong>
//               </Form.Label>
//               <Form.Control
//                 type="file"
//                 name="instructionPDF"
//                 accept=".pdf"
//                 onChange={handleFileChange}
//               />
//             </Form.Group>
//           </Card.Body>
//         </Card>
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Card.Title className="mb-3">Job Cards</Card.Title>
//             {jobCards.map((job, index) => (
//               <div key={index} className="mb-4 p-3 border rounded">
//                 <Row className="mb-2">
//                   <Col md={6}>
//                     <Form.Label>
//                       <strong>Company Logo</strong>
//                     </Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const updatedFiles = [...companyLogoFiles];
//                         updatedFiles[index] = e.target.files[0];
//                         setCompanyLogoFiles(updatedFiles);
//                       }}
//                     />
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId={`companyName-${index}`}>
//                       <Form.Label>
//                         <strong>Company Name</strong>
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="companyName"
//                         placeholder="Company Name"
//                         value={job.companyName}
//                         onChange={(e) => handleJobCardChange(index, e)}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Form.Group controlId={`jobProfile-${index}`} className="mb-2">
//                   <Form.Label>
//                     <strong>Job Description</strong>
//                   </Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     name="jobProfile"
//                     placeholder="Complete Job Description"
//                     value={job.jobProfile}
//                     onChange={(e) => handleJobCardChange(index, e)}
//                     rows={4}
//                     required
//                   />
//                 </Form.Group>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group controlId={`candidatesRequired-${index}`}>
//                       <Form.Label>
//                         <strong>Vacancies</strong>
//                       </Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="candidatesRequired"
//                         placeholder="Total Vacancies"
//                         value={job.candidatesRequired}
//                         onChange={(e) => handleJobCardChange(index, e)}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId={`jobLocation-${index}`}>
//                       <Form.Label>
//                         <strong>Location</strong>
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="jobLocation"
//                         placeholder="Job Location"
//                         value={job.jobLocation}
//                         onChange={(e) => handleJobCardChange(index, e)}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 {jobCards.length > 1 && (
//                   <Button
//                     variant="outline-danger"
//                     onClick={() => removeJobCard(index)}
//                     className="mt-2"
//                   >
//                     Remove Job Card
//                   </Button>
//                 )}
//               </div>
//             ))}
//             <Button
//               variant="outline-primary"
//               type="button"
//               onClick={handleAddJobCard}
//             >
//               + Add Job Card
//             </Button>
//           </Card.Body>
//         </Card>
//         <Card className="mb-4 shadow-sm">
//           <Card.Body>
//             <Card.Title className="mb-3">FAQs</Card.Title>
//             {faqs.map((faq, index) => (
//               <div key={index} className="mb-3">
//                 <Form.Group controlId={`question-${index}`} className="mb-2">
//                   <Form.Label>
//                     <strong>Question</strong>
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="question"
//                     placeholder="Enter question"
//                     value={faq.question}
//                     onChange={(e) => handleFaqChange(index, e)}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group controlId={`answer-${index}`}>
//                   <Form.Label>
//                     <strong>Answer</strong>
//                   </Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     name="answer"
//                     placeholder="Enter answer"
//                     value={faq.answer}
//                     onChange={(e) => handleFaqChange(index, e)}
//                     required
//                   />
//                 </Form.Group>
//                 {faqs.length > 1 && (
//                   <Button
//                     variant="outline-danger"
//                     onClick={() => removeFAQ(index)}
//                     className="mt-2"
//                   >
//                     Remove FAQ
//                   </Button>
//                 )}
//               </div>
//             ))}
//             <Button variant="outline-primary" onClick={handleAddFaq}>
//               + Add FAQ
//             </Button>
//           </Card.Body>
//         </Card>
//         <div className="text-end">
//           <Button variant="primary" type="submit" className="px-4">
//             Submit
//           </Button>
//         </div>
//       </Form>
//       {renderModal()}
//     </>
//   );
// };

// export default CreateJobFairForm;
