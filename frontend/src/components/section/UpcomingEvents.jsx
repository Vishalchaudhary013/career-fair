import { RiArrowRightLongFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import EventFairsCard from "../cards/EventFairsCard";

const UpcomingEvents = ({ events = [] }) => {
    const activeEvents = events.filter(event => {
        if (!event.endDate) return true;
        const endDate = new Date(event.endDate);
        // Set end date to end of the day to ensure it includes the whole day
        endDate.setHours(23, 59, 59, 999);
        return endDate >= new Date();
    });

    return (
        <>
            <div className="bg-gray-100">
                <div className="max-w-[1400px] w-full mx-auto py-20 px-4">
                    <div className="flex flex-row justify-between items-center gap-4 mb-8">
                        <div className="flex flex-col">
                            <h2 className="text-xl md:text-2xl font-semibold text-primary">Upcoming Fairs</h2>
                            <span className="hidden md:block text-gray-600 mt-1">Don't miss out on what's happening soon near you</span>
                        </div>
                        <Link to="/events" className="flex shrink-0 items-center gap-1.5 text-primary font-semibold border border-2 rounded-lg px-3 py-1 text-sm md:text-base hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer">
                            View All
                            <RiArrowRightLongFill />
                        </Link>
                    </div>

                    <div className="flex overflow-x-auto gap-6 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory hide-scrollbar">
                        {activeEvents.length > 0 ? (
                            activeEvents.map(event => (
                                <div key={event._id} className="w-[340px] sm:w-[380px] md:w-auto shrink-0 snap-center md:snap-align-none">
                                    <EventFairsCard event={event} />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">No upcoming fairs available at the moment.</p>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default UpcomingEvents