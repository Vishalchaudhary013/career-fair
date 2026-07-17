import React, { useEffect, useState } from "react";
import { getBookingsByEvent, deleteBooking } from "../services/bookingService";
import { getEvent } from "../services/eventService";
import { getMediaUrl } from "../services/api";
import { FaArrowLeft, FaFileExcel, FaFileCsv, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import CandidateDetailsModal from "./CandidateDetailsModal";

const EventResponsesView = ({ eventId, onBack }) => {
  const [bookings, setBookings] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tickets"); 
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventData, bookingsData] = await Promise.all([
          getEvent(eventId),
          getBookingsByEvent(eventId)
        ]);
        setEvent(eventData);
       
        setBookings(Array.isArray(bookingsData.data) ? bookingsData.data : bookingsData || []);
      } catch (err) {
        console.error("Failed to load responses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }


  const bookingsArray = Array.isArray(bookings) ? bookings : (bookings.data || []);

  const formatExportData = () => {
    return bookingsArray.map(booking => {
      const getAttendeeName = () => {
        if (booking.answers) {
          if (booking.answers.q_name) return booking.answers.q_name;
          const nameQuestion = event?.questions?.find(q => q.title.toLowerCase().includes("name") && !q.title.toLowerCase().includes("company name"));
          if (nameQuestion) {
            const qId = nameQuestion.id || nameQuestion._id;
            if (booking.answers[qId]) return booking.answers[qId];
          }
          const nameKey = Object.keys(booking.answers).find(key => key.toLowerCase().includes("name"));
          if (nameKey && booking.answers[nameKey]) return booking.answers[nameKey];
        }
        return booking.email ? booking.email.split('@')[0] : 'Guest';
      };

      const baseRow = {
        "Attendee Name": getAttendeeName(),
        "Email": booking.email,
      };

      if (activeTab === "tickets") {
        return {
          "Order ID": booking._id,
          ...baseRow,
          "Total Tickets": booking.totalItems,
          "Amount (₹)": booking.totalPrice > 0 ? booking.totalPrice : 'FREE',
          "Date": new Date(booking.createdAt).toLocaleDateString()
        };
      } else {
        const formRow = { ...baseRow };
       
        if (booking.answers) {
          Object.entries(booking.answers).forEach(([qId, ans]) => {
            const question = event?.questions?.find(q => q.id === qId || q._id === qId);
            const qTitle = question ? question.title : (qId.startsWith('q_') ? qId.substring(2).replace(/_/g, ' ') : qId);
            formRow[qTitle] = Array.isArray(ans) ? ans.join(", ") : String(ans);
          });
        }
        formRow["Date"] = new Date(booking.createdAt).toLocaleDateString();
        return formRow;
      }
    });
  };

  const downloadExcel = () => {
    if (bookingsArray.length === 0) return;
    const data = formatExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
    XLSX.writeFile(workbook, `${event?.basicInfo?.title || 'Event'}_${activeTab === "tickets" ? 'TicketData' : 'FormData'}.xlsx`);
  };

  const downloadCSV = () => {
    if (bookingsArray.length === 0) return;
    const data = formatExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${event?.basicInfo?.title || 'Event'}_${activeTab === "tickets" ? 'TicketData' : 'FormData'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadRegistrationPDF = (booking, eventData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 16;
    let y = 20;
    
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    doc.text("edeco", marginX, y);
    const edecoWidth = doc.getTextWidth("edeco");
    doc.setTextColor(40, 167, 69); 
    doc.text(".", marginX + edecoWidth, y);
    
   
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Student ID: ${booking._id}`, pageWidth - marginX, y, { align: "right" });
    
    y += 20;
    
  
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text("Application", pageWidth / 2, y, { align: "center" });
    const titleWidth = doc.getTextWidth("Application");
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - titleWidth / 2, y + 2, pageWidth / 2 + titleWidth / 2, y + 2);
    
    y += 15;

  
    const getAttendeeName = () => {
      if (booking.answers) {
        if (booking.answers.q_name) return booking.answers.q_name;
        const nameQuestion = eventData?.questions?.find(q => q.title.toLowerCase().includes("name") && !q.title.toLowerCase().includes("company name"));
        if (nameQuestion) {
          const qId = nameQuestion.id || nameQuestion._id;
          if (booking.answers[qId]) return booking.answers[qId];
        }
        const nameKey = Object.keys(booking.answers).find(key => key.toLowerCase().includes("name"));
        if (nameKey && booking.answers[nameKey]) return booking.answers[nameKey];
      }
      return booking.email ? booking.email.split('@')[0] : 'Guest';
    };

    const categories = {
      "Personal Information": ["email", "contact", "phone", "mobile", "city", "gender", "dob", "date of birth", "age"],
      "Academic Details": ["qualification", "education", "discipline", "specialization", "branch", "year of graduation", "aggregate", "cgpa", "percentage", "college", "university", "institute"],
      "Career Preferences": ["industry", "industries", "job role", "roles", "preferred location", "willing to relocate", "relocation"],
      "Documents and Links": ["linkedin", "portfolio", "github", "resume", "cv", "document", "link"],
      "Declaration and Consent": ["heard from", "previous fair", "attended before", "declaration", "consent", "agree", "terms", "submission"]
    };

    const groupedAnswers = {
      "Personal Information": [],
      "Academic Details": [],
      "Career Preferences": [],
      "Documents and Links": [],
      "Declaration and Consent": [],
      "Other Details": []
    };

    groupedAnswers["Personal Information"].push({ label: "Full Name", value: getAttendeeName() });
    
    const hasEmailQuestion = eventData?.questions?.some(q => q.title.toLowerCase().includes("email"));
    if (!hasEmailQuestion) {
      groupedAnswers["Personal Information"].push({ label: "Email", value: booking.email || "N/A" });
    }

    if (eventData?.questions && booking.answers) {
      eventData.questions.forEach((q) => {
        const qTitleLower = q.title.toLowerCase();
        if (qTitleLower.includes("name") && !qTitleLower.includes("company") && !qTitleLower.includes("college") && !qTitleLower.includes("university") && !qTitleLower.includes("institute") && !qTitleLower.includes("branch")) return;

        const qId = q.id || q._id;
        let answer = booking.answers[qId];
        if (!answer) {
           const fallbackKey = Object.keys(booking.answers).find(key => key.includes(qId) || qId.includes(key) || key.replace('q_', '').toLowerCase() === qTitleLower);
           if (fallbackKey) answer = booking.answers[fallbackKey];
        }

        if (!answer) answer = "N/A";
        
        let displayAnswer = Array.isArray(answer) ? answer.join(", ") : String(answer);
        if (typeof answer === 'string' && (answer.startsWith('/uploads/') || answer.startsWith('uploads/') || answer.startsWith('http'))) {
          if (answer.includes('/uploads/file-') || answer.match(/\.(pdf|doc|docx|png|jpg|jpeg)$/i)) {
             displayAnswer = "File Uploaded";
          }
        }

        let assignedCategory = "Other Details";
        
        if (qTitleLower.includes("college city") || qTitleLower.includes("university city")) {
          assignedCategory = "Personal Information";
        } else {
          for (const [catName, keywords] of Object.entries(categories)) {
            if (keywords.some(kw => {
              if (kw === "age") return /\bage\b/.test(qTitleLower);
              return qTitleLower.includes(kw);
            })) {
              assignedCategory = catName;
              break;
            }
          }
        }

        groupedAnswers[assignedCategory].push({ label: q.title, value: displayAnswer });
      });
    }

    groupedAnswers["Declaration and Consent"].push({ 
      label: "Date of Submission", 
      value: new Date(booking.createdAt).toLocaleDateString() 
    });

    Object.entries(groupedAnswers).forEach(([catName, fields]) => {
      if (fields.length === 0) return;

      if (y > pageHeight - 40) {
        doc.addPage();
        y = 20;
      }

    
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 86, 179); 
      doc.text(catName, marginX, y);
      y += 4;
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 8;

      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      
      let isLeft = true;
      let maxColYOffset = 0;

      fields.forEach((field, index) => {
        const text = `${index + 1}. ${field.label}: ${field.value}`;
        const splitText = doc.splitTextToSize(text, pageWidth / 2 - marginX - 10);
        
        if (y + splitText.length * 5 > pageHeight - 30) {
          doc.addPage();
          y = 20;
          isLeft = true;
        }

        const currentX = isLeft ? marginX : pageWidth / 2 + 5;
        doc.text(splitText, currentX, y);
        
        const yOffset = splitText.length * 5;
        if (yOffset > maxColYOffset) maxColYOffset = yOffset;

        if (!isLeft) {
          y += maxColYOffset + 4;
          maxColYOffset = 0;
        }
        isLeft = !isLeft;
      });

      if (!isLeft) {
        y += maxColYOffset + 4;
      }
      y += 6; 
    });

    
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
    
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginX, pageHeight - 20, pageWidth - marginX, pageHeight - 20);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("Auto Generated Ticket by Career Fair, powered by edeco", marginX, pageHeight - 12);
      doc.text("© edeco Consulting | All Rights Reserved", pageWidth - marginX, pageHeight - 12, { align: "right" });
    }
    
    doc.save(`Registration_${getAttendeeName().replace(/\s+/g, '_')}.pdf`);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this applicant?")) {
      try {
        await deleteBooking(bookingId);
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } catch (error) {
        console.error("Failed to delete booking", error);
        alert("Failed to delete booking.");
      }
    }
  };

  return (
    <div className="border border-[#E2EAFC] bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-[#E2EAFC] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary font-semibold mb-4 transition-colors">
            <FaArrowLeft className="text-xs" /> Back to Events
          </button>
          <h3 className="text-lg font-semibold text-primary">{event?.basicInfo?.title}</h3>
          <p className="text-xs font-medium text-slate-500 mt-1">Total Bookings: {bookingsArray.length}</p>
        </div>
        
        {bookingsArray.length > 0 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={downloadExcel} 
              className="flex items-center justify-center gap-2 bg-[#107c41] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#0c6b37] transition-colors shadow-sm"
            >
              <FaFileExcel /> Export Excel
            </button>
            <button 
              onClick={downloadCSV} 
              className="flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors shadow-sm"
            >
              <FaFileCsv /> Export CSV
            </button>
          </div>
        )}
      </div>

      <div className="flex border-b border-[#E2EAFC] bg-slate-50/50">
        <button 
          onClick={() => setActiveTab("tickets")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "tickets" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Ticket (issued)
        </button>
        <button 
          onClick={() => setActiveTab("form")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "form" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Registration Form (Applied)
        </button>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[#E3EAFA] text-slate-500 bg-slate-50/80 uppercase text-[11px] tracking-wider font-bold">
              <th className="py-3 px-5 whitespace-nowrap">S.No</th>
              {activeTab === "tickets" && <th className="py-3 px-5 whitespace-nowrap">Order ID</th>}
              {activeTab === "tickets" && <th className="py-3 px-5 whitespace-nowrap">Attendee</th>}
              {activeTab === "tickets" && <th className="py-3 px-5 whitespace-nowrap">Email</th>}
              {activeTab === "tickets" ? (
                <>
                  <th className="py-3 px-5 whitespace-nowrap">Total Tickets</th>
                  <th className="py-3 px-5 whitespace-nowrap">Amount</th>
                  <th className="py-3 px-5 whitespace-nowrap">Date</th>
                </>
              ) : (
                <>
                  <th className="py-3 px-5 whitespace-nowrap">Name</th>
                  <th className="py-3 px-5 whitespace-nowrap">Qualification</th>
                  <th className="py-3 px-5 whitespace-nowrap">Discipline</th>
                  <th className="py-3 px-5 whitespace-nowrap">College</th>
                  <th className="py-3 px-5 whitespace-nowrap">Year</th>
                  <th className="py-3 px-5 whitespace-nowrap">Consent</th>
                  <th className="py-3 px-5 whitespace-nowrap text-center">Resume</th>
                  <th className="py-3 px-5 whitespace-nowrap text-center">Registration PDF</th>
                  <th className="py-3 px-5 whitespace-nowrap text-center">Action</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF2FD]">
            {bookingsArray.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "tickets" ? 7 : (4 + (event?.questions?.length || 0))} className="py-12 text-center text-slate-500 font-medium">
                  No responses yet for this event.
                </td>
              </tr>
            ) : (
              bookingsArray.map((booking, index) => {
                const getAttendeeName = () => {
                  if (booking.answers) {
                    if (booking.answers.q_name) return booking.answers.q_name;
                    const nameQuestion = event?.questions?.find(q => q.title.toLowerCase().includes("name") && !q.title.toLowerCase().includes("company name"));
                    if (nameQuestion) {
                      const qId = nameQuestion.id || nameQuestion._id;
                      if (booking.answers[qId]) return booking.answers[qId];
                    }
                    const nameKey = Object.keys(booking.answers).find(key => key.toLowerCase().includes("name"));
                    if (nameKey && booking.answers[nameKey]) return booking.answers[nameKey];
                  }
                  return booking.email ? booking.email.split('@')[0] : 'Guest';
                };

                const attendeeName = getAttendeeName();
                return (
                  <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 text-sm text-slate-500">{index + 1}</td>
                    {activeTab === "tickets" && (
                      <td className="py-4 px-5 text-xs text-slate-500 font-mono" title={booking._id}>{booking._id}</td>
                    )}
                    {activeTab === "tickets" && (
                      <td className="py-4 px-5 font-semibold whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="text-blue-500 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
                        >
                          {attendeeName}
                        </button>
                      </td>
                    )}
                    {activeTab === "tickets" && (
                      <td className="py-4 px-5 text-slate-600 whitespace-nowrap">
                        {booking.email}
                      </td>
                    )}
                    
                    {activeTab === "tickets" ? (
                      <>
                        <td className="py-4 px-5 text-slate-600 font-medium">
                          {booking.totalItems} <span className="text-xs text-slate-400 font-normal ml-1">tickets</span>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-800">
                          {booking.totalPrice > 0 ? <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded whitespace-nowrap">₹{booking.totalPrice}</span> : <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">FREE</span>}
                        </td>
                        <td className="py-4 px-5 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                      </>
                    ) : (
                      <>
                        {(() => {
                          const getAnswerByKeywords = (keywords) => {
                            if (!event?.questions || !booking.answers) return null;
                            for (const q of event.questions) {
                               const qTitleLower = q.title.toLowerCase();
                               if (keywords.some(kw => qTitleLower.includes(kw))) {
                                  const qId = q.id || q._id;
                                  let ans = booking.answers[qId];
                                  if (!ans) {
                                     const fallbackKey = Object.keys(booking.answers).find(key => key.includes(qId) || qId.includes(key) || key.replace('q_', '').toLowerCase() === qTitleLower);
                                     if (fallbackKey) ans = booking.answers[fallbackKey];
                                  }
                                  if (ans) return ans;
                               }
                            }
                            return null;
                          };
                          
                          const qual = getAnswerByKeywords(['qualification', 'education', 'degree']);
                          const disc = getAnswerByKeywords(['discipline', 'branch', 'specialization', 'stream']);
                          const coll = getAnswerByKeywords(['college', 'university', 'institute']);
                          const year = getAnswerByKeywords(['year', 'graduation', 'passing']);
                          const cons = getAnswerByKeywords(['consent', 'declaration', 'agree', 'terms', 'heard from']);
                          const resu = getAnswerByKeywords(['resume', 'cv', 'file upload', 'document']);
                          
                          const consText = cons ? (Array.isArray(cons) ? cons.join(", ") : String(cons)) : null;
                          const isYes = consText && (consText.toLowerCase().includes('yes') || consText.toLowerCase().includes('agree') || consText.toLowerCase() === 'true' || consText.toLowerCase().includes('accept'));

                          return (
                            <>
                              <td className="py-4 px-5 text-slate-600 whitespace-nowrap">
                                <button 
                                  onClick={() => setSelectedBooking(booking)}
                                  className="text-blue-500 hover:text-blue-700 hover:underline transition-colors focus:outline-none font-medium"
                                >
                                  {attendeeName || "-"}
                                </button>
                              </td>
                              <td className="py-4 px-5 text-slate-600 whitespace-nowrap">{qual ? (Array.isArray(qual) ? qual.join(", ") : String(qual)) : <span className="text-slate-300">-</span>}</td>
                              <td className="py-4 px-5 text-slate-600 whitespace-nowrap">{disc ? (Array.isArray(disc) ? disc.join(", ") : String(disc)) : <span className="text-slate-300">-</span>}</td>
                              <td className="py-4 px-5 text-slate-600 whitespace-nowrap">{coll ? (Array.isArray(coll) ? coll.join(", ") : String(coll)) : <span className="text-slate-300">-</span>}</td>
                              <td className="py-4 px-5 text-slate-600 whitespace-nowrap">{year ? (Array.isArray(year) ? year.join(", ") : String(year)) : <span className="text-slate-300">-</span>}</td>
                              <td className="py-4 px-5 whitespace-nowrap">
                                {consText ? <span className={isYes ? "text-emerald-600 font-medium" : "text-slate-600 font-medium"}>{consText}</span> : <span className="text-slate-300">-</span>}
                              </td>
                              <td className="py-4 px-5 whitespace-nowrap text-center">
                                {resu ? (
                                  <a href={getMediaUrl(Array.isArray(resu) ? resu[0] : resu)} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-primary font-medium transition-colors">
                                    View
                                  </a>
                                ) : <span className="text-slate-300">-</span>}
                              </td>
                            </>
                          );
                        })()}
                        <td className="py-4 px-5 whitespace-nowrap text-center">
                          <button 
                            onClick={() => downloadRegistrationPDF(booking, event)}
                            className="text-[#00875A] hover:text-[#006644] text-sm font-medium transition-colors"
                          >
                            View PDF
                          </button>
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap text-center">
                          <button 
                            onClick={() => handleDelete(booking._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <CandidateDetailsModal 
        isOpen={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        booking={selectedBooking} 
        eventData={event}
      />
    </div>
  );
};

export default EventResponsesView;
