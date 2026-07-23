import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Monitor, Building, Users, X, ShieldCheck, LucideHandshake, ArrowRight, Mail } from "lucide-react";
import { IoLocation } from "react-icons/io5";
import { IoMdShare } from "react-icons/io";
import { GoArrowUpRight } from "react-icons/go";
import ShareModal from "../section/ShareModal";
import { useState } from "react";
import { getMediaUrl } from "../services/api";
import { formatDate } from "../../utils/dateFormatter";
import useAuth from "../hooks/useAuth";

const EventFairsCard = ({ event, viewMode = 'grid' }) => {
    const navigate = useNavigate();
    const [shareModalEventId, setShareModalEventId] = useState(null);
    const { sendOtp, verifyOtp, loading, isAuthenticated } = useAuth();
    
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [step, setStep] = useState("EMAIL");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    if (!event) return null;

    const handlePostJobClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) {
            navigate('/employer-dashboard', { state: { openPostJobFor: event } });
        } else {
            setStep("EMAIL");
            setEmail("");
            setOtp("");
            setErrorMsg("");
            setShowOtpModal(true);
        }
    };

    const handleSendOtpSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        if (!email.trim()) return;

        try {
            const res = await sendOtp({ email: email.trim(), role: "EMPLOYER" });
            if (res?.alreadyVerified) {
                setShowOtpModal(false);
                navigate('/employer-dashboard', { state: { openPostJobFor: event } });
                return;
            }
            setStep("OTP");
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Failed to send OTP. Please try again.");
        }
    };

    const handleVerifyOtpSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        if (!otp.trim()) return;

        try {
            await verifyOtp({ email: email.trim(), otp: otp.trim(), role: "EMPLOYER" });
            setShowOtpModal(false);
            navigate('/employer-dashboard', { state: { openPostJobFor: event } });
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
        }
    };

    const bannerUrl = event.fairBanner ? getMediaUrl(event.fairBanner) : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    const logoUrl = event.fairLogo ? getMediaUrl(event.fairLogo) : null;
    
    let locationStr = "Online / Remote";
    let isOnline = false;

    if (typeof event.venue === 'string') {
        locationStr = "Online";
        isOnline = true;
    } else if (event.venue && event.venue.city) {
        locationStr = event.venue.city;
        if (locationStr.toLowerCase().includes("online")) {
            isOnline = true;
            locationStr = "Online";
        }
    } else if (event.venue && event.venue.venueName) {
        locationStr = event.venue.venueName;
        if (locationStr.toLowerCase().includes("online") || locationStr === "Online Meeting") {
            isOnline = true;
            locationStr = "Online";
        }
    }

    const cityState = (() => {
        if (isOnline) return "Online";
        if (event.venue && typeof event.venue !== 'string') {
            const c = event.venue.city?.trim();
            const s = event.venue.state?.trim();
            if (c && s) return `${c}, ${s}`;
            if (c) return c;
            if (s) return s;
        }
        return locationStr;
    })();

    const fullLocation = (() => {
        if (isOnline) return "Online / Remote";
        if (event.venue && typeof event.venue !== 'string') {
            const parts = [event.venue.venueName, event.venue.city, event.venue.state, event.venue.country].filter(Boolean);
            if (parts.length > 0) return parts.join(", ");
        }
        return locationStr;
    })();

    let priceDisplay = "Free";
    if (event.tickets && event.tickets.length > 0) {
        const hasPaid = event.tickets.some(t => t.category === "Paid" && t.price > 0);
        if (hasPaid) {
            const minPrice = Math.min(...event.tickets.filter(t => t.price > 0).map(t => t.price));
            const currency = event.tickets[0]?.currency || "INR";
            priceDisplay = `${currency} ${minPrice}+`;
        }
    }

    const totalOpenings = (() => {
        if (event.totalOpenings !== undefined && event.totalOpenings !== null) return event.totalOpenings;
        if (event.openings !== undefined && event.openings !== null) return event.openings;
        if (Array.isArray(event.hiringPartners) && event.hiringPartners.length > 0) {
            const sum = event.hiringPartners.reduce((acc, hp) => acc + (Number(hp.candidatesRequired) || 0), 0);
            return sum > 0 ? sum : event.hiringPartners.length;
        }
        return 0;
    })();

    const totalCompanies = (() => {
        if (event.totalCompanies !== undefined && event.totalCompanies !== null) return event.totalCompanies;
        if (event.companies !== undefined && event.companies !== null) return event.companies;
        if (Array.isArray(event.hiringPartners)) return event.hiringPartners.length;
        return 0;
    })();


    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        try {
            const [hours, minutes] = timeStr.split(":");
            const h = parseInt(hours, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const formattedH = h % 12 || 12;
            return `${formattedH}:${minutes} ${ampm}`;
        } catch {
            return timeStr;
        }
    };

    const dateDisplay = event.startDate ? formatDate(event.startDate) : "TBD";
    const timeDisplay = event.basicInfo?.startTime ? formatTime(event.basicInfo.startTime) : "";
    
    // Shared Share Button
    const ShareButton = () => (
        <div
            className="absolute top-3 right-3 p-2 rounded-full cursor-pointer z-20 hover:scale-110 transition-transform bg-black/30 hover:bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShareModalEventId(event._id);
            }}
        >
            <IoMdShare size={18} className="text-white" />
        </div>
    );

    const OtpModalUI = showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowOtpModal(false); setStep("EMAIL"); }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#110060]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#110060]">
                        Employer Signup / Login
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-3">
                        {step === "EMAIL" ? "Welcome to Career Fairs" : "Verify OTP"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === "EMAIL" 
                            ? "Enter your email to receive a verification code" 
                            : `We sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl text-center">
                        {errorMsg}
                    </div>
                )}

                {step === "EMAIL" ? (
                    <form onSubmit={handleSendOtpSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 text-left">Email Address</label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-[#110060] focus:bg-white text-gray-800 font-medium"
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500 text-left">
                                New users will receive a one-time OTP for email verification.
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !email.trim()}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#8a8da8] py-3.5 text-sm font-semibold text-white transition hover:bg-[#8a8da8]/90 disabled:opacity-50 cursor-pointer shadow-md"
                        >
                            {loading ? "Logging in..." : "Log In"}
                            <ArrowRight size={16} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 text-left">Enter 6-Digit OTP</label>
                            <div className="relative">
                                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-center text-xl tracking-[0.4em] font-bold outline-none transition focus:border-[#110060] focus:bg-white text-gray-800"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00875a] py-3.5 text-sm font-semibold text-white transition hover:bg-[#00875a]/90 disabled:opacity-50 cursor-pointer shadow-md"
                        >
                            {loading ? "Verifying..." : "Verify & Continue"}
                            <ArrowRight size={16} />
                        </button>
                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStep("EMAIL"); setOtp(""); setErrorMsg(""); }}
                                className="text-xs font-semibold text-[#110060] hover:underline cursor-pointer"
                            >
                                Change Email / Resend OTP
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );

    if (viewMode === 'list') {
        return (
            <>
                <Link to={`/event/${event._id}`} className="block w-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col md:flex-row h-full md:h-[220px] cursor-pointer relative group">
                        
                        <div className="w-full md:w-[35%] h-48 md:h-full overflow-hidden relative shrink-0 ">
                            <div className="w-full h-full rounded-l-xl overflow-hidden relative">
                                <img
                                    src={bannerUrl}
                                    alt={event.fairName}
                                    className="w-full h-full object-fit transition-transform duration-700 group-hover:scale-105"
                                />
                                <ShareButton />
                            </div>
                        </div>
                       
                        <div className="p-3 md:p-4 flex flex-col flex-grow min-w-0 justify-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
                                <Calendar size={16} />
                                <span>{dateDisplay} {timeDisplay && ` • ${timeDisplay}`}</span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-2 break-words">{event.fairName}</h3>

                            <div className="flex items-center gap-2 text-gray-500 mb-5 text-sm">
                                <IoLocation size={18} className="shrink-0" />
                                <span className="break-words">{fullLocation}</span>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex gap-6">
                                     <div>
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Mode</p>
                                        <p className="text-base font-bold text-gray-800">{isOnline ? 'Virtual' : 'In-Person'}</p>
                                    </div>
                                     <div>
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Location</p>
                                        <p className="text-base font-bold text-gray-800">{cityState}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Job Openings</p>
                                        <p className="text-base font-bold text-gray-800">{totalOpenings > 0 ? `${totalOpenings}+` : 'TBD'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Hiring Companies</p>
                                        <p className="text-base font-bold text-gray-800">{totalCompanies > 0 ? `${totalCompanies}+` : 'TBD'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-3">
                                    <div className="relative group/btn cursor-pointer min-w-[110px]" onClick={handlePostJobClick}>
                                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-widest z-10 whitespace-nowrap border border-gray-100 bg-secondary text-white transition-transform group-hover/btn:-translate-y-0.5">
                                            Employer
                                        </div>
                                        <div className="rounded-xl p-2 pt-3.5 shadow-md text-white bg-[#1b223c] flex justify-center group-hover/btn:bg-[#2a324b] transition-colors text-center border border-gray-800">
                                            <span className="font-bold text-[13px]">Post Job</span>
                                        </div>
                                    </div>
                                    <div className="relative group/btn cursor-pointer min-w-[110px]" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/event/${event._id}/attendee-details`); }}>
                                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-widest z-10 whitespace-nowrap border border-gray-100 bg-secondary text-white transition-transform group-hover/btn:-translate-y-0.5">
                                            Candidate
                                        </div>
                                        <div className="rounded-xl p-2 pt-3.5 shadow-md text-white bg-[#1b223c] flex justify-center group-hover/btn:bg-[#2a324b] transition-colors text-center border border-gray-800">
                                            <span className="font-bold text-[13px]">Register</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                <ShareModal
                    isOpen={!!shareModalEventId}
                    onClose={() => setShareModalEventId(null)}
                    eventTitle={event.fairName || ""}
                    shareUrl={`${window.location.origin}/fair/${shareModalEventId}`}
                />
                {OtpModalUI}
            </>
        );
    }

    return (
        <>
            <Link to={`/event/${event._id}`} className="block w-full h-full">
                <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer relative group">
                    
                    {/* Banner Image Area */}
                    <div className="h-[250px] relative shrink-0">
                        <div className="w-full h-full rounded-t-xl overflow-hidden relative">
                            <img
                                src={bannerUrl}
                                alt={event.fairName}
                                className="w-full h-full object-fit transition-transform duration-700 group-hover:scale-105"
                            />
                            <ShareButton />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-grow">
                        
                        <div className="flex items-center text-[15px] font-medium gap-2 text-gray-500 mb-3">
                            <Calendar size={18} />
                            <span>{dateDisplay} {timeDisplay && ` • ${timeDisplay}`}</span>
                        </div>
                        
                        <h3 className="text-[22px] leading-tight font-bold text-[#1e293b] mb-3 break-words ">
                            {event.fairName}
                        </h3>

                        <div className="flex items-start gap-2 text-gray-500 mb-6 text-[14.5px]">
                            <IoLocation size={20} className="shrink-0 mt-0.5" />
                            <span className="whitespace-nowrap overflow-hidden">{fullLocation}</span>
                        </div>

                        {/* Top Stats Grid */}
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-5 pt-5 pb-5 border-b border-t border-gray-100 gap-x-2">
                            {/* Mode */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <Monitor size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] text-gray-500 font-medium">Mode</p>
                                    <p className="text-[15px] font-semibold text-gray-800 whitespace-nowrap">{isOnline ? 'Virtual' : 'In-Person'}</p>
                                </div>
                            </div>
                            
                            <div className="w-px h-10 bg-gray-100 mx-4 shrink-0"></div>
                            
                            {/* Location City */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] text-gray-500 font-medium">Location</p>
                                    <p className="text-[15px] font-semibold text-gray-800 whitespace-nowrap">{cityState}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stats Grid */}
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-3 gap-x-2 pb-5 border-b  border-gray-100">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                    <Users size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] text-gray-500 font-medium leading-none mb-1">Job Openings</p>
                                    <p className="text-[15px] font-bold text-gray-800 leading-none whitespace-nowrap">{totalOpenings > 0 ? `${totalOpenings}+` : 'TBD'}</p>
                                </div>
                            </div>

                            <div className="w-px h-10 bg-gray-100 mx-4 shrink-0"></div>

                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                    <Building size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] text-gray-500 font-medium leading-none mb-1">Hiring Companies</p>
                                    <p className="text-[15px] font-bold text-gray-800 leading-none whitespace-nowrap">{totalCompanies > 0 ? `${totalCompanies}+` : 'TBD'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto grid grid-cols-2 gap-4 pt-5 pb-1">
                            {/* Employer Button */}
                            <div className="relative group/btn cursor-pointer" onClick={handlePostJobClick}>
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-widest z-10 whitespace-nowrap border border-gray-100 bg-secondary text-white transition-transform group-hover/btn:-translate-y-0.5">
                                    Employer
                                </div>
                                <div className="rounded-xl p-2.5 pt-4 shadow-md text-white bg-[#1b223c] flex justify-center group-hover/btn:bg-[#2a324b] transition-colors text-center border border-gray-800">
                                    <span className="font-bold text-[14px]">Post Job</span>
                                </div>
                            </div>

                            {/* Candidate Button */}
                            <div className="relative group/btn cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/event/${event._id}/attendee-details`); }}>
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-widest z-10 whitespace-nowrap border border-gray-100 bg-secondary text-white transition-transform group-hover/btn:-translate-y-0.5">
                                    Candidate
                                </div>
                                <div className="rounded-xl p-2.5 pt-4 shadow-md text-white bg-[#1b223c] flex justify-center group-hover/btn:bg-[#2a324b] transition-colors text-center border border-gray-800">
                                    <span className="font-bold text-[14px]">Register</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Link>

            <ShareModal
                isOpen={!!shareModalEventId}
                onClose={() => setShareModalEventId(null)}
                eventTitle={event.fairName || ""}
                shareUrl={`${window.location.origin}/fair/${shareModalEventId}`}
            />
            {OtpModalUI}
        </>
    );
};

export default EventFairsCard;
