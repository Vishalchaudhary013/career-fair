import { useEffect, useState, useRef } from "react";
import { Home, Calendar, User as UserIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config";



const useAuth = () => ({ user: null, handleLogout: () => {} });

const navItems = [
  { id: "thingsToKnown", label: "Eligibility" },
  { id: "about", label: "Details" },
  { id: "highlights", label: "Highlights" },
  { id: "gallery", label: "Gallery" },
  { id: "faqs", label: "FAQs & Terms" },
  { id: "venue", label: "Venue" },
];

const EventStickyNav = ({ showHighlights, showGallery, showFaqs, showThingsToKnown, organizerWhatsAppNumber, fairLogo, fairName, eventId, isOnline, companyListDocument, contact, isPast }) => {
  const [activeId, setActiveId] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const contactDropdownRef = useRef(null);
  
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(e.target)) {
        setShowContactDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const onLogout = () => {
    handleLogout();
    navigate("/login");
  };

  const displayName = user?.userName || user?.workEmail || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const filteredItems = navItems.filter((item) => {
    if (item.id === "highlights" && !showHighlights) return false;
    if (item.id === "gallery" && !showGallery) return false;
    if (item.id === "faqs" && !showFaqs) return false;
    if (item.id === "thingsToKnown" && !showThingsToKnown) return false;
    if (item.id === "venue" && isOnline) return false;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      
      for (const item of filteredItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = item.id;
          }
        }
      }
      
      if (current) {
        setActiveId(current);
      } else if (window.scrollY < 200) {
        setActiveId("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredItems]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveId(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveId("");
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all py-4">
      <div className="w-full max-w-350 mx-auto flex justify-between items-center px-4">
        
       
        <div className="">
          <Link to="/" className="flex items-center gap-3">
            {fairLogo ? (
              <img
                src={`${SERVER_URL}/uploads/logo/${fairLogo}`}
                alt={fairName || "Fair Logo"}
                className="h-12 max-w-40 object-contain"
              />
            ) : (
              <img src="/logo-cf.png" alt="Career Fairs" className="h-12 object-contain" />
            )}
          </Link>
        </div>

        
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={scrollToTop}
            className={`text-gray-500 hover:text-primary transition pb-1 ${activeId === "" ? "text-primary border-b-2 border-primary" : "border-b-2 border-transparent"}`}
          >
            <Home size={22} />
          </button>
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center">
              <span className="text-gray-300 mr-5 mb-1 select-none">|</span>
              <button
                onClick={() => scrollTo(item.id)}
                className={`font-medium pb-1 transition-colors duration-200  ${
                  activeId === item.id 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-500 hover:text-primary border-b-2 border-transparent"
                }`}
              >
                {item.label}
              </button>
            </div>
          ))}
          
          {companyListDocument && (
            <div className="flex items-center">
              <span className="text-gray-300 mr-5 mb-1 select-none">|</span>
              <a 
                href={`${SERVER_URL}/uploads/files/${companyListDocument}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium pb-1 transition-colors duration-200 text-gray-500 hover:text-primary border-b-2 border-transparent cursor-pointer"
              >
                Company List
              </a>
            </div>
          )}

          <div className="flex items-center relative" ref={contactDropdownRef}>
            <span className="text-gray-300 mr-5 mb-1 select-none">|</span>
            <button 
              onClick={() => setShowContactDropdown(!showContactDropdown)}
              className={`font-medium pb-1 transition-colors duration-200 ${showContactDropdown ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-primary border-b-2 border-transparent"}`}
            >
              Contact Number
            </button>

            {showContactDropdown && (
              <div className="absolute top-[calc(100%+12px)] left-0 w-72 bg-white rounded-lg shadow-xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150 cursor-default">
                <h4 className="font-semibold text-slate-800 text-[15px] uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Contact Details</h4>
                <div className="space-y-4">
                  {contact?.primaryNumber && (
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1">Primary Number</span>
                      <span className="font-medium text-slate-700 text-[15px]">{contact.primaryNumber}</span>
                    </div>
                  )}
                  {contact?.whatsappNumber && (
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1">WhatsApp Number</span>
                      <span className="font-medium text-slate-700 text-[15px]">{contact.whatsappNumber}</span>
                    </div>
                  )}
                  {contact?.additionalNumber1 && (
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1">Additional Number</span>
                      <span className="font-medium text-slate-700 text-[15px]">{contact.additionalNumber1}</span>
                    </div>
                  )}
                  {contact?.additionalNumber2 && (
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1">Additional Number 2</span>
                      <span className="font-medium text-slate-700 text-[15px]">{contact.additionalNumber2}</span>
                    </div>
                  )}
                  {contact?.additionalNumber3 && (
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1">Additional Number 3</span>
                      <span className="font-medium text-slate-700 text-[15px]">{contact.additionalNumber3}</span>
                    </div>
                  )}
                  {contact?.email && (
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1">Email Address</span>
                      <span className="font-medium text-slate-700 text-[15px]">{contact.email}</span>
                    </div>
                  )}
                  {!contact && (
                    <div className="text-sm text-gray-500 italic">No contact details provided.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
         
          
          {isPast ? (
            <button 
              disabled 
              className="bg-gray-300 text-gray-500 px-6 py-2.5 rounded-full font-semibold cursor-not-allowed"
            >
              Registration Closed
            </button>
          ) : user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 cursor-pointer outline-none group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg border-2 border-transparent group-hover:border-primary/20 transition">
                  {initial}
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-65 bg-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.workEmail}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary transition uppercase">
                      <Calendar size={16} /> ORGANIZING EVENTS
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary transition uppercase border-t border-gray-50">
                      <UserIcon size={16} /> MY PROFILE
                    </Link>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-red-600 transition uppercase border-t border-gray-50">
                      <LogOut size={16} /> LOGOUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to={eventId ? `/event/${eventId}/attendee-details` : "/login"} className="relative bg-[#ff4a4a] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#ff3333] transition-colors flex items-center gap-2">
              Register Now
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm uppercase">
              Free
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventStickyNav;
