import { Link } from "react-router-dom";
import { Calendar, Globe } from "lucide-react";
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
    
    
    const plainDescription = event.description ? event.description.replace(/<[^>]+>/g, '') : "No description available.";
    
  
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
        if (event.jobRoles !== undefined && event.jobRoles !== null) return event.jobRoles;
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

    const jobLocationDisplay = (() => {
        let locs = [];
        if (Array.isArray(event.jobLocations) && event.jobLocations.length > 0) {
            locs = event.jobLocations.filter(Boolean);
        } else if (Array.isArray(event.hiringPartners) && event.hiringPartners.length > 0) {
            const partnerLocs = event.hiringPartners.map(hp => hp.location?.trim()).filter(Boolean);
            locs = [...new Set(partnerLocs)];
        }

        if (locs.length > 1) {
            return "PAN India";
        } else if (locs.length === 1) {
            return locs[0];
        }

        if (event.venue) {
            if (typeof event.venue === 'string' && event.venue.toLowerCase() !== 'online') return event.venue;
            const city = event.venue.city?.trim();
            const state = event.venue.state?.trim();
            if (city && state && city.toLowerCase() !== 'online') return `${city}, ${state}`;
            if (city && city.toLowerCase() !== 'online') return city;
            if (state && state.toLowerCase() !== 'online') return state;
        }

        return (locationStr && locationStr.toLowerCase() !== "online") ? locationStr : "PAN India";
    })();

    if (viewMode === 'list') {
        return (
            <>
                <Link to={`/event/${event._id}`} className="block w-full">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col md:flex-row h-full md:h-[220px] cursor-pointer relative">
                        
                        <div className="w-full md:w-[35%] h-48 md:h-full overflow-hidden relative shrink-0">
                            <img
                                src={bannerUrl}
                                alt={event.fairName}
                                className="w-full h-full object-fit transition-transform duration-500 hover:scale-105"
                            />
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
                        </div>

                       
                        <div className="p-6 flex flex-col flex-grow min-w-0 justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.fairName}</h3>

                                <div className="flex items-center justify-between text-[14px] font-medium mb-1">
                                    <div className="flex items-center gap-1.5 text-gray-600 min-w-0">
                                        <span className="text-black font-bold">Location :</span>
                                        <span className="truncate">{jobLocationDisplay}</span>
                                    </div>
                                    <div className="text-gray-600 font-semibold shrink-0">
                                        Companies: <span className="font-bold text-primary">{totalCompanies}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end text-[13px] font-semibold text-gray-500 mb-2">
                                    <span>Openings: <strong className="text-primary">{totalOpenings}</strong></span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <span className="font-bold text-[22px] text-[#292f56]">{priceDisplay}</span>

                                <span className="group bg-secondary text-white font-medium py-1.5 pl-3 pr-1.5 rounded-4xl font-semibold text-sm inline-flex items-center gap-2">
                                    View Details
                                    <GoArrowUpRight size={16} strokeWidth={1} className="text-white rounded-full transition-transform duration-400 ease-in-out group-hover:rotate-45" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                <ShareModal
                    isOpen={!!shareModalEventId}
                    onClose={() => setShareModalEventId(null)}
                    eventTitle={event.fairName || ""}
                    shareUrl={`${window.location.origin}/event/${shareModalEventId}`}
                />
            </>
        );
    }

    return (
        <>
            <Link to={`/event/${event._id}`} className="block w-full h-full">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full cursor-pointer relative">
                    <div className="h-48 overflow-hidden relative">
                        <img
                            src={bannerUrl}
                            alt={event.fairName}
                            className="w-full h-full object-fit transition-transform duration-500 hover:scale-101"
                        />


                        <div
                            className="absolute top-3 right-3 p-2 rounded-full cursor-pointer z-20 hover:scale-110 transition-transform bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShareModalEventId(event._id);
                            }}
                        >
                            <IoMdShare size={20} className="text-white" />
                        </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center text-sm gap-1 mb-2 text-gray-600 ">
                            <Calendar size={14} />
                            <span>{event.startDate ? formatDate(event.startDate) : "TBD"}</span>
                        </div>
                        <h3 className="text-[16px] font-bold text-primary mb-2">{event.fairName}</h3>

                        <div className="flex items-center justify-between gap-2 mb-1.5 text-sm font-semibold text-gray-600">
                            <div className="flex items-center gap-1 min-w-0">
                                <span className="text-black font-bold">Location :</span>
                                <span className="truncate">{jobLocationDisplay}</span>
                            </div>


                            <div className="shrink-0 text-right text-black font-bold">
                                Openings : <span className="font-semibold text-gray-600">{totalOpenings}</span>
                            </div>
                            
                        </div>

                        <div className="flex items-center justify-between text-sm font-bold text-black mb-4">
                            

                            <div className="">
                                Hiring companies : <span className="font-semibold text-gray-600">{totalCompanies}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-auto pt-2">
                            <span className="group bg-secondary text-white font-medium py-1.5 pl-3 pr-1.5 rounded-4xl font-semibold text-sm inline-flex items-center gap-2">View Details
                                <GoArrowUpRight size={16} strokeWidth={1} className="text-white rounded-full transition-transform duration-400 ease-in-out group-hover:rotate-47" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            <ShareModal
                isOpen={!!shareModalEventId}
                onClose={() => setShareModalEventId(null)}
                eventTitle={event.fairName || ""}
                shareUrl={`${window.location.origin}/event/${shareModalEventId}`}
            />
        </>
    );
};

export default EventFairsCard;
