import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../../config";
import HallTicketModal from "../modals/HallTicketModal";

const RegistrationForm = () => {
  const { jobFairId } = useParams();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    currentCity: "",
    gender: "",
    dob: "",
    highestQualification: "",
    discipline: "",
    yearOfGraduation: "",
    aggregate: "",
    collegeOrUniversity: "",
    collegeCity: "",
    preferredIndustry: [],
    desiredJobRole: [],
    preferredLocations: "",
    willingToRelocate: "",
    resume: null,
    linkedinProfile: "",
    portfolioOrGithub: "",
    heardFrom: [],
    otherSource: "",
    attendedPreviousFair: "",
    declarationConfirmed: false,
    consentToShareProfile: false,
    dateOfSubmission: "",
  });

  /*-----------------  Validation States ----------*/
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState("");

  /*----------------- Modal States ------------------ */
  const [showModal, setShowModal] = useState(false);
  const [hallTicket, setHallTicket] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  /*----------------- All Qualification dropdown options ------------- */
  const qualifications = [
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Science (B.Sc)",
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Arts (BA)",
    "Bachelor of Computer Applications (BCA)",
    "Master of Technology (M.Tech)",
    "Master of Science (M.Sc)",
    "Master of Business Administration (MBA)",
    "Master of Arts (MA)",
    "Master of Computer Applications (MCA)",
    "Diploma in Engineering",
    "Diploma in Business Management",
    "Diploma in Hotel Management",
    "PG Diploma in Management",
    "PG Diploma in Data Science",
    "PG Diploma in Computer Applications",
    "PG Diploma in Journalism",
    "Science Stream",
    "Commerce Stream",
    "Vocational Training in IT",
    "Vocational Training in Healthcare",
    "Vocational Training in Retail Management",
    "Other",
  ];

  /*------------------ Industries Dropdown ------------- */
  const industries = [
    "IT Services",
    "Product Development",
    "Fintech",
    "Telecom",
    "E-commerce",
    "Automobile",
    "Manufacturing",
    "Aerospace",
    "Energy",
    "Hotel Industry",
    "Construction",
    "Infrastructure",
    "Real Estate",
    "Urban Development",
    "Utilities",
    "Electronics",
    "Semiconductors",
    "Telecom",
    "Consumer Electronics",
    "Automation",
    "Tech",
    "Healthcare",
    "Finance",
    "Consulting",
    "Education",
    "Banking",
    "General Industry",
    "Pharma",
    "Agriculture",
    "Research",
    "Corporate",
    "Financial Services",
    "Government",
    "Policy Think Tanks",
    "FMCG",
    "Advertising",
    "Media",
    "Insurance",
    "Startups",
    "Retail",
    "Technology",
    "Services",
    "Publishing",
    "NGOs",
    "Defence",
    "Diagnostics",
  ];

