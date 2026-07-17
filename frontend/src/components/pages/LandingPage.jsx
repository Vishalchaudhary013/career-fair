/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * Function contains ::
 * Header
 * -- Logo: LHS
 * -- Login / Talk to us : RHS
 * -- JobFairList
 */

import { useNavigate } from "react-router-dom";
// Child component
import JobFairList from "../lists/JobFairList";

function LandingPage() {
  const navigate = useNavigate();

  /**
   * Function is used to return footer first section.
   */
  function companyInfo(){
    return(
      <div>
            <div className="flex items-center mb-6">
              <i className="bi bi-building-fill text-[2.5rem] mr-4 text-[#00f2fe]"></i>
              <h3 className="text-[1.8rem] font-bold m-0 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">Edeco Consulting</h3>
            </div>  
            <p className="text-base leading-[1.6] text-[#e0e0e0] mb-6">
              Innovative Solutions. Expert Consulting. Accessible for All.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white transition-all duration-300 ease-in-out" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white transition-all duration-300 ease-in-out" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white transition-all duration-300 ease-in-out" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white transition-all duration-300 ease-in-out" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
      );
    }

   /**
    * Function is used to return second section of the footer
   */ 
  function contactInfo(){
    return (
      <div>
            <h4 className="text-[1.4rem] font-semibold mb-6 relative pb-2">Contact Information</h4>
            <div className="flex flex-col gap-[1.2rem]">
              <div className="flex items-start gap-4">
                <i className="bi bi-telephone-fill"></i>
                <div className="flex flex-col">
                  <span className="text-[0.9rem] text-[#b0b0b0]">Phone</span>
                  <a href="tel:+919517777127" className="value">+91 9517777127</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="bi bi-envelope-fill"></i>
                <div className="flex flex-col">
                  <span className="text-[0.9rem] text-[#b0b0b0]">Email</span>
                  <a href="mailto:bavneet.taneja@edeco.in" className="text-white no-underline transition-colors duration-300 hover:text-[#00f2fe]">bavneet.taneja@edeco.in</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="bi bi-clock-fill"></i>
                <div className="flex flex-col">
                  <span className="text-[0.9rem] text-[#b0b0b0]">Working Hours</span>
                  <span className="text-white no-underline transition-colors duration-300 hover:text-[#00f2fe]">Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
    );
  }

  /**
   * Function is used to return the location info in the footer.
   */
  function locationInfo(){
    return(
      <div className="bg-white/5 rounded-[15px] p-8">
            <h4 className="text-[1.4rem] font-semibold mb-6 relative pb-2">Our Location</h4>
            <div className="flex items-start gap-4 mb-6">
              <i className="bi bi-geo-alt-fill text-[1.5rem] text-white"></i>
              <address className="not-italic leading-[1.6] text-[#e0e0e0] m-0">
                F88, Level-3, Verma Tech Park<br />
                S.A.S Nagar, Mohali<br />
                Punjab, India 160055
              </address>
            </div>
            <button className="flex items-center justify-center gap-2 w-full bg-white/10 text-white py-3 px-6 rounded-[25px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#00f2fe] hover:-translate-y-0.5" onClick={() => window.open('https://maps.google.com/?q=Verma Tech Park Mohali', '_blank')}>
              <i className="bi bi-map"></i>
              Get Directions
            </button>
          </div>
      )
  }

  /**
   * Function is used to return the bottom of footer section.
   */
  function footerBottom(){
    return (
      <div className="mt-16">
      <hr className="border border-white/10 my-8" />
      <div className="row align-items-center">
        <div className="col-md-6">
          <p className="text-[#b0b0b0] m-0">
            © {new Date().getFullYear()} Edeco Consulting. All rights reserved.
          </p>
        </div>
        <div className="col-md-6">
          <div className="flex justify-end gap-8">
            <a className="text-[#b0b0b0] no-underline transition-colors duration-300 ease-in-out hover:text-[#00f2fe]" href="#privacy">Privacy Policy</a>
            <a className="text-[#b0b0b0] no-underline transition-colors duration-300 ease-in-out hover:text-[#00f2fe]" href="#terms">Terms of Service</a>
            <a className="text-[#b0b0b0] no-underline transition-colors duration-300 ease-in-out hover:text-[#00f2fe]" href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
    )
  }

  /**
   * Functsion is used to return the footer section.
   */
  function renderFooter(){
    return(
    <footer className="relative bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white py-20 pb-10 overflow-hidden">
    <div className="container relative z-10">
      <div className="row g-4">
        <div className="col-lg-4 col-md-6">
          {companyInfo()}
        </div>
        <div className="col-lg-4 col-md-6">
           {contactInfo()}
        </div>
        <div className="col-lg-4 col-md-6">
          {locationInfo()}
        </div>
      </div>
          {footerBottom()}
    </div>
  </footer>
    );
  }

  return (
    <>
    <div className="flex justify-between  items-center px-4 py-3 shadow-sm bg-white sticky top-0 z-50">
      <div className="flex items-center">
        <img
          src="./cf-logo.png"
          alt="Career Fairs Logo"
          className="h-[50px] w-auto object-contain"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          className="mr-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition-colors"
          onClick={() => navigate("/login")}
        >
        Admin Login
        </button>
        <a
          href="https://wa.me/9216490490?text=I'm%20interested%20in%20admin%20credentials%20for%20JobFairs"
          target="_blank"
          className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white no-underline rounded-lg font-medium shadow-sm transition-colors"
          rel="noreferrer"
        >
        <i className="bi bi-whatsapp mr-2 text-xl"></i>
        Talk to Us
      </a>
    </div>
    </div>
    <JobFairList />
    {renderFooter()}
    </>
  );
}

export default LandingPage;
