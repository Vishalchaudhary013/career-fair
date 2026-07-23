import React, { useEffect, useState } from 'react'
import Navbar from '../section/Navbar'
import Hero from '../section/Hero'
import UpcomingEvents from '../section/UpcomingEvents'
import InternshipEvent from '../section/InternshipEvent'
import { AppleIcon } from 'lucide-react'
import ApprenticeshipEvent from '../section/ApprenticeshipEvent'
import JobEvents from '../section/JobEvents'
import Footer from '../section/Footer'
import { getAllEvents } from '../services/eventService'

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        const now = new Date();
        const activeEvents = (data || []).filter(e => {
          const dateStr = e.endDate || e.startDate || e.basicInfo?.endDate || e.basicInfo?.startDate;
          if (!dateStr) return true;
          const dateToCheck = new Date(dateStr);
          return dateToCheck >= now;
        });
        setEvents(activeEvents);
      } catch (error) {
        console.error("Failed to load fairs:", error);
      }
    };

    fetchEvents();
  }, []);

  const internships = events.filter(e => e.fairType === "Internship");
  const jobs = events.filter(e => e.fairType === "Job");
  const apprenticeships = events.filter(e => e.fairType === "Apprenticeship");

  // Get 4 latest fairs among Job, Internship, Apprenticeship
  const upcoming = events
    .filter(e => ["Job", "Internship", "Apprenticeship"].includes(e.fairType))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  return (
    <div>
      <Navbar />
      <Hero />
      <UpcomingEvents events={upcoming} />
      <JobEvents events={jobs} />
      <InternshipEvent events={internships} />
      <ApprenticeshipEvent events={apprenticeships} />
      <Footer />
    </div>
  )
}

export default Home
