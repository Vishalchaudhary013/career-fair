import { LucideHandshake, X, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import OtpModal from './OtpModal';
import { FaRegUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER"); // "ORGANIZER" or "USER"

  const handleOpenModal = (role) => {
    setSelectedRole(role);
    setShowOtpModal(true);
  };

  return (
    <>
      <div className="w-full bg-[#EAF6FF]">
        <div className="max-w-[1400px] w-full mx-auto min-h-[100vh] flex items-center justify-center pt-20 px-4">
          <div className='flex flex-col justify-center items-center text-center'>
            <h2 className='mb-8 md:mb-12 text-3xl md:text-5xl font-semibold text-primary px-2'>Connecting Students, Universities <br className="hidden md:block" /> & Employers at Scale</h2>

            <div className='text-base md:text-xl mb-8 md:mb-12 text-secondary px-2 max-w-3xl'>
              Discover careers, build skills, access internships, hire talent, and <br className="hidden md:block" /> participate in India's largest career & employability ecosystem.
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-10 w-full px-4 sm:w-auto">
              <button 
                onClick={() => handleOpenModal("EMPLOYER")}
                className='w-full sm:w-auto text-base md:text-xl font-semibold flex items-center justify-center gap-2.5 border border-primary/20 rounded-full px-6 py-2.5 bg-primary text-white transition-all shadow-sm hover:opacity-95 cursor-pointer'
              >
                <FaRegUser />Register as Employer
              </button>
              <button 
                onClick={() => handleOpenModal("USER")}
                className='w-full sm:w-auto text-base md:text-xl font-semibold text-primary flex items-center justify-center gap-2.5 border border-primary/20 rounded-full px-6 py-2.5 bg-primary text-white transition-all shadow-sm hover:opacity-95 cursor-pointer'
              >
                <LucideHandshake /> Register as Job seeker
              </button>
            </div>
            
            <div className='grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-8 md:gap-16 mt-8 md:mt-12 w-full max-w-4xl px-4'>
              <div className='flex flex-col items-center text-center'>
                <span className='text-3xl md:text-5xl font-bold text-primary tracking-tight'>1M+</span>
                <span className='text-secondary text-sm md:text-xl mt-2'>Students Reached</span>
              </div>
              
              <div className='flex flex-col items-center text-center'>
                <span className='text-3xl md:text-5xl font-bold text-primary tracking-tight'>5,000+</span>
                <span className='text-secondary text-sm md:text-xl mt-2'>Employers</span>
              </div>

              <div className='flex flex-col items-center text-center'>
                <span className='text-3xl md:text-5xl font-bold text-primary tracking-tight'>1,000+</span>
                <span className='text-secondary text-sm md:text-xl mt-2'>Institutions</span>
              </div>

              <div className='flex flex-col items-center text-center'>
                <span className='text-3xl md:text-5xl font-bold text-primary tracking-tight'>100+</span>
                <span className='text-secondary text-sm md:text-xl mt-2'>Career Fairs</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* OTP Auth Modal */}
        <OtpModal 
          isOpen={showOtpModal} 
          onClose={() => setShowOtpModal(false)} 
          defaultRole={selectedRole} 
        />
    </>
  );
};

export default Hero;
