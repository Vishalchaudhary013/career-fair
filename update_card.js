const fs = require('fs');

const filePath = '/Users/apple/Desktop/Career-Fairs/frontend/src/components/cards/EventFairsCard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// We will overwrite the entire file with a new version that matches the screenshot design.
const newContent = `import { Link } from "react-router-dom";
import { Calendar, MapPin, Monitor, Briefcase, Building, Users } from "lucide-react";
import { IoLocation } from "react-icons/io5";
import { IoMdShare } from "react-icons/io";
import { GoArrowUpRight } from "react-icons/go";
import ShareModal from "../section/ShareModal";
import { useState } from "react";
import { getMediaUrl } from "../services/api";
import { formatDate } from "../../utils/dateFormatter";

const EventFairsCard = ({ event, viewMode = 'grid' }) => {
    const [shareModalEventId, setShareModalEventId] = useState(null);

    if (!event) return null;

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
            if (c && s) return \`\${c}, \${s}\`;
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
            priceDisplay = \`\${currency} \${minPrice}+\`;
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

    const totalJobRoles = (() => {
        if (event.jobRoles !== undefined && event.jobRoles !== null) return event.jobRoles;
        return 0;
    })();

    const formatTime = (timeStr) => {
        if (!timeStr) return "";
        try {
            const [hours, minutes] = timeStr.split(":");
            const h = parseInt(hours, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const formattedH = h % 12 || 12;
            return \`\${formattedH}:\${minutes} \${ampm}\`;
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

    if (viewMode === 'list') {
        return (
            <>
                <Link to={\`/event/\${event._id}\`} className="block w-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col md:flex-row h-full md:h-[220px] cursor-pointer relative group">
                        
                        <div className="w-full md:w-[35%] h-48 md:h-full overflow-hidden relative shrink-0 p-3">
                            <div className="w-full h-full rounded-xl overflow-hidden relative">
                                <img
                                    src={bannerUrl}
                                    alt={event.fairName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <ShareButton />
                            </div>
                        </div>
                       
                        <div className="p-5 md:p-6 flex flex-col flex-grow min-w-0 justify-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
                                <Calendar size={16} />
                                <span>{dateDisplay} {timeDisplay && \` • \${timeDisplay}\`}</span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-2 truncate">{event.fairName}</h3>

                            <div className="flex items-center gap-2 text-gray-500 mb-5 text-sm">
                                <IoLocation size={18} className="shrink-0" />
                                <span className="truncate">{fullLocation}</span>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Openings</p>
                                        <p className="text-base font-bold text-gray-800">{totalOpenings > 0 ? \`\${totalOpenings}+\` : 'TBD'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Companies</p>
                                        <p className="text-base font-bold text-gray-800">{totalCompanies > 0 ? \`\${totalCompanies}+\` : 'TBD'}</p>
                                    </div>
                                </div>

                                <div className="bg-[#ef4444] text-white font-medium py-2 pl-4 pr-2 rounded-full text-sm inline-flex items-center gap-3 group-hover:bg-red-600 transition shadow-sm">
                                    <span className="font-bold">View Details</span>
                                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0">
                                        <GoArrowUpRight size={16} strokeWidth={1} className="text-[#ef4444] transition-transform duration-300 group-hover:rotate-45" />
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
                    shareUrl={\`\${window.location.origin}/fair/\${shareModalEventId}\`}
                />
            </>
        );
    }

    return (
        <>
            <Link to={\`/event/\${event._id}\`} className="block w-full h-full">
                <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer relative group">
                    
                    {/* Banner Image Area */}
                    <div className="h-[200px] p-3 pb-0 relative shrink-0">
                        <div className="w-full h-full rounded-2xl overflow-hidden relative">
                            <img
                                src={bannerUrl}
                                alt={event.fairName}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <ShareButton />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-grow">
                        
                        <div className="flex items-center text-[15px] font-medium gap-2 text-gray-500 mb-3">
                            <Calendar size={18} />
                            <span>{dateDisplay} {timeDisplay && \` • \${timeDisplay}\`}</span>
                        </div>
                        
                        <h3 className="text-[22px] leading-tight font-bold text-[#1e293b] mb-3 line-clamp-2">
                            {event.fairName}
                        </h3>

                        <div className="flex items-start gap-2 text-gray-500 mb-6 text-[14.5px]">
                            <IoLocation size={20} className="shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{fullLocation}</span>
                        </div>

                        {/* Top Stats Grid */}
                        <div className="flex items-center mb-5 pb-5 border-b border-gray-100">
                            {/* Mode */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <Monitor size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] text-gray-500 font-medium">Mode</p>
                                    <p className="text-[15px] font-semibold text-gray-800 truncate">{isOnline ? 'Virtual' : 'In-Person'}</p>
                                </div>
                            </div>
                            
                            <div className="w-px h-10 bg-gray-100 mx-4 shrink-0"></div>
                            
                            {/* Location City */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] text-gray-500 font-medium">Location</p>
                                    <p className="text-[15px] font-semibold text-gray-800 truncate">{cityState}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stats Grid */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                    <Users size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 font-medium leading-none mb-1">Openings</p>
                                    <p className="text-[15px] font-bold text-gray-800 leading-none">{totalOpenings > 0 ? \`\${totalOpenings}+\` : 'TBD'}</p>
                                </div>
                            </div>

                            <div className="w-px h-8 bg-gray-100 shrink-0"></div>

                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                    <Building size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 font-medium leading-none mb-1">Companies</p>
                                    <p className="text-[15px] font-bold text-gray-800 leading-none">{totalCompanies > 0 ? \`\${totalCompanies}+\` : 'TBD'}</p>
                                </div>
                            </div>

                            <div className="w-px h-8 bg-gray-100 shrink-0"></div>

                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                    <Briefcase size={16} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 font-medium leading-none mb-1">Job Roles</p>
                                    <p className="text-[15px] font-bold text-gray-800 leading-none">{totalJobRoles > 0 ? \`\${totalJobRoles}+\` : 'TBD'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto flex justify-end pt-2">
                            <div className="bg-[#ef4444] text-white font-medium py-2.5 pl-5 pr-2.5 rounded-full text-[15px] inline-flex items-center gap-3 group-hover:bg-red-600 transition-colors shadow-md">
                                <span className="font-bold tracking-wide">View Details</span>
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
                                    <GoArrowUpRight size={18} strokeWidth={1} className="text-[#ef4444] transition-transform duration-300 group-hover:rotate-45" />
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
                shareUrl={\`\${window.location.origin}/fair/\${shareModalEventId}\`}
            />
        </>
    );
};

export default EventFairsCard;
`

fs.writeFileSync(filePath, newContent);
console.log("Updated EventFairsCard");
