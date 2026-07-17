import React, { useState } from "react";
import { Link2, Video } from "lucide-react";
import { BsCameraVideoFill } from "react-icons/bs";

const VirtualJoiningTab = ({ venueName, setVenueName, city, setCity }) => {
  const [platform, setPlatform] = useState(() => {
    if (venueName?.toLowerCase()?.includes("zoom")) return "zoom";
    if (venueName?.toLowerCase()?.includes("teams")) return "teams";
    if (venueName?.toLowerCase()?.includes("meet")) return "meet";
    return "custom";
  });

  const [link, setLink] = useState(() => {
    if (venueName?.startsWith("http")) return venueName;
    return "";
  });

  const handlePlatformChange = (p) => {
    setPlatform(p);
    if (p === "meet") {
      setVenueName("Google Meet");
    } else if (p === "zoom") {
      setVenueName("Zoom Meeting");
    } else if (p === "teams") {
      setVenueName("Microsoft Teams");
    } else {
      setVenueName("Custom Platform");
    }
  };

  const handleLinkChange = (e) => {
    const val = e.target.value;
    setLink(val);
    setVenueName(val || (platform === "meet" ? "Google Meet" : platform === "zoom" ? "Zoom Meeting" : platform === "teams" ? "Microsoft Teams" : "Virtual"));
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-semibold text-primary mb-2">Joining Details</h3>
        <p className="text-xs text-gray-500 font-medium">Configure how your attendees will join your online event.</p>
      </div>

      
      <div>
        <label className="block text-sm font-semibold text-gray-850 mb-3">Select Meeting Platform</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          
          <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${platform === "meet" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
            <input 
              type="radio" 
              name="platform" 
              value="meet" 
              checked={platform === "meet"} 
              onChange={() => handlePlatformChange("meet")}
              className="sr-only" 
            />
            <svg viewBox="0 -22.5 256 256" className="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg">
              <g>
                <polygon fill="#00832D" points="144.82,105.32 169.78,133.85 203.34,155.29 209.18,105.50 203.34,56.83 169.14,75.67"></polygon>
                <path d="M0,150.66 L0,193.09 C0,202.78 7.86,210.64 17.55,210.64 L59.98,210.64 L68.77,178.59 L59.98,150.66 L30.87,141.87 L0,150.66 Z" fill="#0066DA"></path>
                <polygon fill="#E94235" points="59.98,0 0,59.98 30.88,68.75 59.98,59.98 68.61,32.44"></polygon>
                <polygon fill="#2684FC" points="0,150.68 59.98,150.68 59.98,59.98 0,59.98"></polygon>
                <path d="M241.66,25.40 L203.34,56.83 L203.34,155.29 L241.82,186.85 C247.58,191.36 256.00,187.25 256.00,179.93 L256.00,32.18 C256.00,24.78 247.38,20.68 241.66,25.40" fill="#00AC47"></path>
                <path d="M144.82,105.32 L144.82,150.66 L59.98,150.66 L59.98,210.64 L185.79,210.64 C195.48,210.64 203.34,202.78 203.34,193.09 L203.34,155.29 L144.82,105.32 Z" fill="#00AC47"></path>
                <path d="M185.79,0 L59.98,0 L59.98,59.98 L144.82,59.98 L144.82,105.32 L203.34,56.83 L203.34,17.55 C203.34,7.86 195.48,0 185.79,0" fill="#FFBA00"></path>
              </g>
            </svg>
            <span className="text-xs font-semibold text-gray-700">Google Meet</span>
          </label>

         
          <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${platform === "zoom" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
            <input 
              type="radio" 
              name="platform" 
              value="zoom" 
              checked={platform === "zoom"} 
              onChange={() => handlePlatformChange("zoom")}
              className="sr-only" 
            />
            <svg viewBox="0 0 24 24" className="w-8 h-8 mb-2" xmlns="http://www.w3.org/2000/svg">
              <path fill="#2D8CFF" d="M20.4,5.6l-4.8,3.2V6c0-1.1-0.9-2-2-2H4c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h9.6c1.1,0,2-0.9,2-2v-2.8l4.8,3.2 c0.3,0.2,0.6,0.2,0.9,0.1c0.3-0.1,0.5-0.3,0.6-0.6V6.1c0-0.3-0.2-0.6-0.5-0.8C21.1,5.4,20.7,5.4,20.4,5.6z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-700">Zoom</span>
          </label>

          
          <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${platform === "teams" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
            <input 
              type="radio" 
              name="platform" 
              value="teams" 
              checked={platform === "teams"} 
              onChange={() => handlePlatformChange("teams")}
              className="sr-only" 
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="#6264A7">
              <path d="M20.625 8.127q-.55 0-1.025-.205-.475-.205-.832-.563-.358-.357-.563-.832Q18 6.053 18 5.502q0-.54.205-1.02t.563-.837q.357-.358.832-.563.474-.205 1.025-.205.54 0 1.02.205t.837.563q.358.357.563.837.205.48.205 1.02 0 .55-.205 1.025-.205.475-.563.832-.357.358-.837.563-.48.205-1.02.205zm0-3.75q-.469 0-.797.328-.328.328-.328.797 0 .469.328.797.328.328.797.328.469 0 .797-.328.328-.328.328-.797 0-.469-.328-.797-.328-.328-.797-.328zM24 10.002v5.578q0 .774-.293 1.46-.293.685-.803 1.194-.51.51-1.195.803-.686.293-1.459.293-.445 0-.908-.105-.463-.106-.85-.329-.293.95-.855 1.729-.563.78-1.319 1.336-.756.557-1.67.861-.914.305-1.898.305-1.148 0-2.162-.398-1.014-.399-1.805-1.102-.79-.703-1.312-1.664t-.674-2.086h-5.8q-.411 0-.704-.293T0 16.881V6.873q0-.41.293-.703t.703-.293h8.59q-.34-.715-.34-1.5 0-.727.275-1.365.276-.639.75-1.114.475-.474 1.114-.75.638-.275 1.365-.275t1.365.275q.639.276 1.114.75.474.475.75 1.114.275.638.275 1.365t-.275 1.365q-.276.639-.75 1.113-.475.475-1.114.75-.638.276-1.365.276-.188 0-.375-.024-.188-.023-.375-.058v1.078h10.875q.469 0 .797.328.328.328.328.797zM12.75 2.373q-.41 0-.78.158-.368.158-.638.434-.27.275-.428.639-.158.363-.158.773 0 .41.158.78.159.368.428.638.27.27.639.428.369.158.779.158.41 0 .773-.158.364-.159.64-.428.274-.27.433-.639.158-.369.158-.779 0-.41-.158-.773-.159-.364-.434-.64-.275-.275-.639-.433-.363-.158-.773-.158zM6.937 9.814h2.25V7.94H2.814v1.875h2.25v6h1.875zm10.313 7.313v-6.75H12v6.504q0 .41-.293.703t-.703.293H8.309q.152.809.556 1.5.405.691.985 1.19.58.497 1.318.779.738.281 1.582.281.926 0 1.746-.352.82-.351 1.436-.966.615-.616.966-1.43.352-.815.352-1.752zm5.25-1.547v-5.203h-3.75v6.855q.305.305.691.452.387.146.809.146.469 0 .879-.176.41-.175.715-.48.304-.305.48-.715t.176-.879Z"/>
            </svg>
            <span className="text-xs font-semibold text-gray-700">Teams</span>
          </label>

          
          <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${platform === "custom" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
            <input 
              type="radio" 
              name="platform" 
              value="custom" 
              checked={platform === "custom"} 
              onChange={() => handlePlatformChange("custom")}
              className="sr-only" 
            />
            <Link2 size={24} className="text-gray-500 mb-2" />
            <span className="text-xs font-semibold text-gray-700">Custom Link</span>
          </label>
        </div>
      </div>

      
      <div className="space-y-5 w-full">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Joining Link / Meeting URL</label>
          <div className="relative">
            <Video className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`e.g. ${platform === "meet" ? "https://meet.google.com/abc-defg-hij" : platform === "zoom" ? "https://zoom.us/j/123456789" : "https://yourlink.com"}`}
              value={link} 
              onChange={handleLinkChange} 
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Event Region / City (For local targeting)</label>
          <input 
            type="text" 
            placeholder="e.g. Online, Bengaluru, Mumbai" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" 
          />
        </div>
      </div>

      
    </div>
  );
};

export default VirtualJoiningTab;
