import { useState } from "react";
import { SERVER_URL } from "../../config";
import { t } from "../../utils/translations";

const CompanyCard = ({ jobCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const {
    logoLink = "",
    logo = "",
    companyLogo = "",
    companyName = "Company Name",
    jobProfile = "",
    candidatesRequired = "N/A",
    location = "",
    jobLocation = "",
    language = "English",
  } = jobCard || {};

  const displayLogo = logoLink || logo || companyLogo;
  const companyLogoSrc = displayLogo
    ? (displayLogo.startsWith("http") 
        ? displayLogo 
        : (displayLogo.startsWith("companyLogo") || displayLogo.startsWith("file-")
           ? `${SERVER_URL}/uploads/files/${displayLogo}` 
           : `${SERVER_URL}/uploads/logo/${displayLogo}`))
    : "";

  const displayLocation = location || jobLocation || "Location not specified";

  const formatJobProfile = (profile) => {
    if (!profile) return "";
    let str = Array.isArray(profile) ? profile[0] : profile;
    if (typeof str !== 'string') return "";
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        return parsed.map(p => p.title).filter(Boolean).join("\n");
      }
    } catch(e) {}
    if (Array.isArray(profile)) return profile.join("\n");
    return String(profile);
  };
  const displayJobProfile = formatJobProfile(jobProfile);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
     
      <div className="companyCardWrapper">
        <div className="companyCardSimple">
          <img
            src={companyLogo ? companyLogoSrc : ""}
            alt={companyName}
            className="companyLogoSimple"
          />

         
          <div className="cardOverlay">
            <button className="viewDetailBtn" onClick={openModal}>
              {t(language, "viewDetails")}
            </button>
          </div>
        </div>
      </div>

      
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            
            <span className="modalClose" onClick={closeModal}>
              ×
            </span>

            <h2>{companyName}</h2>
            <p>
              <strong>{t(language, "jobLocation")}:</strong> {displayLocation}
            </p>
            <p>
              <strong>{t(language, "totalCandidatesRequired")}:</strong> {candidatesRequired}
            </p>

           
            <div className="modalDescription">
              <p className="jobProfileHeading">
                <strong>{t(language, "jobProfileText")}</strong>
              </p>
              {(displayJobProfile || "").split("\n").map((line, i) => (
                <p className="jobProfile" key={i}>
                  {line}
                </p>
              ))}
            </div>

            
            <button className="modalCancelBtn" onClick={closeModal}>
              {t(language, "cancel")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyCard;
