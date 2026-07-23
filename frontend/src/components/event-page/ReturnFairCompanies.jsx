import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SERVER_URL } from "../../config";

const CompanyCard = ({ jobCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const {
    logo = "",
    logoLink = "",
    companyLogo = "",
    companyName = "Company Name",
    jobProfile = "",
    candidatesRequired = "N/A",
    location = "",
    jobLocation = "",
    description = "",
  } = jobCard || {};

  const displayLogo = logoLink || logo || companyLogo;
  const displayLocation = location || jobLocation || "Location not specified";
  const companyLogoSrc = displayLogo
    ? (displayLogo.startsWith("http") 
        ? displayLogo 
        : (displayLogo.startsWith("companyLogo") || displayLogo.startsWith("file-")
           ? `${SERVER_URL}/uploads/files/${displayLogo}` 
           : `${SERVER_URL}/uploads/logo/${displayLogo}`))
    : "";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="relative group border border-gray-100 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center h-[120px] cursor-pointer" onClick={openModal}>
        {companyLogoSrc ? (
          <img
            src={companyLogoSrc}
            alt={companyName}
            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        
        <div
          className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl select-none"
          style={{ display: companyLogoSrc ? "none" : "flex" }}
        >
          {companyName.charAt(0).toUpperCase()}
        </div>

        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-xl">
          <button className="bg-primary hover:bg-[#1a0b5a] text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            View Details
          </button>
        </div>
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={closeModal}>
          <div className="bg-white p-8 md:p-10 rounded-2xl w-full max-w-3xl relative shadow-2xl flex flex-col min-h-[500px]" onClick={(e) => e.stopPropagation()}>
            
            <button className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-2xl leading-none" onClick={closeModal}>
              &times;
            </button>

            <h2 className="text-3xl font-semibold mb-6 text-gray-900">{companyName}</h2>
            
            <p className="mb-4 text-[15px] text-gray-800">
              <strong className="font-semibold text-gray-900">Job Location:</strong> {displayLocation}
            </p>
            <p className="mb-6 text-[15px] text-gray-800">
              <strong className="font-semibold text-gray-900">Total Candidates Required:</strong> {candidatesRequired}
            </p>

            
            <div className="text-[15px] text-gray-800 mb-4">
              <p className="mb-3">
                <strong className="font-semibold text-gray-900">Job Profile:</strong>
              </p>
              {(jobProfile || "").split("\n").map((line, i) => (
                <p className="mb-2" key={i}>
                  {line}
                </p>
              ))}
            </div>

            {description && (
              <div className="flex-1 text-[15px] text-gray-800 mb-8 overflow-y-auto pr-2">
                <p className="mb-3">
                  <strong className="font-semibold text-gray-900">Description:</strong>
                </p>
                <div className="whitespace-pre-wrap">{description}</div>
              </div>
            )}

            
            <div className="mt-auto flex justify-start">
              <button className="bg-[#f3f4f6] hover:bg-[#e5e7eb] text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors text-[15px]" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ReturnFairCompanies = React.memo(({ currentCards }) => {
  const scrollContainerRef = useRef(null);

  if (!currentCards || currentCards.length === 0) return null;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="partCompanies"
      className="bg-white mb-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6 scroll-mt-20 relative"
    >
      <h2 className="text-center text-primary text-2xl font-semibold mb-2">
        Connect with Our Hiring Partners. Your Career Growth Starts Here.
      </h2>
      <h2 className="text-center mb-4 text-gray-600">
        <strong>Register for Free and Meet Our Partners!</strong>
      </h2>
      {/* <div className="flex justify-center mb-6">
        <Link 
          to="/employer-dashboard" 
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-full transition cursor-pointer"
        >
          Are you an Employer? Join as Hiring Partner ↗
        </Link>
      </div> */}

      <div className="relative group/nav mt-4">
        {currentCards.length > 7 && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] rounded-full p-2 border border-gray-100 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all opacity-0 group-hover/nav:opacity-100 disabled:opacity-0"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 snap-x" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            #partCompanies .flex::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {currentCards.map((jobCard) => (
            <div key={jobCard._id} className="w-[130px] md:w-[150px] xl:w-[calc(14.285%-14px)] shrink-0 snap-start">
              <CompanyCard jobCard={jobCard} />
            </div>
          ))}
        </div>

        {currentCards.length > 7 && (
          <button
            onClick={() => scroll('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] rounded-full p-2 border border-gray-100 text-gray-600 hover:text-primary hover:bg-gray-50 transition-all opacity-0 group-hover/nav:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
});

export default ReturnFairCompanies;
