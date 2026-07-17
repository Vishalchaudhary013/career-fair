import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiEdit2, FiTrash2, FiEye, FiSearch } from "react-icons/fi";
import { deleteEvent } from "../services/eventService";
import { formatDate, formatTime } from "../../utils/dateFormatter";
import { getCategories } from "../services/categoryService";
import EventResponsesView from "./EventResponsesView";

const EventsSection = ({ events, setEvents, busy, setBusy }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  
  const itemsPerPage = 10;

  React.useEffect(() => {
    const fetchCats = async () => {
      const defaultNames = ["Career Drive", "College Festivals", "Competitions", "Conferences", "Cultural Events", "Hackathon", "Mentorships", "Olympiad", "Quizzes", "Webinars", "Workshop"];
      const eventCats = events.map(e => e.category).filter(Boolean);
      try {
        const fetched = await getCategories();
        const fetchedNames = fetched.map(c => c.name);
        setAllCategories([...new Set([...defaultNames, ...fetchedNames, ...eventCats])].sort());
      } catch (err) {
        setAllCategories([...new Set([...defaultNames, ...eventCats])].sort());
      }
    };
    fetchCats();
  }, [events]);

  const uniqueYears = useMemo(() => {
    return [...new Set(events.map(e => {
      const dateStr = e.endDate || e.startDate;
      return dateStr ? new Date(dateStr).getFullYear().toString() : null;
    }).filter(Boolean))].sort((a, b) => b - a);
  }, [events]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => {
      const dateStr = event.endDate || event.startDate;
      let isExpired = false;
      let eventYear = null;
      let eventMonth = null;
      
      if (dateStr) {
        const eventDate = new Date(dateStr);
        eventYear = eventDate.getFullYear().toString();
        eventMonth = (eventDate.getMonth() + 1).toString();
        eventDate.setHours(23, 59, 59, 999);
        isExpired = eventDate.getTime() < now.getTime();
      } else {
        isExpired = activeTab !== "upcoming"; 
      }
      
      
      if (activeTab === "upcoming" && isExpired) return false;
      if (activeTab === "expired" && !isExpired) return false;

      
      if (searchQuery && !(event.fairName || event.basicInfo?.title || "").toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      
      if (filterYear && eventYear !== filterYear) return false;
      if (filterMonth && eventMonth !== filterMonth) return false;
      if (filterCategory && event.category !== filterCategory) return false;

      return true;
    });
  }, [events, activeTab, searchQuery, filterYear, filterMonth, filterCategory]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const handleEdit = (event) => {
    navigate(`/edit-event/${event._id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setBusy(true);
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      setSelectedEvents(prev => prev.filter(eventId => eventId !== id));
    } catch (err) {
      alert("Failed to delete event.");
    } finally {
      setBusy(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEvents(paginatedEvents.map(ev => ev._id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedEvents.includes(id)) {
      setSelectedEvents(selectedEvents.filter(eventId => eventId !== id));
    } else {
      setSelectedEvents([...selectedEvents, id]);
    }
  };

  const handleDeleteSelected = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedEvents.length} events? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setBusy(true);
      await Promise.all(selectedEvents.map(id => deleteEvent(id)));
      setEvents(prev => prev.filter(e => !selectedEvents.includes(e._id)));
      setSelectedEvents([]);
    } catch (err) {
      alert("Failed to delete some events.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
    {selectedEventId ? (
      <EventResponsesView eventId={selectedEventId} onBack={() => setSelectedEventId(null)} />
    ) : (
    <div className="border border-[#E2EAFC] bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-[#E2EAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Your Events</h3>
          <p className="text-xs font-medium text-slate-500 mt-1">Manage and edit your created events</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedEvents.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={busy}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <FiTrash2 size={16} /> Delete Selected ({selectedEvents.length})
            </button>
          )}
          <button 
            onClick={() => navigate('/create-event')}
            className="bg-primary hover:bg-[#180080] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm"
          >
            + Create Event
          </button>
        </div>
      </div>

      
      <div className="flex border-b border-[#E2EAFC] px-5 bg-slate-50/30">
        <button 
          onClick={() => { setActiveTab("upcoming"); setCurrentPage(1); }}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "upcoming" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Upcoming Events
        </button>
        <button 
          onClick={() => { setActiveTab("expired"); setCurrentPage(1); }}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "expired" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Expired Events
        </button>
      </div>

      
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50/50 border-b border-[#E2EAFC]">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-9 pr-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            className="px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary bg-white text-slate-600"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">Year</option>
            {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
          <select 
            className="px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary bg-white text-slate-600"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
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
            className="px-3 py-2 border border-[#E2EAFC] rounded-lg text-sm focus:outline-none focus:border-primary bg-white text-slate-600"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Categories</option>
            {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center">
          <FiCalendar size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-600 font-medium mb-1">
            {activeTab === "upcoming" ? "No upcoming events found" : "No expired events found"}
          </p>
          <p className="text-sm text-slate-500">
            {activeTab === "upcoming" ? "You haven't created any upcoming events yet." : "You have no expired events."}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-[#E3EAFA] text-slate-500 bg-slate-50/80 uppercase text-[11px] tracking-wider font-bold">
                  <th className="py-3 px-4 w-[40px]">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={paginatedEvents.length > 0 && selectedEvents.length === paginatedEvents.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-5">Event Name</th>
                  <th className="py-3 px-5">Date & Time</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Responses</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2FD]">
                {paginatedEvents.map((item) => (
                  <tr key={item._id} className={`hover:bg-slate-50/50 transition-colors ${selectedEvents.includes(item._id) ? 'bg-primary/5' : ''}`}>
                    <td className="py-4 px-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedEvents.includes(item._id)}
                        onChange={() => handleSelectOne(item._id)}
                      />
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-800">
                      {item.fairName || item.basicInfo?.title || "Untitled Event"}
                    </td>
                    <td className="py-4 px-5 text-slate-600">
                      {item.startDate ? formatDate(item.startDate) : (item.basicInfo?.startDate ? formatDate(item.basicInfo.startDate) : "TBA")}
                    </td>
                    <td className="py-4 px-5 text-slate-600 truncate max-w-[200px]" title={(item.venue?.city === "Online" || item.location?.city === "Online") ? "Online" : (item.venue?.venueName || item.venue?.city || item.location?.venueName || item.location?.city)}>
                      {(item.venue?.city === "Online" || item.location?.city === "Online") ? "Online" : (item.venue?.venueName || item.venue?.city || item.location?.venueName || item.location?.city || "TBA")}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0F4FF] text-primary">
                          {item.bookingCount || 0}
                        </span>
                        <button 
                          onClick={() => setSelectedEventId(item._id)}
                          className="text-slate-400 hover:text-primary transition-colors p-1"
                          title="View Responses"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-green-100 text-green-700">
                        Published
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={busy}
                          className="p-1.5 text-primary bg-primary/10 hover:bg-primary/20 rounded transition-colors disabled:opacity-50"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={busy}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#EDF2FD] p-4 bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + (filteredEvents.length > 0 ? 1 : 0)} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} entries
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || busy}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || busy}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    )}
    </>
  );
};

export default EventsSection;
