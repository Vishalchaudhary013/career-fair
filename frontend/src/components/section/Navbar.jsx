import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { Ticket, Calendar, User, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import OtpModal from "./OtpModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER");
  const [currentLang, setCurrentLang] = useState("en");
  const { user, logout } = useAuth(); 

  useEffect(() => {
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,pa,ta,te,bn,mr,gu,kn,ml",
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
    
    // Read current language from cookie
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    } else {
      setCurrentLang("en");
    }
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
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
      <div className="fixed top-0 left-0 w-full z-50 transition-all ">
       
        <div className="bg-white border-b border-gray-200">
          <div className="w-full max-w-[1400px] mx-auto py-1.5 px-4 flex justify-end items-center gap-4 sm:gap-6 text-[12px] sm:text-[13px] text-gray-700">
            <div id="google_translate_element" style={{ display: "none" }}></div>
            <div className="font-medium flex items-center gap-2">
              <span className="text-gray-600">Language:</span>
              <select 
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent border border-gray-300 rounded px-2 py-0.5 outline-none focus:border-primary text-gray-800 font-medium cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="pa">Punjabi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="bn">Bengali</option>
                <option value="mr">Marathi</option>
                <option value="gu">Gujarati</option>
                <option value="kn">Kannada</option>
                <option value="ml">Malayalam</option>
              </select>
            </div>
            
            {/* <div className="w-[1px] h-3.5 bg-gray-300 hidden sm:block"></div> */}
            {/* <Link to="/signup?type=employer" className="hover:text-primary font-medium transition-colors">
                  Post Job
                </Link> */}
            {!user && (
              <div className="flex items-center gap-4 sm:gap-6">
                <button 
                  onClick={() => { setSelectedRole("EMPLOYER"); setShowOtpModal(true); }}
                  className="hover:text-primary font-medium transition-colors"
                >
                  Register as Employer
                </button>
                <div className="w-[1px] h-3.5 bg-gray-300 hidden sm:block"></div>
                <button 
                  onClick={() => { setSelectedRole("USER"); setShowOtpModal(true); }}
                  className="hover:text-primary font-medium transition-colors"
                >
                  Register as Jobseeker
                </button>
              </div>
            )}
          </div>
        </div>

       
        <div className="bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="w-full max-w-[1400px] mx-auto py-1 md:py-1.5 px-4">
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
                    
                    <Link to="/events?type=Job" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Job Fairs</Link>
                    <Link to="/events?type=Internship" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Internship Fairs</Link>
                    <Link to="/events?type=Apprenticeship" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Apprenticeship Fairs</Link>
                  </div>
                </div>
              </div>

              <div className="relative group cursor-pointer py-4">
                <span className="font-medium text-[16px] text-gray-700 hover:text-primary transition-colors flex items-center gap-1">
                  Find Fairs <ChevronDown size={16} />
                </span>
                <div className="absolute top-full left-0 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white rounded shadow-lg border border-gray-100 py-2 flex flex-col">
                    <Link to="/events?filter=upcoming" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Upcoming Fairs</Link>
                    <Link to="/events?filter=past" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">Past Fairs</Link>
                  </div>
                </div>
              </div>

              
              <Link to="/calendar" className="font-medium text-[16px] text-gray-700 hover:text-primary transition-colors py-4">Calendar</Link>

              
              {/* <Link to="/gallery" className="font-medium text-[16px] text-gray-700 hover:text-primary transition-colors py-4">Gallery</Link> */}
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-4 md:gap-6 lg:flex-1">
              
              <Link
                to="/create-event"
                className="hidden md:flex group relative items-center gap-2 overflow-hidden border border-black/45 py-1.5 px-6 rounded-4xl"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-secondary transition-transform duration-300 ease-out group-hover:scale-x-100" />
                <Ticket className="relative z-10 text-[#110053] transition-colors duration-300 group-hover:text-white"/>
                <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-white">Create Fair</span>
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
                      {(user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.role === "EMPLOYER") && (
                        <Link to={
                          user?.role === "SUPER_ADMIN" 
                            ? "/super-admin-dashboard" 
                            : user?.role === "EMPLOYER"
                            ? "/employer-dashboard"
                            : `/admin-dashboard/${user.id || ""}`
                        } className="px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors font-medium">Dashboard</Link>
                      )}
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
                  <Link to="/events?type=Internship" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Internship Fairs</Link>
                  <Link to="/events?type=Job" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Job Fairs</Link>
                  <Link to="/events?type=Apprenticeship" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Apprenticeship Fairs</Link>
                </div>
                
                <div className="px-2 py-1 text-gray-700 font-medium mt-2">Find Fairs</div>
                <div className="flex flex-col pl-4 gap-2 border-l-2 border-gray-100 ml-4">
                  <Link to="/events?filter=upcoming" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Upcoming Fairs</Link>
                  <Link to="/events?filter=past" className="text-gray-600 text-sm" onClick={() => setShowMobileMenu(false)}>Past Fairs</Link>
                </div>
              </div>

              <Link to="/calendar" className="flex items-center gap-3 px-2 py-2 mt-2 text-gray-700 font-medium" onClick={() => setShowMobileMenu(false)}>
                <Calendar size={18} className="text-primary" /> Fair Calendar
              </Link>
              <Link to="/gallery" className="flex items-center gap-3 px-2 py-2 text-gray-700 font-medium" onClick={() => setShowMobileMenu(false)}>
                Gallery
              </Link>
              <Link to="/create-event" className="flex items-center gap-3 px-2 py-2 text-gray-700 font-medium" onClick={() => setShowMobileMenu(false)}>
                <Ticket size={18} className="text-primary" /> Create Fair
              </Link>
              
              {user ? (
                <>
                  {(user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.role === "EMPLOYER") && (
                    <Link to={
                      user?.role === "SUPER_ADMIN" 
                        ? "/super-admin-dashboard" 
                        : user?.role === "EMPLOYER"
                        ? "/employer-dashboard"
                        : `/admin-dashboard/${user.id || ""}`
                    } className="flex items-center gap-3 px-2 py-2 text-gray-700 font-medium" onClick={() => setShowMobileMenu(false)}>
                      <User size={18} className="text-primary" /> Dashboard
                    </Link>
                  )}
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
      </div>
      <OtpModal 
        isOpen={showOtpModal} 
        onClose={() => setShowOtpModal(false)} 
        defaultRole={selectedRole} 
      />
    </>
  );
};

export default Navbar;
