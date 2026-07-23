import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getEvent } from "../services/eventService";
import { FaArrowLeft } from "react-icons/fa";
import { ShieldCheck, Users, Upload } from "lucide-react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { createBooking } from "../services/bookingService";
import api from "../services/api";
import { formatDate, formatTime } from "../../utils/dateFormatter";

const getEventTitle = (event) => event?.basicInfo?.title || event?.fairName || "Fair";
const getEventDate = (event) => event?.basicInfo?.startDate || event?.startDate;
const getEventTime = (event) => {
  if (event?.basicInfo?.startTime) return event.basicInfo.startTime;
  if (event?.startDate) {
    const date = new Date(event.startDate);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  }
  return '';
};
const getEventVenue = (event) => {
  const venue = event?.location || event?.venue || {};
  return venue.venueName || venue.city || "Venue TBA";
};

const AttendeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [dbEvent, setDbEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        setDbEvent(data);
      } catch (err) {
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="flex justify-center mt-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7e3af2]"></div></div>;
  if (error || !dbEvent) return <div className="text-center mt-32 text-red-500">{error || "Fair not found"}</div>;

  const title = getEventTitle(dbEvent);
  const startDate = formatDate(getEventDate(dbEvent));
  const startTime = formatTime(getEventTime(dbEvent));
  const venue = getEventVenue(dbEvent);

  const { totalPrice = 0, totalItems = 1, quantities = {}, tickets = [] } = state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    
    const ticketsBooked = [];
    Object.entries(quantities).forEach(([tId, qty]) => {
      if (qty > 0) {
        const t = tickets.find(t => t._id === tId);
        ticketsBooked.push({
          ticketId: tId,
          name: t?.name || 'General Admission',
          price: t?.price || 0,
          quantity: qty
        });
      }
    });

    try {
      const response = await createBooking({
        eventId: id,
        tickets: ticketsBooked,
        totalPrice,
        totalItems,
        answers
      });
      navigate(`/fair/${id}/booking-success/${response._id}`);
    } catch (err) {
      alert("Failed to book tickets. " + (err.message || "Please try again."));
      setSubmitting(false);
    }
  };

  const renderInputForQuestion = (q) => {
    const typeStr = (q.type || "").toLowerCase();
    const isMandatory = q.status === "Mandatory";
    const val = answers[q.id || q._id] || "";
    
    const handleChange = (newVal) => setAnswers({...answers, [q.id || q._id]: newVal});

    if (typeStr.includes("paragraph")) {
      return <textarea rows="2" value={val} onChange={(e) => handleChange(e.target.value)} required={isMandatory} className="w-full border-b border-gray-300 px-0 py-2 outline-none focus:border-primary transition-colors bg-transparent resize-none" />;
    }

    if (typeStr.includes("dropdown") || typeStr.includes("country") || typeStr.includes("state") || typeStr.includes("city")) {
      let options = q.options?.map(o => o.value) || [];
      
      const qTitleLower = q.title.toLowerCase();

      if (qTitleLower.includes("country")) {
        options = Country.getAllCountries().map(c => c.name);
      } else if (qTitleLower.includes("state")) {
        const allCountries = Country.getAllCountries();
        const selectedCountryName = Object.values(answers).find(val => allCountries.some(c => c.name === val));
        if (selectedCountryName) {
          const cIso = allCountries.find(c => c.name === selectedCountryName).isoCode;
          options = State.getStatesOfCountry(cIso).map(s => s.name);
        }
      } else if (qTitleLower.includes("city")) {
        const allCountries = Country.getAllCountries();
        const selectedCountryName = Object.values(answers).find(val => allCountries.some(c => c.name === val));
        if (selectedCountryName) {
          const cIso = allCountries.find(c => c.name === selectedCountryName).isoCode;
          const allStates = State.getStatesOfCountry(cIso);
          const selectedStateName = Object.values(answers).find(val => allStates.some(s => s.name === val));
          if (selectedStateName) {
            const sIso = allStates.find(s => s.name === selectedStateName).isoCode;
            options = City.getCitiesOfState(cIso, sIso).map(c => c.name);
            options = [...new Set(options)]; 
          }
        }
      } else if (q.title === "Title (Mr.,Mrs.,Etc)") {
        options = ["Mr.", "Mrs.", "Ms.", "Dr.", "Miss"];
      } else if (q.title === "Blood Group") {
        options = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      }

      const selectOptions = options.map(opt => ({ value: opt, label: opt })).concat(q.allowOther ? [{ value: "Other", label: "Other" }] : []);

      return (
        <Select
          options={selectOptions}
          value={val ? { value: val, label: val } : null}
          onChange={(selected) => handleChange(selected ? selected.value : "")}
          placeholder={`Search or Select ${q.title}...`}
          isClearable
          isSearchable
          menuPlacement="bottom"
          styles={{
            control: (base, state) => ({
              ...base,
              border: "none",
              borderBottom: state.isFocused ? "1px solid #110060" : "1px solid #d1d5db",
              borderRadius: 0,
              boxShadow: "none",
              backgroundColor: "transparent",
              minHeight: "36px",
              "&:hover": {
                borderBottom: "1px solid #110060"
              }
            }),
            indicatorSeparator: () => ({ display: "none" }),
            valueContainer: (base) => ({ ...base, padding: 0 }),
            menu: (base) => ({ ...base, zIndex: 50 }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected 
                ? "#110060" 
                : state.isFocused 
                  ? "#1100601a" 
                  : "transparent",
              color: state.isSelected ? "white" : "#374151",
              cursor: "pointer",
              "&:active": {
                backgroundColor: "#110060",
                color: "white"
              }
            })
          }}
        />
      );
    }

    if (typeStr.includes("radio") || typeStr.includes("multiple choice")) {
      let options = q.options?.map(o => o.value) || [];
      if (q.title === "Gender") options = ["Male", "Female", "Other"];
      else if (options.length === 0) options = ["Option 1", "Option 2"];

      return (
        <div className="flex flex-row flex-wrap gap-6 mt-2">
          {options.map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="radio" name={q.id || q._id} value={opt} checked={val === opt} onChange={(e) => handleChange(e.target.value)} required={isMandatory} className="text-primary focus:ring-primary " /> {opt}
            </label>
          ))}
          {q.allowOther && (
             <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
               <input type="radio" name={q.id || q._id} value="Other" checked={val === "Other"} onChange={(e) => handleChange(e.target.value)} required={isMandatory} className="text-primary focus:ring-primary" /> Other
             </label>
          )}
        </div>
      );
    }
    
    if (typeStr.includes("checkbox")) {
      let options = q.options?.map(o => o.value) || [];
      if (options.length === 0) options = ["Option 1", "Option 2"];
      
      const currentValues = Array.isArray(val) ? val : (val ? String(val).split(",") : []);
      const isGroupRequired = isMandatory && currentValues.length === 0;
      
      const handleCheckboxChange = (opt, isChecked) => {
        let newValues;
        if (isChecked) {
          newValues = [...currentValues, opt];
        } else {
          newValues = currentValues.filter(v => v !== opt);
        }
        
        handleChange(newValues.length > 0 ? newValues : "");
      };

      return (
        <div className="flex flex-col gap-3 mt-3 mb-2">
          {options.map((opt, i) => (
            <label key={i} className="flex items-center gap-3 text-[14px] text-gray-700 cursor-pointer w-fit font-medium">
              <input 
                type="checkbox" 
                name={q.id || q._id} 
                value={opt} 
                checked={currentValues.includes(opt)} 
                onChange={(e) => handleCheckboxChange(opt, e.target.checked)} 
                required={isGroupRequired}
                className="text-primary focus:ring-primary rounded w-4 h-4 cursor-pointer" 
              /> 
              {opt}
            </label>
          ))}
          {q.allowOther && (
             <label className="flex items-center gap-3 text-[14px] text-gray-700 cursor-pointer w-fit font-medium">
               <input 
                 type="checkbox" 
                 name={q.id || q._id} 
                 value="Other" 
                 checked={currentValues.includes("Other")} 
                 onChange={(e) => handleCheckboxChange("Other", e.target.checked)} 
                 required={isGroupRequired}
                 className="text-primary focus:ring-primary rounded w-4 h-4 cursor-pointer" 
               /> 
               Other
             </label>
          )}
        </div>
      );
    }

    let inputType = "text";
    if (typeStr.includes("email") || q.title.toLowerCase().includes("email")) inputType = "email";
    else if (typeStr.includes("number") || typeStr.includes("mobile")) inputType = "tel";
    else if (typeStr.includes("date") || typeStr.includes("calendar")) inputType = "date";
    else if (typeStr.includes("time")) inputType = "time";

    const isFile = typeStr.includes("file") || typeStr.includes("upload") || q.title.toLowerCase().includes("resume") || q.title.toLowerCase().includes("document");

    if (isFile) {
      return (
        <div className="flex flex-col gap-2 w-full mt-2">
           <label className="relative flex flex-col items-center justify-center w-full py-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
             <div className="flex flex-col items-center justify-center pb-1">
               <Upload className="w-5 h-5 mb-2 text-slate-500" />
               <p className="text-sm text-slate-500 font-medium upload-text">{val ? "Change file" : "Click to upload a file"}</p>
             </div>
             <input 
               type="file" 
               className="hidden"
               onChange={async (e) => {
                 const file = e.target.files[0];
                 if (!file) return;
                 
                 const label = e.target.closest("label");
                 const p = label.querySelector(".upload-text");
                 p.innerText = "Uploading...";
                 
                 try {
                   const formData = new FormData();
                   formData.append("file", file);
                   const token = localStorage.getItem("token");
                   const apiUrl = import.meta.env.PROD ? 'https://career-fair-loyh.onrender.com/api' : 'http://localhost:5000/api';
                   const res = await fetch(`${apiUrl}/upload/public`, {
                     method: 'POST',
                     headers: token ? { Authorization: `Bearer ${token}` } : {},
                     body: formData
                   });
                   if (!res.ok) throw new Error('Upload failed');
                   const data = await res.json();
                   handleChange(data.url);
                 } catch (err) {
                   console.error(err);
                   alert("Failed to upload file. Please try again.");
                   e.target.value = "";
                 } finally {
                   p.innerText = file.name;
                 }
               }}
               required={isMandatory && !val} 
             />
           </label>
           {val && <span className="text-xs text-green-600 font-semibold bg-green-50 w-fit px-2 py-1 rounded-md border border-green-200">File attached successfully</span>}
        </div>
      );
    }

    return <input type={inputType} value={val} onChange={(e) => handleChange(e.target.value)} required={isMandatory} className="w-full border-b border-gray-300 px-0 py-2 outline-none focus:border-primary transition-colors bg-transparent" />;
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      
      

      <div className="max-w-5xl mx-auto w-full px-6 py-8">
        
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-1">
            <div className="p-1.5 bg-gray-100 rounded-full">
              <FaArrowLeft className="text-xs" />
            </div>
            Attendee Details
          </button>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            <div className="text-sm text-gray-500 font-medium mt-2">
              {startDate} | {startTime} IST Onwards | {venue}
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-gray-50 rounded-t-lg px-6 py-3 border border-gray-200 border-b-0">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Users size={16} /> Attendee Details
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {dbEvent.questions?.length > 0 ? (
                dbEvent.questions.map((q) => {
                  const isResume = q.title?.toLowerCase().includes("resume") || 
                                   q.title?.toLowerCase().includes("cv") || 
                                   (q.type || "").toLowerCase().includes("file");
                  return (
                    <div key={q.id || q._id} className={isResume ? "md:col-span-2" : "col-span-1"}>
                      <label className="block text-[14.5px] font-semibold text-gray-600 mb-2">
                        {q.title} {q.status === "Mandatory" && <span className="text-red-500">*</span>}
                      </label>
                      {renderInputForQuestion(q)}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 md:col-span-2">No additional details required for this event.</p>
              )}

              <div className="md:col-span-2 flex items-start gap-3 mt-4">
                <input type="checkbox" required className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary" />
                <span className="text-sm text-gray-600">
                  By clicking here, I state that I have read and understood the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> and <a href="#" className="text-blue-600 hover:underline">privacy policy</a>.
                </span>
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <button disabled={submitting} type="submit" className="bg-gradient-to-r from-primary to-[#2a108a] hover:opacity-95 text-white px-10 py-2.5 rounded font-semibold transition-colors shadow-md disabled:opacity-70">
                  {submitting ? "PROCESSING..." : "REGISTER"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDetailsPage;
