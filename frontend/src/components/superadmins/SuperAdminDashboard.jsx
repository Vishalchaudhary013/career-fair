/**
 * Function is used to create the Superadmin dashboard.
 * -- it consists of::
 * --- All admin and job fairs details
 * --- Manage admin(create, edit and delete admin)
 * --- Manage job fairs (create, edit and delete job fair)
 */


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import SuperAdminSidebar from "./SuperAdminSidebar";
import CreateJobFairForm from "../forms/CreateJobFairForm";
import EditJobFairModal from "../modals/EditJobFairModal";

import { SERVER_URL } from "../../config";

const SuperAdminDashboard = () => {
  const superadmin = JSON.parse(localStorage.getItem("superadmin"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [admins, setAdmins] = useState([]);
  const [jobFairs, setJobFairs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showJobFairModal, setShowJobFairModal] = useState(false);
  const [showEditJobFairModal, setShowEditJobFairModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [selectedJobFairId, setSelectedJobFairId] = useState(null);

  const [updatedAdmin, setUpdatedAdmin] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // ------------------ FETCH ADMINS ------------------
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/auth/admins`);
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  // ------------------ FETCH JOB FAIRS ------------------
  const fetchJobFairs = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/jobFair/all`);
      setJobFairs(res.data);
    } catch (err) {
      console.error("Error fetching job fairs:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchJobFairs();
  }, []);

  // ------------------ ADD ADMIN ------------------
  const addAdmin = async () => {
    const { name, email, password } = newAdmin;

    if (!Object.values(newAdmin).every(Boolean)) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/register-admin`, {
        name,
        email,
        password
      });

      setAdmins([...admins, response.data.admin]);
      setNewAdmin({ name: "", email: "", password: "" });
      setModalMessage("Admin created successfully!");
      setShowModal(true);
      fetchAdmins();
    } catch (error) {
      setModalMessage(error.response?.data?.message || "An error occurred");
      setShowModal(true);
    }
  };

  // ------------------ EDIT ADMIN ------------------
  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setUpdatedAdmin({ name: admin.name, email: admin.email, password: "" });
    setShowEditModal(true);
  };

  // ------------------ UPDATE ADMIN ------------------
  const handleUpdateAdmin = async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/auth/admins/${selectedAdmin._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAdmin)
        }
      );

      if (response.ok) {
        setShowEditModal(false);
        setModalMessage("Admin updated successfully");
        setShowModal(true);
        fetchAdmins();
      } else {
        setModalMessage("Failed to update admin!");
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage(`Error updating admin: ${error}`);
      setShowModal(true);
    }
  };

  // ------------------ DELETE ADMIN ------------------
  const handleDeleteAdmin = async (admin) => {
    if (!admin) return;

    try {
      await axios.delete(`${SERVER_URL}/api/auth/admins/${admin._id}`);
      setAdmins(admins.filter((a) => a._id !== admin._id));
      setModalMessage("Admin deleted successfully!");
      setShowModal(true);
    } catch (error) {
      setModalMessage(error.response?.data?.message || "An error occurred");
      setShowModal(true);
    }
  };

  // ------------------ PASSWORD TOGGLE ------------------
  const togglePasswordVisibility = (adminId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };

  const renderPasswordCell = (admin) => (
    <div>
      {showPasswords[admin?._id] ? admin?.password : "*******"}{" "}
      <span
        onClick={() => togglePasswordVisibility(admin?._id)}
        style={{ cursor: "pointer", marginLeft: "10px" }}
      >
        {showPasswords[admin?._id] ? (
          <i className="bi bi-eye-fill"></i>
        ) : (
          <i className="bi bi-eye-slash"></i>
        )}
      </span>
    </div>
  );

  // ------------------ MODAL CLOSE ------------------
  const handleCloseModal = () => setShowModal(false);

  // ------------------ DELETE JOB FAIR ------------------
  const handleDeleteFair = async (jobId) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/jobfair/delete/${jobId}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage("Job fair deleted successfully");
      } else {
        setModalMessage(result.error || "Error deleting job fair");
      }

      fetchJobFairs();
    } catch (error) {
      setModalMessage("Error deleting job fair");
    } finally {
      setShowModal(true);
    }
  };

  // ------------------ EDIT JOB FAIR MODAL ------------------
  const handleEdit = (jobFairId) => {
    setSelectedJobFairId(jobFairId);
    setShowEditJobFairModal(true);
  };
// -------------------------------------------
// PART 2 — DASHBOARD UI + ADMIN LIST + MANAGE ADMIN UI
// -------------------------------------------

// ------------------ DASHBOARD HEADER ------------------
const dashboardHeader = () => (
  <div className="flex flex-wrap -mx-3 gap-y-4">
    <div className="w-full md:w-1/3 px-3">
      <div className="bg-white shadow-sm border-0 rounded-2xl p-4 h-full">
        <h5 className="text-blue-600 mb-3 text-lg font-medium">Super Admin Profile</h5>
        <p className="mb-1"><strong>Name:</strong> Bavneet Taneja</p>
        <p className="mb-1"><strong>Email:</strong> bavneetcf@gmail.com</p>
        <p className="mb-0"><strong>Password:</strong> bavneetcf369</p>
      </div>
    </div>

    <div className="w-full md:w-2/3 px-3">
      <div className="flex flex-wrap -mx-2 h-full">
        <div className="w-full md:w-1/3 px-2 mb-3 md:mb-0">
          <div className="bg-white border-0 shadow-sm rounded-2xl text-center p-4 h-full flex flex-col justify-center">
            <i className="bi bi-person-badge text-blue-600 text-3xl mb-2" />
            <h6 className="mb-1 text-gray-500 font-medium">Total Admins</h6>
            <h4 className="text-2xl font-bold">{admins.length}</h4>
          </div>
        </div>

        <div className="w-full md:w-1/3 px-2 mb-3 md:mb-0">
          <div className="bg-white border-0 shadow-sm rounded-2xl text-center p-4 h-full flex flex-col justify-center">
            <i className="bi bi-calendar2-event text-blue-600 text-3xl mb-2" />
            <h6 className="mb-1 text-gray-500 font-medium">Job Fairs</h6>
            <h4 className="text-2xl font-bold">{jobFairs.length}</h4>
          </div>
        </div>

        <div className="w-full md:w-1/3 px-2">
          <div className="bg-white border-0 shadow-sm rounded-2xl text-center p-4 h-full flex flex-col justify-center">
            <i className="bi bi-people-fill text-blue-600 text-3xl mb-2" />
            <h6 className="mb-1 text-gray-500 font-medium">Hall Tickets</h6>
            <h4 className="text-2xl font-bold">500+</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ------------------ ADMIN LIST SECTION ------------------
const renderAdminList = () => (
  <div className="mt-6">
    <div className="bg-white shadow-sm border-0 rounded-2xl p-4">
      <h5 className="mb-3 text-blue-600 text-lg font-medium">Admins List</h5>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white border border-gray-200">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {admins.map((admin, index) => (
              <tr
                key={admin?._id || admin?.email || index}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">{admin.name}</td>
                <td className="px-4 py-3">{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ------------------ DASHBOARD MAIN VIEW ------------------
const renderDashboard = () => (
  <div className="w-full font-roboto">
    {dashboardHeader()}
    {renderAdminList()}

    <div className="mt-6">
      <div className="bg-white shadow-sm border-0 rounded-2xl p-4">
        <h5 className="mb-3 text-blue-600 text-lg font-medium">Job Fair Statistics</h5>
        <div className="text-gray-500 text-center py-4">[Bar Chart Coming Soon]</div>
      </div>
    </div>
  </div>
);

// ------------------ ADMIN DETAILS (VIEW ADMIN TAB) ------------------
const renderAdminDetails = () => (
  <div className="bg-white border rounded-lg shadow-sm mb-4 p-5">
    <button 
      className="px-4 py-2 border border-gray-400 text-gray-600 hover:bg-gray-100 rounded-md transition-colors font-medium text-sm"
      onClick={() => setActiveTab("dashboard")}
    >
      Back
    </button>

    <h2 className="mt-4 text-2xl font-semibold">Admin Details</h2>

    {selectedAdmin && (
      <div className="mt-4">
        <p className="mb-2"><strong>Name:</strong> {selectedAdmin.admin.name}</p>
        <p className="mb-2"><strong>Email:</strong> {selectedAdmin.admin.email}</p>

        <h3 className="mt-6 mb-3 text-xl font-medium">Job Fairs Created</h3>

        {selectedAdmin.jobFairs?.length > 0 ? (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-r">Title</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {selectedAdmin.jobFairs.map((job, idx) => (
                  <tr key={job._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 border-r">{job.title}</td>
                    <td className="px-4 py-3">{new Date(job.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No job fairs created by this admin.</p>
        )}
      </div>
    )}
  </div>
);

// ------------------ MANAGE ADMINS SECTION ------------------
const renderManageAdmins = () => (
  <div className="w-full font-inter">
    <div className="bg-white border-0 shadow-sm rounded-2xl p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-blue-600 font-semibold text-xl">Manage Admins</h4>
      </div>

      {/* CREATE ADMIN FORM */}
      <form className="flex flex-wrap  items-center mb-6">
        <div className="w-full md:w-1/4 px-2 mb-3 md:mb-0">
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-1/4 px-2 mb-3 md:mb-0">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-1/4 px-2 mb-3 md:mb-0">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-1/4 px-2">
          <button 
            type="button" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            onClick={addAdmin}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Admin
          </button>
        </div>
      </form>

      {/* ADMIN TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white border border-gray-200">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700 border-r">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700 border-r">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-700 border-r">Password</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {admins.map((admin, index) => (
              <tr key={admin?._id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 border-r">{admin.name}</td>
                <td className="px-4 py-3 border-r">{admin.email}</td>
                <td className="px-4 py-3 border-r">{renderPasswordCell(admin)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 text-sm text-yellow-600 border border-yellow-600 rounded hover:bg-yellow-600 hover:text-white transition-colors"
                      onClick={() => handleEditAdmin(admin)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>

                    <button
                      className="px-2 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                      onClick={() => navigate(`/admin-dashboard/${admin._id}`)}
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </button>

                    <button
                      className="px-2 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                      onClick={() => handleDeleteAdmin(admin)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
// -------------------------------------------
// PART 3 — MANAGE JOB FAIRS (with Chips + Tabs + Table)
// -------------------------------------------

// FAIR TYPE options for chips
const fairTypes = [
  "All",
  "Career Fair",
  "Education Fair",
  "Career & Education Fair",
  "Conference",
];

const tabs = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "registrationClosed", label: "Registration Closed" },
  { key: "past", label: "Past Events" },
];

// FILTER STATES
const [selectedFairType, setSelectedFairType] = useState("All");
const [selectedTab, setSelectedTab] = useState("all");

const renderManageJobFairs = () => {
  // ---------------- FILTER LOGIC ----------------
  let filtered = [...jobFairs];
  const now = moment();

  // fair type filter
  if (selectedFairType !== "All") {
    filtered = filtered.filter((job) => job.fairType === selectedFairType);
  }

  // status tabs filter
  filtered = filtered.filter((job) => {
    const reg = moment(job.registrationDateTime);
    const start = moment(job.jobFairStart);
    const end = moment(job.jobFairEnd);

    if (selectedTab === "upcoming") return now.isBefore(reg);

    if (selectedTab === "registrationClosed")
      return now.isAfter(reg) && now.isBefore(start);

    if (selectedTab === "past") return now.isAfter(end);

    return true; // ALL
  });

  // --------------------------------------------------

  return (
    <div className="w-full font-sans">
      <div className="bg-white border border-gray-200 rounded p-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-gray-900 font-semibold text-xl">Manage Job Fairs</h4>
          <button
            className="flex items-center gap-2 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white px-3 py-1.5 rounded transition-colors"
            onClick={() => setShowJobFairModal(true)}
          >
            <i className="bi bi-calendar-plus"></i> Create Job Fair
          </button>
        </div>

        {/* -------------- FILTERS SECTION -------------- */}
        <div className="mt-4 mb-4 flex flex-col gap-3">

          {/* FAIR TYPE CHIPS */}
          <div className="flex flex-wrap gap-2">
            {fairTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedFairType(type)}
                className={`border text-sm px-3 py-1.5 transition-colors ${
                  selectedFairType === type
                    ? "bg-[#0d6efd] text-white border-[#0d6efd]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* STATUS TABS */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`relative border text-sm px-4 py-1.5 transition-colors ${
                  selectedTab === tab.key
                    ? "bg-white text-blue-600 border-gray-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className={selectedTab === tab.key ? "text-blue-600" : ""}>{tab.label}</span>
                {selectedTab === tab.key && (
                  <div className="absolute bottom-[-1px] left-2 right-2 h-[3px] bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>

        </div>

        {/* -------------- TABLE SECTION -------------- */}
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="min-w-full text-left bg-white">
            <thead className="bg-[#f8f9fa] border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Sr No.</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Event Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Fair Type</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">State</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Dates</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-sm">Status / Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filtered.map((job, index) => {
                const reg = moment(job.registrationDateTime);
                const start = moment(job.jobFairStart);
                const end = moment(job.jobFairEnd);
                const now = moment();

                // status logic
                let status = "";
                let statusClass = "";

                if (now.isBefore(reg)) {
                  status = "Registration Open";
                  statusClass = "bg-[#0d6efd] text-white";
                } else if (now.isAfter(reg) && now.isBefore(start)) {
                  status = "Registration Closed";
                  statusClass = "bg-[#ffc107] text-dark";
                } else if (now.isBetween(start, end)) {
                  status = "Active";
                  statusClass = "bg-[#198754] text-white";
                } else {
                  status = "Inactive";
                  statusClass = "bg-[#6c757d] text-white";
                }

                return (
                  <tr key={job._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-800 align-top">{index + 1}</td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-top">{job.jobFairName}</td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-top">{job.fairType}</td>
                    <td className="px-4 py-4 text-sm text-gray-800 align-top">{job?.venue?.state}</td>

                    <td className="px-4 py-4 text-sm text-gray-800 align-top">
                      {moment(job.jobFairStart).format("YYYY-MM-DD")} <br />
                      <span className="text-gray-500">to</span> <br />
                      {moment(job.jobFairEnd).format("YYYY-MM-DD")}
                    </td>

                    <td className="px-4 py-4 text-sm align-top">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          {/* VIEW DETAILS */}
                          <button
                            className="px-2 py-1 text-sm text-[#0d6efd] border border-[#0d6efd] rounded hover:bg-[#0d6efd] hover:text-white transition-colors flex items-center"
                            onClick={() => navigate(`/job-fair/${job.jobFairId}`)}
                          >
                            <i className="bi bi-eye me-1"></i> View
                          </button>

                          {/* APPLIED CANDIDATES */}
                          <button
                            className="px-2 py-1 text-sm text-[#0dcaf0] border border-[#0dcaf0] rounded hover:bg-[#0dcaf0] hover:text-white transition-colors flex items-center"
                            onClick={() =>
                              navigate(`/studentDetailList/${job.jobFairId}`, { state: { job } })
                            }
                          >
                            <i className="bi bi-people-fill me-1"></i> Applied
                          </button>

                          {/* EDIT */}
                          <button
                            className="px-2 py-1 text-sm text-[#ffc107] border border-[#ffc107] rounded hover:bg-[#ffc107] hover:text-white transition-colors flex items-center"
                            onClick={() => handleEdit(job.jobFairId)}
                          >
                            <i className="bi bi-pencil-square me-1"></i> Edit
                          </button>

                          {/* DELETE */}
                          <button
                            className="px-2 py-1 text-sm text-[#dc3545] border border-[#dc3545] rounded hover:bg-[#dc3545] hover:text-white transition-colors flex items-center"
                            onClick={() => handleDeleteFair(job._id)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                        
                        {/* STATUS */}
                        <div>
                          <button className={`px-2 py-1 text-sm rounded ${statusClass} cursor-default`} disabled>
                            {status}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------
// PART 4 — MODALS + RETURN JSX + EXPORT
// -------------------------------------------

// ------------------ GENERIC MESSAGE MODAL ------------------
const renderModal = () => {
  if (!showModal) return null;
  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4" onClick={handleCloseModal}>
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-medium text-gray-900">Message</h3>
          <button onClick={handleCloseModal} className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="p-4 text-gray-700">{modalMessage}</div>
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------ EDIT ADMIN MODAL ------------------
const renderEditModalData = () => {
  if (!showEditModal) return null;
  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEditModal(false)}>
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-medium text-gray-900">Edit Admin</h3>
          <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="p-4">
          <form className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Name</label>
              <input
                type="text"
                value={updatedAdmin.name}
                onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                value={updatedAdmin.email}
                onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">New Password (Leave empty to keep same)</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={updatedAdmin.password}
                onChange={(e) => setUpdatedAdmin({ ...updatedAdmin, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleUpdateAdmin} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------ CREATE JOB FAIR MODAL ------------------
const renderManageJobFairModal = () => {
  if (!showJobFairModal) return null;
  return (
    <div className="fixed inset-0 z-[1050] bg-white flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold text-blue-600">Create Job Fair</h3>
        <button onClick={() => setShowJobFairModal(false)} className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg w-10 h-10 flex justify-center items-center text-xl">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        <CreateJobFairForm
          setShowJobFairModal={setShowJobFairModal}
          setJobFairs={setJobFairs}
          admin="super-admin"
          adminId={superadmin?._id}
        />
      </div>
    </div>
  );
};

// ------------------ FINAL RETURN JSX ------------------
return (
  <div className="flex flex-wrap h-screen">
    <div className="w-full md:w-1/6 bg-gray-50 border-r border-gray-200">
      <SuperAdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBar="super-admin"
      />
    </div>

    <div className="w-full md:w-5/6 py-4 px-4 overflow-y-auto h-screen">
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "adminDetails" && renderAdminDetails()}
      {activeTab === "manageAdmins" && renderManageAdmins()}
      {activeTab === "manageJobFairs" && renderManageJobFairs()}

      {renderModal()}
      {renderEditModalData()}
      {renderManageJobFairModal()}

      <EditJobFairModal
        show={showEditJobFairModal}
        onClose={() => setShowEditJobFairModal(false)}
        jobFairId={selectedJobFairId}
      />
    </div>
  </div>
);

}; // end component

export default SuperAdminDashboard;
