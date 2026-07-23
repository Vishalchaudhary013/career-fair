import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../config";
import CreateEventHeader from "../create-event/CreateEventHeader";
import CreateEventSidebar, { allItems } from "../create-event/CreateEventSidebar";
import BasicInformationTab from "../create-event/BasicInformationTab";
import LocationTab from "../create-event/LocationTab";
import VirtualJoiningTab from "../create-event/VirtualJoiningTab";
import EventInformationTab from "../create-event/EventInformationTab";
import BannerPhotosTab from "../create-event/BannerPhotosTab";
import TicketsTab from "../create-event/TicketsTab";
import QuestionsTab from "../create-event/QuestionsTab";
import { DATE_OPTS } from "../create-event/dateTimeHelpers";
import { X } from "lucide-react";
import virtualEventImg from "../../asserts/virtual_event.png";
import inPersonEventImg from "../../asserts/in_person_event.png";

const stepMeta = {
  "basic-information": { label: "Add Event Details - step 1/5", step: 1 },
  "location":          { label: "Add Event Details - step 2/5", step: 2 },
  "event-information": { label: "Add Event Details - step 3/5", step: 3 },
  "banner-photos":     { label: "Add Event Details - step 4/5", step: 4 },
  "question":          { label: "Registration Form - step 5/5", step: 5 },
};

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isEditing = !!eventId;
  const user = { hostName: "Admin", userName: "Admin" };


  const [eventType, setEventType] = useState(isEditing ? "in-person" : null);

  const handleSelectEventType = (type) => {
    setEventType(type);
    if (type === "virtual") {
      setVenueOption("online");
      setCity("Online");
      setVenueName("Online Meeting");
    } else {
      setVenueOption("address");
      setCity("");
      setVenueName("");
    }
  };

  const [activeTab, setActiveTab] = useState("basic-information");
  const [maxReachedStep, setMaxReachedStep] = useState(isEditing ? allItems.length - 1 : 0);

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [startDate, setStartDate] = useState(DATE_OPTS[1]?.value ?? DATE_OPTS[0].value);
  const [startTime, setStartTime] = useState("17:00");
  const [endDate, setEndDate] = useState(DATE_OPTS[1]?.value ?? DATE_OPTS[0].value);
  const [endTime, setEndTime] = useState("18:00");

  const [venueOption, setVenueOption] = useState("address");
  const [venueName, setVenueName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [nearestBusStop, setNearestBusStop] = useState("");
  const [nearestAirport, setNearestAirport] = useState("");
  const [nearestTrainStation, setNearestTrainStation] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const resetLocation = () => { setVenueName(""); setStreet1(""); setStreet2(""); setCity(""); setPinCode(""); setNearestBusStop(""); setNearestAirport(""); setNearestTrainStation(""); setLocationLink(""); };


  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [fairType, setFairType] = useState("");
  const [fairStats, setFairStats] = useState([
    { label: "Companies", value: 150 },
    { label: "Job Roles", value: 45 },
    { label: "Graduates", value: 2500 },
    { label: "States / U.Ts", value: 12 },
    { label: "Cities & Towns", value: 35 },
    { label: "Hall Tickets", value: 5000 }
  ]);
  const initialCompany = {
    companyName: "",
    companyLogo: null,
    companyLogoUrl: "",
    existingLogo: "",
    logoSourceMode: "upload",
    logoLink: "",
    jobProfile: [{ title: "", type: "" }],
    qualification: "",
    candidatesRequired: "",
    minSalary: "",
    maxSalary: "",
    salaryType: "Per Month",
    minExperience: "",
    maxExperience: "",
    experienceType: "Years",
    description: "",
    locations: [{ state: "", city: "", pincode: "" }],
    jobExpiryDate: "",
    hiringProcess: [],
    positionOpenFor: [],
    otherBenefit: "",
    openForPhysicallyChallenged: "",
    organisationName: "",
    companyType: "",
    contactPersonName: "",
    designation: "",
    mobileNumber: "",
    email: "",
    yourDetailsJobRole: "",
    yourDetailsTotalOpenings: "",
    yourDetailsState: "",
    yourDetailsCity: "",
    yourDetailsMinSalary: "",
    yourDetailsMaxSalary: ""
  };
  const [companies, setCompanies] = useState([initialCompany]);
  
  const addCompany = () => setCompanies((c) => [...c, initialCompany]);
  const removeCompany = (i) => setCompanies((c) => c.filter((_, idx) => idx !== i));
  const updateCompany = (i, field, val) => setCompanies((c) => c.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  
  const [thingsToKnow, setThingsToKnow] = useState(["", "", ""]);
  const [instructions, setInstructions] = useState("");
  const [termsText, setTermsText] = useState("");
  const [faqs, setFaqs] = useState([{ q: "", a: "", open: true }]);
  
  const [extraDetails, setExtraDetails] = useState({
    organizedBy: "",
    registrationDateTime: "",
    whatsappNumber: "",
    phone: "",
    additionalPhone: "",
    additionalPhone2: "",
    additionalPhone3: "",
    email: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });
  
  const addThing = () => setThingsToKnow((t) => [...t, ""]);
  const removeThing = (i) => setThingsToKnow((t) => t.filter((_, idx) => idx !== i));
  const updateThing = (i, val) => setThingsToKnow((t) => t.map((item, idx) => idx === i ? val : item));
  const addFaq = () => setFaqs((f) => [...f, { q: "", a: "", open: true }]);
  const removeFaq = (i) => setFaqs((f) => f.filter((_, idx) => idx !== i));
  const updateFaq = (i, field, val) => setFaqs((f) => f.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const toggleFaq = (i) => setFaqs((f) => f.map((item, idx) => idx === i ? { ...item, open: !item.open } : item));

  const [bannerUrl, setBannerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [companyListDocumentUrl, setCompanyListDocumentUrl] = useState("");

  const [tickets, setTickets] = useState([]);
  const [ticketButtonText, setTicketButtonText] = useState("Book Tickets");
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editingTicketIndex, setEditingTicketIndex] = useState(null);
  const [ticketName, setTicketName] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Free");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [minBooking, setMinBooking] = useState("1");
  const [maxBooking, setMaxBooking] = useState("10");
  const [ticketStartDate, setTicketStartDate] = useState(DATE_OPTS[1]?.value ?? DATE_OPTS[0].value);
  const [ticketStartTime, setTicketStartTime] = useState("10:00");
  const [ticketEndDate, setTicketEndDate] = useState(DATE_OPTS[1]?.value ?? DATE_OPTS[0].value);
  const [ticketEndTime, setTicketEndTime] = useState("09:00");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketCurrency, setTicketCurrency] = useState("INR");

  const resetTicketForm = () => { setTicketName(""); setTicketCategory("Free"); setTotalQuantity(""); setMinBooking("1"); setMaxBooking("10"); setTicketStartDate(DATE_OPTS[1]?.value ?? DATE_OPTS[0].value); setTicketStartTime("10:00"); setTicketEndDate(DATE_OPTS[1]?.value ?? DATE_OPTS[0].value); setTicketEndTime("09:00"); setTicketPrice(""); setTicketCurrency("INR"); setEditingTicketIndex(null); };

  const handleCreateTicket = () => {
    const newTicket = { name: ticketName, category: ticketCategory, price: ticketCategory === "Paid" ? ticketPrice : 0, currency: ticketCurrency, totalQuantity, minBooking, maxBooking, startDate: ticketStartDate, startTime: ticketStartTime, endDate: ticketEndDate, endTime: ticketEndTime };
    if (editingTicketIndex !== null) { setTickets((prev) => { const arr = [...prev]; arr[editingTicketIndex] = newTicket; return arr; }); }
    else { setTickets((prev) => [...prev, newTicket]); }
    setShowTicketForm(false);
    resetTicketForm();
  };

  const editTicket = (i) => { const t = tickets[i]; setTicketName(t.name); setTicketCategory(t.category); setTicketPrice(t.price); setTicketCurrency(t.currency || "INR"); setTotalQuantity(t.totalQuantity); setMinBooking(t.minBooking); setMaxBooking(t.maxBooking); setTicketStartDate(t.startDate); setTicketStartTime(t.startTime); setTicketEndDate(t.endDate); setTicketEndTime(t.endTime); setEditingTicketIndex(i); setShowTicketForm(true); };
  const deleteTicket = (i) => setTickets((prev) => prev.filter((_, idx) => idx !== i));

 
  const [addedQuestions, setAddedQuestions] = useState([
    { id: "q_name",  title: "Name",     type: "Text", status: "Mandatory", tickets: "All Tickets", isDefault: false },
    { id: "q_email", title: "Email ID", type: "Text", status: "Mandatory", tickets: "All Tickets", isDefault: false },
  ]);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [showCustomQuestionForm, setShowCustomQuestionForm] = useState(false);
  const [selectedPredefinedQuestion, setSelectedPredefinedQuestion] = useState(null);
  const [customQuestionTitle, setCustomQuestionTitle] = useState("");
  const [customQuestionType, setCustomQuestionType] = useState("");
  const [questionStatus, setQuestionStatus] = useState("Mandatory");
  const [questionTickets, setQuestionTickets] = useState("All Tickets");
  const [fileUploadFields, setFileUploadFields] = useState([]);

  const currentStep = stepMeta[activeTab] ? {
    ...stepMeta[activeTab],
    label: activeTab === "location" && eventType === "virtual" 
      ? "Add Joining Details - step 2/5" 
      : stepMeta[activeTab].label
  } : null;

  
  useEffect(() => {
    if (!isEditing) return;
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/fair/${eventId}`);
        const e = res.data?.data || res.data;
        if (!e) return;

        setTitle(e.fairName || "");
        setVisibility(e.visibility || "public");
        setCategory(e.category || "");
        setFairType(e.fairType || "");
        setDescription(e.description || "");

        if (e.startDate) {
          const sd = new Date(e.startDate);
          setStartDate(sd.toISOString().split("T")[0]);
          setStartTime(sd.toTimeString().slice(0, 5));
        }
        if (e.endDate) {
          const ed = new Date(e.endDate);
          setEndDate(ed.toISOString().split("T")[0]);
          setEndTime(ed.toTimeString().slice(0, 5));
        }

        if (e.venue) {
          setVenueName(e.venue.venueName || "");
          setStreet1(e.venue.addressLine1 || "");
          setStreet2(e.venue.addressLine2 || "");
          setCity(e.venue.city || "");
          setPinCode(e.venue.pincode || "");
          setNearestBusStop(e.venue.nearestBusStop || "");
          setNearestAirport(e.venue.nearestAirport || "");
          setNearestTrainStation(e.venue.nearestRailwayStation || "");
          setLocationLink(e.venue.location || "");
        }

        if (e.statistics && Array.isArray(e.statistics)) {
          setFairStats(e.statistics.map(stat => ({
            label: stat.label || "Statistic",
            value: stat.value || 0
          })));
        }

        if (e.hiringPartners && Array.isArray(e.hiringPartners)) {
          setCompanies(e.hiringPartners.map(p => ({
            companyName: p.companyName || "",
            companyLogo: null,
            existingLogo: p.logo || "",
            companyLogoUrl: p.logo ? (p.logo.startsWith("http") ? p.logo : (p.logo.startsWith("companyLogo") || p.logo.startsWith("file-") ? `${SERVER_URL}/uploads/files/${p.logo}` : `${SERVER_URL}/uploads/logo/${p.logo}`)) : "",
            logoSourceMode: p.logoLink ? "link" : "upload",
            logoLink: p.logoLink || "",
            jobProfile: (p.jobProfile && typeof p.jobProfile === 'string' && p.jobProfile.startsWith('[')) ? JSON.parse(p.jobProfile) : [{ title: p.jobProfile || "", type: p.jobType || "" }],
            qualification: p.qualification || "",
            candidatesRequired: p.candidatesRequired || "",
            minSalary: p.minSalary || "",
            maxSalary: p.maxSalary || "",
            salaryType: p.salaryType || "Per Month",
            minExperience: p.minExperience || "",
            maxExperience: p.maxExperience || "",
            experienceType: p.experienceType || "Years",
            description: p.description || "",
            locations: p.locations && p.locations.length > 0 ? p.locations : [{ state: p.jobLocationState || "", city: p.jobLocationCity || "", pincode: p.pincode || "" }],
            jobExpiryDate: p.jobExpiryDate ? new Date(p.jobExpiryDate).toISOString().split("T")[0] : "",
            hiringProcess: p.hiringProcess || [],
            positionOpenFor: p.positionOpenFor || [],
            otherBenefit: p.otherBenefit || "",
            openForPhysicallyChallenged: p.openForPhysicallyChallenged || "",
            organisationName: p.organisationName || "",
            companyType: p.companyType || "",
            contactPersonName: p.contactPersonName || "",
            designation: p.designation || "",
            mobileNumber: p.mobileNumber || "",
            email: p.email || "",
            yourDetailsJobRole: p.yourDetailsJobRole || "",
            yourDetailsTotalOpenings: p.yourDetailsTotalOpenings || "",
            yourDetailsState: p.yourDetailsState || "",
            yourDetailsCity: p.yourDetailsCity || "",
            yourDetailsMinSalary: p.yourDetailsMinSalary || "",
            yourDetailsMaxSalary: p.yourDetailsMaxSalary || ""
          })));
        }

        if (e.whoCanApply && Array.isArray(e.whoCanApply)) {
          setThingsToKnow(e.whoCanApply.map(w => w.title || ""));
        }

        setInstructions(e.instructions || "");
        setTermsText(e.termAndConditions || "");

        if (e.faqs && Array.isArray(e.faqs)) {
          setFaqs(e.faqs.map(f => ({ q: f.question || f.q || "", a: f.answer || f.a || "", open: false })));
        }

        setExtraDetails({
          organizedBy: e.organizerName || "",
          registrationDateTime: e.registrationDeadline ? new Date(e.registrationDeadline).toISOString().slice(0, 16) : "",
          whatsappNumber: e.contact?.whatsappNumber || "",
          phone: e.contact?.primaryNumber || "",
          additionalPhone: e.contact?.additionalNumber1 || "",
          additionalPhone2: e.contact?.additionalNumber2 || "",
          additionalPhone3: e.contact?.additionalNumber3 || "",
          email: e.contact?.email || "",
          facebook: e.socialLinks?.facebook || "",
          instagram: e.socialLinks?.instagram || "",
          linkedin: e.socialLinks?.linkedin || "",
          twitter: e.socialLinks?.twitter || "",
        });

        if (e.fairBanner) setBannerUrl({ preview: `${SERVER_URL}/uploads/banner/${e.fairBanner}`, file: null });
        if (e.fairLogo) setLogoUrl({ preview: `${SERVER_URL}/uploads/logo/${e.fairLogo}`, file: null });
        if (e.companyListDocument) setCompanyListDocumentUrl({ preview: `${SERVER_URL}/uploads/files/${e.companyListDocument}`, file: null, existingName: e.companyListDocument });

        if (e.tickets && Array.isArray(e.tickets)) {
          setTickets(e.tickets.map(t => ({
            name: t.ticketName || t.name || "",
            category: t.category || "Free",
            price: t.price || 0,
            currency: t.currency || "INR",
            totalQuantity: t.totalQuantity || "",
            minBooking: t.minBooking || 1,
            maxBooking: t.maxBooking || 10,
            startDate: t.startFroms ? new Date(t.startFroms).toISOString().split("T")[0] : startDate,
            startTime: t.startFroms ? new Date(t.startFroms).toTimeString().slice(0, 5) : "10:00",
            endDate: t.endsat ? new Date(t.endsat).toISOString().split("T")[0] : endDate,
            endTime: t.endsat ? new Date(t.endsat).toTimeString().slice(0, 5) : "09:00",
          })));
        }

        if (e.questions && Array.isArray(e.questions)) {
          const typeMapping = {
            "textarea": "Paragraph",
            "email": "Email",
            "number": "Contact Number",
            "select": "Dropdown",
            "radio": "Multiple Choice",
            "checkbox": "Checkboxes",
            "date": "Date of birth",
            "file": "File",
            "text": "Text"
          };

          const fetchedQuestions = e.questions.map(q => {
            const mappedType = typeMapping[q.type] || "Text";
            return {
              id: q._id || `q_${Date.now()}_${Math.random()}`,
              title: q.title || "",
              type: mappedType,
              status: q.status || (q.required ? "Mandatory" : "Optional"),
              tickets: q.showforallTickets || "All Tickets",
              isDefault: !!q.isDefault,
              options: q.options || [],
              allowOther: q.allowOther || false
            };
          });
          
          if (fetchedQuestions.length > 0) {
            setAddedQuestions(fetchedQuestions);
          }
        }
      } catch (err) {
        console.error("Failed to load fair for editing:", err);
        alert("Failed to load fair data.");
      }
    };
    fetchEvent();
  }, [eventId, isEditing]);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Fair Name is required. Please go to Basic Information and enter a title.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      
      fd.append("fairName", title);
      fd.append("visibility", visibility);
      fd.append("category", category);
      fd.append("fairType", fairType);
      fd.append("description", description);
      
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);
      fd.append("startDate", startDateTime.toISOString());
      fd.append("endDate", endDateTime.toISOString());
      
      const venueData = {
        venueName: venueName || (eventType === "virtual" ? "Online Meeting" : ""),
        addressLine1: street1,
        addressLine2: street2,
        city: eventType === "virtual" ? "Online" : city,
        pincode: pinCode,
        nearestBusStop,
        nearestAirport,
        nearestRailwayStation: nearestTrainStation,
        location: locationLink,
      };
      fd.append("venue", JSON.stringify(venueData));
      
      fd.append("organizerName", extraDetails.organizedBy || "Organizer");
      if (extraDetails.registrationDateTime) {
        fd.append("registrationDeadline", new Date(extraDetails.registrationDateTime).toISOString());
      } else {
        fd.append("registrationDeadline", new Date().toISOString());
      }
      
      const contactData = {
        whatsappNumber: extraDetails.whatsappNumber || "0000000000",
        primaryNumber: extraDetails.phone || "0000000000",
        additionalNumber1: extraDetails.additionalPhone,
        additionalNumber2: extraDetails.additionalPhone2,
        additionalNumber3: extraDetails.additionalPhone3,
        email: extraDetails.email || "test@example.com",
      };
      fd.append("contact", JSON.stringify(contactData));
      
      const socialLinksData = {
        facebook: extraDetails.facebook,
        instagram: extraDetails.instagram,
        linkedin: extraDetails.linkedin,
        twitter: extraDetails.twitter,
      };
      fd.append("socialLinks", JSON.stringify(socialLinksData));
      
      const statsData = fairStats.map(stat => ({
        label: stat.label || "Statistic",
        value: Number(stat.value) || 0
      }));
      fd.append("statistics", JSON.stringify(statsData));
      
      const applyData = thingsToKnow.filter(t => t.trim()).map(t => ({ title: t }));
      fd.append("whoCanApply", JSON.stringify(applyData));
      
      fd.append("instructions", instructions);
      fd.append("termAndConditions", termsText);
      
      const faqsData = faqs.filter(f => f.q.trim() && f.a.trim()).map(f => ({ question: f.q, answer: f.a, open: f.open }));
      fd.append("faqs", JSON.stringify(faqsData));
      
      fd.append("tickets", JSON.stringify([]));
      
      const questionsData = addedQuestions.map(q => {
        let mappedType = "text";
        const typeStr = (q.type || "").toLowerCase();
        
        if (typeStr.includes("paragraph")) mappedType = "textarea";
        else if (typeStr.includes("email")) mappedType = "email";
        else if (typeStr.includes("number") || typeStr.includes("mobile")) mappedType = "number";
        else if (typeStr.includes("dropdown") || typeStr.includes("state") || typeStr.includes("country")) mappedType = "select";
        else if (typeStr.includes("radio") || typeStr.includes("multiple choice")) mappedType = "radio";
        else if (typeStr.includes("checkbox")) mappedType = "checkbox";
        else if (typeStr.includes("date") || typeStr.includes("calendar")) mappedType = "date";
        else if (typeStr.includes("file") || typeStr.includes("upload")) mappedType = "file";

        return {
          title: q.title,
          type: mappedType,
          required: q.status === "Mandatory",
          status: q.status,
          showforallTickets: q.tickets,
          isDefault: q.isDefault,
          options: q.options || [],
          allowOther: q.allowOther || false
        };
      });

      fileUploadFields.forEach(f => {
        questionsData.push({
          title: f.title || "File Upload",
          type: "file",
          required: f.status === "Mandatory",
          status: f.status || "Mandatory",
          showforallTickets: "All Tickets",
          isDefault: false
        });
      });

      fd.append("questions", JSON.stringify(questionsData));
      
      const partnersData = companies.map(c => ({
        companyName: c.companyName || "Unknown Company",
        logo: c.existingLogo || c.companyLogoUrl || "",
        logoLink: c.logoSourceMode === "link" ? c.logoLink : "",
        jobProfile: JSON.stringify(c.jobProfile),
        qualification: c.qualification,
        candidatesRequired: Number(c.candidatesRequired) || 0,
        minSalary: c.minSalary,
        maxSalary: c.maxSalary,
        salaryType: c.salaryType,
        minExperience: c.minExperience,
        maxExperience: c.maxExperience,
        experienceType: c.experienceType,
        description: c.description,
        locations: c.locations,
        jobExpiryDate: c.jobExpiryDate,
        hiringProcess: c.hiringProcess,
        positionOpenFor: c.positionOpenFor,
        otherBenefit: c.otherBenefit,
        openForPhysicallyChallenged: c.openForPhysicallyChallenged,
        organisationName: c.organisationName,
        companyType: c.companyType,
        contactPersonName: c.contactPersonName,
        designation: c.designation,
        mobileNumber: c.mobileNumber,
        email: c.email,
        yourDetailsJobRole: c.yourDetailsJobRole,
        yourDetailsTotalOpenings: c.yourDetailsTotalOpenings,
        yourDetailsState: c.yourDetailsState,
        yourDetailsCity: c.yourDetailsCity,
        yourDetailsMinSalary: c.yourDetailsMinSalary,
        yourDetailsMaxSalary: c.yourDetailsMaxSalary
      }));
      fd.append("hiringPartners", JSON.stringify(partnersData));
      
      if (bannerUrl?.file) fd.append("fairBanner", bannerUrl.file);
      if (logoUrl?.file) fd.append("fairLogo", logoUrl.file);
      if (companyListDocumentUrl?.file) fd.append("companyListDocument", companyListDocumentUrl.file);
      
      companies.forEach((c) => {
        if (c.companyLogo) {
          fd.append("companyLogo", c.companyLogo);
        } else {
           fd.append("companyLogo", new File([""], "empty_logo.txt", { type: "text/plain" }));
        }
      });
      
      if (isEditing) {
        await axios.put(`${SERVER_URL}/api/fair/update/${eventId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Fair updated successfully!");
      } else {
        await axios.post(`${SERVER_URL}/api/fair/create`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Fair created successfully!");
      }
      navigate("/super-admin-dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to create event. Please check the form and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    const idx = allItems.indexOf(activeTab);
    if (idx < allItems.length - 1) {
      setActiveTab(allItems[idx + 1]);
      setMaxReachedStep(Math.max(maxReachedStep, idx + 1));
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const idx = allItems.indexOf(activeTab);
    if (idx > 0) setActiveTab(allItems[idx - 1]);
  };

  if (!isEditing && eventType === null) {
    return (
      <div className="min-h-screen bg-[#F7F5FC] flex flex-col pt-[60px]">
        <CreateEventHeader />
        <div className="flex-1 flex flex-col justify-center items-center relative py-12 px-6">
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 right-8 w-12 h-12 bg-primary hover:bg-primary/90 text-white flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition cursor-pointer z-10"
          >
            <X size={24} />
          </button>

    
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-300">
            <h1 className="text-4xl md:text-5xl font-semibold  text-primary mb-3">
              Hi {user?.hostName || user?.userName || "Organizer"}!
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-500">
              What kind of fair would you like to create?
            </p>
          </div>

      
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
          
            <div 
              onClick={() => handleSelectEventType("virtual")}
              className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.12)] border-gray-200/50 flex flex-col items-center text-center w-full md:w-[380px] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer group"
            >
              <div className="h-44 w-full flex items-center justify-center mb-6 overflow-hidden rounded-2xl bg-gray-50/50">
                <img 
                  src={virtualEventImg} 
                  alt="Virtual Event" 
                  className="h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h2 className="text-xl font-bold text-primary mb-3  transition-colors">Virtual Fair</h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[280px] mb-8 flex-1">
                Host single and multi-track fairs including webinars, conferences and virtual exhibitions
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSelectEventType("virtual"); }}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition shadow-sm hover:shadow-md cursor-pointer"
              >
                Select
              </button>
            </div>

            {/* In-Person Fair Card */}
            <div 
              onClick={() => handleSelectEventType("in-person")}
              className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.12)] border-gray-200/50 flex flex-col items-center text-center w-full md:w-[380px] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer group"
            >
              <div className="h-44 w-full flex items-center justify-center mb-6 overflow-hidden rounded-2xl bg-gray-50/50">
                <img 
                  src={inPersonEventImg} 
                  alt="In-Person Event" 
                  className="h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h2 className="text-xl font-bold text-primary mb-3  transition-colors">In-Person Fair</h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[280px] mb-8 flex-1">
                Conduct and manage physical fairs such as marathons and workshops
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSelectEventType("in-person"); }}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition shadow-sm hover:shadow-md cursor-pointer"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="flex flex-col bg-white" style={{ height: "100vh" }}>
      <CreateEventHeader />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden" style={{ marginTop: "60px", height: "calc(100vh - 60px)" }}>
        <CreateEventSidebar activeTab={activeTab} setActiveTab={setActiveTab} maxReachedStep={maxReachedStep} eventType={eventType} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-6 sm:py-10">

            {activeTab === "basic-information" && (
              <BasicInformationTab
                title={title} setTitle={setTitle}
                visibility={visibility} setVisibility={setVisibility}
                startDate={startDate} setStartDate={setStartDate}
                startTime={startTime} setStartTime={setStartTime}
                endDate={endDate} setEndDate={setEndDate}
                endTime={endTime} setEndTime={setEndTime}
              />
            )}

            {activeTab === "location" && (
              eventType === "virtual" ? (
                <VirtualJoiningTab
                  venueName={venueName} setVenueName={setVenueName}
                  city={city} setCity={setCity}
                />
              ) : (
                <LocationTab
                  venueOption={venueOption} setVenueOption={setVenueOption}
                  venueName={venueName} setVenueName={setVenueName}
                  street1={street1} setStreet1={setStreet1}
                  street2={street2} setStreet2={setStreet2}
                  city={city} setCity={setCity}
                  pinCode={pinCode} setPinCode={setPinCode}
                  nearestBusStop={nearestBusStop} setNearestBusStop={setNearestBusStop}
                  nearestAirport={nearestAirport} setNearestAirport={setNearestAirport}
                  nearestTrainStation={nearestTrainStation} setNearestTrainStation={setNearestTrainStation}
                  locationLink={locationLink} setLocationLink={setLocationLink}
                  resetLocation={resetLocation}
                />
              )
            )}

            {activeTab === "event-information" && (
              <EventInformationTab
                description={description} setDescription={setDescription}
                category={category} setCategory={setCategory}
                fairType={fairType} setFairType={setFairType}
                fairStats={fairStats} setFairStats={setFairStats}
                companies={companies} addCompany={addCompany} removeCompany={removeCompany} updateCompany={updateCompany}
                thingsToKnow={thingsToKnow} addThing={addThing} removeThing={removeThing} updateThing={updateThing}
                instructions={instructions} setInstructions={setInstructions}
                termsText={termsText} setTermsText={setTermsText}
                faqs={faqs} addFaq={addFaq} removeFaq={removeFaq} updateFaq={updateFaq} toggleFaq={toggleFaq}
                extraDetails={extraDetails} setExtraDetails={setExtraDetails}
                companyListDocumentUrl={companyListDocumentUrl} setCompanyListDocumentUrl={setCompanyListDocumentUrl}
              />
            )}

            {activeTab === "banner-photos" && (
              <BannerPhotosTab
                bannerUrl={bannerUrl} setBannerUrl={setBannerUrl}
                logoUrl={logoUrl} setLogoUrl={setLogoUrl}
              />
            )}



            {activeTab === "question" && (
              <QuestionsTab
                addedQuestions={addedQuestions} setAddedQuestions={setAddedQuestions}
                showQuestionBank={showQuestionBank} setShowQuestionBank={setShowQuestionBank}
                showCustomQuestionForm={showCustomQuestionForm} setShowCustomQuestionForm={setShowCustomQuestionForm}
                selectedPredefinedQuestion={selectedPredefinedQuestion} setSelectedPredefinedQuestion={setSelectedPredefinedQuestion}
                customQuestionTitle={customQuestionTitle} setCustomQuestionTitle={setCustomQuestionTitle}
                customQuestionType={customQuestionType} setCustomQuestionType={setCustomQuestionType}
                questionStatus={questionStatus} setQuestionStatus={setQuestionStatus}
                questionTickets={questionTickets} setQuestionTickets={setQuestionTickets}
                fileUploadFields={fileUploadFields} setFileUploadFields={setFileUploadFields}
              />
            )}
          </div>

          {/* Sticky Footer */}
          <footer className="shrink-0 bg-[#eeeef8] border-t border-[#d4d4ec] px-4 sm:px-10 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">({currentStep?.label ?? "Add Fair Details"})</span>
            <div className="flex items-center gap-3">
              {currentStep?.step > 1 && (
                <button onClick={handleBack} className="border border-primary text-primary text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-secondary/5 transition cursor-pointer">Back</button>
              )}
              <button onClick={handleNext} disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90 disabled:bg-secondary/70 text-white text-sm font-semibold px-7 py-2.5 rounded-lg transition shadow-sm cursor-pointer">
                {isSubmitting ? "Publishing..." : activeTab === "basic-information" ? "Save & Next" : activeTab === "question" ? "Publish Fair" : "Next"}
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default CreateEventPage;
