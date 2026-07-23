import React, { useState } from 'react';
import { FaWhatsapp, FaXTwitter, FaInstagram, FaLinkedinIn, FaCopy, FaCheck } from "react-icons/fa6";
import { Mail, QrCode } from "lucide-react";

const FloatingShareWidget = ({ shareUrl, eventTitle }) => {
  const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
  const title = eventTitle || "Fair";
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareLinks = [
    { name: 'Whatsapp', icon: <FaWhatsapp size={20} />,href: `https://wa.me/?text=${encodedTitle} ${encodedUrl}` , bg: 'bg-[#25D366]' },
    { name: 'LinkedIn', icon: <FaLinkedinIn size={20} />, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, bg: 'bg-[#0077b5]' },
    { name: 'Instagram', icon: <FaInstagram size={20} />, href: 'https://instagram.com', bg: 'bg-[#E1306C]' },
    { name: 'X (Twitter)', icon: <FaXTwitter size={20} />, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, bg: 'bg-black' },
    
    { name: 'Email', icon: <Mail size={20} />, href: `mailto:?subject=${encodedTitle}&body=Check out this fair: ${encodedUrl}`, bg: 'bg-gray-600' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

   const downloadQRCode = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(shareUrl)}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeTitle = eventTitle ? eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'fair';
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
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex items-center">
      
      <div className="bg-white p-2.5 rounded-l-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col gap-3 min-w-[50px]">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full focus:outline-none flex flex-col items-center justify-center md:cursor-default"
          >
            <div className="hidden md:block text-primary font-bold text-[11px] uppercase text-center tracking-widest mb-1 mt-1">Share</div>
            <div className={`md:hidden text-primary transition-transform duration-300 ${isOpen ? 'opacity-80' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </div>
          </button>
          
          <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col gap-3 animate-in fade-in duration-300`}>
             {/* QR Code with Popout */}
          <div className="relative group/qr">
            <button 
              className="w-10 h-10 mx-auto rounded-full flex items-center justify-center bg-slate-700 text-white transition-all hover:bg-primary hover:scale-110 shadow-sm"
              title="QR Code"
            >
              <QrCode size={20} />
            </button>
            
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all duration-200 origin-right scale-95 group-hover/qr:scale-100 w-max">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}`} 
                alt="QR Code"
                className="w-[150px] h-[150px] min-w-[150px] object-contain rounded-lg mb-3 block" 
              />
              <button 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                downloadQRCode();
              }}
              className="bg-secondary text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {/* <QrCode size={16} /> */}
              Download QR Code
            </button>
            </div>
          </div>
            
          <button
            onClick={handleCopy}
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white transition-all shadow-sm ${copied ? 'bg-green-500' : 'bg-slate-700 hover:opacity-80 hover:scale-110'}`}
            title="Copy Link"
          >
            {copied ? <FaCheck size={18} /> : <FaCopy size={18} />}
          </button>

         
          
          {shareLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              title={link.name}
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white transition-all ${link.bg} hover:opacity-80 hover:scale-110 shadow-sm`}
            >
              {link.icon}
            </a>
          ))}

          
        </div>
      </div>
    </div>
  );
};

export default FloatingShareWidget;
