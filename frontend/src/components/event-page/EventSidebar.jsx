import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiLocationOn, CiCalendarDate } from "react-icons/ci";
import { IndianRupee } from "lucide-react";


import ShareModal from "../../components/section/ShareModal";

const ORGANIZER_IMG = "data:image/jpeg;base64,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";

const EventSidebar = ({ event }) => {
  const [isFollowing, setIsFollowing] = useState(event.isFollowing);
  const [followersCount, setFollowersCount] = useState(event.followersCount);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!event.organizerId) return;
    try {
      setLoading(true);
      const res = await toggleFollowUser(event.organizerId);
      setIsFollowing(res.isFollowing);
      setFollowersCount(res.followerCount);
    } catch (err) {
      console.error("Follow error:", err);
      alert(err.message || "Please log in to follow an organizer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-1 lg:col-span-4">
    
    <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow rounded-2xl p-7 mb-10">
      <div className="flex gap-3 items-center mb-5 text-gray-700">
        <div className="bg-indigo-50 p-2 rounded-full text-primary"><CiLocationOn size={28} /></div>
        <p className="text-[16px] font-medium leading-tight">
          {event.venueOption === "online" ? "Online" : event.venue}
        </p>
      </div>
      <div className="flex gap-3 items-center mb-6 text-gray-700">
        <div className="bg-indigo-50 p-2 rounded-full text-primary"><CiCalendarDate size={28} /></div>
        <p className="text-[16px] font-medium">{event.startTime}</p>
      </div>
      <div className="border border-gray-100 mb-6" />
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-0.5 text-gray-800">
          {event.price > 0 ? (
            <>
              <IndianRupee size={22} />
              <p className="text-2xl font-bold">
                {event.price} <span className="text-[13px] font-medium text-gray-500 ml-1">onwards</span>
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold ">Free</p>
          )}
        </div>
        <Link 
          to={`/event/${event._id || window.location.pathname.split('/').pop()}/attendee-details`}
          className="bg-secondary hover:opacity-95 hover:shadow-lg hover:-translate-y-0.5 transition-all text-white py-3 px-8 rounded-xl text-[16px] font-semibold cursor-pointer text-center"
        >
          {event.ticketButtonText || "Register Now"}
        </Link>
      </div>
    </div>

   

    <ShareModal 
      inline={true} 
      eventTitle={event?.title || "Event"} 
      shareUrl={typeof window !== 'undefined' ? window.location.href : ''} 
    />

    
    {/* <h2 className="text-2xl font-semibold mb-5 text-primary mt-10">Organized by</h2>
    <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 mb-8 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <img src={ORGANIZER_IMG} alt="Organizer" className="border border-black/15 p-1 w-20 h-20 object-contain overflow-hidden rounded-full" />
        <div className="py-2 flex-1">
          <div className="mb-3">
            <h2 className="text-2xl font-medium flex-1 break-all">{event.hostName || "Organizer"}</h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-1 gap-4">
            <div className="flex gap-5">
              <div className="flex flex-col"><span className="text-xs font-semibold text-black/55">Followers</span><span className="text-[16px]">{followersCount}</span></div>
              <span className="text-black/25">|</span>
              <div className="flex flex-col"><span className="text-xs font-semibold text-black/55">Event</span><span className="text-[16px]">{event.organizerEventsCount || 0}</span></div>
            </div>
            <button 
              onClick={handleFollow}
              disabled={loading}
              className={`hover:shadow-md transition-all text-white py-1.5 px-6 rounded-lg font-semibold text-sm cursor-pointer disabled:opacity-50 ${isFollowing ? "bg-gray-800 hover:bg-gray-700" : "bg-secondary hover:opacity-90"}`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      </div>
    </div> */}
     
  </div>
  );
};

export default EventSidebar;
