import { useState } from "react";
import { LucideTicket } from "lucide-react";
import ThingsToKnow from "./ThingsToKnow";
import FairStatistics from "../section/FairStatistics";
import ReturnFairCompanies from "./ReturnFairCompanies";
import { VscDebugBreakpointData } from "react-icons/vsc";
const EventContent = ({ dbEvent, images }) => {
  const [showAll, setShowAll] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  let descriptionHtml = dbEvent?.eventInfo?.description || "<p>No description provided.</p>";

  descriptionHtml = descriptionHtml.replace(/\sclass="[^"]*"/gi, '');


  const highlights = (dbEvent?.eventInfo?.highlights || []).filter(h =>
    (typeof h?.title === 'string' && h.title.trim().length > 0) ||
    (typeof h?.body === 'string' && h.body.trim().length > 0)
  );

  const thingsToKnow = (dbEvent?.eventInfo?.thingsToKnow || []).filter(t =>
    typeof t === 'string' && t.trim().length > 0
  );

  const faqs = (dbEvent?.eventInfo?.faqs || []).filter(f =>
    (typeof f?.q === 'string' && f.q.trim().length > 0) ||
    (typeof f?.a === 'string' && f.a.trim().length > 0) ||
    (typeof f?.question === 'string' && f.question.trim().length > 0) ||
    (typeof f?.answer === 'string' && f.answer.trim().length > 0)
  );

  const instructionsText = typeof dbEvent?.eventInfo?.instructions === 'string' ? dbEvent.eventInfo.instructions.trim() : "";
  const termsTextContent = typeof dbEvent?.eventInfo?.termsText === 'string' ? dbEvent.eventInfo.termsText.trim() : "";

  const hasBanner = !!dbEvent?.media?.bannerUrl;
  const galleryImages = hasBanner ? images.slice(1) : images;

  return (
    <div className="col-span-1 lg:col-span-12">

      {thingsToKnow.length > 0 && (
        <div id="thingsToKnown" className="bg-white mb-11 border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6 scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-5 text-primary">Who Can Apply</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-x-8">
            {[thingsToKnow.slice(0, Math.ceil(thingsToKnow.length / 2)), thingsToKnow.slice(Math.ceil(thingsToKnow.length / 2))].map((col, ci) => (
              <div key={ci} className="space-y-4 text-sm font-medium text-gray-700">
                {col.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className=" text-primary mt-0.5"><VscDebugBreakpointData size={18} /></div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

  
      <div id="about" className="bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl mb-11 scroll-mt-20">
        <h3 className="text-2xl mb-4 font-semibold text-primary">Fair Information</h3>
        <style>{`
          .fair-desc-html * {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            max-width: 100% !important;
          }
          .fair-desc-html table, .fair-desc-html td, .fair-desc-html th {
            border: 1px solid #d1d5db !important;
          }
          .fair-desc-html table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .fair-desc-html td, .fair-desc-html th {
            padding: 0.5rem !important;
          }
          .fair-desc-html ul {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
            margin: 0.5rem 0 !important;
          }
          .fair-desc-html ol {
            list-style-type: decimal !important;
            padding-left: 1.5rem !important;
            margin: 0.5rem 0 !important;
          }
          .fair-desc-html a {
            color: #2563eb !important;
            text-decoration: underline !important;
          }
        `}</style>
        <div
          className={`text-gray-650 leading-relaxed space-y-4 event-desc-html ${!showAll ? "line-clamp-4" : ""}`}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
        <button onClick={() => setShowAll((s) => !s)} className="text-sm mt-6 text-center text-primary font-semibold hover:text-[#2a108a] transition-colors mx-auto block px-4 py-2 hover:underline decoration-primary hover:underline-offset-4  rounded-full" aria-expanded={showAll}>
          {showAll ? "Read less" : "Read more"}
        </button>
      </div>

      {/*
      {highlights.length > 0 && (
        <div id="highlights" className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6 mb-10 scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-5 text-primary">Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {highlights.map((h, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl py-5 px-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-[16px] mb-1.5 font-semibold text-primary">{h.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      */}

    
      <FairStatistics statistics={dbEvent?.statistics || []} />

  
      <ReturnFairCompanies currentCards={dbEvent?.hiringPartners || []} />





      {(instructionsText || termsTextContent || faqs.length > 0) && (
        <div id="faqs" className="scroll-mt-20">
          <ThingsToKnow
            instructions={instructionsText}
            termsText={termsTextContent}
            faqs={faqs}
          />
        </div>
      )}
    </div>
  );
};

export default EventContent;
