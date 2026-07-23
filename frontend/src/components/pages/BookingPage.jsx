import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getEvent } from "../services/eventService";
import { FaArrowLeft } from "react-icons/fa";
import { Inbox, Users } from "lucide-react";
import { formatDate, formatTime } from "../../utils/dateFormatter";

const getEventTitle = (event) => event?.basicInfo?.title || event?.fairName || "Fair";
const getEventDate = (event) => event?.basicInfo?.startDate || event?.startDate;
const getEventTime = (event) => {
  if (event?.basicInfo?.startTime) return event.basicInfo.startTime;
  if (event?.startDate) {
    const date = new Date(event.startDate);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  }
  return '';
};
const getEventVenue = (event) => {
  const venue = event?.location || event?.venue || {};
  return venue.venueName || venue.city || "Venue TBA";
};

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dbEvent, setDbEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const [quantities, setQuantities] = useState({});
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        setDbEvent(data);
      } catch (err) {
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="flex justify-center mt-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (error || !dbEvent) return <div className="text-center mt-32 text-red-500">{error || "Fair not found"}</div>;

  const title = getEventTitle(dbEvent);
  const startDate = formatDate(getEventDate(dbEvent));
  const startTime = formatTime(getEventTime(dbEvent));
  const venue = getEventVenue(dbEvent);
  
  const tickets = dbEvent.tickets || [];

  const handleAdd = (ticketId) => {
    setQuantities(prev => ({ ...prev, [ticketId]: 1 }));
  };

  const handleIncrement = (ticketId) => {
    setQuantities(prev => ({ ...prev, [ticketId]: (prev[ticketId] || 0) + 1 }));
  };

  const handleDecrement = (ticketId) => {
    setQuantities(prev => {
      const newQty = Math.max(0, (prev[ticketId] || 0) - 1);
      const newState = { ...prev };
      if (newQty === 0) {
        delete newState[ticketId];
      } else {
        newState[ticketId] = newQty;
      }
      return newState;
    });
  };

  const totalItems = Object.values(quantities).reduce((acc, curr) => acc + curr, 0);
  let totalPrice = 0;
  Object.entries(quantities).forEach(([tId, qty]) => {
    const t = tickets.find(t => t._id === tId);
    if (t) totalPrice += (t.price || 0) * qty;
  });

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col font-sans">
      
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <FaArrowLeft className="text-gray-600 text-sm" />
            </button>
            <h1 className="text-xl font-bold text-primary">{title}</h1>
          </div>
          <div className="ml-11 text-sm text-gray-500 font-medium mt-1">
            {startDate} | {startTime} IST Onwards | {venue}
          </div>
        </div>
      </div>

      
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
        
          <div className="lg:col-span-8">
            {tickets.length === 0 ? (
              <p className="text-gray-500">No tickets available for this event.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {tickets.map(ticket => {
                  const qty = quantities[ticket._id] || 0;
                  const priceDisplay = ticket.price > 0 ? `₹${ticket.price}` : "FREE";
                  
                  return (
                    <div key={ticket._id} className="flex justify-between items-center border-b border-gray-200 pb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-1">
                          {!ticket.name || ticket.name.toLowerCase() === 'general admission' ? title : ticket.name}
                        </h3>
                        <p className="text-gray-600 font-medium">{priceDisplay}</p>
                      </div>
                      
                      <div>
                        {qty === 0 ? (
                          <button 
                            onClick={() => handleAdd(ticket._id)}
                            className="border border-primary text-primary hover:bg-primary/5 transition-colors font-semibold px-6 py-1.5 rounded text-sm"
                          >
                            + ADD
                          </button>
                        ) : (
                          <div className="flex items-center border border-primary rounded overflow-hidden">
                            <button 
                              onClick={() => handleDecrement(ticket._id)}
                              className="px-3 py-1.5 text-primary hover:bg-primary/10 transition-colors font-bold"
                            >
                              -
                            </button>
                            <span className="px-4 py-1.5 text-primary font-semibold text-sm">
                              {qty}
                            </span>
                            <button 
                              onClick={() => handleIncrement(ticket._id)}
                              className="px-3 py-1.5 text-primary hover:bg-primary/10 transition-colors font-bold"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        
          <div className="lg:col-span-4">
            {totalItems === 0 ? (
              <div className="border border-gray-200 rounded flex flex-col items-center justify-center py-16 bg-white shadow-sm">
                <div className="text-gray-300 mb-3">
                  <Inbox size={48} strokeWidth={1} />
                </div>
                <p className="text-gray-500 font-medium">No Items Added</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded bg-white shadow-sm overflow-hidden flex flex-col">
                <div className="p-5">
                  <h3 className="text-xs font-bold text-gray-500 mb-4 tracking-wider uppercase">Summary</h3>
                  
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-gray-600 font-medium">Price ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                    <span className="text-gray-600">{totalPrice > 0 ? `₹${totalPrice}` : "FREE"}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-300 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">Total Amount</span>
                    <span className="font-bold text-primary">{totalPrice > 0 ? `₹${totalPrice}` : "FREE"}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/fair/${id}/attendee-details`, { 
                    state: { 
                      fair: dbEvent,
                      quantities, 
                      totalPrice, 
                      totalItems, 
                      tickets,
                      selectedTickets: Object.entries(quantities)
                        .filter(([, qty]) => qty > 0)
                        .map(([ticketId, quantity]) => {
                          const ticket = tickets.find((item) => item._id === ticketId);
                          return {
                            ticketId,
                            name: ticket?.name || ticket?.ticketName || "Ticket",
                            price: Number(ticket?.price || 0),
                            quantity
                          };
                        })
                    } 
                  })}
                  className="bg-gradient-to-r from-primary to-[#2a108a] hover:opacity-95 transition-all text-white py-3.5 px-4 flex justify-between items-center w-full mt-auto"
                >
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span className="font-semibold">{totalItems}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold tracking-wide text-sm">PROCEED</span>
                    <span className="font-bold">›</span>
                  </div>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;
