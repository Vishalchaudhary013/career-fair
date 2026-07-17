import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { Ticket, Calendar, User, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth(); 

  useEffect(() => {
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,pa,fr,es,de,zh,ja",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      };

      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (langCode) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      if (langCode === "en" && select.value !== "en") {
        select.value = "en";
      }
      select.dispatchEvent(new Event("change"));
    } else {
      if (langCode === "en") {
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" +
          window.location.hostname +
          "; path=/;";
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;
      }
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm transition-all ">
        <div className="w-full max-w-[1400px] mx-auto py-3 md:py-4 px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-8 lg:flex-1">
              <button className="md:hidden text-gray-700" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/" className="font-semibold text-[26px] text-primary">
                Career Fairs
              </Link>
            </div>
              
            <div className="hidden lg:flex items-center justify-center gap-6 md:gap-8 flex-1">
             
              <div className="relative group cursor-pointer py-4">
                <span className="font-medium text-[16px] text-gray-700 hover:text-primary transition-colors flex items-center gap-1">
                  Categories <ChevronDown size={16} />
                </span>
                <div className="absolute top-full left-0 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white rounded shadow-lg border border-gray-100 py-2 flex flex-col">
                    <Link to="/categories/technology" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Technology</Link>
                    <Link to="/categories/business" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Business</Link>
                    <Link to="/categories/arts" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Arts</Link>
                  </div>
                </div>
              </div>

              <div className="relative group cursor-pointer py-4">
                <span className="font-medium text-[16px] text-gray-700 hover:text-primary transition-colors flex items-center gap-1">
                  Find Events <ChevronDown size={16} />
                </span>
                <div className="absolute top-full left-0 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white rounded shadow-lg border border-gray-100 py-2 flex flex-col">
                    <Link to="/events/featured" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Featured Events</Link>
                    <Link to="/events/upcoming" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Upcoming Events</Link>
                    <Link to="/events/past" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Past Events</Link>
                  </div>
                </div>
              </div>

              
              <Link to="/calendar" className="font-medium text-[16px] text-gray-700 hover:text-primary transition-colors py-4">Calendar</Link>

              
              {/* <Link to="/gallery" className="font-medium text-[16px] text-gray-700 hover:text-primary transition-colors py-4">Gallery</Link> */}
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-4 md:gap-6 lg:flex-1">
              
              <div id="google_translate_element" style={{ display: "none" }}></div>
              <div className="text-[13px] font-medium flex items-center gap-2">
                <button
                  onClick={() => changeLanguage("en")}
                  className="hover:text-red-600 transition-colors"
                >
                  EN
                </button>
                <span className="text-[12px]">|</span>
                <button
                  onClick={() => changeLanguage("hi")}
                  className="hover:text-red-600 transition-colors"
                >
                  HIN
                </button>
              </div>
              
              <Link
                to="/create-event"
                className="hidden md:flex group relative items-center gap-2 overflow-hidden border border-black/45 py-1.5 px-6 rounded-4xl"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-secondary transition-transform duration-300 ease-out group-hover:scale-x-100" />
                <Ticket className="relative z-10 text-[#110053] transition-colors duration-300 group-hover:text-white"/>
                <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-white">Create Event</span>
              </Link>

              {user ? (
                <div className="relative group hidden md:block">
                  <div className="cursor-pointer hover:bg-gray-50 transition flex items-center justify-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white font-bold text-lg border-2 border-transparent group-hover:border-primary/20 transition">
                      {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </div>
                  </div>
                  
                  <div className="absolute right-0 top-full pt-4 w-[240px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded shadow-2xl border border-gray-200 py-3 flex flex-col">
                      <Link to={user?.role === "SUPER_ADMIN" ? "/super-admin-dashboard" : `/admin-dashboard/${user.id}`} className="px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors font-medium">Dashboard</Link>
                      {/* <Link to="/profile" className="px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors font-medium">Manage Profile</Link> */}
                      <hr className="my-2 border-gray-100" />
                      <button onClick={handleLogout} className="px-5 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors font-medium">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group hidden md:block">
                  <div className="cursor-pointer hover:bg-gray-50 transition flex items-center justify-center">
                    <FaRegUser  className="text-[28px] text-gray-800" />
                  </div>
                  
                  <div className="absolute right-0 top-full pt-4 w-[320px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded shadow-2xl border border-gray-200 p-6">
                      <h3 className="text-[22px] font-medium text-gray-800 mb-2">Dashboard</h3>
                      <p className="text-[15px] text-gray-600 mb-6 leading-relaxed">
                        Log in or sign up to access your dashboard
                      </p>
                      <div className="flex items-center gap-3 w-full">
                        <Link 
                          to="/login" 
                          className="flex-1 py-2.5 px-4 text-center border-2 border-gray-800 text-gray-900 font-semibold text-sm hover:bg-gray-50 transition"
                        >
                          Log in
                        </Link>
                        <Link 
                          to="/signup" 
                          className="flex-1 py-2.5 px-4 text-center bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition"
                        >
                          Sign up
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          
          {showMobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 flex flex-col gap-4 pb-2">
              
              <div className="flex flex-col gap-2">
                <div className="px-2 py-1 text-gray-700 font-medium">Categories</div>
                <div className="flex flex-col pl-4 gap-2 border-l-2 border-gray-100 ml-4">
                  <Link to="/categories/technology" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Technology</Link>
                  <Link to="/categories/business" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Business</Link>
                  <Link to="/categories/arts" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Arts</Link>
                </div>
                
                <div className="px-2 py-1 text-gray-700 font-medium mt-2">Find Events</div>
                <div className="flex flex-col pl-4 gap-2 border-l-2 border-gray-100 ml-4">
                  <Link to="/events/featured" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Featured Events</Link>
                  <Link to="/events/upcoming" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Upcoming Events</Link>
                  <Link to="/events/past" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Past Events</Link>
                </div>
              </div>

              <Link to="/calendar" className="flex items-center gap-3 px-2 py-2 mt-2 text-gray-700 font-medium" onClick={() => setShowMobileMenu(false)}>
                <Calendar size={18} className="text-primary" /> Event Calendar
              </Link>
              <Link to="/gallery" className="flex items-center gap-3 px-2 py-2 text-gray-700 font-medium" onClick={() => setShowMobileMenu(false)}>
                Gallery
              </Link>
              <Link to="/create-event" className="flex items-center gap-3 px-2 py-2 text-gray-700 font-medium" onClick={() => setShowMobileMenu(false)}>
                <Ticket size={18} className="text-primary" /> Create Event
              </Link>
              
              {user ? (
                <>
                  <Link to={user?.role === "SUPER_ADMIN" ? "/super-admin-dashboard" : "/admin-dashboard"} className="flex items-center gap-3 px-2 py-2 text-gray-700 font-medium" onClick={() => setShowMobileMenu(false)}>
                    <User size={18} className="text-primary" /> Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="flex items-center gap-3 px-2 py-2 text-red-600 font-medium text-left">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 w-full mt-2">
                  <Link to="/login" className="flex-1 py-2 px-4 text-center border-2 border-gray-800 rounded text-gray-900 font-semibold text-sm hover:bg-gray-50 transition" onClick={() => setShowMobileMenu(false)}>
                    Log in
                  </Link>
                  <Link to="/signup" className="flex-1 py-2 px-4 text-center bg-primary rounded hover:bg-primary/90 text-white font-semibold text-sm transition" onClick={() => setShowMobileMenu(false)}>
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
