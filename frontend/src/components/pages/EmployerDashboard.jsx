import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import CreateEventHeader from "../create-event/CreateEventHeader";
import {
  getEmployerDashboard,
  getAllEvents,
  joinAsPartner,
  updateEmployerJob,
  deleteEmployerJob
} from "../services/eventService";
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
import { FaBuilding } from "react-icons/fa";

const EmployerDashboard = () => {
  const navigate = useNavigate();
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
    companyName: "",
    jobProfile: "",
    location: "",
    candidatesRequired: "",
    description: "",
    logoLink: ""
  });
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
        companyName: job.companyName || "",
        jobProfile: job.jobProfile || "",
        location: job.location || "",
        candidatesRequired: job.candidatesRequired || "",
        description: job.description || "",
        logoLink: job.logoLink || ""
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
        companyName: "",
        jobProfile: "",
        location: "",
        candidatesRequired: "",
        description: "",
        logoLink: ""
      });
      setLogoSourceMode("upload");
      setLogoPreview("");
      setLogoFile(null);
    }

    setIsModalOpen(true);
  };

  const closeJobModal = () => {
    setIsModalOpen(false);
    setCurrentFair(null);
    setCurrentJobId("");
    setFormData({
      companyName: "",
      jobProfile: "",
      location: "",
      candidatesRequired: "",
      description: "",
      logoLink: ""
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
    if (!companyName || !jobProfile || !location || !candidatesRequired) {
      setFormError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("companyName", companyName);
    uploadData.append("jobProfile", jobProfile);
    uploadData.append("location", location);
    uploadData.append("candidatesRequired", candidatesRequired);
    uploadData.append("description", formData.description || "");
    uploadData.append("logoLink", logoSourceMode === "link" ? formData.logoLink : "");
    if (logoSourceMode === "upload" && logoFile) {
      uploadData.append("companyLogo", logoFile);
    }

    try {
      if (modalMode === "create") {
        await joinAsPartner(currentFair._id, uploadData);
        triggerSuccessNotification(`Successfully added your job posting for "${currentFair.fairName}"!`);
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
    { key: "Browse", label: "Browse Career Fairs", icon: <FiSearch size={16} /> }
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
      <div className="h-screen flex flex-col overflow-hidden bg-[#EEF3FF] pt-[60.5px]">
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
                      setActiveSection("Browse");
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

            <main className="min-w-0 flex flex-col h-full overflow-hidden space-y-4 sm:space-y-5 px-6">

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

              <div className="bg-white border border-[#DCE5FA] px-6 py-4 flex items-center justify-between shadow-sm mt-4 rounded-xl">
                <div>
                  <h1 className="text-xl font-bold text-primary">
                    {activeSection === "Overview" && "Campaign Overview"}
                    {activeSection === "MyFairs" && "Participating Fairs"}
                    {activeSection === "Browse" && "Explore "}
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


              <div className="flex-grow min-h-0 overflow-y-auto hide-scrollbar pb-10">
                {successMsg && (
                  <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl shadow-sm text-emerald-800 font-medium text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-300">
                    <FiCheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}


                {activeSection === "Overview" && (
                  <div className="space-y-6">

                    {/* <div className="bg-gradient-to-r from-primary to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden md:block bg-[radial-gradient(circle_at_bottom_right,white,transparent_70%)] pointer-events-none" />
                      <div className="relative z-10">
                        <span className="bg-white/20 text-white font-semibold text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider">
                          Employer Dashboard
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold mt-4 mb-2 tracking-tight">
                          Manage Your Campaigns
                        </h1>
                        <p className="text-white/80 max-w-xl text-xs sm:text-sm leading-relaxed">
                          Setup career campaigns, list candidate profiles, and request openings at active expos.
                        </p>
                      </div>
                    </div> */}


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <FiCalendar size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fairs Joined</p>
                          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalFairs}</h3>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                        <div className="h-14 w-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                          <FiBriefcase size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Roles Posted</p>
                          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalJobRoles}</h3>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                        <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <FiUsers size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Vacancies</p>
                          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalVacancies}</h3>
                        </div>
                      </div>
                    </div>


                    <div className="grid grid-cols-1 gap-6">
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

                      {/* <div className="space-y-6">
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
                          <div className="space-y-3">
                            <button 
                              onClick={() => setActiveSection("Browse")}
                              className="w-full flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-xl text-left transition text-slate-700 font-bold text-xs"
                            >
                              <span>Find Expos</span>
                              <FiArrowRight size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                if (myFairs.length > 0) {
                                  openPostJobModal(myFairs[0]);
                                } else {
                                  setActiveSection("Browse");
                                  triggerSuccessNotification("Please select a fair to join first.");
                                }
                              }}
                              className="w-full flex items-center justify-between p-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-xl text-left transition text-slate-700 font-bold text-xs"
                            >
                              <span>Post Job Profile</span>
                              <FiPlus size={14} />
                            </button>
                          </div>
                        </div>
                      </div> */}
                    </div>
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
                          <div key={event._id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

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
                                              <h5 className="font-extrabold text-slate-900 text-xs leading-snug">{job.jobProfile}</h5>
                                              <p className="text-[10px] font-semibold text-slate-500">{job.companyName}</p>
                                            </div>
                                          </div>
                                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                                            {job.candidatesRequired} Openings
                                          </span>
                                        </div>

                                        <div className="space-y-1.5 mb-4 text-xs">
                                          <div className="flex items-center gap-1 text-slate-500">
                                            <FiMapPin size={12} />
                                            <span>Location: <strong className="text-slate-700 font-medium">{job.location}</strong></span>
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


                {activeSection === "Browse" ? (
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

                                {/* {cleanDesc && (
                                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4 text-left">
                                    {cleanDesc}
                                  </p>
                                )} */}

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
                ) : null}

              </div>
            </main>

          </div>
        </div>
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs">
                  {modalMode === "create" ? "Add Company Job Profile" : "Edit Job Profile"}
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


            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">

              {formError && (
                <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-slate-600 uppercase mb-2">Company Logo</label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLogoSourceMode("upload");
                      setLogoPreview(logoFile ? URL.createObjectURL(logoFile) : "");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${logoSourceMode === "upload"
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoSourceMode("link");
                      setLogoPreview(formData.logoLink || "");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${logoSourceMode === "link"
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    Image Link
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
                    <label className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 cursor-pointer hover:bg-slate-50 hover:border-primary/45 transition">
                      <div className="flex flex-col items-center text-center">
                        <FiUpload size={16} className="text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold text-primary">Upload logo</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
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
                        placeholder="Paste logo image URL link (e.g. https://example.com/logo.png)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 outline-none text-xs focus:border-primary focus:bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-600 uppercase mb-1.5">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 outline-none text-xs focus:border-primary focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase mb-1.5">Job Title *</label>
                  <input
                    type="text"
                    name="jobProfile"
                    value={formData.jobProfile}
                    onChange={handleInputChange}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 outline-none text-xs focus:border-primary focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase mb-1.5">Openings *</label>
                  <input
                    type="number"
                    name="candidatesRequired"
                    value={formData.candidatesRequired}
                    onChange={handleInputChange}
                    placeholder="e.g. 5"
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 outline-none text-xs focus:border-primary focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-600 uppercase mb-1.5">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Remote / Chicago / Bengaluru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 outline-none text-xs focus:border-primary focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-600 uppercase mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Summary of responsibilities, requirements, and salary package..."
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 outline-none text-xs focus:border-primary focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeJobModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : (modalMode === "create" ? "Submit Job Profile" : "Save Changes")}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployerDashboard;
