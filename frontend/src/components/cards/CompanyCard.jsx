import { useState } from "react";
import { SERVER_URL } from "../../config";

const CompanyCard = ({ jobCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const {
    companyLogo = "",
    companyName = "Company Name",
    jobProfile = "",
    candidatesRequired = "N/A",
    jobLocation = "Location not specified",
  } = jobCard || {};

  const companyLogoSrc = companyLogo
    ? (companyLogo.startsWith("http") 
        ? companyLogo 
        : (companyLogo.startsWith("companyLogo") || companyLogo.startsWith("file-")
           ? `${SERVER_URL}/uploads/files/${companyLogo}` 
           : `${SERVER_URL}/uploads/logo/${companyLogo}`))
    : "";
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
              View Details
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
              <strong>Job Location:</strong> {jobLocation}
            </p>
            <p>
              <strong>Total Candidates Required:</strong> {candidatesRequired}
            </p>

           
            <div className="modalDescription">
              <p className="jobProfileHeading">
                <strong>Job Profile:</strong>
              </p>
              {(jobProfile || "").split("\n").map((line, i) => (
                <p className="jobProfile" key={i}>
                  {line}
                </p>
              ))}
            </div>

            
            <button className="modalCancelBtn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyCard;
