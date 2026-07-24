import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PieChart, 
  Users, 
  LayoutGrid, 
  LogOut, 
  Trash2,
  CalendarDays,
  ExternalLink,
  KeyRound,
  Eye,
  EyeOff,
  Search,
  Settings,
  Briefcase,
  ClipboardList
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { forgotPassword } from "../services/authApi";
import { getMediaUrl } from "../services/api";
import { getDashboardStats, getAllUsers, deleteUser, getAllEvents, deleteEvent, impersonateUser, changeUserPassword, updateSuperAdminProfile, approveAdmin, getAllBookings } from "../services/superAdminService";
import EventsSection from "../admin-dashboard/EventsSection";
import AdminJobsSection from "../admin-dashboard/AdminJobsSection";
import CreateEventHeader from "../create-event/CreateEventHeader";
import CandidateDetailsModal from "../admin-dashboard/CandidateDetailsModal";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [activeSection, setActiveSection] = useState("Overview");
  const [stats, setStats] = useState({ users: 0, fairs: 0, bookings: 0 });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [candidatesPage, setCandidatesPage] = useState(1);
  const candidatesPerPage = 10;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [passwordChangeUserId, setPasswordChangeUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notifyAdmin, setNotifyAdmin] = useState(false);
  
  const [visiblePasswords, setVisiblePasswords] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedSuperEvents, setSelectedSuperEvents] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [profileEmail, setProfileEmail] = useState("");
  const [profileCurrentPassword, setProfileCurrentPassword] = useState("");
  const [profileNewPassword, setProfileNewPassword] = useState("");
  const [profileConfirmPassword, setProfileConfirmPassword] = useState("");
  const [profileShowPassword, setProfileShowPassword] = useState(false);

  const [searchQueryAllEvents, setSearchQueryAllEvents] = useState("");
  const [filterYearAllEvents, setFilterYearAllEvents] = useState("");
  const [filterMonthAllEvents, setFilterMonthAllEvents] = useState("");
  const [filterCategoryAllEvents, setFilterCategoryAllEvents] = useState("");
  const [allCategoriesAllEvents, setAllCategoriesAllEvents] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      const defaultNames = ["Career Drive", "College Festivals", "Competitions", "Conferences", "Cultural Fairs", "Hackathon", "Mentorships", "Olympiad", "Quizzes", "Webinars", "Workshop"];
      const eventCats = events.map(e => e.category).filter(Boolean);
      try {
        const fetched = await getCategories();
        const fetchedNames = fetched.map(c => c.name);
        setAllCategoriesAllEvents([...new Set([...defaultNames, ...fetchedNames, ...eventCats])].sort());
      } catch (err) {
        setAllCategoriesAllEvents([...new Set([...defaultNames, ...eventCats])].sort());
      }
    };
    fetchCats();
  }, [events]);

  const uniqueYearsAllEvents = React.useMemo(() => {
    return [...new Set(events.map(e => {
      const dateStr = e.endDate || e.startDate;
      return dateStr ? new Date(dateStr).getFullYear().toString() : null;
    }).filter(Boolean))].sort((a, b) => b - a);
  }, [events]);

  const filteredAllEvents = React.useMemo(() => {
    return events.filter(event => {
      const dateStr = event.endDate || event.startDate;
      let eventYear = null;
      let eventMonth = null;
      
      if (dateStr) {
        const eventDate = new Date(dateStr);
        eventYear = eventDate.getFullYear().toString();
        eventMonth = (eventDate.getMonth() + 1).toString();
      }
      
      if (searchQueryAllEvents && !event.fairName?.toLowerCase().includes(searchQueryAllEvents.toLowerCase())) return false;
      if (filterYearAllEvents && eventYear !== filterYearAllEvents) return false;
      if (filterMonthAllEvents && eventMonth !== filterMonthAllEvents) return false;
      if (filterCategoryAllEvents && event.category !== filterCategoryAllEvents) return false;

      return true;
    });
  }, [events, searchQueryAllEvents, filterYearAllEvents, filterMonthAllEvents, filterCategoryAllEvents]);

  useEffect(() => {
    if (!user || user.role !== "SUPER_ADMIN") {
      navigate("/");
      return;
    }

    if (user.email && !profileEmail) {
      setProfileEmail(user.email);
    }

    fetchData();
  }, [user, navigate, activeSection]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (activeSection === "Overview") {
        const [statsData, usersData] = await Promise.all([
          getDashboardStats(),
          getAllUsers()
        ]);
        setStats(statsData);
        setUsers(usersData);
      } else if (["Users", "Admins", "Employers"].includes(activeSection)) {
        const data = await getAllUsers();
        setUsers(data);
      } else if (activeSection === "AllEvents" || activeSection === "EmployerJobs") {
        const data = await getAllEvents();
        setEvents(data);
      } else if (activeSection === "MyEvents") {
        const data = await getAllEvents();
        setEvents(data.filter(e => !e.organizer || e.organizer === user?._id || e.organizer?._id === user?._id || !e.organizer));
      } else if (activeSection === "Candidates") {
        const data = await getAllBookings();
        setCandidates(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user and all their fairs/bookings?")) return;
    setBusy(true);
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setBusy(false);
    }
  };

  const handleApproveAdminClick = async (id) => {
    if (!window.confirm("Are you sure you want to approve this organizer?")) return;
    setBusy(true);
    try {
      await approveAdmin(id);
      setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
      alert("Organizer approved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve organizer");
    } finally {
      setBusy(false);
    }
  };

  const handleRejectAdminClick = async (id) => {
    if (!window.confirm("Are you sure you want to reject this organizer? This will delete their pending account.")) return;
    setBusy(true);
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      alert("Organizer rejected successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject organizer");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fair?")) return;
    setBusy(true);
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete fair");
    } finally {
      setBusy(false);
    }
  };

  const handleImpersonate = async (id, role) => {
    setBusy(true);
    try {
      const data = await impersonateUser(id);
      
      localStorage.setItem("super_admin_user", localStorage.getItem("user"));
      localStorage.setItem("super_admin_token", localStorage.getItem("token"));
      
      const impersonatedUser = {
        ...data,
        role: role
      };
      
      localStorage.setItem("user", JSON.stringify(impersonatedUser));
      localStorage.setItem("token", data.token);
      
      if (role === "EMPLOYER") {
        window.location.href = "/employer-dashboard";
      } else {
        window.location.href = `/admin-dashboard/${data._id || ""}`;
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to impersonate user");
      setBusy(false);
    }
  };

  const handlePasswordChange = async (id) => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    
    setBusy(true);
    try {
      await changeUserPassword(id, newPassword, notifyAdmin);
      alert("Password updated successfully!");
      
      setUsers(users.map(u => {
        if (u._id === id) {
          return { ...u, decryptedPassword: newPassword };
        }
        return u;
      }));
      
      setPasswordChangeUserId(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setBusy(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    if (visiblePasswords.includes(id)) {
      setVisiblePasswords(visiblePasswords.filter(vId => vId !== id));
    } else {
      setVisiblePasswords([...visiblePasswords, id]);
    }
  };

  const handleSelectAllUsers = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectOneUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uId => uId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleDeleteBulkUsers = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users and all their data?`)) return;
    setBusy(true);
    try {
      await Promise.all(selectedUsers.map(id => deleteUser(id)));
      setUsers(users.filter(u => !selectedUsers.includes(u._id)));
      setSelectedUsers([]);
    } catch (err) {
      alert("Failed to delete some users.");
    } finally {
      setBusy(false);
    }
  };

  const handleSelectAllEvents = (e) => {
    if (e.target.checked) {
      setSelectedSuperEvents(events.map(ev => ev._id));
    } else {
      setSelectedSuperEvents([]);
    }
  };

  const handleSelectOneEvent = (id) => {
    if (selectedSuperEvents.includes(id)) {
      setSelectedSuperEvents(selectedSuperEvents.filter(eId => eId !== id));
    } else {
      setSelectedSuperEvents([...selectedSuperEvents, id]);
    }
  };

  const handleDeleteBulkEvents = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedSuperEvents.length} fairs?`)) return;
    setBusy(true);
    try {
      await Promise.all(selectedSuperEvents.map(id => deleteEvent(id)));
      setEvents(events.filter(e => !selectedSuperEvents.includes(e._id)));
      setSelectedSuperEvents([]);
    } catch (err) {
      alert("Failed to delete some events.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileCurrentPassword) {
      alert("Current password is required.");
      return;
    }
    if (profileNewPassword && profileNewPassword !== profileConfirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    setBusy(true);
    try {
      const data = await updateSuperAdminProfile({
        email: profileEmail,
        currentPassword: profileCurrentPassword,
        newPassword: profileNewPassword
      });
      alert("Profile updated successfully!");
      setProfileCurrentPassword("");
      setProfileNewPassword("");
      setProfileConfirmPassword("");
      
      if (data.user) {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({ ...currentUser, ...data.user }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setBusy(false);
    }
  };

  const menuItems = [
    { key: "Overview", label: "Overview", icon: <PieChart size={16} /> },
    { key: "Admins", label: "Admins", icon: <Users size={16} /> },
    { key: "Employers", label: "Employers", icon: <Users size={16} /> },
    { key: "Users", label: "Users", icon: <Users size={16} /> },
    { key: "MyEvents", label: "Fairs", icon: <LayoutGrid size={16} /> },
    { key: "AllEvents", label: "All Fairs", icon: <CalendarDays size={16} /> },
    { key: "EmployerJobs", label: "Employer Jobs", icon: <Briefcase size={16} /> },
    { key: "Candidates", label: "Candidates", icon: <ClipboardList size={16} /> },
    { key: "Profile", label: "Manage Profile", icon: <Settings size={16} /> }
  ];

  const renderUserTableSection = (title, userList) => (
    <div className="bg-white border border-[#E2EAFC] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[#E2EAFC] flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-primary">{title}</h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">{userList.length}</span>
        </div>
        {selectedUsers.length > 0 && (
          <button 
            onClick={handleDeleteBulkUsers}
            disabled={busy}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 size={14} /> Delete Selected ({selectedUsers.length})
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-[#E2EAFC] text-slate-500">
            <tr>
              <th className="px-4 py-3 w-[40px]">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={userList.length > 0 && userList.every(u => selectedUsers.includes(u._id))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const ids = userList.map(u => u._id);
                      setSelectedUsers([...new Set([...selectedUsers, ...ids])]);
                    } else {
                      const ids = userList.map(u => u._id);
                      setSelectedUsers(selectedUsers.filter(id => !ids.includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Organization</th>
              <th className="px-4 py-3 font-semibold">Password</th>
              <th className="px-4 py-3 font-semibold">Verified</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2EAFC]">
            {userList.map(u => (
              <React.Fragment key={u._id}>
                <tr className={`hover:bg-slate-50 transition-colors ${selectedUsers.includes(u._id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedUsers.includes(u._id)}
                      onChange={() => handleSelectOneUser(u._id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{u.name || u.userName || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600">{u.organisationName || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono flex items-center gap-2">
                    {u.decryptedPassword ? (
                      <>
                        <span>{visiblePasswords.includes(u._id) ? u.decryptedPassword : '••••••••'}</span>
                        <button 
                          onClick={() => togglePasswordVisibility(u._id)}
                          className="text-slate-400 hover:text-slate-600 ml-1"
                        >
                          {visiblePasswords.includes(u._id) ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Reset Required</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.isVerified 
                      ? <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium border border-emerald-200">Verified</span> 
                      : <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-medium border border-amber-200">Pending</span>}
                    
                    {/* {(u.role === "ORGANIZER" || u.role === "ADMIN") && !u.isApproved && (
                      <span className="block mt-1 text-secondary text-[10px] font-bold uppercase tracking-wider">Unapproved</span>
                    )}
                    {(u.role === "ORGANIZER" || u.role === "ADMIN") && u.isApproved && (
                      <span className="block mt-1 text-primary text-[10px] font-bold uppercase tracking-wider">Approved</span>
                    )} */}
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-3 items-center">
                    <button 
                      disabled={busy}
                      onClick={() => handleImpersonate(u._id, u.role)}
                      className="text-primary hover:text-primary/80 bg-primary/10 p-1.5 rounded-md disabled:opacity-50 transition"
                      title="Access Dashboard"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button 
                      disabled={busy}
                      onClick={() => {
                        setPasswordChangeUserId(passwordChangeUserId === u._id ? null : u._id);
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="text-amber-500 hover:text-amber-700 bg-amber-50 p-1.5 rounded-md disabled:opacity-50 transition"
                      title="Change Password"
                    >
                      <KeyRound size={16} />
                    </button>
                    <button 
                      disabled={busy}
                      onClick={() => handleDeleteUser(u._id)}
                      className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md disabled:opacity-50 transition"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                     {(u.role === "ORGANIZER" || u.role === "ADMIN") && !u.isApproved && (
                      <>
                        <button 
                          disabled={busy}
                          onClick={() => handleApproveAdminClick(u._id)}
                          className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-1.5 rounded-md disabled:opacity-50 transition border border-emerald-200"
                          title="Approve Organizer/Admin"
                        >
                          Approve
                        </button>
                        <button 
                          disabled={busy}
                          onClick={() => handleRejectAdminClick(u._id)}
                          className="text-rose-600 hover:text-rose-800 bg-rose-50 p-1.5 rounded-md disabled:opacity-50 transition border border-rose-200"
                          title="Reject Organizer/Admin"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  </td>
                </tr>
                {passwordChangeUserId === u._id && (
                  <tr className="bg-[#F8FAFC]">
                    <td colSpan="7" className="px-4 py-4">
                      <div className="bg-white border border-[#E2EAFC] rounded-lg p-4 max-w-2xl shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="New password" 
                              className="w-full pl-3 pr-10 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-blue-500"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Confirm password" 
                              className="w-full pl-3 pr-10 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-blue-500"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-4">
                          Password must be at least 8 characters and include letters, numbers, and special characters.
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          <input 
                            type="checkbox" 
                            id="notify-admin" 
                            checked={notifyAdmin}
                            onChange={(e) => setNotifyAdmin(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="notify-admin" className="text-sm text-slate-700 cursor-pointer">
                            Notify admin by email about password change
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            disabled={busy}
                            onClick={() => handlePasswordChange(u._id)}
                            className="bg-[#0A1629] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152745] transition disabled:opacity-50"
                          >
                            Save Password
                          </button>
                          <button 
                            onClick={() => {
                              setPasswordChangeUserId(null);
                              setNewPassword("");
                              setConfirmPassword("");
                            }}
                            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {userList.length === 0 && (
              <tr><td colSpan="7" className="text-center py-8 text-slate-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSimpleUserTableSection = (title, userList) => (
    <div className="bg-white border border-[#E2EAFC] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[#E2EAFC] flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-primary">{title}</h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">{userList.length}</span>
        </div>
        {selectedUsers.length > 0 && (
          <button 
            onClick={handleDeleteBulkUsers}
            disabled={busy}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 size={14} /> Delete Selected ({selectedUsers.length})
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-[#E2EAFC] text-slate-500">
            <tr>
              <th className="px-4 py-3 w-[40px]">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={userList.length > 0 && userList.every(u => selectedUsers.includes(u._id))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const ids = userList.map(u => u._id);
                      setSelectedUsers([...new Set([...selectedUsers, ...ids])]);
                    } else {
                      const ids = userList.map(u => u._id);
                      setSelectedUsers(selectedUsers.filter(id => !ids.includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Verified</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2EAFC]">
            {userList.map(u => (
              <tr key={u._id} className={`hover:bg-slate-50 transition-colors ${selectedUsers.includes(u._id) ? 'bg-primary/5' : ''}`}>
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedUsers.includes(u._id)}
                    onChange={() => handleSelectOneUser(u._id)}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{u.name || (u.email ? u.email.split('@')[0] : 'N/A')}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  {u.isVerified 
                    ? <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium border border-emerald-200">Verified</span> 
                    : <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-medium border border-amber-200">Pending</span>}
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-3 items-center">
                  <button 
                    disabled={busy}
                    onClick={() => handleImpersonate(u._id, u.role)}
                    className="text-primary hover:text-primary/80 bg-primary/10 p-1.5 rounded-md disabled:opacity-50 transition"
                    title="Access Dashboard"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button 
                    disabled={busy}
                    onClick={() => handleDeleteUser(u._id)}
                    className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md disabled:opacity-50 transition"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {userList.length === 0 && (
              <tr><td colSpan="5" className="text-center py-8 text-slate-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCandidatesTable = () => {
    const totalPages = Math.max(1, Math.ceil(candidates.length / candidatesPerPage));
    const startIndex = (candidatesPage - 1) * candidatesPerPage;
    const paginatedCandidates = candidates.slice(startIndex, startIndex + candidatesPerPage);

    return (
      <div className="bg-white border border-[#E2EAFC] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E2EAFC] flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-primary">Candidates</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">{candidates.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-[#E2EAFC] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">College Name</th>
                <th className="px-4 py-3 font-semibold">Branch</th>
                <th className="px-4 py-3 font-semibold">Fair Name</th>
                <th className="px-4 py-3 font-semibold text-center">Resume</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAFC]">
              {paginatedCandidates.map(candidate => {
                const answers = candidate.answers || {};
                const questions = candidate.event?.questions || [];
                
                let name = candidate.user?.name || candidate.user?.userName || (candidate.email ? candidate.email.split('@')[0] : "N/A");
                let college = "N/A";
                let branch = "N/A";
                let resume = null;

                const qMap = {};
                questions.forEach(q => {
                  qMap[q._id] = q.title.toLowerCase();
                  if (q.id) qMap[q.id] = q.title.toLowerCase();
                });

                Object.keys(answers).forEach(key => {
                  const lowerKey = key.toLowerCase();
                  const title = qMap[key] || lowerKey;
                  const val = answers[key];

                  if (title.includes("name") && !title.includes("company") && !title.includes("college") && !title.includes("university") && !title.includes("institute") && !title.includes("branch")) {
                    name = val;
                  }
                  if (lowerKey === 'q_name' && val) name = val;

                  if (title.includes("college") || title.includes("university") || title.includes("institute")) {
                    college = val;
                  }
                  
                  if (title.includes("branch") || title.includes("discipline") || title.includes("specialization") || title.includes("degree") || title.includes("qualification")) {
                    branch = val;
                  }
                  
                  if (typeof val === 'string' && (val.includes("cloudinary") || val.includes("http") || val.startsWith('/uploads/'))) {
                    if (title.includes("resume") || title.includes("cv") || title.includes("document") || title.includes("portfolio")) {
                      resume = val;
                    }
                  }
                });

                return (
                  <tr key={candidate._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{name}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={college}>{college}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate" title={branch}>{branch}</td>
                    <td className="px-4 py-3 text-slate-600">{candidate.event?.fairName || 'N/A'}</td>
                    <td className="px-4 py-3 text-center">
                      {resume ? (
                        <a href={getMediaUrl(resume)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">View Resume</a>
                      ) : (
                        <span className="text-slate-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => setSelectedCandidate(candidate)}
                        className="text-primary hover:text-primary/80 bg-primary/10 p-1.5 rounded-md transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {candidates.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No candidates found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-2 pb-4">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{candidates.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + candidatesPerPage, candidates.length)}</span> of <span className="font-bold text-slate-900">{candidates.length}</span> candidates
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCandidatesPage(prev => Math.max(1, prev - 1))}
                disabled={candidatesPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-slate-900 mx-2">
                Page {candidatesPage} of {totalPages}
              </span>
              <button
                onClick={() => setCandidatesPage(prev => Math.min(totalPages, prev + 1))}
                disabled={candidatesPage === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!user || user.role !== "SUPER_ADMIN") return null;

  return (
    <>
    <CreateEventHeader />
    <div className="h-screen flex flex-col overflow-hidden pt-[60.5px]">
      <div className="flex-1 w-full  overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)]  h-full overflow-hidden">
          
          {/* Sidebar */}
          <aside className="bg-[#E4EBFB] p-5 border border-[#D8E2F7]   xl:sticky xl:top-6 flex flex-col overflow-hidden">
            <div className="mb-7">
              <p className="text-slate-900 text-xl font-semibold">Super Admin</p>
              <p className="text-[11px] tracking-[0.16em] text-slate-500 mt-1 font-semibold">CONTROL PANEL</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-7 sm:grid-cols-3 xl:grid-cols-1 xl:space-y-2 xl:gap-0 overflow-y-auto custom-scrollbar ">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center justify-center xl:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                    activeSection === item.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:bg-white/70"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-[#D0DCF5] space-y-2">
              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg border border-slate-300 hover:bg-white/80 flex items-center justify-center xl:justify-start gap-2"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex flex-col h-full overflow-hidden space-y-4 sm:space-y-5">
            {/* Header */}
            <div className="bg-white border border-[#DCE5FA]  px-6 py-4 flex items-center justify-between shadow-sm mb-5">
              <div>
                <h1 className="text-xl font-bold text-primary">Super Admin Control</h1>
                <p className="text-[10px] tracking-[0.1em] text-slate-400 font-bold uppercase">Operational Excellence</p>
              </div>
              <div className="flex items-center gap-4">
                
                <div className="flex items-center gap-3 rounded-xl bg-[#F5F8FF] border border-[#DEE8FF] px-3 py-1.5">
                  <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    SA
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">Super Admin</p>
                    
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
              {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-20 ">
                <p className="text-slate-500 font-medium">Loading...</p>
              </div>
            ) : (
              <>
                {activeSection === "Overview" && (() => {
                  const totalAdmins = users.filter(u => u.role === "ADMIN" || u.role === "ORGANIZER").length;
                  const totalEmployers = users.filter(u => u.role === "EMPLOYER").length;
                  const totalSuperAdmins = users.filter(u => u.role === "SUPER_ADMIN").length;
                  const totalRegularUsers = users.filter(u => u.role === "USER" || (!u.role || (u.role !== "ADMIN" && u.role !== "SUPER_ADMIN" && u.role !== "ORGANIZER" && u.role !== "EMPLOYER"))).length;

                  return (
                    <div className="grid gap-3 sm:gap- grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-2">
                      <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white shadow-sm">
                        <p className="text-xs text-slate-500 tracking-widest font-semibold uppercase">TOTAL SUPERADMINS</p>
                        <p className="text-3xl mt-1 font-bold text-slate-800">{totalSuperAdmins}</p>
                      </div>
                       <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white shadow-sm">
                        <p className="text-xs text-slate-500 tracking-widest font-semibold uppercase">TOTAL ADMINS</p>
                        <p className="text-3xl mt-1 font-bold text-slate-800">{totalAdmins}</p>
                      </div>
                      
                      <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white shadow-sm">
                        <p className="text-xs text-slate-500 tracking-widest font-semibold uppercase">TOTAL EMPLOYERS</p>
                        <p className="text-3xl mt-1 font-bold text-slate-800">{totalEmployers}</p>
                      </div>
                     <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white shadow-sm">
                        <p className="text-xs text-slate-500 tracking-widest font-semibold uppercase">TOTAL USERS</p>
                        <p className="text-3xl mt-1 font-bold text-slate-800">{totalRegularUsers}</p>
                      </div>
                      
                      <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white shadow-sm">
                        <p className="text-xs text-slate-500 tracking-widest font-semibold uppercase">TOTAL FAIRS</p>
                        <p className="text-3xl mt-1 font-bold text-slate-800">{stats.events}</p>
                      </div>
                      <div className="rounded-lg border border-[#E2EAFC] p-4 bg-white shadow-sm">
                        <p className="text-xs text-slate-500 tracking-widest font-semibold uppercase">TOTAL BOOKINGS</p>
                        <p className="text-3xl mt-1 font-bold text-slate-800">{stats.bookings}</p>
                      </div>
                    </div>
                  );
                })()}

                {activeSection === "Admins" && renderUserTableSection("Admins List", users.filter(u => u.role === "ADMIN" || u.role === "ORGANIZER"))}
                {activeSection === "Employers" && renderSimpleUserTableSection("Employers List", users.filter(u => u.role === "EMPLOYER"))}
                {activeSection === "Users" && renderSimpleUserTableSection("Users List", users.filter(u => u.role === "USER" || (!u.role || (u.role !== "ADMIN" && u.role !== "SUPER_ADMIN" && u.role !== "ORGANIZER" && u.role !== "EMPLOYER"))))}

                {activeSection === "MyEvents" && (
                  <EventsSection 
                    events={events} 
                    setEvents={setEvents} 
                    busy={busy} 
                    setBusy={setBusy} 
                  />
                )}

                {activeSection === "AllEvents" && (
                  <div className="bg-white border border-[#E2EAFC] overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-[#E2EAFC] flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-primary">All Platform Fairs</h2>
                        <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">{events.length}</span>
                      </div>
                      {selectedSuperEvents.length > 0 && (
                        <button 
                          onClick={handleDeleteBulkEvents}
                          disabled={busy}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Trash2 size={14} /> Delete Selected ({selectedSuperEvents.length})
                        </button>
                      )}
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50/50 border-b border-[#E2EAFC]">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search events..." 
                          className="w-full pl-9 pr-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary"
                          value={searchQueryAllEvents}
                          onChange={(e) => setSearchQueryAllEvents(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <select 
                          className="px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary bg-white text-slate-600"
                          value={filterYearAllEvents}
                          onChange={(e) => setFilterYearAllEvents(e.target.value)}
                        >
                          <option value="">Year</option>
                          {uniqueYearsAllEvents.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                        <select 
                          className="px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary bg-white text-slate-600"
                          value={filterMonthAllEvents}
                          onChange={(e) => setFilterMonthAllEvents(e.target.value)}
                        >
                          <option value="">Month</option>
                          <option value="1">January</option>
                          <option value="2">February</option>
                          <option value="3">March</option>
                          <option value="4">April</option>
                          <option value="5">May</option>
                          <option value="6">June</option>
                          <option value="7">July</option>
                          <option value="8">August</option>
                          <option value="9">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                        </select>
                        <select 
                          className="px-3 py-2 border border-[#E2EAFC]  rounded-lg text-sm focus:outline-none focus:border-primary bg-white text-slate-600"
                          value={filterCategoryAllEvents}
                          onChange={(e) => setFilterCategoryAllEvents(e.target.value)}
                        >
                          <option value="">Categories</option>
                          {allCategoriesAllEvents.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-[#E2EAFC] text-slate-500">
                          <tr>
                            <th className="px-4 py-3 w-[40px]">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                checked={events.length > 0 && selectedSuperEvents.length === events.length}
                                onChange={handleSelectAllEvents}
                              />
                            </th>
                            <th className="px-4 py-3 font-semibold">Fair Title</th>
                            <th className="px-4 py-3 font-semibold">Organizer</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 text-left font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2EAFC]">
                          {filteredAllEvents.map(e => (
                            <tr key={e._id} className={`hover:bg-slate-50 transition-colors ${selectedSuperEvents.includes(e._id) ? 'bg-primary/5' : ''}`}>
                              <td className="px-4 py-3">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                  checked={selectedSuperEvents.includes(e._id)}
                                  onChange={() => handleSelectOneEvent(e._id)}
                                />
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-800">{e.fairName || e.basicInfo?.title || 'N/A'}</td>
                              <td className="px-4 py-3 text-slate-600">
                                {e.organizerName || (e.organizer ? (e.organizer.userName || e.organizer.hostName || e.organizer.organisationName || e.organizer.workEmail || 'No Name Provided') : 'Super Admin')}
                              </td>
                              <td className="px-4 py-3 text-slate-600">{e.startDate ? new Date(e.startDate).toLocaleDateString() : (e.basicInfo?.startDate || 'N/A')}</td>
                              <td className="px-4 py-3 text-right">
                                <button 
                                  disabled={busy}
                                  onClick={() => handleDeleteEvent(e._id)}
                                  className="text-red-500 hover:text-red-700 disabled:opacity-50 transition"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {filteredAllEvents.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-8 text-slate-500">No fairs found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSection === "Profile" && (
                  <div className="max-w-2xl bg-white border border-[#E2EAFC] overflow-hidden shadow-sm mx-auto mt-4 sm:mt-10">
                    <div className="p-5 border-b border-[#E2EAFC] bg-slate-50/50">
                      <h2 className="font-semibold text-primary flex items-center gap-2">
                        <Settings size={18} /> Profile Settings
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Update your email and password</p>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          required
                          className="w-full px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100">
                        <label className="flex justify-between items-center text-sm font-medium text-slate-700 mb-1">
                          <span>Current Password *</span>
                          <button 
                            type="button" 
                            disabled={busy}
                            onClick={async () => {
                              if (!profileEmail) return alert("Email is required");
                              setBusy(true);
                              try {
                                const data = await forgotPassword(profileEmail);
                                alert(data.message || "Reset link sent!");
                              } catch (err) {
                                alert(err.response?.data?.message || "Failed to send reset link");
                              } finally {
                                setBusy(false);
                              }
                            }}
                            className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                          >
                            Forgot password?
                          </button>
                        </label>
                        <div className="relative">
                          <input 
                            type={profileShowPassword ? "text" : "password"} 
                            required
                            placeholder="Enter current password"
                            className="w-full px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary"
                            value={profileCurrentPassword}
                            onChange={(e) => setProfileCurrentPassword(e.target.value)}
                          />
                          <button 
                            type="button" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            onClick={() => setProfileShowPassword(!profileShowPassword)}
                          >
                            {profileShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                          <input 
                            type={profileShowPassword ? "text" : "password"} 
                            placeholder="Enter new password"
                            className="w-full px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary"
                            value={profileNewPassword}
                            onChange={(e) => setProfileNewPassword(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                          <input 
                            type={profileShowPassword ? "text" : "password"} 
                            placeholder="Confirm new password"
                            className="w-full px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary"
                            value={profileConfirmPassword}
                            onChange={(e) => setProfileConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button 
                          type="submit"
                          disabled={busy}
                          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152745] transition disabled:opacity-50"
                        >
                          {busy ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeSection === "EmployerJobs" && (
                  <AdminJobsSection 
                    events={events} 
                    setEvents={setEvents} 
                  />
                )}

                {activeSection === "Candidates" && renderCandidatesTable()}
              </>
            )}
            </div>
          </main>
          
        </div>
      </div>
      <CandidateDetailsModal 
        isOpen={!!selectedCandidate} 
        onClose={() => setSelectedCandidate(null)} 
        booking={selectedCandidate} 
        eventData={selectedCandidate?.event} 
      />
    </div>
    </>
  );
};

export default SuperAdminDashboard;
