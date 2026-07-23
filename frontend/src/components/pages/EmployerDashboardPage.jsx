import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit2, 
  LogOut, 
  CheckCircle, 
  ExternalLink, 
  Calendar, 
  Search, 
  FileText, 
  Upload, 
  AlertCircle,
  X
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { 
  getAllEvents, 
  getEmployerDashboard, 
  joinAsPartner, 
  updateEmployerJob, 
  deleteEmployerJob 
} from "../services/eventService";
import { getMediaUrl } from "../services/api";
import CreateEventHeader from "../create-event/CreateEventHeader";

const EmployerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("my-fairs"); 
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalFairs: 0, totalJobRoles: 0, totalVacancies: 0 });
  const [myFairs, setMyFairs] = useState([]);
  const [allFairs, setAllFairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState("CREATE"); 
  const [selectedFairId, setSelectedFairId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [submitting, setSubmitting] = useState(false);


  const [companyName, setCompanyName] = useState("");
  const [jobProfile, setJobProfile] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [candidatesRequired, setCandidatesRequired] = useState("");
  const [description, setDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, allFairsData] = await Promise.all([
        getEmployerDashboard(),
        getAllEvents()
      ]);

      if (dashRes.success) {
        setStats(dashRes.stats);
        setMyFairs(dashRes.participatingFairs);
      }
      setAllFairs(allFairsData || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenJoinModal = (fairId) => {
    setSelectedFairId(fairId);
    setModalMode("CREATE");
    setCompanyName(user?.organisationName !== "Individual" ? user?.organisationName : "");
    setJobProfile("");
    setJobLocation("");
    setCandidatesRequired("");
    setDescription("");
    setCompanyLogo(null);
    setLogoPreview("");
    setFormError("");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (fairId, job) => {
    setSelectedFairId(fairId);
    setSelectedJobId(job._id);
    setModalMode("EDIT");
    setCompanyName(job.companyName || "");
    setJobProfile(job.jobProfile || "");
    setJobLocation(job.location || "");
    setCandidatesRequired(String(job.candidatesRequired || ""));
    setDescription(job.description || "");
    setCompanyLogo(null);
    setLogoPreview(job.logo ? getMediaUrl(job.logo) : "");
    setFormError("");
    setShowFormModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!companyName.trim() || !jobProfile.trim() || !jobLocation.trim() || !candidatesRequired) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("companyName", companyName.trim());
    formData.append("jobProfile", jobProfile.trim());
    formData.append("location", jobLocation.trim());
    formData.append("candidatesRequired", candidatesRequired);
    formData.append("description", description.trim());
    if (companyLogo) {
      formData.append("companyLogo", companyLogo);
    }

    try {
      if (modalMode === "CREATE") {
        await joinAsPartner(selectedFairId, formData);
      } else {
        await updateEmployerJob(selectedFairId, selectedJobId, formData);
      }
      setShowFormModal(false);
      fetchDashboardData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit posting.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (fairId, jobId) => {
    if (!window.confirm("Are you sure you want to withdraw this job posting?")) return;

    try {
      await deleteEmployerJob(fairId, jobId);
      fetchDashboardData();
    } catch (err) {
      alert("Failed to remove job posting.");
    }
  };

  const isEmployerParticipating = (fairId) => {
    return myFairs.some(f => String(f._id) === String(fairId));
  };

  const filteredFairs = allFairs.filter(f => 
    f.fairName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.venue?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-secondary font-medium mt-4">Loading Employer Portal...</p>
      </div>
    );
  }

  return (
    <>
      <CreateEventHeader />
      <div className="min-h-screen bg-[#F8FAFC] pt-[80px] pb-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white  border border-gray-100 shadow-sm">
            <div>
              <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full">
                Employer Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mt-2">
                Welcome, {user?.name || "Partner"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your job postings and company details across all career events.
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition font-semibold text-sm cursor-pointer"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
              <div className="p-4 bg-primary/10 rounded-xl text-primary">
                <Building2 size={24} />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Fairs Joined</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalFairs}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
              <div className="p-4 bg-[#D3F7E1] rounded-xl text-secondary">
                <Briefcase size={24} />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Job Roles Posted</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalJobRoles}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
              <div className="p-4 bg-amber-50 rounded-xl text-amber-600">
                <Plus size={24} />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Total Openings</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalVacancies}</h3>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-200 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm max-w-md">
            <button 
              onClick={() => setActiveTab("my-fairs")}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                activeTab === "my-fairs" 
                  ? "bg-primary text-white" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              My Participating Fairs ({myFairs.length})
            </button>
            <button 
              onClick={() => setActiveTab("browse")}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                activeTab === "browse" 
                  ? "bg-primary text-white" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Browse All Fairs ({allFairs.length})
            </button>
          </div>

          {activeTab === "my-fairs" ? (
            <div className="space-y-6">
              {myFairs.length === 0 ? (
                <div className="bg-white text-center py-16 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                  <Briefcase size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">No Participations Yet</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    You haven't posted any jobs for upcoming career fairs yet. Switch to the browse tab to join.
                  </p>
                  <button 
                    onClick={() => setActiveTab("browse")}
                    className="mt-6 px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-95 transition cursor-pointer"
                  >
                    Browse Active Fairs
                  </button>
                </div>
              ) : (
                myFairs.map(event => (
                  <div key={event._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{event.fairName}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(event.startDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} /> {event.venue?.city || "Venue Not Decided"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenJoinModal(event._id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-95 transition cursor-pointer"
                        >
                          <Plus size={14} /> Add Job Role
                        </button>
                        <button 
                          onClick={() => navigate(`/fair/${event._id}`)}
                          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                        >
                          <ExternalLink size={14} /> View Page
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {event.myPostings.map(job => (
                        <div key={job._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition">
                          <div className="flex items-center gap-4">
                            {job.logo ? (
                              <img 
                                src={getMediaUrl(job.logo)} 
                                alt={job.companyName} 
                                className="w-12 h-12 rounded-xl object-contain border border-gray-100 bg-white p-1"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {job.companyName?.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-gray-900">{job.jobProfile}</h4>
                              <p className="text-xs text-gray-500 font-semibold">{job.companyName} • {job.location}</p>
                              {job.description && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xl">{job.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right">
                              <span className="text-xs text-gray-500 font-medium">Openings</span>
                              <p className="text-sm font-extrabold text-primary">{job.candidatesRequired} Vacancies</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleOpenEditModal(event._id, job)}
                                className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition cursor-pointer"
                                title="Edit Job Posting"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button 
                                onClick={() => handleDeleteJob(event._id, job._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Withdraw Job Posting"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative max-w-md">
                <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by fair name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFairs.map(event => {
                  const isPart = isEmployerParticipating(event._id);
                  return (
                    <div key={event._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-extrabold text-gray-900 text-lg leading-tight line-clamp-2">
                            {event.fairName}
                          </h3>
                          {isPart && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-secondary bg-[#D3F7E1] px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                              <CheckCircle size={10} /> Joined
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-3">
                          <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(event.startDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><MapPin size={13} /> {event.venue?.city || "Venue Not Decided"}</span>
                        </div>
                        
                        {event.description && (
                          <div 
                            className="text-xs text-gray-400 mt-4 line-clamp-3 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                          />
                        )}
                      </div>

                      <div className="flex gap-3 mt-6 border-t border-gray-50 pt-4">
                        <button 
                          onClick={() => handleOpenJoinModal(event._id)}
                          className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl text-xs hover:opacity-95 transition cursor-pointer"
                        >
                          {isPart ? "Post Another Job" : "Join as Hiring Partner"}
                        </button>
                        <button 
                          onClick={() => navigate(`/fair/${event._id}`)}
                          className="px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-50 transition cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === "CREATE" ? "Join Fair as Partner" : "Edit Job Posting"}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} /> {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company Name *</label>
                  <input 
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Job Profile / Role *</label>
                  <input 
                    type="text"
                    required
                    value={jobProfile}
                    onChange={(e) => setJobProfile(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    placeholder="e.g. Node.js Developer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Job Location *</label>
                  <input 
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    placeholder="e.g. Bangalore / Remote"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Candidates Required (Openings) *</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    value={candidatesRequired}
                    onChange={(e) => setCandidatesRequired(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Job Description & Requirements</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
                  placeholder="Provide role requirements, package, qualifications, etc."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Company Logo</label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative shrink-0">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="w-16 h-16 rounded-xl object-contain border border-gray-200 bg-white p-1"
                      />
                      <button 
                        type="button"
                        onClick={() => { setCompanyLogo(null); setLogoPreview(""); }}
                        className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 rounded-xl bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition cursor-pointer">
                      <Upload size={18} />
                      <span className="text-[10px] mt-1">Upload</span>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-xs text-gray-500">
                    <p className="font-semibold text-gray-700">Upload Company Logo</p>
                    <p>PNG, JPG, or WEBP up to 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Submitting..." : (modalMode === "CREATE" ? "Join Fair" : "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployerDashboardPage;
