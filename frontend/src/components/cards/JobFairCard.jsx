import { useState, useMemo } from "react";
import { SERVER_URL } from "../../config";

const JobFairCard = ({ jobFair }) => {
  const [show, setShow] = useState(false);

  const {
    fairType,
    jobFairName,
    registrationDateTime,
    jobFairStart,
    jobFairEnd,
    jobRoles,
    companies,
    venue = {},
    jobFairId,
  } = jobFair;

  const handleClose = () => setShow(false);

  /* --------------------------------------------------------
     🧩 Auto status calculation logic
     -------------------------------------------------------- */
  const { isInactive, isRegistrationClosed, statusLabel, statusColor } = useMemo(() => {
    const now = new Date();
    const regDeadline = new Date(registrationDateTime);
    const endDate = new Date(jobFairEnd);

    if (now > endDate) {
      return {
        isInactive: true,
        isRegistrationClosed: false,
        statusLabel: "Inactive",
        statusColor: "text-gray-600 bg-gray-100",
      };
    } else if (now > regDeadline && now <= endDate) {
      return {
        isInactive: false,
        isRegistrationClosed: true,
        statusLabel: "Registration Closed",
        statusColor: "text-orange-600 bg-orange-100",
      };
    } else {
      return {
        isInactive: false,
        isRegistrationClosed: false,
        statusLabel: "Active",
        statusColor: "text-green-700 bg-green-100",
      };
    }
  }, [registrationDateTime, jobFairEnd]);

  /* --------------------------------------------------------
     🗓️ Format Dates
     -------------------------------------------------------- */
  const formattedDate = new Date(registrationDateTime).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  const formattedStartDate = new Date(jobFairStart).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  const jobFairLink = `${window.location.origin}/job-fair/${jobFairId}`;

  /* --------------------------------------------------------
     📲 Share & Copy logic
     -------------------------------------------------------- */
  const isOnline = venue?.city?.toLowerCase() === "online" || 
                   venue?.venueName?.toLowerCase() === "online meeting" ||
                   venue?.venueName?.toLowerCase().includes("online");

  const displayLocation = isOnline ? "Online" : 
                          (venue?.city && venue?.state ? `${venue.city}, ${venue.state}` : (venue?.city || venue?.venueName || "Location not available"));

  const shareOnWhatsApp = () => {
    const message = `🌟 Join the *${jobFairName}* Job Fair! 🌟\n\n📅 *Last Date to Register:* ${formattedDate}\n📍 *Venue:* ${displayLocation}\n\n🔗 Register now: ${jobFairLink}\n\nDon't miss this opportunity to connect with top employers! 🚀`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) setShow(true);
      else alert("Failed to copy link");
    } catch (err) {
      console.error("Fallback copy failed", err);
      alert("Clipboard not supported in this browser.");
    }
    document.body.removeChild(textArea);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(jobFairLink)
        .then(() => setShow(true))
        .catch(() => fallbackCopyToClipboard(jobFairLink));
    } else {
      fallbackCopyToClipboard(jobFairLink);
    }
  };

  const renderCopyModal = () => {
    if (!show) return null;
    
    return (
      <div 
        className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4"
        onClick={handleClose}
      >
        <div 
          className="relative w-full max-w-sm bg-white rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-0">
            <h3 className="w-full text-center text-xl font-semibold text-[#198754]">
              <i className="bi bi-check-circle-fill me-2 text-2xl"></i>
              Link Copied!
            </h3>
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
            >
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="p-4 text-center text-gray-500 py-3">
            The job fair link has been successfully copied to your clipboard.
            <br />
            You can now share it with your network or colleagues!
          </div>
          
          {/* Footer */}
          <div className="flex justify-center p-4 pt-0">
            <button 
              onClick={handleClose}
              className="px-4 py-2 text-white bg-[#198754] hover:bg-[#157347] border border-[#198754] rounded-full font-semibold transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* --------------------------------------------------------
     🖼️ Render Card
     -------------------------------------------------------- */
  return (
    <div
      className={`relative max-w-sm w-full rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white transition-all duration-300 ${
        isInactive || isRegistrationClosed ? "opacity-70" : "opacity-100"
      }`}
    >
      {/* Banner Area */}
      <div className="relative h-[96px] w-full bg-gradient-to-r from-indigo-900 to-cyan-600 flex items-start justify-between p-2">
<div>
       {fairType && (
  <div
    className="flex items-center gap-2 px-[10px] py-[2px] rounded-full text-[12px] font-semibold bg-gray-50"
  >
    {fairType}
  </div>
)}
  </div>

        {/* 🔹 Copy & Share icons (Top-Right) */}
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="bg-white/90 hover:bg-white text-gray-700 rounded-full py-[0px] px-[5px] shadow transition"
            title="Copy Link"
          >
            <i className="bi bi-clipboard"></i>
          </button>
          <button
            onClick={shareOnWhatsApp}
            className="bg-white/90 hover:bg-white text-gray-700 rounded-full py-[0px] px-[5px] shadow transition"
            title="Share"
          >
            <i className="bi bi-whatsapp text-green-600"></i>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 pt-[20px] pb-2">
        <div className="h-[105px] border-b border-gray-200">
          <div className="flex justify-center items-center bg-blue-100 text-blue-700 text-sm font-medium p-[8px] rounded-full mb-3">
            <i className={isOnline ? "bi bi-globe me-2 text-blue-600" : "bi bi-geo-alt-fill me-2 text-blue-600"}></i>
            {displayLocation}
          </div>

        <div className="pb-[12px] text-sm flex justify-between">
          {/* <span className="text-gray-600 font-medium">Job Fair:</span> */}
          <span className="text-blue-600 font-[700] text-[17px]">{jobFairName}</span>
        </div>
          </div>

        <div className="mt-[10px] grid grid-cols-2 gap-y-4 gap-x-[25px] text-sm">
          <div>
            <p className="text-gray-600 font-medium mb-[2px]">
              Registration End
            </p>
            <p className="font-semibold mb-0">{formattedDate}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-[2px]">Start Date</p>
            <p className="font-semibold mb-0">{formattedStartDate}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-[2px]">Companies</p>
            <p className="font-semibold mb-0">{companies}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium mb-[2px]">Job Roles</p>
            <p className="font-semibold mb-0">{jobRoles}</p>
          </div>
        </div>

        <div className="text-center mt-[15px] mb-[10px] flex justify-between items-center">

  {/* LEFT SIDE — Status Badge */}
  <div
    className={`flex items-center gap-2 px-[10px] py-[4px] rounded-full text-[12px] font-semibold ${statusColor}`}
  >
    <span
      className={`h-[8px] w-[8px] rounded-full ${
        isInactive
          ? "bg-gray-500"
          : isRegistrationClosed
          ? "bg-orange-500"
          : "bg-green-600"
      }`}
    ></span>
    {statusLabel}
  </div>

  {/* RIGHT SIDE — View Details */}
  <a
    href={`/job-fair/${jobFairId}`}
    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md font-medium transition-all"
  >
    View Details →
  </a>
</div>

      </div>

      {/* Overlay when registration closed or inactive */}
      {(isInactive || isRegistrationClosed) && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-lg font-semibold rounded-xl ${
            isInactive
              ? "bg-gray-100/80 text-gray-700"
              : "bg-orange-100/70 text-orange-700"
          }`}
        >
          {isInactive ? "Job Fair Inactive" : "Registration Closed"}
        </div>
      )}

      {renderCopyModal()}
    </div>
  );
};

export default JobFairCard;

