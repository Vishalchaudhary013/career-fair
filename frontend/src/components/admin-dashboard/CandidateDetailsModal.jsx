import React from 'react';
import { getMediaUrl } from '../services/api';

const CandidateDetailsModal = ({ isOpen, onClose, booking, eventData }) => {
  if (!isOpen || !booking) return null;


  const getAttendeeName = () => {
    let titlePrefix = "";
    if (booking.answers) {
      const titleQuestion = eventData?.questions?.find(q => q.title.toLowerCase().includes("title"));
      if (titleQuestion) {
        const tId = titleQuestion.id || titleQuestion._id;
        if (booking.answers[tId]) titlePrefix = booking.answers[tId] + " ";
      }
      
      if (booking.answers.q_name) return titlePrefix + booking.answers.q_name;
      const nameQuestion = eventData?.questions?.find(q => {
        const title = q.title.toLowerCase();
        return title.includes("name") && !title.includes("company") && !title.includes("college") && !title.includes("university") && !title.includes("institute") && !title.includes("branch");
      });
      if (nameQuestion) {
        const qId = nameQuestion.id || nameQuestion._id;
        if (booking.answers[qId]) return titlePrefix + booking.answers[qId];
      }
      const nameKey = Object.keys(booking.answers).find(key => {
        const k = key.toLowerCase();
        return k.includes("name") && !k.includes("company") && !k.includes("college") && !k.includes("university") && !k.includes("institute") && !k.includes("branch");
      });
      if (nameKey && booking.answers[nameKey]) return titlePrefix + booking.answers[nameKey];
    }
    return titlePrefix + (booking.user?.name || booking.user?.userName || (booking.email ? booking.email.split('@')[0] : 'Guest'));
  };

  
  const categories = {
    "1. Personal Information": ["email", "contact", "phone", "mobile", "city", "gender", "dob", "date of birth", "age"],
    "2. Academic Details": ["qualification", "education", "discipline", "specialization", "branch", "year of graduation", "aggregate", "cgpa", "percentage", "college", "university", "institute"],
    "3. Career Preferences": ["industry", "industries", "job role", "roles", "preferred location", "willing to relocate", "relocation"],
    "4. Documents & Links": ["linkedin", "portfolio", "github", "resume", "cv", "document", "link"],
    "5. Declaration & Consent": ["heard from", "previous fair", "attended before", "declaration", "consent", "agree", "terms", "submission"]
  };

  const groupedAnswers = {
    "1. Personal Information": [],
    "2. Academic Details": [],
    "3. Career Preferences": [],
    "4. Documents & Links": [],
    "5. Declaration & Consent": [],
    "Other Details": []
  };

 
  const hasEmailQuestion = eventData?.questions?.some(q => q.title.toLowerCase().includes("email"));
  if (!hasEmailQuestion) {
    groupedAnswers["1. Personal Information"].push({ label: "Email", value: booking.email });
  }
  
  
  if (eventData?.questions && booking.answers) {
    eventData.questions.forEach((q) => {
      const qTitleLower = q.title.toLowerCase();
     
      if (qTitleLower.includes("name") && !qTitleLower.includes("company") && !qTitleLower.includes("college") && !qTitleLower.includes("university") && !qTitleLower.includes("institute") && !qTitleLower.includes("branch")) return; 
      if (qTitleLower.includes("title")) return;

      const qId = q.id || q._id;
      let answer = booking.answers[qId];
      if (!answer) {
         const fallbackKey = Object.keys(booking.answers).find(key => key.includes(qId) || qId.includes(key) || key.replace('q_', '').toLowerCase() === q.title.toLowerCase());
         if (fallbackKey) answer = booking.answers[fallbackKey];
      }

      if (!answer) return;
      
      const displayAnswer = Array.isArray(answer) ? answer.join(", ") : String(answer);
      
      let isFile = false;
      if (typeof answer === 'string' && (answer.startsWith('/uploads/') || answer.startsWith('uploads/') || answer.startsWith('http'))) {
        if (answer.includes('/uploads/file-') || answer.match(/\.(pdf|doc|docx|png|jpg|jpeg)$/i)) {
           isFile = true;
        }
      }

      const valComponent = isFile ? (
        <a href={getMediaUrl(answer)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Document</a>
      ) : displayAnswer;

   
      let assignedCategory = "Other Details";
      
      if (qTitleLower.includes("college city") || qTitleLower.includes("university city")) {
        
        assignedCategory = "1. Personal Information";
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

      groupedAnswers[assignedCategory].push({ label: q.title, value: valComponent });
    });
  }

  
  groupedAnswers["5. Declaration & Consent"].push({ 
    label: "Date of Submission", 
    value: new Date(booking.createdAt).toLocaleDateString() 
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-primary">Candidate Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        
        <div className="p-6 overflow-y-auto hide-scrollbar flex-1 bg-white">
          <h3 className="text-2xl font-bold text-primary mb-6">{getAttendeeName()}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {Object.entries(groupedAnswers).map(([category, fields]) => {
              if (fields.length === 0) return null;
              return (
                <div key={category} className="break-inside-avoid">
                  <h4 className="text-[15px] font-bold text-slate-500 mb-4">{category}</h4>
                  <div className="space-y-4">
                    {fields.map((field, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-start text-[14.5px]">
                        <span className="font-bold text-slate-800 sm:w-2/5 shrink-0">{field.label}:</span>
                        <span className="text-slate-600 sm:w-3/5">{field.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-b border-gray-100 mt-6" />
                </div>
              );
            })}
          </div>
        </div>

       
        <div className="p-4 border-t border-gray-200 flex justify-end bg-slate-50 rounded-b-lg">
          <button 
            onClick={onClose}
            className="bg-[#DC3545] hover:bg-[#c82333] text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;
