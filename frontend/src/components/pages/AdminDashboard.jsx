import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getAllEvents } from "../services/eventService";

import AdminSidebar from "../admin-dashboard/AdminSidebar";
import AdminHeader from "../admin-dashboard/AdminHeader";
import OverviewSection from "../admin-dashboard/OverviewSection";
import EventsSection from "../admin-dashboard/EventsSection";
import CreateEventHeader from "../create-event/CreateEventHeader";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [activeSection, setActiveSection] = useState("Overview");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents(true);
       
        const myEvents = data.filter(e => {
          if (!e.organizer) return false;
          const orgId = typeof e.organizer === "string" ? e.organizer : (e.organizer._id || e.organizer.id);
          return String(orgId) === String(user._id);
        });
        
       
        myEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setEvents(myEvents);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-slate-700 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
    <CreateEventHeader />
    <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFC] pt-[60px]">
      
      <div className="flex-1 w-full overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)] h-full overflow-hidden">
          
          <AdminSidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            onLogout={onLogout} 
          />

          <main className="min-w-0 flex flex-col h-full overflow-hidden space-y-4 sm:space-y-5">
            <AdminHeader 
              activeSection={activeSection} 
              user={user} 
            />

            <div className="flex-1 min-h-0 overflow-y-auto  hide-scrollbar">
              {activeSection === "Overview" && (
                <OverviewSection events={events} />
              )}

              {activeSection === "Fairs" && (
                <EventsSection 
                  events={events} 
                  setEvents={setEvents} 
                  busy={busy} 
                  setBusy={setBusy} 
                />
              )}
            </div>
          </main>
          
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
