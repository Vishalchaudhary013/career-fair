import React, { useState } from "react";
import { SERVER_URL } from "../../config";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { FiTrash2 } from "react-icons/fi";

const AdminJobsSection = ({ events, setEvents }) => {
  const { user } = useAuth();
  const [loadingId, setLoadingId] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const allJobs = [];
  events.forEach((event) => {
    if (event.hiringPartners && event.hiringPartners.length > 0) {
      event.hiringPartners.forEach((partner) => {
        if (partner.postedBy) {
          allJobs.push({
            ...partner,
            eventTitle: event.fairName,
            eventId: event._id,
          });
        }
      });
    }
  });

  allJobs.sort((a, b) => {
    if (a.status === "Pending" && b.status !== "Pending") return -1;
    if (a.status !== "Pending" && b.status === "Pending") return 1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(allJobs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = allJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusUpdate = async (eventId, jobId, newStatus) => {
    try {
      setLoadingId(jobId);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${SERVER_URL}/api/fair/${eventId}/job/${jobId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setEvents((prev) =>
          prev.map((evt) => {
            if (evt._id === eventId) {
              return {
                ...evt,
                hiringPartners: evt.hiringPartners.map((hp) =>
                  hp._id === jobId ? { ...hp, status: newStatus } : hp
                ),
              };
            }
            return evt;
          })
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const paginatedIds = paginatedJobs.map(j => j._id);
      setSelectedJobs(Array.from(new Set([...selectedJobs, ...paginatedIds])));
    } else {
      const paginatedIds = paginatedJobs.map(j => j._id);
      setSelectedJobs(selectedJobs.filter(id => !paginatedIds.includes(id)));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedJobs.includes(id)) {
      setSelectedJobs(selectedJobs.filter(jobId => jobId !== id));
    } else {
      setSelectedJobs([...selectedJobs, id]);
    }
  };

  const handleDeleteSelected = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedJobs.length} jobs?`);
    if (!confirmed) return;
    
    setLoadingId('bulk');
    try {
      const token = localStorage.getItem("token");
      
      const promises = selectedJobs.map(jobId => {
        const job = allJobs.find(j => j._id === jobId);
        if (job) {
          return axios.delete(
            `${SERVER_URL}/api/fair/${job.eventId}/job/${jobId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        return Promise.resolve();
      });

      await Promise.all(promises);

      setEvents((prev) =>
        prev.map((evt) => {
          return {
            ...evt,
            hiringPartners: evt.hiringPartners.filter((hp) => !selectedJobs.includes(hp._id)),
          };
        })
      );
      setSelectedJobs([]);
    } catch (error) {
      console.error("Failed to delete selected jobs:", error);
      alert("Failed to delete some jobs.");
    } finally {
      setLoadingId(null);
    }
  };

  const renderJobProfile = (profileStr) => {
    if (!profileStr || profileStr === "[]") return <div className="text-xs text-slate-500 mt-0.5">N/A</div>;
    try {
      const parsed = JSON.parse(profileStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (
          <div className="flex flex-wrap gap-1 mt-1">
            {parsed.map((p, idx) => (
              <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] border border-primary/20 whitespace-normal text-left font-semibold">
                {p.title || "Unknown Role"} {p.type ? `(${p.type})` : ""}
              </span>
            ))}
          </div>
        );
      }
    } catch (e) {
    }
    return <div className="text-xs text-slate-500 mt-0.5">{profileStr}</div>;
  };

  return (
    <div className="bg-white  border border-slate-100 p-6 flex flex-col ">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Employer Jobs</h2>
          <p className="text-sm text-slate-500 mt-1">Review and approve job postings submitted by employers.</p>
        </div>
        {selectedJobs.length > 0 && (
          <button 
            onClick={handleDeleteSelected}
            disabled={loadingId === 'bulk'}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <FiTrash2 size={16} /> Delete Selected ({selectedJobs.length})
          </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-3 px-4 w-[40px]">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={paginatedJobs.length > 0 && paginatedJobs.every(job => selectedJobs.includes(job._id))}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-3 font-semibold">Company / Role</th>
              <th className="py-3 font-semibold">Event</th>
              <th className="py-3 font-semibold">Employer Email</th>
              <th className="py-3 font-semibold">Status</th>
              <th className="py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allJobs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">
                  No employer jobs found.
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job) => (
                <tr key={job._id} className={`border-b border-slate-100 transition-colors in`}>
                  <td className="py-4 px-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedJobs.includes(job._id)}
                      onChange={() => handleSelectOne(job._id)}
                    />
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-slate-900 whitespace-normal">
                      {job.companyName && job.companyName.trim() !== "" ? job.companyName : "Unknown Company"}
                    </div>
                    {renderJobProfile(job.jobProfile)}
                  </td>
                  <td className="py-4">
                    <div className="text-slate-700">{job.eventTitle}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-slate-600">{job.postedByEmail || "N/A"}</div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                        job.status === "Pending"
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : job.status === "Approved"
                          ? "bg-primary text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {job.status || "Approved"}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {job.status === "Pending" ? (
                        <>
                          <button
                            disabled={loadingId === job._id}
                            onClick={() => handleStatusUpdate(job.eventId, job._id, "Approved")}
                            className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 transition"
                          >
                            Approve
                          </button>
                          <button
                            disabled={loadingId === job._id}
                            onClick={() => handleStatusUpdate(job.eventId, job._id, "Rejected")}
                            className="bg-secondary hover:bg-secondary/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">Processed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{allJobs.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, allJobs.length)}</span> of <span className="font-bold text-slate-900">{allJobs.length}</span> jobs
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-900 mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
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

export default AdminJobsSection;
