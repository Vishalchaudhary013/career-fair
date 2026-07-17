import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Calendar, User, LogOut } from "lucide-react";

const CreateEventHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const user = { userName: "Admin", workEmail: "admin@example.com" };
  const handleLogout = () => { console.log("Logged out (mock)") };
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
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

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-primary z-50 flex items-center justify-between px-6 shadow-sm">
      <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
        Career Fairs
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 cursor-pointer outline-none group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold text-sm border-2 border-white/20 group-hover:border-white/50 transition">
            {initial}
          </div>
          <ChevronDown size={14} className="text-white/70 group-hover:text-white transition" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-[260px] bg-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-150">
           
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
                <User size={16} /> MY PROFILE
              </Link>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-secondary transition uppercase border-t border-gray-50">
                <LogOut size={16} /> LOGOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CreateEventHeader;
