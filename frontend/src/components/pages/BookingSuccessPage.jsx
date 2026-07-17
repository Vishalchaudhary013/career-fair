import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Download } from "lucide-react";
import { getBookingById } from "../services/bookingService";
import { formatDate, formatTime } from "../../utils/dateFormatter";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const getEventTitle = (event) => event?.basicInfo?.title || event?.fairName || "Event";
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

const BookingSuccessPage = () => {
  const { eventId, bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const ticketRef = useRef();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const buildQrCode = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(String(bookingId || ""), {
          errorCorrectionLevel: "M",
          width: 240,
          margin: 1,
          color: {
            dark: "#110060",
            light: "#FFFFFF"
          }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error("Failed to generate QR code", err);
      }
    };

    buildQrCode();
  }, [bookingId]);

  if (loading) return <div className="flex justify-center mt-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (error || !booking) return <div className="text-center mt-32 text-red-500">{error || "Booking not found"}</div>;

  const event = booking.event;
  const title = getEventTitle(event);
  const startDate = formatDate(getEventDate(event)) || "TBA";
  const startTime = formatTime(getEventTime(event)) || "TBA";
  const venue = getEventVenue(event);
  
  const downloadTicket = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 16;
      const marginY = 8;
      let y = marginY + 10;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);

      // TOP LEFT -> Ticket ID
      doc.text(`Ticket ID : ${bookingId}`, marginX, y);

      // TOP RIGHT -> Created At
      const createdDate = formatDate(booking.createdAt || new Date());
      doc.text(`Created At : ${createdDate}`, pageWidth - marginX, y, { align: "right" });

      // QR CODE placement (Top Right below Created At)
      if (qrCodeDataUrl) {
        doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - marginX - 30, y + 5, 30, 30);
      }

      // TITLE "HALL TICKET"
      y += 15;
      doc.setFontSize(18);
      doc.setFont("Helvetica", "bold");
      doc.text("HALL TICKET", pageWidth / 2, y, { align: "center" });

      // FAIR NAME
      y += 12;
      doc.setFontSize(13);
      doc.setFont("Helvetica", "bold");
      const fairLines = doc.splitTextToSize(`"${title}"`, pageWidth - 2 * marginX);
      doc.text(fairLines, pageWidth / 2, y, { align: "center" });
      
      y += fairLines.length * 7 + 5;

      // DATE OF EVENT & ENTRY TIMING
      doc.setFontSize(11);
      doc.setFont("Helvetica", "normal");
      doc.text(`Date Of Event : ${startDate}`, marginX, y);
      doc.text(`Entry Timing : ${startTime}`, pageWidth - marginX, y, { align: "right" });

      // CANDIDATE DETAILS
      y += 15;
      const fullName = getAttendeeName();
      const gender = booking.answers?.Gender || booking.answers?.gender || "N/A";
      const email = booking.email || "N/A";
      
      // Attempt to find phone number from various potential question keys
      const phoneKeys = ["Phone Number", "phone", "mobile", "contact"];
      let mobile = "N/A";
      if (booking.answers) {
        const foundKey = Object.keys(booking.answers).find(k => phoneKeys.some(pk => k.toLowerCase().includes(pk)));
        if (foundKey) mobile = booking.answers[foundKey];
      }

      // Attempt to find highest qualification
      const eduKeys = ["Highest Level of Education", "qualification", "education", "degree"];
      let qualification = "N/A";
      if (booking.answers) {
        const foundKey = Object.keys(booking.answers).find(k => eduKeys.some(ek => k.toLowerCase().includes(ek)));
        if (foundKey) qualification = booking.answers[foundKey];
      }

      const specialization = booking.answers?.discipline || "";
      const qualificationLine = specialization ? `${qualification} (${specialization})` : qualification;

      const col1X = marginX;
      const col2X = pageWidth / 2 + 10;
      const rowGap = 8;

      // Row 1
      doc.text(`1. Candidate Name : ${fullName}`, col1X, y);
      doc.text(`2. Gender : ${gender}`, col2X, y);

      // Row 2
      y += rowGap;
      doc.text(`3. Email ID : ${email}`, col1X, y);
      doc.text(`4. Contact No. : ${mobile}`, col2X, y);

      // Row 3
      y += rowGap;
      doc.text(`5. Highest Qualification : ${qualificationLine}`, col1X, y);

      // APPLYING FOR BOX
      y += 14;
      const box1X = marginX;
      const box1Y = y;
      const box1Width = pageWidth - 2 * marginX;
      const box1Height = 32;

      doc.rect(box1X, box1Y, box1Width, box1Height);

      doc.setFont("Helvetica", "bold");
      doc.text("Applying for :", box1X + 4, box1Y + 8);
      doc.text("(For office use only)", box1X + box1Width - 4, box1Y + 8, { align: "right" });

      doc.setFont("Helvetica", "normal");
      doc.text("1. ___________________________", box1X + 4, box1Y + 16);
      doc.text("2. ___________________________", box1X + box1Width / 2 + 4, box1Y + 16);
      doc.text("3. ___________________________", box1X + 4, box1Y + 24);
      doc.text("4. ___________________________", box1X + box1Width / 2 + 4, box1Y + 24);

      // IMPORTANT INSTRUCTIONS BOX
      const instructions = [
        "1. The candidate must carry this Hall Ticket to the venue without fail. Entry to the premises shall be strictly",
        "   prohibited without a valid Hall Ticket.",
        "2. Candidates are permitted to apply for a maximum of four (04) companies per day.",
        "3. The candidate must bring a valid Government-issued Photo Identification Proof for verification.",
        "   (a) Accepted IDs include Aadhaar Card, PAN Card, Voter ID Card, Passport, or Driving Licence.",
        "4. The candidate shall report to the venue with the following mandatory documents:",
        "   (a) Four (04) recent passport-size photographs.",
        "   (b) (04) hard copies of the updated Resume/Curriculum Vitae (CV).",
        "5. All candidates must report at least thirty (30) minutes prior to the scheduled reporting time to complete",
        "   verification and other formalities.",
        "6. The organizers reserve the right to deny entry or cancel the candidature of any candidate found providing",
        "   false information or violating any of the above instructions."
      ];

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);

      const box2X = marginX;
      const box2Width = pageWidth - 2 * marginX;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);

      let allLines = [];
      instructions.forEach((ins) => {
        const wrapped = doc.splitTextToSize(ins, box2Width - 10);
        allLines.push(...wrapped);
      });

      const lineHeight = 5;
      const headerHeight = 14;
      const boxHeight = headerHeight + allLines.length * lineHeight + 10;
      const box2Y = box1Y + box1Height + 14;

      doc.rect(box2X, box2Y, box2Width, boxHeight);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("IMPORTANT INSTRUCTIONS", pageWidth / 2, box2Y + 8, { align: "center" });

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);

      let instrY = box2Y + 18;
      allLines.forEach((line) => {
        doc.text(line, box2X + 5, instrY);
        instrY += lineHeight;
      });

      // SIGNATURE BOTTOM RIGHT
      doc.text("Candidate's Signature", pageWidth - marginX, doc.internal.pageSize.getHeight() - 12, { align: "right" });
      
      doc.save(`Hall_Ticket_${bookingId}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF ticket.");
    }
  };

  const getAttendeeName = () => {
    if (!booking) return "Attendee";
    
    // Check if answers exist
    if (booking.answers) {
      if (booking.answers.q_name) return booking.answers.q_name;
      
      const event = booking.event;
      const nameQuestion = event?.questions?.find(q => q.title.toLowerCase().includes("name") && !q.title.toLowerCase().includes("company name"));
      if (nameQuestion) {
        const qId = nameQuestion.id || nameQuestion._id;
        if (booking.answers[qId]) return booking.answers[qId];
      }

      const nameKey = Object.keys(booking.answers).find(key => 
        key.toLowerCase().includes("name")
      );
      if (nameKey && booking.answers[nameKey]) return booking.answers[nameKey];
    }
    
    // Fallback to email prefix
    if (booking.email) {
      return booking.email.split("@")[0];
    }
    
    return "Guest Attendee";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20">
      {/* Top Success Banner */}
     

      <div className="max-w-md mx-auto w-full px-4 py-12 flex flex-col items-center">
        
        {/* Ticket Receipt (Hero Card) */}
        <div className="w-full bg-white border border-slate-200/60 rounded-2xl shadow-xl p-8 relative overflow-hidden mb-8">
          
          {/* Left Cutout */}
          {/* */}
          {/* Ticket Header */}
          <div className="text-center mb-6">
            <span className="text-4xl inline-block animate-bounce mb-2" role="img" aria-label="party popper">🎉</span>
            <h2 className="text-2xl font-bold text-primary">Thank you!</h2>
            <p className="text-sm text-slate-500 mt-1">Your ticket has been issued successfully</p>
            
            {/* Project Success Tag Message */}
           
          </div>

          {/* Dashed Line */}
          <div className="border-t border-dashed border-slate-200 my-6 -mx-8" />

          {/* Details Section */}
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ticket ID</span>
                <span className="text-[14px] font-mono font-bold text-slate-700 mt-0.5 block truncate max-w-45">{bookingId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Amount</span>
                <span className="text-[15px] font-bold text-slate-800 mt-0.5 block">
                  {booking.totalPrice > 0 ? `₹${booking.totalPrice.toFixed(2)}` : "FREE"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Date & Time</span>
              <span className="text-[14px] font-semibold text-slate-700 mt-0.5 block">{startDate} • {startTime}</span>
            </div>

            {/* Event Name */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Event</span>
              <span className="text-[14px] font-bold text-primary mt-0.5 block line-clamp-1">{title}</span>
            </div>

            {/* Attendee Info Bar */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 shrink-0">
                {booking.totalPrice > 0 ? (
                  <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="10" cy="12" r="6" fill="#EB001B" opacity="0.8"/>
                    <circle cx="14" cy="12" r="6" fill="#F79E1B" opacity="0.8"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-slate-700 truncate">{getAttendeeName()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                  {booking.totalPrice > 0 ? "Paid Ticket • Confirmed" : "Free Pass • Confirmed"}
                </p>
              </div>
            </div>
          </div>

          {/* Second Dashed Line */}
          <div className="border-t border-dashed border-slate-200 my-6 -mx-8" />

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center py-4 w-full">
            {qrCodeDataUrl ? (
              <img src={qrCodeDataUrl} alt="QR Code" className="w-[100px] h-[100px]" />
            ) : (
              <div className="w-[100px] h-[100px] rounded-lg bg-slate-100 animate-pulse" />
            )}
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3">Scan at Entry</span>
          </div>

          {/* Scalloped Bottom Edge Circles */}
          <div className="absolute left-0 right-0 -bottom-2 flex justify-between px-1 pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-slate-50 border border-slate-200/40" />
            ))}
          </div>
        </div>

        {/* Action Buttons below Receipt Card */}
        <div className="w-full flex flex-col gap-3">
          <button 
            onClick={downloadTicket}
            className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
          >
            <Download size={16} />
            Download Ticket(s)
          </button>
          
          <Link 
            to="/" 
            className="w-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            Back to Home
          </Link>
        </div>

      </div>

      {/* Hidden Ticket for PDF generation */}
      <div id="printable-ticket" style={{ position: "absolute", zIndex: -10, top: 0, left: 0, opacity: 0.01, pointerEvents: "none" }}>
        <div ref={ticketRef} className="w-200 bg-white p-8 border border-gray-200">
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
              <p className="text-gray-600">{startDate} at {startTime}</p>
              <p className="text-gray-600">{venue}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wider">Order ID</p>
              <p className="font-mono font-bold text-gray-800">{bookingId}</p>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Attendee Information</h3>
              <p className="text-lg text-gray-800 font-medium">{booking.email}</p>
              
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-8 mb-4">Ticket Type</h3>
              {booking.tickets?.map((t, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-gray-800">{t.name || t.ticketName || "Ticket"}</p>
                  <p className="text-gray-600">Quantity: {t.quantity}</p>
                </div>
              ))}
            </div>
            
            <div className="w-48 flex flex-col items-center justify-center border-l border-gray-200 pl-8">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="QR Code" className="w-[150px] h-[150px]" />
              ) : (
                <div className="w-[150px] h-[150px] rounded-lg bg-slate-100 animate-pulse" />
              )}
              <p className="text-xs text-gray-500 mt-4 text-center">Scan at entry</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default BookingSuccessPage;