/*---------------- Job Roles Dropdown ---------------- */
  const jobRoles = [
    "Software Developer",
    "Data Analyst",
    "Web Developer",
    "AI Engineer",
    "System Administrator",
    "Mechanical Engineer",
    "Design Engineer",
    "Maintenance Engineer",
    "Production Supervisor",
    "Civil Engineer",
    "Structural Engineer",
    "Site Engineer",
    "Project Manager",
    "Electrical Engineer",
    "Power Systems Engineer",
    "Automation Engineer",
    "Electronics Engineer",
    "Embedded Systems Engineer",
    "Testing Engineer",
    "Data Scientist",
    "ML Researcher",
    "IT Support Specialist",
    "Network Administrator",
    "Database Manager",
    "General Professional Role",
    "Biotech Researcher",
    "Lab Technician",
    "Clinical Data Analyst",
    "General Professional Role",
    "Software Engineer",
    "Accountant",
    "Tax Consultant",
    "Auditor",
    "Financial Analyst",
    "Investment Advisor",
    "Economic Analyst",
    "Research Associate",
    "Marketing Executive",
    "Brand Manager",
    "Digital Marketing Specialist",
    "HR Executive",
    "Talent Acquisition Specialist",
    "Training Coordinator",
    "Startup Founder",
    "Business Consultant",
    "Operations Manager",
    "Content Writer",
    "Editor",
    "Teacher",
    "Counselor",
    "HR Specialist",
    "Research Assistant",
    "Security Analyst",
    "Penetration Tester",
    "Information Security Manager",
    "Business Intelligence Analyst",
    "Chef",
    "Sous Chef",
    "Kitchen Manager",
    "Hotel Manager",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Pathology Technician",
    "Sales Executive",
    "Store Manager",
    "Inventory Controller",
  ];

  /*-------------- Heard from options ----------- */
  const heardOptions = [
    "Social Media (LinkedIn/Instagram/etc.)",
    "College Placement Cell",
    "Friend/Referral",
    "Website/Advertisement",
    "Others",
  ];

  /*----------Specialization mapped by Qualification -----*/
  const specializationsByQualification = {
    "Bachelor of Technology (B.Tech)": [
      "Computer Science Engineering (CSE)",
      "Information Technology (IT)",
      "Electronics & Communication (ECE)",
      "Electrical Engineering (EE)",
      "Mechanical Engineering (ME)",
      "Civil Engineering (CE)",
      "AI & ML Engineering",
    ],
    "Bachelor of Science (B.Sc)": [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biotechnology",
      "Agriculture",
      "Computer Science",
    ],
    "Bachelor of Commerce (B.Com)": [
      "Accounting",
      "Finance",
      "Economics",
      "Taxation",
      "Banking",
      "Business Analytics",
    ],
    "Bachelor of Business Administration (BBA)": [
      "Marketing",
      "Finance",
      "Human Resource",
      "International Business",
      "Entrepreneurship",
    ],
    "Bachelor of Arts (BA)": [
      "English",
      "Political Science",
      "Psychology",
      "Sociology",
      "Economics",
      "History",
    ],
    "Bachelor of Computer Applications (BCA)": [
      "Software Development",
      "Cloud Computing",
      "Data Analytics",
      "Cybersecurity",
    ],
    "Master of Technology (M.Tech)": [
      "Computer Science",
      "Mechanical",
      "Civil",
      "Electronics",
      "Data Science",
      "AI & ML",
    ],
    "Master of Science (M.Sc)": [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Environmental Science",
      "Biotechnology",
    ],
    "Master of Business Administration (MBA)": [
      "Finance",
      "Marketing",
      "Human Resource",
      "Business Analytics",
      "Operations",
      "Supply Chain",
    ],
    "Master of Arts (MA)": [
      "English",
      "Political Science",
      "Economics",
      "Psychology",
      "Sociology",
    ],
    "Master of Computer Applications (MCA)": [
      "Software Engineering",
      "Data Science",
      "Cloud Computing",
      "Cybersecurity",
    ],
    "Diploma in Engineering": [
      "Civil",
      "Mechanical",
      "Electrical",
      "Computer Science",
      "Electronics",
    ],
    "Diploma in Computer Applications": [
      "Office Automation",
      "Web Designs",
      "Networking",
    ],
    "Diploma in Business Management": [
      "Finance",
      "Marketing",
      "HR",
      "Entrepreneurship",
    ],
    "Diploma in Hotel Management": [
      "Culinary Arts",
      "Food & Beverage",
      "Hospitality and Management",
    ],
    "PG Diploma in Management": [
      "Finance",
      "Marketing",
      "HR",
      "International Business",
    ],
    "PG Diploma in Data Science": [
      "AI",
      "Machine Learning",
      "Big Data",
      "Business Analytics",
    ],
    "PG Diploma in Journalism": [
      "Mass Communication",
      "Digital Media",
      "Public Relations",
    ],
    "Science Stream": [
      "PCM (Physics, Chemistry, Maths)",
      "PCB (Physics, Chemistry, Biology)",
    ],
    "Commerce Stream": [
      "Accountancy",
      "Business Studies",
      "Economics",
      "Mathematics",
    ],
  };

  /*----------- Auto-set Date of submission ---------------- */
  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setFormData((prev) => ({ ...prev, dateOfSubmission: formatted }));
  }, []);
  
  /*------------ Full Form Validation function --------------- */
  const validateForm = () => {
    let newErrors = {};

    // PERSONAL DETAILS
    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required.";

    if (!formData.email.trim()) newErrors.email = "Email is required.";

    if (formData.contactNumber.length !== 10)
      newErrors.contactNumber = "Contact number must be exactly 10 digits.";

    if (!formData.currentCity.trim())
      newErrors.currentCity = "Current city is required.";

    if (!formData.gender) newErrors.gender = "Please select gender.";

    if (!formData.dob) newErrors.dob = "Date of birth is required.";

    // ACADEMIC DETAILS
    if (!formData.highestQualification)
      newErrors.highestQualification = "Qualification is required.";

    if (!formData.discipline)
      newErrors.discipline = "Discipline / Specialization is required.";

    if (!formData.yearOfGraduation)
      newErrors.yearOfGraduation = "Year of graduation is required.";

    if (!formData.aggregate) newErrors.aggregate = "Aggregate is required.";

    if (!formData.collegeOrUniversity)
      newErrors.collegeOrUniversity = "College/University is required.";

    if (!formData.collegeCity)
      newErrors.collegeCity = "College city is required.";

    // CAREER PREFERENCES
    if (formData.preferredIndustry.length === 0)
      newErrors.preferredIndustry = "Select at least 1 industry.";

    if (formData.desiredJobRole.length === 0)
      newErrors.desiredJobRole = "Select at least 1 job role.";

    if (!formData.preferredLocations.trim())
      newErrors.preferredLocations = "Preferred location(s) required.";

    if (!formData.willingToRelocate)
      newErrors.willingToRelocate = "Please select an option.";

    // DOCUMENTS
    if (!formData.resume) newErrors.resume = "Resume upload is required.";

    if (fileError) newErrors.resume = fileError;

    // HEARD FROM
    if (formData.heardFrom.length === 0)
      newErrors.heardFrom = "Please select at least one option.";

    if (formData.heardFrom.includes("Others") && !formData.otherSource.trim())
      newErrors.otherSource = "Please specify the source.";

    // DECLARATION
    if (!formData.declarationConfirmed)
      newErrors.declarationConfirmed = "You must accept the declaration.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

/*------------ Handle Change ------------------ */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // CONTACT NUMBER — only digits, max 10
    if (name === "contactNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, contactNumber: digits });
      return;
    }

    // FILE UPLOAD — MAX 5MB
    if (type === "file") {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setFileError("File size must be below 5 MB");
          setFormData({ ...formData, resume: null });
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          setFileError("");
          setFormData({ ...formData, resume: file });
        }
      }
      return;
    }

    // MULTI-CHECKBOX (Industry + Job Roles)
    if (["preferredIndustry", "desiredJobRole"].includes(name)) {
      const updated = checked
        ? [...formData[name], value]
        : formData[name].filter((item) => item !== value);

      setFormData({ ...formData, [name]: updated });
      return;
    }

    // HEARD FROM
    if (name === "heardFrom") {
      const updated = checked
        ? [...formData.heardFrom, value]
        : formData.heardFrom.filter((v) => v !== value);

      setFormData({ ...formData, heardFrom: updated });
      return;
    }

    // RADIO BUTTONS
    if (type === "radio") {
      setFormData({ ...formData, [name]: value });
      return;
    }

    // CHECKBOXES (Declaration, Consent)
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
      return;
    }

    // DEFAULT
    setFormData({ ...formData, [name]: value });
  };

  /*----------------- Handle submit -------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation first
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (fileError) {
      setModalMessage("Please upload a file below 5MB.");
      setShowErrorModal(true);
      return;
    }

    // Prepare data for backend
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "preferredLocations" && typeof value === "string") {
        data.append(
          key,
          value
            .split(",")
            .map((v) => v.trim())
            .join(",")
        );
      } else if (Array.isArray(value)) {
        data.append(key, value.join(","));
      } else {
        data.append(key, value);
      }
    });

    /*---------- Submit to Backend ------------- */
    try {
      const res = await fetch(
        `${SERVER_URL}/api/studentDetail/register/${jobFairId}`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (res.ok) {
        setHallTicket(result.hallTicket);
        setShowModal(true);
        resetForm();
      } else {
        setModalMessage(result.message || "Something went wrong.");
        setShowErrorModal(true);
      }
    } catch (err) {
      setModalMessage("Network error. Please try again later.");
      setShowErrorModal(true);
    }
  };

  /*---------- Reset Form -------------*/
  const resetForm = () => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    setFormData({
      fullName: "",
      email: "",
      contactNumber: "",
      currentCity: "",
      gender: "",
      dob: "",
      highestQualification: "",
      discipline: "",
      yearOfGraduation: "",
      aggregate: "",
      collegeOrUniversity: "",
      collegeCity: "",
      preferredIndustry: [],
      desiredJobRole: [],
      preferredLocations: "",
      willingToRelocate: "",
      resume: null,
      linkedinProfile: "",
      portfolioOrGithub: "",
      heardFrom: [],
      otherSource: "",
      attendedPreviousFair: "",
      declarationConfirmed: false,
      consentToShareProfile: false,
      dateOfSubmission: formatted,
    });

    setErrors({});
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-transparent border-none">
        {/*-------- Personal Details -----*/}
        <h4 className="text-gray-900 font-normal text-[22px] mb-5 border-b border-gray-200 pb-2">
          Personal Details
        </h4>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 mt-1 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Email ID</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">Contact Number</label>

            <div className="flex">
              <span
                className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-md font-semibold text-gray-700"
              >
                +91
              </span>

              <input
                type="text"
                name="contactNumber"
                maxLength={10}
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-2 bg-[#fafafa] border border-l-0 rounded-r-md focus:outline-none"
                style={{
                  borderColor:
                    formData.contactNumber.length === 10
                      ? "green"
                      : formData.contactNumber.length > 0
                      ? "red"
                      : "#ced4da",
                }}
              />
            </div>

            {errors.contactNumber && (
              <p className="text-red-500 mt-1 text-sm">{errors.contactNumber}</p>
            )}
          </div>

          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Current City / Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              name="currentCity"
              value={formData.currentCity}
              onChange={handleChange}
              placeholder="Enter your city"
            />
            {errors.currentCity && (
              <p className="text-red-500 mt-1 text-sm">{errors.currentCity}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  checked={formData.gender === "Male"}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  checked={formData.gender === "Female"}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Female</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  onChange={handleChange}
                  checked={formData.gender === "Other"}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Other</span>
              </label>
            </div>

            {errors.gender && (
              <p className="text-red-500 mt-1 text-sm">{errors.gender}</p>
            )}
          </div>

          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <p className="text-red-500 mt-1 text-sm">{errors.dob}</p>}
          </div>
        </div>

        {/* ---------  Academic Details ------------- */}
        <h4 className="text-gray-900 font-normal text-[22px] mb-5 border-b border-gray-200 pb-2 mt-6">
          Academic Details
        </h4>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">Highest Qualification</label>
            <select
              name="highestQualification"
              value={formData.highestQualification}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Select Qualification --</option>
              {qualifications.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>

            {errors.highestQualification && (
              <p className="text-red-500 mt-1 text-sm">{errors.highestQualification}</p>
            )}
          </div>

          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Discipline / Specialization / Branch</label>

            {specializationsByQualification[formData.highestQualification] ? (
              <select
                name="discipline"
                value={formData.discipline}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Select Specialization --</option>
                {specializationsByQualification[
                  formData.highestQualification
                ].map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="discipline"
                className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={formData.discipline}
                onChange={handleChange}
                placeholder="Enter your specialization"
              />
            )}

            {errors.discipline && (
              <p className="text-red-500 mt-1 text-sm">{errors.discipline}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">Year of Graduation</label>

            <input
              type="text"
              name="yearOfGraduation"
              className="w-full px-4 py-2 bg-[#fafafa] border rounded-md focus:outline-none"
              value={formData.yearOfGraduation}
              maxLength={4}
              placeholder="e.g. 2025"
              onChange={(e) => {
                // Only digits, max 4
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                setFormData({ ...formData, yearOfGraduation: v });
              }}
              style={{
                borderColor:
                  formData.yearOfGraduation.length === 4
                    ? "green"
                    : formData.yearOfGraduation.length > 0
                    ? "red"
                    : "#ced4da",
              }}
            />

            {errors.yearOfGraduation && (
              <p className="text-red-500 mt-1 text-sm">{errors.yearOfGraduation}</p>
            )}
          </div>

          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Aggregate Percentage / CGPA</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              name="aggregate"
              value={formData.aggregate}
              onChange={handleChange}
              placeholder="e.g. 8.5 CGPA or 75%"
            />
            {errors.aggregate && (
              <p className="text-red-500 mt-1 text-sm">{errors.aggregate}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">College / University Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              name="collegeOrUniversity"
              value={formData.collegeOrUniversity}
              onChange={handleChange}
            />
            {errors.collegeOrUniversity && (
              <p className="text-red-500 mt-1 text-sm">{errors.collegeOrUniversity}</p>
            )}
          </div>

          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Location / City</label>
            <input
              type="text"
              name="collegeCity"
              value={formData.collegeCity}
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={handleChange}
            />
            {errors.collegeCity && (
              <p className="text-red-500 mt-1 text-sm">{errors.collegeCity}</p>
            )}
          </div>
        </div>

        {/* ----------- Career Preferences ------------ */}
        <h4 className="text-gray-900 font-normal text-[22px] mb-5 border-b border-gray-200 pb-2 mt-6">
          Career Preferences
        </h4>

        <div className="flex flex-wrap -mx-3 mb-4">
          {/* Preferred Industry */}
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">Preferred Industry (Select all that apply)</label>
            <details className="relative w-full group">
              <summary className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none cursor-pointer list-none flex justify-between items-center text-gray-700 truncate">
                <span className="truncate">
                  {formData.preferredIndustry.length > 0
                    ? formData.preferredIndustry.join(", ")
                    : "Select Preferred Industries"}
                </span>
                <span className="ml-2 text-gray-500">▼</span>
              </summary>

              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto p-2">
                {industries.map((ind, index) => (
                  <div key={index} className="flex items-center mx-2 my-1">
                    <input
                      className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                      type="checkbox"
                      name="preferredIndustry"
                      id={`ind-${index}`}
                      value={ind}
                      checked={formData.preferredIndustry.includes(ind)}
                      onChange={handleChange}
                    />
                    <label
                      className="ml-2 text-gray-700 cursor-pointer"
                      htmlFor={`ind-${index}`}
                    >
                      {ind}
                    </label>
                  </div>
                ))}
              </div>
            </details>

            {errors.preferredIndustry && (
              <p className="text-red-500 mt-1 text-sm">{errors.preferredIndustry}</p>
            )}
          </div>

          {/* Desired Job Roles */}
          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Desired Job Role (Select all that apply)</label>
            <details className="relative w-full group">
              <summary className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none cursor-pointer list-none flex justify-between items-center text-gray-700 truncate">
                <span className="truncate">
                  {formData.desiredJobRole.length > 0
                    ? formData.desiredJobRole.join(", ")
                    : "Select Desired Job Roles"}
                </span>
                <span className="ml-2 text-gray-500">▼</span>
              </summary>

              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto p-2">
                {jobRoles.map((role, index) => (
                  <div key={index} className="flex items-center mx-2 my-1">
                    <input
                      className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                      type="checkbox"
                      id={`role-${index}`}
                      name="desiredJobRole"
                      value={role}
                      checked={formData.desiredJobRole.includes(role)}
                      onChange={handleChange}
                    />
                    <label
                      className="ml-2 text-gray-700 cursor-pointer"
                      htmlFor={`role-${index}`}
                    >
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </details>

            {errors.desiredJobRole && (
              <p className="text-red-500 mt-1 text-sm">{errors.desiredJobRole}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          {/* Preferred Locations */}
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">Preferred Location(s)</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              name="preferredLocations"
              value={formData.preferredLocations}
              onChange={handleChange}
              placeholder="Enter preferred cities separated by commas"
            />

            {errors.preferredLocations && (
              <p className="text-red-500 mt-1 text-sm">{errors.preferredLocations}</p>
            )}
          </div>

          {/* Willing to Relocate? */}
          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Willingness to relocate or not?</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="willingToRelocate"
                  value="Yes"
                  checked={formData.willingToRelocate === "Yes"}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="willingToRelocate"
                  value="No"
                  checked={formData.willingToRelocate === "No"}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>

            {errors.willingToRelocate && (
              <p className="text-red-500 mt-1 text-sm">{errors.willingToRelocate}</p>
            )}
          </div>
        </div>

        {/* --------- Documents & Links ------------ */}
        <h4 className="text-gray-900 font-normal text-[22px] mb-5 border-b border-gray-200 pb-2 mt-6">
          Documents & Links
        </h4>

        <div className="flex flex-wrap -mx-3 mb-4">
          {/* Resume Upload */}
          <div className="w-full sm:w-1/2 px-3 mb-4 sm:mb-0">
            <label className="block text-gray-700 font-medium mb-2">Upload Resume / CV* (PDF preferred)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              name="resume"
              ref={fileInputRef}
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={handleChange}
            />

            {errors.resume && (
              <p className="text-red-500 mt-1 text-sm">{errors.resume}</p>
            )}

            {formData.resume && !fileError && (
              <p className="text-green-600 mt-1 text-sm">
                File uploaded ✓ (
                {(formData.resume.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* LinkedIn Profile */}
          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">LinkedIn Profile (Optional)</label>
            <input
              type="url"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          {/* GitHub / Portfolio */}
          <div className="w-full sm:w-1/2 px-3">
            <label className="block text-gray-700 font-medium mb-2">Portfolio / GitHub Link (Optional)</label>
            <input
              type="url"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              name="portfolioOrGithub"
              value={formData.portfolioOrGithub}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
        </div>
      
        {/* -------- Declaration & Consent --------------- */}
        <h4 className="text-gray-900 font-normal text-[22px] mb-5 border-b border-gray-200 pb-2 mt-6">
          Declaration & Consent
        </h4>

        {/* Heard From */}
        <label className="block text-gray-700 font-semibold mb-2">
          How did you hear about the Job Fair?
        </label>

        <div className="flex flex-wrap gap-4 mt-2">
          {heardOptions.map((opt, index) => (
            <div key={index} className="flex items-center">
              <input
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                type="checkbox"
                name="heardFrom"
                value={opt}
                id={`heard-${index}`}
                checked={formData.heardFrom.includes(opt)}
                onChange={handleChange}
              />
              <label className="ml-2 text-gray-700 cursor-pointer" htmlFor={`heard-${index}`}>
                {opt}
              </label>
            </div>
          ))}
        </div>

        {errors.heardFrom && (
          <p className="text-red-500 mt-1 text-sm">{errors.heardFrom}</p>
        )}

        {/* Others Text Input */}
        {formData.heardFrom.includes("Others") && (
          <>
            <input
              type="text"
              className="w-full px-4 py-2 bg-[#fafafa] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mt-3"
              name="otherSource"
              placeholder="Please specify"
              value={formData.otherSource}
              onChange={handleChange}
            />

            {errors.otherSource && (
              <p className="text-red-500 mt-1 text-sm">{errors.otherSource}</p>
            )}
          </>
        )}

        {/* Attended Previous Fair */}
        <div className="mt-5">
          <label className="block text-gray-700 font-medium mb-2">Have you attended any previous job fairs?</label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="attendedPreviousFair"
                value="Yes"
                checked={formData.attendedPreviousFair === "Yes"}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="attendedPreviousFair"
                value="No"
                checked={formData.attendedPreviousFair === "No"}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Declaration */}
        <div className="mt-6">
          <label className="block text-gray-900 font-bold mb-2">Declaration:</label>

          <label className="flex items-start">
            <input
              type="checkbox"
              name="declarationConfirmed"
              checked={formData.declarationConfirmed}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 mt-1"
            />
            <span className="ml-2 text-gray-700">
              I hereby declare that the information provided above is true to the best of my knowledge.
            </span>
          </label>

          {errors.declarationConfirmed && (
            <p className="text-red-500 mt-1 text-sm">{errors.declarationConfirmed}</p>
          )}
        </div>

        {/* Consent */}
        <div className="mt-5">
          <label className="block text-gray-900 font-bold mb-2">Consent:</label>

          <label className="flex items-start">
            <input
              type="checkbox"
              name="consentToShareProfile"
              checked={formData.consentToShareProfile}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 mt-1"
            />
            <span className="ml-2 text-gray-700">
              I authorize the organizers to share my profile with participating companies for relevant job opportunities and updates via calls, messages, WhatsApp, and email.
            </span>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
        {/* SUBMIT BUTTON */}
        <div>
          <button 
            type="submit" 
            className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
          >
            Submit
          </button>
        </div>

        {/* Submission Date */}
        <div className="flex items-center gap-3">
          <label className="mb-0 font-bold text-gray-700">Date of Submission :</label>
          <input
            type="text"
            value={formData.dateOfSubmission}
            readOnly
            className="bg-transparent border-none text-gray-700 outline-none w-auto max-w-[150px]"
          />
        </div>
        </div> 
      </form>

      {/* ------- Success Modal ------------ */}
      <HallTicketModal
        showModal={showModal}
        hallTicket={hallTicket}
        onClose={() => setShowModal(false)}
      />

      {/*----------- Error MOdal ----------- */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-600 rounded-t-lg">
              <h3 className="text-lg font-medium text-white">Error Occurred</h3>
              <button onClick={() => setShowErrorModal(false)} className="text-white hover:text-gray-200 text-xl font-bold leading-none">
                &times;
              </button>
            </div>
            <div className="p-6 text-center text-gray-700">
              {modalMessage}
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button 
                onClick={() => setShowErrorModal(false)} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationForm;
