import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar } from "lucide-react";
import EventHeader from "../event-page/EventHeader";
import EventContent from "../event-page/EventContent";
import EventSidebar from "../event-page/EventSidebar";
import EventStickyNav from "../event-page/EventStickyNav";
import FloatingShareWidget from "../event-page/FloatingShareWidget";
import EventLocation from "../event-page/EventLocation";
import { IoLogoWhatsapp } from "react-icons/io";
import { getEvent } from "../services/eventService";

// Mock missing imports
const useAuth = () => ({ user: null });
// Removed mock getEvent
import { getMediaUrl } from "../services/api";
const formatDate = (dateString) => {
  if (!dateString) return "Oct 24, 2024";
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return "Oct 24, 2024";
  }
};
const formatTime = (timeString) => {
  if (!timeString) return "10:00 AM";
  if (timeString.includes('T')) {
    const timePart = timeString.split('T')[1].substring(0, 5);
    const [h, m] = timePart.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  }
  try {
    const d = new Date(timeString);
    if (!isNaN(d)) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch (e) {}
  return timeString;
};
const getWhatsAppNumber = (event) => {
  const rawNumber = event?.contact?.whatsappNumber || event?.contact?.primaryNumber || event?.organizer?.contactNumber || "";
  return String(rawNumber).replace(/\D/g, "");
};

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const shareRef = useRef(null);
  const [dbEvent, setDbEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // mock target date for registration (e.g. 5 days from now)
    const target = new Date();
    target.setDate(target.getDate() + 5);
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!id) {
      setError("No event ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEvent(id);
        setDbEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        // share sheet close is handled inside EventHeader
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (loading) return <div className="flex justify-center mt-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (error) return <div className="text-center mt-32 text-red-500">{error}</div>;
  if (!dbEvent) return <div className="text-center mt-32">Event not found.</div>;

  // Transform backend format to UI format
  const startDateStr = dbEvent.startDate || "";
  const locationStr = dbEvent.venue ? `${dbEvent.venue.venueName || dbEvent.venue.city || "Online"}` : "";
  
  let venueStr = "";
  if (dbEvent.venue) {
    venueStr = [
      dbEvent.venue.venueName,
      dbEvent.venue.addressLine1,
      dbEvent.venue.city
    ].filter(Boolean).join(", ");
  }

  const isOnline = dbEvent.venue?.city?.toLowerCase() === "online" || 
                   dbEvent.venue?.venueName?.toLowerCase() === "online meeting" || 
                   venueStr.toLowerCase().includes("online");
                   
  const meetingLink = dbEvent.venue?.location || 
                      (dbEvent.venue?.venueName?.startsWith("http") ? dbEvent.venue.venueName : "");

  const displayLocationStr = isOnline ? "Online" : (dbEvent.venue ? `${dbEvent.venue.venueName || dbEvent.venue.city || "Online"}` : "");
  const displayVenueStr = isOnline ? "Online" : venueStr;

  const priceStr = dbEvent.tickets && dbEvent.tickets.length > 0 ? Math.min(...dbEvent.tickets.map(t => t.price)) : 0;
  
  const EVENT = {
    title: dbEvent.fairName || "Event",
    category: dbEvent.category || "General",
    date: formatDate(startDateStr),
    location: displayLocationStr,
    venue: displayVenueStr,
    isOnline: isOnline,
    meetingLink: meetingLink,
    venueOption: isOnline ? "online" : "address",
    startTime: `Starts at ${formatTime(startDateStr)}`,
    time: formatTime(startDateStr),
    price: priceStr,
    organizerId: dbEvent.organizer?._id,
    organizerName: dbEvent.organizerName || dbEvent.organizer?.name || "Organizer",
    followersCount: dbEvent.organizer?.followers?.length || 0,
    isFollowing: user ? (dbEvent.organizer?.followers || []).includes(user._id) : false,
    organizerEventsCount: 0,
    ticketButtonText: dbEvent.tickets?.[0]?.ticketButtonText || "Book Tickets Now",
  };

  // Extract images and videos
  let IMAGES = [];
  if (dbEvent.fairBanner) {
    IMAGES.push({ type: "image", url: getMediaUrl(dbEvent.fairBanner) });
  }

  // The backend might not have highlights in this exact schema, but we can pass hiring partners if needed.
  const hasHighlights = false; 
  
  const hasThingsToKnown = !!(dbEvent.whoCanApply && dbEvent.whoCanApply.length > 0);
  
  const hasFaqs = !!(dbEvent.faqs && dbEvent.faqs.length > 0);
  const hasInstructions = !!(dbEvent.instructions && dbEvent.instructions.trim());
  const hasTerms = !!(dbEvent.termAndConditions && dbEvent.termAndConditions.trim());
  const hasFaqsOrTerms = hasFaqs || hasInstructions || hasTerms;

  // Adapt backend description to what EventContent expects if needed.
  // We attach it to dbEvent for EventContent to read (it currently reads dbEvent.eventInfo?.description)
  // Let's ensure it maps correctly if EventContent expects eventInfo.
  const adaptedDbEvent = {
    ...dbEvent,
    eventInfo: {
      description: dbEvent.description,
      thingsToKnow: dbEvent.whoCanApply?.map(w => w.title) || [],
      faqs: dbEvent.faqs || [],
      instructions: dbEvent.instructions,
      termsText: dbEvent.termAndConditions
    },
    location: dbEvent.venue,
    isOnline: isOnline
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <div className="flex-1">
        <EventStickyNav 
          showHighlights={hasHighlights}
          showFaqs={hasFaqsOrTerms}
          showThingsToKnown={hasThingsToKnown}
          organizerWhatsAppNumber={dbEvent.contact?.whatsappNumber || ""}
          fairLogo={dbEvent.fairLogo}
          fairName={dbEvent.fairName}
          eventId={id}
          isOnline={isOnline}
          companyListDocument={dbEvent.companyListDocument}
          contact={dbEvent.contact}
        />

        <EventHeader
          event={EVENT}
          images={IMAGES}
          organizerWhatsAppNumber={dbEvent.contact?.whatsappNumber || ""}
          timeLeft={timeLeft}
          eventId={id}
        />



        <section>
          <div className="w-full max-w-300 mx-auto px-5 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <EventContent dbEvent={adaptedDbEvent} images={IMAGES} />
              {/* <EventSidebar event={EVENT} /> */}
            </div>
          </div>
        </section>
        
        <EventLocation organizer={dbEvent.organizer} dbEvent={adaptedDbEvent} />
      </div>

      {/* Floating WhatsApp Button */}
      {getWhatsAppNumber(dbEvent) && (
        <a 
          href={`https://wa.me/${getWhatsAppNumber(dbEvent)}?text=${encodeURIComponent("Hi, I am interested in this event.")}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-20 right-6 md:bottom-20 md:right-8 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all duration-300 z-50 flex items-center justify-center cursor-pointer"
          title="Chat with Organizer"
        >
          <IoLogoWhatsapp size={32} className="shrink-0" />
          <span className="ml-2.5 font-semibold text-[16px]">
            Get in touch
          </span>
        </a>
      )}
      
      
      <FloatingShareWidget 
        shareUrl={typeof window !== "undefined" ? window.location.href : ""} 
        eventTitle={dbEvent.fairName || "Event"} 
      />
    </div>
  );
};

export default EventPage;
