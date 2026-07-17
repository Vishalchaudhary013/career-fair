import { Info, Pencil, Trash2, Plus, X } from "lucide-react";
import DateTimePicker from "./DateTimePicker";

const TicketsTab = ({
  ticketButtonText, setTicketButtonText,
  tickets,
  showTicketForm, setShowTicketForm,
  editingTicketIndex,
  ticketName, setTicketName,
  ticketCategory, setTicketCategory,
  totalQuantity, setTotalQuantity,
  minBooking, setMinBooking,
  maxBooking, setMaxBooking,
  ticketStartDate, setTicketStartDate,
  ticketStartTime, setTicketStartTime,
  ticketEndDate, setTicketEndDate,
  ticketEndTime, setTicketEndTime,
  ticketPrice, setTicketPrice,
  ticketCurrency, setTicketCurrency,
  handleCreateTicket,
  editTicket,
  deleteTicket,
  resetTicketForm,
}) => {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-10 max-w-4xl">
      
      <div className="mb-8 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
        <label className="block text-sm font-semibold text-gray-800 mb-2">Registration Button Name</label>
        <p className="text-xs text-gray-500 mb-4">Set the text for the button attendees will click to book tickets for this event.</p>
        <input 
          type="text" 
          placeholder="e.g. Book Tickets, Register Now, RSVP" 
          value={ticketButtonText} 
          onChange={(e) => setTicketButtonText(e.target.value)} 
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" 
        />
      </div>

      
      {!showTicketForm && tickets.length > 0 ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              {tickets.map((t, i) => (
                <div key={i} className="relative bg-white flex rounded-md border border-dashed border-primary overflow-hidden" style={{ borderBottomStyle: "solid", borderBottomWidth: "2px" }}>
                  <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f8f9fa] rounded-full border border-dashed border-primary border-r-transparent hidden md:block" />
                  <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#f8f9fa] rounded-full border border-dashed border-primary border-l-transparent hidden md:block" />
                  <div className="flex-1 p-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center justify-between z-10">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-700 text-lg">{t.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Starts {t.startDate} - Ends {t.endDate}</p>
                    </div>
                    <div className="text-sm text-gray-600 px-6 font-medium mt-3 md:mt-0">{t.totalQuantity} Ticket(s)</div>
                    <div className="text-sm text-gray-600 px-6 min-w-[100px] text-left md:text-center mt-1 md:mt-0 font-medium">
                      {t.category === "Free" ? "Free" : `${t.currency} ${t.price}`}
                    </div>
                  </div>
                  <div className="w-px border-l border-dashed border-primary my-4 z-10 hidden md:block" />
                  <div className="flex items-center gap-6 px-6 md:px-8 z-10 bg-white md:bg-transparent">
                    <button onClick={() => editTicket(i)} className="text-primary hover:text-primary/90 transition cursor-pointer"><Pencil size={18} /></button>
                    <button onClick={() => deleteTicket(i)} className="text-primary hover:text-primary/90 transition cursor-pointer"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setShowTicketForm(true)} className="w-full border-2 border-dashed border-primary/30 text-primary rounded-2xl py-16 flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary transition cursor-pointer bg-white">
            <Plus size={32} className="mb-2" />
            <span className="font-semibold text-base">Add Ticket</span>
          </button>
        </div>
      ) : (
        
        <div className="relative">
          {tickets.length > 0 && (
            <button onClick={() => { setShowTicketForm(false); resetTicketForm(); }} className="absolute top-0 right-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition cursor-pointer">
              <X size={20} />
            </button>
          )}

          <div className="space-y-8">
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Ticket Name</label>
              <input type="text" placeholder="Enter Tickets name" value={ticketName} onChange={(e) => setTicketName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
            </div>

            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Ticket Category</label>
              <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
                <button onClick={() => setTicketCategory("Paid")} className={`px-10 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${ticketCategory === "Paid" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>Paid</button>
                <button onClick={() => setTicketCategory("Free")} className={`px-10 py-2.5 text-sm font-semibold transition-colors cursor-pointer border-l border-gray-200 ${ticketCategory === "Free" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>Free</button>
              </div>
            </div>

            <div className={`grid gap-6 ${ticketCategory === "Paid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">Total Quantity <span className="cursor-help text-gray-400"><Info size={14} /></span></label>
                <input type="number" placeholder="Enter Total Ticket Quantity" value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
              </div>

              {ticketCategory === "Paid" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Ticket Price</label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition">
                    <select value={ticketCurrency} onChange={(e) => setTicketCurrency(e.target.value)} className="bg-transparent text-sm text-gray-600 px-3 py-3 border-r border-gray-200 outline-none cursor-pointer w-28 appearance-none">
                      <option value="INR">INR - Indi...</option>
                      <option value="USD">USD</option>
                    </select>
                    <input type="number" placeholder="0" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="w-full px-4 py-3 text-sm placeholder-gray-400 outline-none" />
                  </div>
                </div>
              )}

              {ticketCategory === "Free" && (
                <>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">Minimum per booking <span className="cursor-help text-gray-400"><Info size={14} /></span></label>
                    <input type="number" value={minBooking} onChange={(e) => setMinBooking(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">Maximum per booking <span className="cursor-help text-gray-400"><Info size={14} /></span></label>
                    <input type="number" value={maxBooking} onChange={(e) => setMaxBooking(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
                  </div>
                </>
              )}
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DateTimePicker label="Ticket sale starts from" dateVal={ticketStartDate} timeVal={ticketStartTime} onDateChange={setTicketStartDate} onTimeChange={setTicketStartTime} />
              <DateTimePicker label="Ticket sale ends at" dateVal={ticketEndDate} timeVal={ticketEndTime} onDateChange={setTicketEndDate} onTimeChange={setTicketEndTime} />
            </div>

            
            <div className="mt-4">
              <button onClick={handleCreateTicket} className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition shadow-sm cursor-pointer">
                {editingTicketIndex !== null ? "Update Ticket" : "Create Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsTab;
