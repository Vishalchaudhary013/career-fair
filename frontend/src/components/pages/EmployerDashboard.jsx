import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import CreateEventHeader from "../create-event/CreateEventHeader";
import {
  getEmployerDashboard,
  getAllEvents,
  joinAsPartner,
  updateEmployerJob,
  deleteEmployerJob,
  getAvailableLanguages
} from "../services/eventService";
import { t } from "../../utils/translations";
import { getMediaUrl } from "../services/api";
import {
  FiBriefcase,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiUpload,
  FiX,
  FiSearch,
  FiChevronRight,
  FiLogOut
} from "react-icons/fi";
import { FaBuilding, FaDownload, FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaGlobe, FaArrowRight, FaClock, FaCheckCircle, FaUsers, FaMapMarkerAlt, FaFileAlt, FaBriefcase, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { SERVER_URL } from "../../config";
import api from "../services/api";
import Select from "react-select";
import { State, City } from "country-state-city";

const INDIA_ISO_CODE = 'IN';
const INDIA_STATES = State.getStatesOfCountry(INDIA_ISO_CODE).map(s => ({ value: s.name, label: s.name, isoCode: s.isoCode }));

const formatJobProfileDisplay = (profile) => {
  if (!profile) return "";
  let str = Array.isArray(profile) ? profile[0] : profile;
  if (typeof str !== 'string') return "";
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      return parsed.map(p => p.title).filter(Boolean).join(", ");
    }
  } catch(e) {}
  if (Array.isArray(profile)) return profile.join(", ");
  return String(profile);
};

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openPostJobFor) {
      openPostJobModal(location.state.openPostJobFor);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const { user, logout } = useAuth();

  const isImpersonating = !!localStorage.getItem("super_admin_token");

  const handleReturnToSuperAdmin = () => {
    localStorage.setItem("user", localStorage.getItem("super_admin_user"));
    localStorage.setItem("token", localStorage.getItem("super_admin_token"));
    localStorage.removeItem("super_admin_user");
    localStorage.removeItem("super_admin_token");
    window.location.href = "/super-admin-dashboard";
  };

  const [stats, setStats] = useState({ totalFairs: 0, totalJobRoles: 0, totalVacancies: 0 });
  const [myFairs, setMyFairs] = useState([]);
  const [allFairs, setAllFairs] = useState([]);

  const [activeSection, setActiveSection] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentFair, setCurrentFair] = useState(null);
  const [currentJobId, setCurrentJobId] = useState("");

  const [logoSourceMode, setLogoSourceMode] = useState("upload");
  const [formData, setFormData] = useState({
    companyName: "", jobProfile: [{ title: "", type: "" }], location: "", candidatesRequired: "", description: "", logoLink: "",
    jobType: "", qualification: "", minSalary: "", maxSalary: "", salaryType: "Per Month", minExperience: "", maxExperience: "", experienceType: "Years",
    locations: [{ state: "", city: "", pincode: "" }], jobExpiryDate: "", hiringProcess: [],
    positionOpenFor: [], otherBenefit: "", openForPhysicallyChallenged: "", organisationName: "",
    companyType: "", contactPersonName: "", designation: "", mobileNumber: "", email: "",
    yourDetailsJobRole: "", yourDetailsTotalOpenings: "", yourDetailsState: "", yourDetailsCity: "",
    yourDetailsMinSalary: "", yourDetailsMaxSalary: "", language: "English"
  });

  const [availableLanguages, setAvailableLanguages] = useState(["English"]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await getAvailableLanguages();
        if (langs && langs.length > 0) setAvailableLanguages(langs);
      } catch (e) {
        console.error("Failed to fetch languages", e);
      }
    };
    fetchLanguages();
  }, []);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashData = await getEmployerDashboard();
      if (dashData && dashData.success) {
        setStats(dashData.stats || { totalFairs: 0, totalJobRoles: 0, totalVacancies: 0 });
        setMyFairs(dashData.participatingFairs || []);
      }

      const eventsData = await getAllEvents();
      setAllFairs(eventsData || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const triggerSuccessNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 5000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("File size must be less than 5MB");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setFormError("");
    }
  };

  const openPostJobModal = (event, job = null) => {
    setCurrentFair(event);
    setFormError("");

    if (job) {
      setModalMode("edit");
      setCurrentJobId(job._id);
      setFormData({
        companyName: job.companyName || "", jobProfile: (() => {
          if (!job.jobProfile) return [{ title: "", type: "" }];
          try {
            const parsed = JSON.parse(job.jobProfile);
            return Array.isArray(parsed) ? parsed : [{ title: job.jobProfile, type: job.jobType || "" }];
          } catch(e) {
            return job.jobProfile.split(",").map(s => ({ title: s.trim(), type: job.jobType || "" }));
          }
        })(), location: job.location || "",
        candidatesRequired: job.candidatesRequired || "", description: job.description || "", logoLink: job.logoLink || "",
        jobType: job.jobType || "", qualification: job.qualification || "", minSalary: job.minSalary || "", salaryType: job.salaryType || "Per Month",
        maxSalary: job.maxSalary || "", minExperience: job.minExperience || "", maxExperience: job.maxExperience || "", experienceType: job.experienceType || "Years",
        locations: job.locations && job.locations.length > 0 ? job.locations : [{ state: "", city: "", pincode: "" }],
        jobExpiryDate: job.jobExpiryDate ? job.jobExpiryDate.split('T')[0] : "", hiringProcess: job.hiringProcess || [],
        positionOpenFor: job.positionOpenFor || [], otherBenefit: job.otherBenefit || "",
        openForPhysicallyChallenged: job.openForPhysicallyChallenged || "", organisationName: job.organisationName || "",
        companyType: job.companyType || "", contactPersonName: job.contactPersonName || "", designation: job.designation || "",
        mobileNumber: job.mobileNumber || "", email: job.email || "", yourDetailsJobRole: job.yourDetailsJobRole || "",
        yourDetailsCity: job.yourDetailsCity || "", yourDetailsMinSalary: job.yourDetailsMinSalary || "", yourDetailsMaxSalary: job.yourDetailsMaxSalary || "",
        showDetailsInUI: job.showDetailsInUI !== undefined ? job.showDetailsInUI : true,
        postingType: job.postingType || "Job"
      });
      if (job.logo) {
        setLogoSourceMode("upload");
        setLogoPreview(getMediaUrl(job.logo));
      } else if (job.logoLink) {
        setLogoSourceMode("link");
        setLogoPreview(job.logoLink);
      } else {
        setLogoSourceMode("upload");
        setLogoPreview("");
      }
      setLogoFile(null);
    } else {
      setModalMode("create");
      setCurrentJobId("");
      setFormData({
        companyName: "", jobProfile: [{ title: "", type: "" }], location: "", candidatesRequired: "", description: "", logoLink: "",
        jobType: "", qualification: "", minSalary: "", maxSalary: "", salaryType: "Per Month", minExperience: "", maxExperience: "", experienceType: "Years",
        locations: [{ state: "", city: "", pincode: "" }], jobExpiryDate: "", hiringProcess: [],
        positionOpenFor: [], otherBenefit: "", openForPhysicallyChallenged: "", organisationName: "",
        companyType: "", contactPersonName: "", designation: "", mobileNumber: "", email: "",
        yourDetailsJobRole: "", yourDetailsTotalOpenings: "", yourDetailsState: "", yourDetailsCity: "",
        yourDetailsMinSalary: "", yourDetailsMaxSalary: "", showDetailsInUI: true, postingType: "Job"
      });
      setLogoSourceMode("upload");
      setLogoPreview("");
      setLogoFile(null);
    }

    setActiveSection("PostJob");
  };

  const closeJobModal = () => {
    setActiveSection("MyFairs");
    setCurrentFair(null);
    setCurrentJobId("");
    setFormData({
      companyName: "", jobProfile: [{ title: "", type: "" }], location: "", candidatesRequired: "", description: "", logoLink: "",
      jobType: "", qualification: "", minSalary: "", maxSalary: "", salaryType: "Per Month", minExperience: "", maxExperience: "", experienceType: "Years",
      locations: [{ state: "", city: "", pincode: "" }], jobExpiryDate: "", hiringProcess: [],
      positionOpenFor: [], otherBenefit: "", openForPhysicallyChallenged: "", organisationName: "",
      companyType: "", contactPersonName: "", designation: "", mobileNumber: "", email: "",
      yourDetailsJobRole: "", yourDetailsTotalOpenings: "", yourDetailsState: "", yourDetailsCity: "",
      yourDetailsMinSalary: "", yourDetailsMaxSalary: "", showDetailsInUI: true, postingType: "Job"
    });
    setLogoFile(null);
    setLogoPreview("");
    setFormError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    const { companyName, jobProfile, location, candidatesRequired } = formData;

    const uploadData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'hiringProcess' || key === 'positionOpenFor') {
        formData[key].forEach(val => uploadData.append(key, val));
      } else if (key === 'jobProfile') {
        uploadData.append(key, JSON.stringify(formData[key].filter(v => v.title)));
      } else if (key === 'locations') {
        uploadData.append(key, JSON.stringify(formData[key].filter(l => l.state || l.city || l.pincode)));
      } else if (key !== 'logoLink') {
        uploadData.append(key, formData[key] || "");
      }
    });

    uploadData.append("logoLink", logoSourceMode === "link" ? formData.logoLink : "");
    if (logoSourceMode === "upload" && logoFile) {
      uploadData.append("companyLogo", logoFile);
    }

    try {
      if (modalMode === "create") {
        await joinAsPartner(currentFair._id, uploadData);
        triggerSuccessNotification("Your job posting request has been sent to the admin. You will receive an email notification once it is approved.");
      } else {
        await updateEmployerJob(currentFair._id, currentJobId, uploadData);
        triggerSuccessNotification("Job posting updated successfully!");
      }

      closeJobModal();
      await fetchDashboardData();
    } catch (err) {
      console.error("Error submitting job:", err);
      setFormError(err.response?.data?.message || "Failed to submit job posting. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (fairId, jobId) => {
    if (window.confirm("Are you sure you want to withdraw this job posting?")) {
      try {
        await deleteEmployerJob(fairId, jobId);
        triggerSuccessNotification("Successfully removed your job posting.");
        await fetchDashboardData();
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Failed to remove job posting. Please try again.");
      }
    }
  };

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const isEmployerInFair = (fairId) => {
    return myFairs.some(f => f._id.toString() === fairId.toString());
  };

  const filteredFairs = allFairs.filter(event => {
    const nameMatch = event.fairName?.toLowerCase().includes(searchQuery.toLowerCase());
    const cityMatch = event.venue?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || cityMatch;
  });

  const menuItems = [
    { key: "Overview", label: "Overview", icon: <FiBriefcase size={16} /> },
    { key: "MyFairs", label: "Participating Fairs", icon: <FiCalendar size={16} /> },
    // { key: "Browse", label: "Browse Career Fairs", icon: <FiSearch size={16} /> }
  ];

  if (loading && allFairs.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-600 font-medium">Loading Employer Portal...</p>
      </div>
    );
  }

  return (
    <>
      <CreateEventHeader />
      <div className="h-screen flex flex-col overflow-hidden pt-[60.5px]">
        <div className="flex-1 w-full overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)] h-full overflow-hidden">

            <aside className="bg-[#E4EBFB] p-5 border border-[#D8E2F7] xl:sticky xl:top-6 flex flex-col overflow-hidden">
              <div className="mb-7">
                <p className="text-slate-900 text-xl font-semibold">Employer Panel</p>
                <p className="text-[11px] tracking-[0.16em] text-slate-500 mt-1 font-semibold">CONTROL PANEL</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-7 sm:grid-cols-3 xl:grid-cols-1 xl:space-y-2 xl:gap-0 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center justify-center xl:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${activeSection === item.key
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:bg-white/70"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    if (myFairs.length > 0) {
                      openPostJobModal(myFairs[0]);
                    } else {
                      triggerSuccessNotification("Please select a fair to join first.");
                    }
                  }}
                  className="w-full flex items-center justify-center xl:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition bg-primary text-white hover:bg-primary/95 shadow-sm mt-1"
                >
                  <FiPlus size={16} />
                  <span>Post Job Profile</span>
                </button>
              </div>

              <div className="mt-auto pt-4 border-t border-[#D0DCF5] space-y-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg border border-slate-300 hover:bg-white/80 flex items-center justify-center xl:justify-start gap-2"
                >
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>
            </aside>

            <main className="min-w-0 flex flex-col h-full overflow-hidden space-y-4 sm:space-y-5 ">

              {isImpersonating && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleReturnToSuperAdmin}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20 transition border border-primary/20"
                  >
                    <FiArrowLeft size={16} />
                    Return to Super Admin
                  </button>
                </div>
              )}

              {activeSection === "Overview" && (
                <div className="bg-white border border-[#DCE5FA] px-6 py-4 flex items-center justify-between shadow">
                  <div>
                    <h1 className="text-xl font-bold text-primary">
                      Campaign Overview
                    </h1>
                    <p className="text-[10px] tracking-[0.1em] text-slate-400 font-bold uppercase">
                      Recruiting Command Center
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-xl bg-[#F5F8FF] border border-[#DEE8FF] px-3 py-1.5">
                      <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {(user?.userName || user?.email || "E").charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {user?.userName || user?.email || "Employer"}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                          Hiring Partner
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-grow min-h-0 overflow-y-auto hide-scrollbar ">
                {successMsg && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full text-center animate-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                        <FiCheckCircle size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Request Submitted</h3>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {successMsg}
                      </p>
                      <button 
                        onClick={() => setSuccessMsg("")}
                        className="mt-6 w-full py-3 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition cursor-pointer"
                      >
                        Okay
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === "Overview" && (
                  <div className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-1">
                      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow flex items-center gap-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <FiCalendar size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fairs Joined</p>
                          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalFairs}</h3>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow flex items-center gap-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                        <div className="h-14 w-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                          <FiBriefcase size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Roles Posted</p>
                          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalJobRoles}</h3>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow flex items-center gap-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                        <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <FiUsers size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Vacancies</p>
                          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalVacancies}</h3>
                        </div>
                      </div>
                    </div>

                    {/* <div className="grid grid-cols-1 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recruiting campaigns</h2>
                            <button
                              onClick={() => setActiveSection("MyFairs")}
                              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                            >
                              View All <FiChevronRight size={14} />
                            </button>
                          </div>

                          {myFairs.length === 0 ? (
                            <div className="text-center py-10">
                              <FiBriefcase size={40} className="mx-auto text-slate-300 mb-3" />
                              <p className="text-slate-500 text-xs">No active campaigns.</p>
                              <button
                                onClick={() => setActiveSection("Browse")}
                                className="mt-4 inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                              >
                                Join Fairs
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {myFairs.slice(0, 3).map(event => (
                                <div key={event._id} className="p-4 border border-slate-100 hover:border-slate-200 rounded-xl transition">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-slate-900 text-xs">{event.fairName}</h4>
                                    <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                                      Participating
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-[9px] text-slate-400 uppercase font-bold">Location</p>
                                      <p className="text-xs font-semibold text-slate-700 mt-0.5 truncate">
                                        {typeof event.venue === 'string' ? event.venue : (event.venue?.city || 'Online')}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[9px] text-slate-400 uppercase font-bold">Job Postings</p>
                                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                                        {event.myPostings?.length || 0} Roles Configured
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                    </div> */}
                  </div>
                )}

                {activeSection === "MyFairs" && (
                  <div className="space-y-8">
                    {myFairs.length === 0 ? (
                      <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
                        <FiBriefcase size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-sm font-bold text-slate-900 mb-1">No participating fairs</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-xs">
                          Join career fairs as a hiring partner and submit your job profiles to start recruiting.
                        </p>
                        <button
                          onClick={() => setActiveSection("Browse")}
                          className="mt-5 inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-sm transition"
                        >
                          <FiSearch size={14} /> Browse All Fairs
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {myFairs.map(event => (
                          <div key={event._id} className="bg-white border border-slate-100   overflow-hidden">

                            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900">{event.fairName}</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-slate-500 text-[10px] font-semibold">
                                  <span className="flex items-center gap-1">
                                    <FiMapPin size={12} />
                                    {typeof event.venue === 'string' ? event.venue : (event.venue?.city || 'Online')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FiCalendar size={12} />
                                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <button
                                  onClick={() => openPostJobModal(event)}
                                  className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
                                >
                                  <FiPlus size={14} /> Post Another Job
                                </button>
                              </div>
                            </div>

                            <div className="p-6">
                              {event.myPostings && event.myPostings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {event.myPostings.map(job => (
                                    <div key={job._id} className="border border-slate-100 rounded-xl p-5 hover:shadow-sm transition flex flex-col justify-between">
                                      <div>
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                          <div className="flex items-center gap-3">
                                            {job.logo || job.logoLink ? (
                                              <img
                                                src={job.logo ? getMediaUrl(job.logo) : job.logoLink}
                                                alt={job.companyName}
                                                className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 p-1"
                                              />
                                            ) : (
                                              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                <FaBuilding size={18} />
                                              </div>
                                            )}
                                            <div>
                                              <h5 className="font-extrabold text-slate-900 text-xs leading-snug">{formatJobProfileDisplay(job.jobProfile)}</h5>
                                              <p className="text-[10px] font-semibold text-slate-500">{job.companyName}</p>
                                            </div>
                                          </div>
                                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                                            {job.candidatesRequired} Openings
                                          </span>
                                        </div>

                                        <div className="space-y-1.5 mb-4 text-xs">
                                          <div className="flex items-center gap-1 text-slate-500">
                                            <FiMapPin size={12} className="shrink-0" />
                                            <span className="line-clamp-1">Location: <strong className="text-slate-700 font-medium">
                                              {job.locations?.length > 0 
                                                ? job.locations.map(loc => [loc.city, loc.state].filter(Boolean).join(", ")).filter(Boolean).join(" | ") 
                                                : (job.location || "Not specified")}
                                            </strong></span>
                                          </div>
                                          {job.description && (
                                            <p className="text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                                              {job.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                        <button
                                          onClick={() => openPostJobModal(event, job)}
                                          className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition"
                                          title="Edit job profile"
                                        >
                                          <FiEdit size={16} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteJob(event._id, job._id)}
                                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                          title="Remove posting"
                                        >
                                          <FiTrash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6 text-slate-500 text-xs">
                                  No active job postings inside this event. Click "+ Post Another Job" to add one.
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* {activeSection === "Browse" ? (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Browse Career Fairs</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Explore active fairs and join as a hiring partner</p>
                      </div>

                      <div className="relative w-full sm:w-80">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search fairs by name or city..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none text-xs focus:border-primary"
                        />
                      </div>
                    </div>

                    {filteredFairs.length === 0 ? (
                      <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
                        <FiSearch size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-xs">No career fairs found matching your criteria.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFairs.map(event => {
                          const participating = isEmployerInFair(event._id);
                          const bannerUrl = event.fairBanner ? getMediaUrl(event.fairBanner) : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

                          const cleanDesc = event.description ? event.description.replace(/<[^>]+>/g, '') : "Join this career expo to connect with top-tier candidates, hold pre-screening drives, and offer letters on the spot.";

                          const locationStr = (() => {
                            if (typeof event.venue === 'string') {
                              return "Online";
                            }
                            if (event.venue) {
                              const city = event.venue.city?.trim();
                              const state = event.venue.state?.trim();
                              if (city && state && city.toLowerCase() !== 'online') return `${city}, ${state}`;
                              if (city && city.toLowerCase() !== 'online') return city;
                              if (state && state.toLowerCase() !== 'online') return state;
                            }
                            return "PAN India";
                          })();

                          const totalOpenings = (() => {
                            if (event.totalOpenings !== undefined && event.totalOpenings !== null) return event.totalOpenings;
                            if (event.openings !== undefined && event.openings !== null) return event.openings;
                            if (event.jobRoles !== undefined && event.jobRoles !== null) return event.jobRoles;
                            if (Array.isArray(event.hiringPartners) && event.hiringPartners.length > 0) {
                              const sum = event.hiringPartners.reduce((acc, hp) => acc + (Number(hp.candidatesRequired) || 0), 0);
                              return sum > 0 ? sum : event.hiringPartners.length;
                            }
                            return 0;
                          })();

                          const totalCompanies = (() => {
                            if (event.totalCompanies !== undefined && event.totalCompanies !== null) return event.totalCompanies;
                            if (event.companies !== undefined && event.companies !== null) return event.companies;
                            if (Array.isArray(event.hiringPartners)) return event.hiringPartners.length;
                            return 0;
                          })();

                          const displayDate = event.startDate ? new Date(event.startDate).toLocaleDateString('en-GB') : "TBD";

                          return (
                            <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full cursor-pointer relative">

                              <div className="h-48 overflow-hidden relative">
                                <img
                                  src={bannerUrl}
                                  alt={event.fairName}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                {participating && (
                                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1 z-20">
                                    <FiCheckCircle size={10} /> Participating
                                  </div>
                                )}
                              </div>

                              <div className="p-4 flex flex-col flex-grow text-left">
                                <div className="flex items-center text-xs gap-1.5 mb-2 text-gray-500 font-medium">
                                  <FiCalendar size={14} className="text-gray-400" />
                                  <span>{displayDate}</span>
                                </div>

                                <h3 className="text-[16px] font-bold text-primary mb-2 line-clamp-2 text-left">{event.fairName}</h3>

                                <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-semibold text-gray-600">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <span className="text-black font-bold">Location :</span>
                                    <span className="truncate">{locationStr}</span>
                                  </div>
                                  <div className="shrink-0 text-right text-black font-bold">
                                    Openings : <span className="font-semibold text-gray-600">{totalOpenings}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs font-bold text-black mb-3">
                                  <div>
                                    Hiring companies : <span className="font-semibold text-gray-600">{totalCompanies}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-100 w-full">
                                  <Link
                                    to={`/event/${event._id}`}
                                    className="text-xs font-bold text-slate-600 hover:text-primary transition"
                                  >
                                    View Details
                                  </Link>
                                  <button
                                    onClick={() => openPostJobModal(event)}
                                    className={`text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm ${participating
                                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        : "bg-primary hover:bg-primary/95 text-white"
                                      }`}
                                  >
                                    {participating ? "+ Post Another Job" : "+ Join as Hiring Partner"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : null} */}

{activeSection === "PostJob" && (
        <div className="bg-white border border-slate-100  shadow-sm overflow-hidden flex flex-col">
          <div className="w-full flex flex-col">

            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs">
                  {modalMode === "create" ? t(formData.language, "addCompanyJobProfile") : t(formData.language, "editJobProfile")}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">
                  Fair: {currentFair?.fairName}
                </p>
              </div>
              <button
                onClick={closeJobModal}
                className="p-1.5 hover:bg-slate-200/50 text-slate-400 hover:text-slate-700 rounded-lg transition"
              >
                <FiX size={18} />
              </button>
            </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">

              {formError && (
                <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="flex gap-4 mb-6 mt-2">
                {["Job", "Internship", "Apprenticeship"].map(type => (
                  <label key={type} className={`cursor-pointer flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold border-2 transition ${(formData.postingType || "Job") === type ? "border-primary bg-primary/5 text-primary" : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>
                    <input type="radio" className="hidden" checked={(formData.postingType || "Job") === type} onChange={() => setFormData({ ...formData, postingType: type })} />
                    {type}
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-600 uppercase mb-2">{t(formData.language, "jobLanguage")}</label>
                <select
                  value={formData.language || "English"}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

               <div>
                    <label className="block text-xs font-extrabold text-slate-600 uppercase mb-2">{t(formData.language, "companyLogo")}</label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setLogoSourceMode("upload");
                          setLogoPreview(logoFile ? URL.createObjectURL(logoFile) : "");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${logoSourceMode === "upload"
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        {t(formData.language, "uploadFile")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoSourceMode("link");
                          setLogoPreview(formData.logoLink || "");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${logoSourceMode === "link"
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        {t(formData.language, "imageLink")}
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <div className="relative w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              if (logoSourceMode === "upload") {
                                setLogoFile(null);
                              } else {
                                setFormData({ ...formData, logoLink: "" });
                              }
                              setLogoPreview("");
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600 transition"
                          >
                            <FiX size={10} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                          <FaBuilding size={24} />
                        </div>
                      )}

                      {logoSourceMode === "upload" ? (
                        <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 cursor-pointer hover:bg-slate-50 hover:border-primary/45 transition h-16">
                          <div className="flex flex-col items-center text-center">
                            <FiUpload size={14} className="text-slate-400 mb-1" />
                            <span className="text-[9px] font-bold text-primary">{t(formData.language, "uploadLogo")}</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="flex-grow">
                          <input
                            type="url"
                            name="logoLink"
                            value={formData.logoLink}
                            onChange={(e) => {
                              handleInputChange(e);
                              setLogoPreview(e.target.value);
                            }}
                            placeholder="Image URL..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>

              <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">{formData.postingType || "Job"} {t(formData.language, "jobDetailsTitle")}</h4>
                  
                  <div className="mb-4">
                      {formData.jobProfile.map((job, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-600 mb-1">{formData.postingType || "Job"} {t(formData.language, "jobTitleLabel")} </label>
                            <input
                              type="text"
                              placeholder={t(formData.language, "jobTitleLabel")}
                              value={job.title}
                              onChange={(e) => {
                                const newProfiles = [...formData.jobProfile];
                                newProfiles[index].title = e.target.value;
                                setFormData({ ...formData, jobProfile: newProfiles });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-600 mb-1">{formData.postingType || "Job"} {t(formData.language, "jobTypeLabel")}</label>
                            <select
                              value={job.type}
                              onChange={(e) => {
                                const newProfiles = [...formData.jobProfile];
                                newProfiles[index].type = e.target.value;
                                setFormData({ ...formData, jobProfile: newProfiles });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                            >
                                <option value="">{t(formData.language, "selectType")}</option>
                                <option value="Full Time">{t(formData.language, "fullTime")}</option>
                                <option value="Part Time">{t(formData.language, "partTime")}</option>
                                <option value="Internship">{t(formData.language, "internship")}</option>
                                <option value="Contract">{t(formData.language, "contract")}</option>
                            </select>
                          </div>
                          {index > 0 && (
                            <button type="button" onClick={() => {
                              const newProfiles = formData.jobProfile.filter((_, i) => i !== index);
                              setFormData({ ...formData, jobProfile: newProfiles });
                            }} className="text-red-500 hover:text-red-700 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg shrink-0">
                              <FiX size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData({ ...formData, jobProfile: [...formData.jobProfile, { title: "", type: "" }] })} className="text-xs text-primary font-bold hover:underline">{t(formData.language, "addJobTitle")}</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "qualification")}</label>
                        <input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "noOfPositions")}</label>
                        <input
                          type="number"
                          name="candidatesRequired"
                          value={formData.candidatesRequired}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "salaryRange")}</label>
                        <div className="flex gap-2">
                            <input
                              type="number"
                              name="minSalary"
                              value={formData.minSalary}
                              onChange={handleInputChange}
                              placeholder={t(formData.language, "minSal")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                            />
                            <input
                              type="number"
                              name="maxSalary"
                              value={formData.maxSalary}
                              onChange={handleInputChange}
                              placeholder={t(formData.language, "maxSal")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                            />
                            <select
                              name="salaryType"
                              value={formData.salaryType}
                              onChange={handleInputChange}
                              className="w-[100px] bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 outline-none text-xs focus:border-primary focus:bg-white shrink-0"
                            >
                                <option value="Per Month">{t(formData.language, "perMonth")}</option>
                                <option value="Per Year">{t(formData.language, "perYear")}</option>
                            </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          {formData.postingType === 'Internship' || formData.postingType === 'Apprenticeship' ? t(formData.language, "duration") : t(formData.language, "experienceRequired")}
                        </label>
                        <div className="flex gap-2">
                            <select
                              name="minExperience"
                              value={formData.minExperience}
                              onChange={handleInputChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                            >
                                <option value="">{formData.postingType === 'Internship' || formData.postingType === 'Apprenticeship' ? t(formData.language, "minDur") : t(formData.language, "minExp")}</option>
                                {[...Array(15)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                            </select>
                            <select
                              name="maxExperience"
                              value={formData.maxExperience}
                              onChange={handleInputChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                            >
                                <option value="">{formData.postingType === 'Internship' || formData.postingType === 'Apprenticeship' ? t(formData.language, "maxDur") : t(formData.language, "maxExp")}</option>
                                {[...Array(20)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                            </select>
                            <select
                              name="experienceType"
                              value={formData.experienceType}
                              onChange={handleInputChange}
                              className="w-[100px] bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 outline-none text-xs focus:border-primary focus:bg-white shrink-0"
                            >
                                <option value="Months">{t(formData.language, "months")}</option>
                                <option value="Years">{t(formData.language, "years")}</option>
                            </select>
                        </div>
                      </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-600 mb-1">{formData.postingType || "Job"} {t(formData.language, "jobDescription")}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={t(formData.language, "jobDescPlaceholder")}
                      rows="3"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white resize-none"
                    />
                  </div>

                  <div className="mb-4">
                    {formData.locations.map((loc, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-4 items-end">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">{formData.postingType || "Job"} {t(formData.language, "locationState")}</label>
                          <Select
                            options={INDIA_STATES}
                            value={INDIA_STATES.find(s => s.value === loc.state) || null}
                            onChange={(selected) => {
                              const newLocs = [...formData.locations];
                              newLocs[index].state = selected ? selected.value : "";
                              newLocs[index].city = ""; 
                              setFormData({ ...formData, locations: newLocs });
                            }}
                            placeholder={t(formData.language, "searchState")}
                            isClearable
                            isSearchable
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                backgroundColor: '#f8fafc',
                                borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                                boxShadow: 'none',
                                '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                                borderRadius: '0.5rem',
                                minHeight: '34px',
                                fontSize: '12px'
                              }),
                              menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">{formData.postingType || "Job"} {t(formData.language, "locationCity")}</label>
                          <Select
                            options={(() => {
                              if (!loc.state) return [];
                              const stateObj = INDIA_STATES.find(s => s.value === loc.state);
                              if (!stateObj) return [];
                              const cities = City.getCitiesOfState(INDIA_ISO_CODE, stateObj.isoCode);
                              const uniqueCities = [...new Set(cities.map(c => c.name))];
                              return uniqueCities.map(c => ({ value: c, label: c }));
                            })()}
                            value={loc.city ? { value: loc.city, label: loc.city } : null}
                            onChange={(selected) => {
                              const newLocs = [...formData.locations];
                              newLocs[index].city = selected ? selected.value : "";
                              setFormData({ ...formData, locations: newLocs });
                            }}
                            placeholder={loc.state ? t(formData.language, "searchCity") : t(formData.language, "selectStateFirst")}
                            isDisabled={!loc.state}
                            isClearable
                            isSearchable
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                backgroundColor: '#f8fafc',
                                borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                                boxShadow: 'none',
                                '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                                borderRadius: '0.5rem',
                                minHeight: '34px',
                                fontSize: '12px'
                              }),
                              menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "pincode")}</label>
                          <input
                            type="text"
                            placeholder={t(formData.language, "pincode")}
                            value={loc.pincode}
                            onChange={(e) => {
                              const newLocs = [...formData.locations];
                              newLocs[index].pincode = e.target.value;
                              setFormData({ ...formData, locations: newLocs });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                          />
                        </div>
                        {index > 0 ? (
                          <button type="button" onClick={() => {
                            const newLocs = formData.locations.filter((_, i) => i !== index);
                            setFormData({ ...formData, locations: newLocs });
                          }} className="text-red-500 hover:text-red-700 px-3 py-2 border border-red-200 rounded-lg bg-red-50 flex items-center justify-center h-[34px]">
                            <FiTrash2 size={16} />
                          </button>
                        ) : <div className="w-9 h-[34px]"></div>}
                      </div>
                    ))}
                    <button type="button" onClick={() => setFormData({ ...formData, locations: [...formData.locations, { state: "", city: "", pincode: "" }] })} className="text-xs text-primary font-bold hover:underline">{t(formData.language, "addLocation")}</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{formData.postingType || "Job"} {t(formData.language, "jobExpiryDate")}</label>
                        <input
                          type="date"
                          name="jobExpiryDate"
                          value={formData.jobExpiryDate}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "otherBenefit")}</label>
                        <select
                          name="otherBenefit"
                          value={formData.otherBenefit}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        >
                            <option value="">{t(formData.language, "noneSelected")}</option>
                            <option value="Health Insurance">{t(formData.language, "healthInsurance")}</option>
                            <option value="Transport">{t(formData.language, "transport")}</option>
                            <option value="Meals">{t(formData.language, "meals")}</option>
                        </select>
                      </div>
                      
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "positionOpenFor")}</label>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-700">
                            {['Male', 'Female', 'Transgender', 'Other'].map(gender => (
                                <label key={gender} className="flex items-center gap-1.5 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={formData.positionOpenFor.includes(gender)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                            setFormData({...formData, positionOpenFor: [...formData.positionOpenFor, gender]});
                                        } else {
                                            setFormData({...formData, positionOpenFor: formData.positionOpenFor.filter(g => g !== gender)});
                                        }
                                      }}
                                    />
                                    {t(formData.language, gender.toLowerCase()) || gender}
                                </label>
                            ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "hiringProcess")}</label>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-700">
                            {['FaceToFace', 'Writtentest', 'Telephonic', 'GroupDiscussion', 'Walk In'].map(method => (
                                <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={formData.hiringProcess.includes(method)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                            setFormData({...formData, hiringProcess: [...formData.hiringProcess, method]});
                                        } else {
                                            setFormData({...formData, hiringProcess: formData.hiringProcess.filter(m => m !== method)});
                                        }
                                      }}
                                    />
                                    {t(formData.language, method.replace(/\s/g, '').replace(/^[A-Z]/, c => c.toLowerCase())) || method}
                                </label>
                            ))}
                        </div>
                      </div>
                      
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "openForPhysicallyChallenged")}</label>
                        <select
                          name="openForPhysicallyChallenged"
                          value={formData.openForPhysicallyChallenged}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        >
                            <option value="">{t(formData.language, "select")}</option>
                            <option value="Yes">{t(formData.language, "yes")}</option>
                            <option value="No">{t(formData.language, "no")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "organisationName")}</label>
                        <input
                          type="text"
                          name="organisationName"
                          value={formData.organisationName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                  </div>
              </div>

                  <div className="border-t border-slate-200 pt-4 mt-6">
                  <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider ">{t(formData.language, "yourDetails")}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "companyName")}</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "companyType")}</label>
                        <select
                          name="companyType"
                          value={formData.companyType}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        >
                            <option value="">{t(formData.language, "select")}</option>
                            <option value="Private">{t(formData.language, "privateType")}</option>
                            <option value="Public">{t(formData.language, "publicType")}</option>
                            <option value="Government">{t(formData.language, "government")}</option>
                            <option value="NGO">{t(formData.language, "ngo")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "contactPersonName")}</label>
                        <input
                          type="text"
                          name="contactPersonName"
                          value={formData.contactPersonName}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "designation")}</label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "mobileNumber")}</label>
                        <input
                          type="text"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder={t(formData.language, "enterMobile")}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "email")}</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{formData.postingType || "Job"} {t(formData.language, "jobRole")}</label>
                        <input
                          type="text"
                          name="yourDetailsJobRole"
                          value={formData.yourDetailsJobRole}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "totalNumberOpenings")}</label>
                        <input
                          type="number"
                          name="yourDetailsTotalOpenings"
                          value={formData.yourDetailsTotalOpenings}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "state")}</label>
                        <Select
                          options={INDIA_STATES}
                          value={INDIA_STATES.find(s => s.value === formData.yourDetailsState) || null}
                          onChange={(selected) => {
                            setFormData({
                              ...formData,
                              yourDetailsState: selected ? selected.value : "",
                              yourDetailsCity: "" 
                            });
                          }}
                          placeholder={t(formData.language, "searchState")}
                          isClearable
                          isSearchable
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: '#f8fafc',
                              borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                              boxShadow: 'none',
                              '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                              borderRadius: '0.5rem',
                              minHeight: '34px',
                              fontSize: '12px'
                            }),
                            menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                          }}
                        />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">{t(formData.language, "cityText")}</label>
                        <Select
                          options={(() => {
                            if (!formData.yourDetailsState) return [];
                            const stateObj = INDIA_STATES.find(s => s.value === formData.yourDetailsState);
                            if (!stateObj) return [];
                            const cities = City.getCitiesOfState(INDIA_ISO_CODE, stateObj.isoCode);
                            const uniqueCities = [...new Set(cities.map(c => c.name))];
                            return uniqueCities.map(c => ({ value: c, label: c }));
                          })()}
                          value={formData.yourDetailsCity ? { value: formData.yourDetailsCity, label: formData.yourDetailsCity } : null}
                          onChange={(selected) => {
                            setFormData({
                              ...formData,
                              yourDetailsCity: selected ? selected.value : ""
                            });
                          }}
                          placeholder={formData.yourDetailsState ? t(formData.language, "searchCity") : t(formData.language, "selectStateFirst")}
                          isDisabled={!formData.yourDetailsState}
                          isClearable
                          isSearchable
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: '#f8fafc',
                              borderColor: state.isFocused ? '#110060' : '#e2e8f0',
                              boxShadow: 'none',
                              '&:hover': { borderColor: state.isFocused ? '#110060' : '#e2e8f0' },
                              borderRadius: '0.5rem',
                              minHeight: '34px',
                              fontSize: '12px'
                            }),
                            menu: base => ({ ...base, fontSize: '12px', zIndex: 50 })
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-600 mb-1">Salary Range(INR)</label>
                        <div className="flex gap-2">
                            <input
                              type="number"
                              name="yourDetailsMinSalary"
                              value={formData.yourDetailsMinSalary}
                              onChange={handleInputChange}
                              placeholder={t(formData.language, "minSal")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                            />
                            <input
                              type="number"
                              name="yourDetailsMaxSalary"
                              value={formData.yourDetailsMaxSalary}
                              onChange={handleInputChange}
                              placeholder={t(formData.language, "maxSal")}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none text-xs focus:border-primary focus:bg-white"
                            />
                        </div>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                  <div className="mb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700  ">
                      <input 
                        type="checkbox" 
                        name="showDetailsInUI"
                        checked={formData.showDetailsInUI}
                        onChange={(e) => setFormData({...formData, showDetailsInUI: e.target.checked})}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      Want to show Job and Company details to Candidates?
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1 ml-8">If unticked, candidates won't be able to open the details modal for this job posting.</p>
                  </div>
                 
              </div>

              <div className="flex items-center justify-start gap-3 pt-4 border-t border-slate-200 mt-auto sticky bottom-0 bg-white pb-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-extrabold shadow hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <FiCheckCircle size={14} />
                  )}
                  {t(formData.language, "saveJobProfile")}
                </button>
                <button
                  type="button"
                  onClick={closeJobModal}
                  className="px-6 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold transition ml-auto"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

              </div>
            </main>

          </div>
        </div>
      </div>

    </>
  );
};

export default EmployerDashboard;
