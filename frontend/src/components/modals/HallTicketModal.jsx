
import { useNavigate } from "react-router-dom";

const HallTicketModal = ({ showModal, hallTicket, onClose }) => {
  const navigate = useNavigate();

  const handleDownloadClick = () => {
 
    navigate("/hallTicketPdf", { state: { hallTicket } });
  };

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} 
      >
      
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-medium text-gray-900">
            Hall Ticket
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
          >
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>

       
        <div className="p-4 space-y-3 text-gray-700">
          <p>Your Hall Ticket has been generated successfully.</p>
          <p>Hall Ticket: {hallTicket?.hallTicketNumber}</p>
          <button 
            onClick={handleDownloadClick}
            className="inline-block mt-2 px-3 py-[0.375rem] text-white bg-[#198754] hover:bg-[#157347] border border-[#198754] rounded transition-colors text-base"
          >
            View & Download Hall Ticket
          </button>
        </div>

        
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-3 py-[0.375rem] text-white bg-[#6c757d] hover:bg-[#5c636a] border border-[#6c757d] rounded transition-colors text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallTicketModal;
