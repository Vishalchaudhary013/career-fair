/**
 * Function is used to edit the job fair. It includes the modal and is opened by clicking on the dit button.
 */
import  { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { SERVER_URL } from "../../config";

// Options for the states select
const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam", "Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Jammu","Ladakh","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand",
    "Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Lakshadweep","Delhi","Puducherry",
];
const EditJobFairModal = ({ show, onClose, jobFairId }) => {
    const { adminId } = useParams();
    const [faqs, setFaqs] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [jobCards, setJobCards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [formData, setFormData] = useState({
  adminId,
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
  faq: [],
  fairBanner: "",
  fairLogo: "",
  fairJobCards: [],
  instructionPDF: null,
  companies: "",
  jobRoles: "",
  activeParticipants: "",
  totalStates: "",
  totalCities: "",
  totalHallTickets: "",
});

/**
 * Fetch job fair details and prefill modal form.
 */
const fetchJobFair = async () => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/jobFair/${jobFairId}`);
    const data = response.data;

    // ✅ Destructure all known fields safely
    const {
      jobFairName = "",
      organizedBy = "",
      fairType = "",
      registrationDateTime = "",
      jobFairStart = "",
      jobFairEnd = "",
      whatsappNumber = "",
      venue = {},
      locationUrl = "",
      phone = "",
      additionalPhone = "",
      additionalPhone2 = "",
      additionalPhone3 = "",
      email = "",
      facebook = "",
      instagram = "",
      linkedin = "",
      twitter = "",
      description = "",
      eligibility = "",
      fairBanner = "",
      fairLogo = "",
      instructionPDF = null,
      faq = [],
      fairJobCards = [],
      companies = "",
      jobRoles = "",
      activeParticipants = "",
      totalStates = "",
      totalCities = "",
      totalHallTickets = "",
    } = data;

    // ✅ Update state cleanly
    setFormData({
      jobFairName,
      organizedBy,
      fairType,
      registrationDateTime: formatDateTimeForInput(registrationDateTime),
      jobFairStart: formatDateTimeForInput(jobFairStart),
      jobFairEnd: formatDateTimeForInput(jobFairEnd),

      whatsappNumber,
      phone,
      additionalPhone,
      additionalPhone2,
      additionalPhone3,

      venue: {
        address: venue.address || "",
        city: venue.city || "",
        state: venue.state || "",
        pinCode: venue.pinCode || "",
        nearestBusStop: venue.nearestBusStop || "",
        nearestAirport: venue.nearestAirport || "",
        nearestTrainStation: venue.nearestTrainStation || "",
      },
      locationUrl,

      facebook,
      instagram,
      linkedin,
      twitter,
      email,
      description,
      eligibility,

      fairBanner,
      fairLogo,
      instructionPDF,
      faq,
      fairJobCards,

      companies,
      jobRoles,
      activeParticipants,
      totalStates,
      totalCities,
      totalHallTickets,
    });

    // ✅ Update state dropdown
    setSelectedState(venue.state || "");

    // ✅ Clear temporary additions
    setFaqs([]);
    setJobCards([]);

    console.log("📋 Prefilled Job Fair Data Loaded:", {
      name: jobFairName,
      city: venue.city,
      faqCount: faq.length,
      jobCards: fairJobCards.length,
    });
  } catch (error) {
    console.error("❌ Error fetching Job Fair:", error);
  }
};

  
    

    // Fetch job fair details when modal is opened
    useEffect(() => {
        if (show) fetchJobFair();
    }, [show, jobFairId]);

    const formatDateTimeForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'
    };

    /**
     * Function is used to handle the state change in the 'state' field as it is select field.
     */
    const handleStateChange = (e) => {
        const stateValue = e.target.value;
        setSelectedState(stateValue);
        setFormData((prevState) => ({
            ...prevState,
            venue: { ...prevState.venue, state: stateValue },
        }));
    };

    /**
    * Function is used to handle the changes in the files.
    */
    const handleChange = (e) => {
        const { name, value } = e.target;
        const nameParts = name.split("[").map((part) => part.replace("]", ""));
        setFormData((prevState) => {
            const updatedFormData = { ...prevState };
            let current = updatedFormData;
            nameParts.forEach((part, index) => {
                if (index === nameParts.length - 1) {
                    current[part] = value; // Set final value
                } else {
                    if (!current[part]) {
                        current[part] = {}; // Ensure nested object exists
                    }
                    current = current[part]; // Move to the next nested level
                }
            });
            return { ...updatedFormData }; // Ensure state update is detected
        });
    };
   
    /**
    * Function  is used to handle the file changes like jobBanner, jobLogo etc.
    */
    const handleFileChange = (e) => {
        const { name, files } = e.target;        
        if (files && files[0]) {
            setFormData((prevData) => ({
                ...prevData, 
                [name]: files[0], 
            }));
        }
    };

    /**
    * Function is used to handle the job card changes when new job card is added.
    */
    const handleJobCardChange = (index, event) => {
        const { name, value, files } = event.target;
        const updatedJobCards = [...jobCards];
        if (updatedJobCards[index]) {
            if (files && files[0]) {
                const file = files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    updatedJobCards[index][name] = reader.result;
                    setJobCards(updatedJobCards); 
                };
            } else {
                updatedJobCards[index][name] = value;
                setJobCards(updatedJobCards); 
            }
        }
    };

    /**
    * Function is used to chnage the already added job card components.
    */
    const handleOldJobCardChange = (index, event) => {
        const { name, value, files } = event.target;
        const updatedFairJobCards = [...formData.fairJobCards];

        if (updatedFairJobCards[index]) {
            if (files && files[0]) {
                // 👉 Directly store the File object, NOT base64
                updatedFairJobCards[index][name] = files[0];
            } else {
                updatedFairJobCards[index][name] = value;
            }

            setFormData(prevFormData => ({
                ...prevFormData,
                fairJobCards: updatedFairJobCards
            }));
        }
    };

    /**
    * Function is used to remove the already added job fair card.
    */
    const removeJobFairSelected = (index) => {
        const updatedJobFairs = formData.fairJobCards.filter((_, i) => i !== index);
        setFormData({ ...formData, fairJobCards: updatedJobFairs });
    }

    /**
    * Function is used to remove the job card that are newly added.
    */
    const removeJobCard = (index) => {
        const updatedJobCards = jobCards.filter((_, i) => i !== index);
        setJobCards(updatedJobCards);
    };
    
    /**
    * Function is used to add the Job Card.
    */
    const handleAddJobCard = () => {
        setFormData({
            ...formData,
            fairJobCards: [
                ...formData.fairJobCards, 
                { companyLogo: '', 
                companyName: '',
                jobProfile: '',
                candidatesRequired: '',
                jobLocation: ''
             }
            ],
        });
    };

    /**
    * Function is used to hande the change in the FAQ.
    */
    const handleFaqChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFaqs = [...faqs];
        updatedFaqs[index][name] = value;
        setFaqs(updatedFaqs);
    };

    /**
    * Function is used to remove the newly added FAQ.
    */
    const removeFAQ = (index) => {
        const updatedFaq = faqs.filter((_, i)=> i !== index);
        setFaqs(updatedFaq);
    }

    /**
    * Function is used to remove the already added FAQ.
    */
    const removeFAQSelected = (index) => {
        const updatedFaq = formData.faq.filter((_, i) => i !== index);
        setFormData({ ...formData, faq: updatedFaq });
    };

    /**
    * Add a new FAQ with empty question and answer
    */
    const handleAddFaq = () => { setFormData({...formData, faq: [...formData.faq, { question: '', answer: '' }] });};
    
 /**
 * Function is used to hit the edit API and update the data.
 */
const handleSubmit = async (e) => {
  e.preventDefault();

  const updateData = new FormData();

  // 🧠 1. Append all basic text fields
  const textFields = [
    "jobFairName", "organizedBy", "fairType", "registrationDateTime", "jobFairStart", "jobFairEnd",
    "whatsappNumber", "locationUrl",
    "phone", "additionalPhone", "additionalPhone2", "additionalPhone3", "email",
    "facebook", "instagram", "linkedin", "twitter",
    "description", "eligibility", "companies", "jobRoles",
    "activeParticipants", "totalStates", "totalCities", "totalHallTickets"
  ];

  textFields.forEach((field) => {
    if (formData[field]) updateData.append(field, formData[field]);
  });

  // 🧭 2. Append venue fields
  const venueFields = {
    "venue[address]": formData.venue?.address,
    "venue[city]": formData.venue?.city,
    "venue[state]": formData.venue?.state,
    "venue[pinCode]": formData.venue?.pinCode,
    "venue[nearestBusStop]": formData.venue?.nearestBusStop,
    "venue[nearestAirport]": formData.venue?.nearestAirport,
    "venue[nearestTrainStation]": formData.venue?.nearestTrainStation,
  };

  Object.entries(venueFields).forEach(([key, value]) => {
    if (value) updateData.append(key, value);
  });

  //  3. Merge existing + newly added FAQs
  const allFaqs = [...(formData.faq || []), ...(faqs || [])];
  if (allFaqs.length) updateData.append("faq", JSON.stringify(allFaqs));

  // 🖼️ 4. Append uploaded media (only if replaced)
  ["fairBanner", "fairLogo", "instructionPDF"].forEach((fileField) => {
    if (formData[fileField]) updateData.append(fileField, formData[fileField]);
  });

  // 💼 5. Merge existing + new job cards
  const mergedJobCards = [...(formData.fairJobCards || []), ...(jobCards || [])];
  const jobCardData = [];

  mergedJobCards.forEach((jobCard) => {
    const { companyLogo, ...rest } = jobCard;
    if (companyLogo instanceof File) {
      updateData.append("companyLogo", companyLogo);
    }
    jobCardData.push(rest);
  });

  updateData.append("fairJobCards", JSON.stringify(jobCardData));

  // 🧾 Debugging helper (optional)
  for (let [key, val] of updateData.entries()) {
    console.log("📤", key, val);
  }

  try {
    await axios.put(`${SERVER_URL}/api/jobFair/edit/${jobFairId}`, updateData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ Ensure state selection remains after update
    setSelectedState(formData.venue?.state || "");

    setShowModal(true);
    setModalMessage("✅ Job Fair successfully updated!");
    fetchJobFair();
  } catch (error) {
    console.error("❌ Error updating Job Fair:", error);
    setShowModal(true);
    setModalMessage("⚠️ Error occurred. Please try again later!");
  }
};

    /** Close the modal */
     const handleCloseModal = () => {
        setShowModal(false);
        onClose();
    }; 

     /**
    * Function is used to display the modal when any event (API is hit)
    */
     /**
    * Function is used to display the modal when any event (API is hit)
    */
    const renderModal = () => {
        if (!showModal) return null;
        return (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4">
                <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-xl font-medium text-gray-900">Message</h3>
                        <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-6 text-gray-700">
                        {modalMessage}
                    </div>
                    <div className="flex justify-end p-4 border-t border-gray-200">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (!show) return null;

    return (
        <>
        <div className="fixed inset-0 z-[1050] bg-black/50 overflow-y-auto p-4" onClick={onClose}>
            <div className="min-h-screen bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-blue-600">Edit Job Fair</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="text-2xl leading-none">&times;</span>
                    </button>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="p-3">
                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-xl font-medium mb-3">Job Fair Details</h3>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="jobFairName">Job Fair Name</label>
                                        <input
                                            type="text"
                                            id="jobFairName"
                                            name="jobFairName"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.jobFairName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="organizedBy">Organized By</label>
                                        <input
                                            type="text"
                                            id="organizedBy"
                                            name="organizedBy"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.organizedBy}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="registrationDateTime">Registration Deadline</label>
                                        <input
                                            type="datetime-local"
                                            id="registrationDateTime"
                                            name="registrationDateTime"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.registrationDateTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="whatsappNumber">Organizer WhatsApp Number</label>
                                        <input
                                            type="tel"
                                            id="whatsappNumber"
                                            name="whatsappNumber"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="+91 9876543210"
                                            value={formData.whatsappNumber}
                                            onChange={handleChange}
                                        />
                                        <p className="text-gray-500 text-sm mt-1">This number will be used for WhatsApp queries.</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="jobFairStart">Start Date</label>
                                        <input
                                            type="datetime-local"
                                            id="jobFairStart"
                                            name="jobFairStart"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.jobFairStart}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="jobFairEnd">End Date</label>
                                        <input
                                            type="datetime-local"
                                            id="jobFairEnd"
                                            name="jobFairEnd"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.jobFairEnd}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="fairType">Fair Type</label>
                                        <select
                                            id="fairType"
                                            name="fairType"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.fairType || ""}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Select Fair Type --</option>
                                            <option value="Career Fair">🎓 Career Fair</option>
                                            <option value="Education Fair">🏫 Education Fair</option>
                                            <option value="Career & Education Fair">💼 Career & Education Fair</option>
                                            <option value="Conference">🎤 Conference</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-xl font-medium mb-3">Venue Details</h3>
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="venueAddress">Address</label>
                                    <input
                                        type="text"
                                        id="venueAddress"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-1"
                                        placeholder="Address Line 1"
                                        name="venue[address]"
                                        value={formData.venue?.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="City"
                                            name="venue[city]"
                                            value={formData.venue?.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="Pin Code"
                                            name="venue[pinCode]"
                                            value={formData.venue?.pinCode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/3 px-3 mb-3 md:mb-0">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="Nearest bus stop"
                                            name="venue[nearestBusStop]"
                                            value={formData.venue?.nearestBusStop}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-3 mb-3 md:mb-0">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="Nearest Airport"
                                            name="venue[nearestAirport]"
                                            value={formData.venue?.nearestAirport}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-3">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="Nearest Train station"
                                            name="venue[nearestTrainStation]"
                                            value={formData.venue?.nearestTrainStation}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <label className="block text-gray-700 font-bold mb-2">Location URL</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-3"
                                    placeholder="Location URL (Google Maps)"
                                    name="locationUrl"
                                    value={formData.locationUrl}
                                    onChange={handleChange}
                                />

                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-1"
                                    value={selectedState}
                                    onChange={handleStateChange}
                                    name="venue[state]"
                                    required
                                >
                                    <option value="">Choose a State</option>
                                    {states.map((state, index) => (
                                        <option key={index} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-xl font-medium mb-3">Job Fair Statistics</h3>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="companies">Total number of companies</label>
                                        <input
                                            type="number"
                                            id="companies"
                                            name="companies"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.companies}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="jobRoles">Total number of JobRoles</label>
                                        <input
                                            type="number"
                                            id="jobRoles"
                                            name="jobRoles"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.jobRoles}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="activeParticipants">Total number of active participants</label>
                                        <input
                                            type="number"
                                            id="activeParticipants"
                                            name="activeParticipants"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.activeParticipants}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="totalStates">Number of states participating</label>
                                        <input
                                            type="number"
                                            id="totalStates"
                                            name="totalStates"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.totalStates}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="totalCities">Number of cities participating</label>
                                        <input
                                            type="number"
                                            id="totalCities"
                                            name="totalCities"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.totalCities}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="totalHallTickets">Number of halltickets generated</label>
                                        <input
                                            type="number"
                                            id="totalHallTickets"
                                            name="totalHallTickets"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.totalHallTickets}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-xl font-medium mb-3">Contact Information</h3>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">Phone</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="additionalPhone">Additional Phone</label>
                                        <input
                                            type="tel"
                                            id="additionalPhone"
                                            name="additionalPhone"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            value={formData.additionalPhone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="additionalPhone2">Additional Number 2</label>
                                        <input
                                            type="tel"
                                            id="additionalPhone2"
                                            name="additionalPhone2"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="+91 9000000002"
                                            value={formData.additionalPhone2}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="additionalPhone3">Additional Number 3</label>
                                        <input
                                            type="tel"
                                            id="additionalPhone3"
                                            name="additionalPhone3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="+91 9000000003"
                                            value={formData.additionalPhone3}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="emailId">Email</label>
                                    <input
                                        type="email"
                                        id="emailId"
                                        name="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-xl font-medium mb-3">Social Media</h3>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="Facebook"
                                            name="facebook"
                                            value={formData.facebook}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="Instagram"
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-3">
                                    <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="LinkedIn"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            placeholder="X / Twitter"
                                            name="twitter"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={10}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="eligibility">Eligibility</label>
                                    <textarea
                                        id="eligibility"
                                        name="eligibility"
                                        rows={10}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        value={formData.eligibility}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-xl font-medium mb-3">Uploads</h3>
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="fairBanner">Banner (JPEG, PNG, 5MB)</label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-100 cursor-pointer mb-2"
                                        value={formData.fairBanner ? formData.fairBanner : 'No file chosen'}
                                        onClick={() => document.getElementById('fairBanner').click()}
                                    />
                                    <input
                                        id="fairBanner"
                                        type="file"
                                        name="fairBanner"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="fairLogo">Logo (JPEG, PNG, 1MB)</label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-100 cursor-pointer mb-2"
                                        value={formData.fairLogo ? formData.fairLogo : 'No file chosen'}
                                        onClick={() => document.getElementById('fairLogo').click()}
                                    />
                                    <input
                                        id="fairLogo"
                                        type="file"
                                        name="fairLogo"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="instructionPDF">Instruction PDF (5MB)</label>
                                    <input
                                        id="instructionPDF"
                                        type="file"
                                        name="instructionPDF"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-xl font-medium mb-3">Job Cards</h3>
                                {formData.fairJobCards.map((job, index) => (
                                    <div key={`existing-job-${index}`} className="mb-4 p-4 border border-gray-200 rounded-md">
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2">Company Logo (JPEG, PNG, 1MB)</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-100 cursor-pointer mb-2"
                                                value={job ? job.companyLogo : 'No file chosen'}
                                                onClick={() => document.getElementById(`companyLogo-${index}`).click()}
                                            />
                                            <input
                                                id={`companyLogo-${index}`}
                                                type="file"
                                                name="companyLogo"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => handleOldJobCardChange(index, e)}
                                                className="hidden"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`companyName-${index}`}>Company Name</label>
                                            <input
                                                type="text"
                                                id={`companyName-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Enter Company Name"
                                                name="companyName"
                                                value={job.companyName || ''}
                                                onChange={(e) => handleOldJobCardChange(index, e)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`jobProfile-${index}`}>Job Description</label>
                                            <textarea
                                                id={`jobProfile-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Enter complete job description"
                                                name="jobProfile"
                                                value={job.jobProfile || ''}
                                                onChange={(e) => handleOldJobCardChange(index, e)}
                                                rows={10}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`candidatesRequired-${index}`}>Total number of candidates required</label>
                                            <input
                                                type="number"
                                                id={`candidatesRequired-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Total number of vacancies"
                                                name="candidatesRequired"
                                                value={job.candidatesRequired || ''}
                                                onChange={(e) => handleOldJobCardChange(index, e)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`jobLocation-${index}`}>Job Location</label>
                                            <input
                                                type="text"
                                                id={`jobLocation-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Job Location"
                                                name="jobLocation"
                                                value={job.jobLocation || ''}
                                                onChange={(e) => handleOldJobCardChange(index, e)}
                                            />
                                        </div>
                                        {formData.fairJobCards.length > 1 && (
                                            <button 
                                                type="button" 
                                                className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" 
                                                onClick={() => removeJobFairSelected(index)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {jobCards.map((job, index) => (
                                    <div key={`new-job-${index}`} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`new-companyLogo-${index}`}>Company Logo (JPEG, PNG, 1MB)</label>
                                            <input
                                                type="file"
                                                id={`new-companyLogo-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                name="companyLogo"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => handleJobCardChange(index, e)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`new-companyName-${index}`}>Company Name</label>
                                            <input
                                                type="text"
                                                id={`new-companyName-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Enter Company Name"
                                                name="companyName"
                                                value={job.companyName}
                                                onChange={(e) => handleJobCardChange(index, e)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`new-jobProfile-${index}`}>Job Description</label>
                                            <textarea
                                                id={`new-jobProfile-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Enter complete job description"
                                                name="jobProfile"
                                                value={job.jobProfile}
                                                onChange={(e) => handleJobCardChange(index, e)}
                                                rows={10}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`new-candidatesRequired-${index}`}>Total number of candidates required</label>
                                            <input
                                                type="number"
                                                id={`new-candidatesRequired-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Total number of vacancies"
                                                name="candidatesRequired"
                                                value={job.candidatesRequired}
                                                onChange={(e) => handleJobCardChange(index, e)}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`new-jobLocation-${index}`}>Job Location</label>
                                            <input
                                                type="text"
                                                id={`new-jobLocation-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Job Location"
                                                name="jobLocation"
                                                value={job.jobLocation}
                                                onChange={(e) => handleJobCardChange(index, e)}
                                                required 
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" 
                                            onClick={() => removeJobCard(index)}
                                        >
                                            ✕
                                        </button>
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

                        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4">
                                <h3 className="text-xl font-medium mb-3">FAQs</h3>
                                {formData.faq.map((faqItem, index) => (
                                    <div key={`existing-faq-${index}`} className="mb-4 p-4 border border-gray-200 rounded-md">
                                        <label className="block text-gray-700 font-bold mb-2">Question</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
                                            placeholder="Question"
                                            value={faqItem.question}
                                            onChange={(e) => {
                                                const updatedFaq = [...formData.faq];
                                                updatedFaq[index].question = e.target.value;
                                                setFormData({ ...formData, faq: updatedFaq });
                                            }}
                                        />
                                        <label className="block text-gray-700 font-bold mb-2">Answer</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2"
                                            placeholder="Answer"
                                            value={faqItem.answer}
                                            onChange={(e) => {
                                                const updatedFaq = [...formData.faq];
                                                updatedFaq[index].answer = e.target.value;
                                                setFormData({ ...formData, faq: updatedFaq });
                                            }}
                                        />
                                        {(formData.faq.length > 1) && (
                                            <button 
                                                type="button"
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => removeFAQSelected(index)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {faqs.map((faq, index) => (
                                    <div key={`new-faq-${index}`} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`new-question-${index}`}>Question</label>
                                            <input
                                                type="text"
                                                id={`new-question-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Enter Question"
                                                name="question"
                                                value={faq.question}
                                                onChange={(e) => handleFaqChange(index, e)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-gray-700 font-bold mb-2" htmlFor={`new-answer-${index}`}>Answer</label>
                                            <textarea
                                                id={`new-answer-${index}`}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                                placeholder="Enter Answer"
                                                name="answer"
                                                value={faq.answer}
                                                onChange={(e) => handleFaqChange(index, e)}
                                                required
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => removeFAQ(index)}
                                        >
                                            ✕
                                        </button>
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
                </div>
            </div>
        </div>
       {renderModal()}
       </>
    );
};

export default EditJobFairModal;
