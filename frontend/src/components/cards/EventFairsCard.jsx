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
        if (event.venue.venueName && event.venue.venueName !== "Online Meeting") {
            locationStr = `${event.venue.venueName}, ${locationStr}`;
        }
        if (locationStr.toLowerCase().includes("online")) {
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
                                <h3 className="text-xl font-bold text-gray-900 mb-3 truncate">{event.fairName}</h3>

                                <div className="flex items-center gap-2.5 font-medium mb-2">
                                    <div className="flex items-center text-[14px] gap-1.5 text-gray-600">
                                        <Calendar size={15} />
                                        <span>{event.startDate ? formatDate(event.startDate) : "TBD"}</span>
                                    </div>

                                    <span className="text-gray-400">|</span>

                                    <div className="flex flex-1 min-w-0 items-center text-[14px] gap-1.5 text-gray-600">
                                        {isOnline ? <Globe className="shrink-0" size={16} /> : <IoLocation className="shrink-0" size={17} />}
                                        <span className="truncate">{locationStr}</span>
                                    </div>
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
                        <h3 className="text-[16px] font-bold text-primary mb-2 line-clamp-1">{event.fairName}</h3>
                        <p className="text-gray-500 text-[13.5px] mb-4 line-clamp-2">{plainDescription}</p>

                        <div className="flex items-center gap-3 mb-5 font-semibold">
                            <div className="flex items-center text-sm gap-1 text-gray-600 ">
                                <Calendar size={14} />
                                <span>{event.startDate ? formatDate(event.startDate) : "TBD"}</span>
                            </div>

                            <span className="text-sm">|</span>

                            <div className="flex flex-1 min-w-0 items-center text-sm gap-1 text-gray-600">
                                {isOnline ? <Globe size={14} className="shrink-0" /> : <IoLocation className="shrink-0" />}
                                <span className="line-clamp-1 ">{locationStr}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2">
                            <span className="font-semibold text-[19px] text-gray-900">{priceDisplay}</span>

                            <span className="group bg-secondary text-white font-medium py-1.5 pl-3 pr-1.5 rounded-4xl font-semibold text-sm  inline-flex items-center gap-2">View Details
                                <GoArrowUpRight size={16} strokeWidth={1} className="  text-white rounded-full  transition-transform duration-400 ease-in-out group-hover:rotate-47" />
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
