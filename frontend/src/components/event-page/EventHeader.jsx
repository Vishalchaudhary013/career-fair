import { useRef, useState } from "react";
import { IoClose, IoShareSocialSharp, IoLogoWhatsapp } from "react-icons/io5";
import { Mail, QrCode, Link as LucideLink, Globe, Clock, ShieldCheck } from "lucide-react";
import { FaAngleRight } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";
import { FaFacebookF, FaWhatsapp, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { MdDateRange, MdOutlineLocationOn, MdTimer } from "react-icons/md";
import { Map } from "lucide-react";
import EventGallery from "./EventGallery";
import { Link } from "react-router";
import ShareModal from "../../components/section/ShareModal";
import { IoMdLink } from "react-icons/io";

import { useNavigate } from "react-router-dom";

const EventHeader = ({ event, images, organizerWhatsAppNumber, timeLeft, eventId }) => {
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("Share Link");
  const [emailInput, setEmailInput] = useState("");
  const shareRef = useRef(null);
  const navigate = useNavigate();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { }
  };

  const downloadQRCode = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shareUrl)}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeTitle = event.title ? event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'event';
      a.download = `${safeTitle}-qr-code.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR code", error);
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shareUrl)}`, "_blank");
    }
  };

  return (
    <div>
   
      <div className="w-full">
        <EventGallery images={images} />
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-5 pt-6 md:pt-10 pb-6">
        

        
        <div className="flex flex-col md:flex-row justify-between w-full md:items-start gap-4">
         <div className="w-full md:w-auto">
            <h2 className="text-2xl md:text-[36px] font-bold mb-4 text-primary leading-tight">{event.title}</h2>
            <div className="space-y-1 mb-2">
              <div className="flex items-center gap-4">

                <span className="text-[16px] font-medium inline-flex gap-1.5 items-center"><MdDateRange size={22} />{event.date} </span>
                <span className="text-[16px] font-medium">|</span>

                <span className="text-[16px] font-medium inline-flex gap-1.5 items-center"><Clock size={18} />{event.time}</span>


              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {(() => {
                  const isOnline = event.isOnline;
                  const meetingLink = event.meetingLink;
                  
                  let platformName = "Virtual Event";
                  let platformIcon = <MdOutlineLocationOn size={22} className="text-primary" />;

                  if (isOnline) {
                    platformName = "Online";
                    platformIcon = <Globe size={20} className="text-[#110053]" />;
                  }

                  return (
                    <>
                      <div className="flex items-center gap-1.5 text-gray-700 ">
                        {platformIcon}
                        <span className="text-[16px] font-medium  tracking-wide">
                          {isOnline ? platformName : event.location}
                        </span>
                      </div>
                      {isOnline ? (
                        meetingLink && (
                          <div className="flex items-center gap-4">
                            <span className="text-[16px]">|</span>
                            <a
                            href={meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 font-semibold text-white border border-primary/20 rounded-4xl py-1 px-3 bg-primary  transition-all"
                          >
                            <IoMdLink size={18} />
                            <span className="text-[14px]">Join the Fair</span>
                          </a>
                          </div>
                        )
                      ) : (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue || event.location || "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 border border-gray-200 rounded-4xl py-1 px-5 font-medium  hover:shadow-sm transition-all text-gray-700 bg-[#D3F7E1]"
                        >
                          <Map size={16} className="text-primary" />
                          <span className="text-[14px] ">Find On Maps</span>
                        </a>
                      )}
                    </>
                  );
                })()}
              </div> 
            </div>
          </div>

          
          <div className="w-full md:w-[380px] shrink-0 mt-6 md:mt-0 relative">
           
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-4 py-1 rounded-full shadow-md uppercase tracking-widest z-10 whitespace-nowrap border border-gray-100 bg-secondary text-white">
              Registration Closes In
            </div>
            
            <div className="bg-[#1b223c] rounded-xl p-6 pt-7 shadow-xl text-white">
              <div className="grid grid-cols-4 gap-3 ">
                <div className="bg-[#2a324b] py-3 px-2 rounded-lg text-center">
                  <span className="text-2xl font-bold block leading-none mb-1">{timeLeft?.days || 0}</span>
                  <span className="text-xs text-gray-300 font-medium">Days</span>
                </div>
                <div className="bg-[#2a324b] py-3 px-2 rounded-lg text-center">
                  <span className="text-2xl font-bold block leading-none mb-1">{timeLeft?.hours || 0}</span>
                  <span className="text-xs text-gray-300 font-medium">Hours</span>
                </div>
                <div className="bg-[#2a324b] py-3 px-2 rounded-lg text-center">
                  <span className="text-2xl font-bold block leading-none mb-1">{timeLeft?.minutes || 0}</span>
                  <span className="text-xs text-gray-300 font-medium">Minutes</span>
                </div>
                <div className="bg-[#2a324b] py-3 px-2 rounded-lg text-center">
                  <span className="text-2xl font-bold block leading-none mb-1">{timeLeft?.seconds || 0}</span>
                  <span className="text-xs text-gray-300 font-medium">Seconds</span>
                </div>
              </div>
              
              {/* <button
                onClick={() => navigate(`/jobfair/${eventId}/register`)}
                className="w-full bg-[#ff4a4a] hover:bg-[#ff3333] text-white py-3 rounded-lg font-bold text-[16px] transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <i className="bi bi-person-plus text-lg"></i> Register Now
              </button> */}
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
