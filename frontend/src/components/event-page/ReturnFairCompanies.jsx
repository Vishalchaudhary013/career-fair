import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Briefcase, MapPin, Users, Building, Factory, Calendar, Building2 } from "lucide-react";
import { SERVER_URL } from "../../config";

const CompanyCard = ({ jobCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);

  const {
    logoLink = "",
    logo = "",
    companyLogo = "",
    companyName = "Company Name",
    jobProfile = "",
    candidatesRequired = "N/A",
    location = "",
    jobLocation = "",
    description = "",
    companyType,
    minExperience,
    maxExperience,
    experienceType,
    minSalary,
    maxSalary,
    salaryType,
    jobType,
    foundedYear,
    companySize,
    hiringProcess,
    otherBenefit,
    postingType,
    locations,
    yourDetailsCity,
    yourDetailsState,
    showDetailsInUI = true,
  } = jobCard || {};

  const displayLogo = logoLink || logo || companyLogo;
  const companyLogoSrc = displayLogo
    ? (displayLogo.startsWith("http") 
        ? displayLogo 
        : (displayLogo.startsWith("companyLogo") || displayLogo.startsWith("file-")
           ? `${SERVER_URL}/uploads/files/${displayLogo}` 
           : `${SERVER_URL}/uploads/logo/${displayLogo}`))
    : "";

  const extractLocationStr = () => {
    if (location) return location;
    if (jobLocation) return jobLocation;
    if (locations && Array.isArray(locations) && locations.length > 0) {
      return locations.map(l => {
        if (l.city && l.state) return `${l.city}, ${l.state}`;
        return l.city || l.state;
      }).filter(Boolean).join(" | ");
    }
    return "Location not specified";
  };

  const displayLocation = extractLocationStr();
  const headquartersLocation = (yourDetailsCity && yourDetailsState) 
    ? `${yourDetailsCity}, ${yourDetailsState}` 
    : (yourDetailsCity || yourDetailsState || "Not specified");

  const formatJobProfile = (profile) => {
    if (!profile) return "";
    let str = Array.isArray(profile) ? profile[0] : profile;
    if (typeof str !== 'string') return "";
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        return parsed.map(p => p.title).filter(Boolean).join(", ");
      }
    } catch(e) {}
    if (Array.isArray(profile)) return profile.join(", ");
    return String(profile);
  };
  
  const extractJobType = (profile, fallbackJobType) => {
    if (!profile) return fallbackJobType || "Not specified";
    let str = Array.isArray(profile) ? profile[0] : profile;
    if (typeof str !== 'string') return fallbackJobType || "Not specified";
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(p => p.type).filter(Boolean).join(", ") || fallbackJobType || "Not specified";
      }
    } catch(e) {}
    return fallbackJobType || "Not specified";
  };

  const displayJobProfile = formatJobProfile(jobProfile).trim();
  const displayJobType = extractJobType(jobProfile, jobType);
  const hasJobDetails = showDetailsInUI && (Boolean(displayJobProfile) || Boolean(description?.trim()));
  const openModal = () => { if (hasJobDetails) setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const toggleReadMore = () => setIsReadMore(!isReadMore);

  const formatExp = (min, max, type) => {
    const hasMin = min != null && min !== "";
    const hasMax = max != null && max !== "";
    
    if (hasMin && hasMax) return `${min}-${max} ${type || 'Months'}`;
    if (hasMin) return `Min ${min} ${type || 'Months'}`;
    if (hasMax) return `0-${max} ${type || 'Months'}`;
    return "Not specified";
  };

  const formatSalary = (min, max, type) => {
    const hasMin = min != null && min !== "";
    const hasMax = max != null && max !== "";

    if (hasMin && hasMax) return `₹${min} - ₹${max} ${type || 'per month'}`;
    if (hasMin) return `₹${min} ${type || 'per month'}`;
    if (hasMax) return `₹0 - ₹${max} ${type || 'per month'}`;
    return "Not specified";
  };

  const hasExtraInfo = (hiringProcess && hiringProcess.length > 0) || Boolean(otherBenefit);
  const isLongDesc = description && description.length > 300;
  const needsToggle = isLongDesc || hasExtraInfo;
  const displayedDesc = (!isReadMore && isLongDesc) ? description.slice(0, 300) + '...' : description;

  const companyInitials = (companyName || "CO").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <>
      <div className={`relative border border-gray-100 rounded-xl bg-white p-4 shadow-sm transition-all flex flex-col items-center justify-center h-[120px] ${hasJobDetails ? 'group hover:shadow-md cursor-pointer' : ''}`} onClick={openModal}>
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

        {hasJobDetails && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-xl">
            <button className="bg-primary hover:bg-[#1a0b5a] text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              View Details
            </button>
          </div>
        )}
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={closeModal}>
          <div className="bg-white p-8 md:p-10 rounded-2xl w-full max-w-4xl relative shadow-2xl flex flex-col min-h-[500px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            
            <button className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-3xl leading-none z-10" onClick={closeModal}>
              &times;
            </button>

            {/* HEADER SECTION */}
            <div className="flex flex-col mb-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-wider">
                  {postingType || "Job"}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl select-none"
                  style={{ display: companyLogoSrc ? "none" : "flex", backgroundColor: "#ef4444" }}
                >
                  {companyInitials}
                </div>
                {companyLogoSrc && (
                  <img src={companyLogoSrc} alt={companyName} className="w-16 h-16 object-contain rounded-xl border border-gray-100" />
                )}
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{companyName}</h2>
                  <p className="text-sm text-gray-700">{companyType || "Not specified"}</p>
                </div>
              </div>
              
              
              <h1 className="text-[28px] font-bold text-gray-900 mb-6">{displayJobProfile || "Job Role"}</h1>
              
              <div className="flex flex-col gap-3 text-[16px]">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-gray-700"/>
                  <span className="font-bold text-gray-900 w-24">{postingType === 'Internship' || postingType === 'Apprenticeship' ? 'Duration:' : 'Exp:'}</span>
                  <span className="text-gray-800">{formatExp(minExperience, maxExperience, experienceType)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center font-bold text-gray-700 text-lg leading-none">₹</div>
                  <span className="font-bold text-gray-900 w-24">CTC:</span>
                  <span className="text-gray-800">{formatSalary(minSalary, maxSalary, salaryType)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-gray-700"/>
                  <span className="font-bold text-gray-900 w-24">Location:</span>
                  <span className="text-gray-800">{displayLocation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 size={20} className="text-gray-700"/>
                  <span className="font-bold text-gray-900 w-24">Role Type:</span>
                  <span className="text-gray-800">{displayJobType}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-gray-700"/>
                  <span className="font-bold text-gray-900 w-24">Openings:</span>
                  <span className="text-gray-800">{candidatesRequired}</span>
                </div>
              </div>
            </div>

            {/* JOB DESCRIPTION SECTION */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{postingType || "Job"} Description</h3>
              <h4 className="text-lg font-semibold text-primary mb-2">About the Role</h4>
              {displayJobProfile && <p className="font-semibold text-gray-800 mb-4">Role: {displayJobProfile}</p>}
              
              {description && (
                <div className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">
                  {displayedDesc}
                </div>
              )}
              
              {isReadMore && (
                <>
                  {hiringProcess && hiringProcess.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-primary mb-2">Hiring Process</h4>
                      <ul className="list-disc pl-5 text-gray-600 text-[15px] space-y-1">
                        {hiringProcess.map((process, i) => (
                          <li key={i}>{process}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {otherBenefit && (
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-primary mb-2">Other Benefits</h4>
                      <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">{otherBenefit}</p>
                    </div>
                  )}
                </>
              )}

              {needsToggle && (
                <div className="mt-6 flex justify-center">
                  <button onClick={toggleReadMore} className="text-primary font-semibold hover:underline hover:underline-offset-4 text-[15px]">
                    {isReadMore ? "Read less" : "Read more"}
                  </button>
                </div>
              )}
            </div>



            <div className="flex justify-start">
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

  const displayCards = currentCards.filter(card => !card.status || card.status === "Approved");
  if (displayCards.length === 0) return null;

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
        {displayCards.length > 7 && (
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
          {displayCards.map((jobCard) => (
            <div key={jobCard._id} className="w-[130px] md:w-[150px] xl:w-[calc(14.285%-14px)] shrink-0 snap-start">
              <CompanyCard jobCard={jobCard} />
            </div>
          ))}
        </div>

        {displayCards.length > 7 && (
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
