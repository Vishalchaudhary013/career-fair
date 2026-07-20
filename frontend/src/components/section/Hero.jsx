import { LucideHandshake, X, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Hero = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loading } = useAuth();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER"); // "ORGANIZER" or "USER"
  const [step, setStep] = useState("EMAIL"); // "EMAIL" or "OTP"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleOpenModal = (role) => {
    setSelectedRole(role);
    setStep("EMAIL");
    setEmail("");
    setOtp("");
    setErrorMsg("");
    setDevOtp("");
    setShowOtpModal(true);
  };

  const handleSendOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim()) return;

    try {
      const res = await sendOtp({ email: email.trim(), role: selectedRole });
      if (res?.alreadyVerified) {
        setShowOtpModal(false);
        const loggedInUser = res.user;
        if (loggedInUser.role === "SUPER_ADMIN") {
          navigate('/super-admin-dashboard');
        } else if (loggedInUser.role === "ADMIN") {
          navigate(loggedInUser.id ? `/admin-dashboard/${loggedInUser.id}` : '/admin-dashboard');
        } else {
          navigate('/');
        }
        return;
      }
      if (res?.devOtp) setDevOtp(res.devOtp);
      setStep("OTP");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!otp.trim()) return;

    try {
      const res = await verifyOtp({ email: email.trim(), otp: otp.trim(), role: selectedRole });
      setShowOtpModal(false);
      
      const loggedInUser = res.user || JSON.parse(localStorage.getItem("user") || "{}");
      if (loggedInUser.role === "SUPER_ADMIN") {
        navigate('/super-admin-dashboard');
      } else if (loggedInUser.role === "ADMIN") {
        navigate(loggedInUser.id ? `/admin-dashboard/${loggedInUser.id}` : '/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full bg-white">
        <div className="max-w-[1400px] w-full mx-auto min-h-[100vh] flex items-center justify-center pt-20 px-4">
          <div className='flex flex-col justify-center items-center text-center'>
            <h2 className='mb-8 md:mb-12 text-3xl md:text-5xl font-semibold text-primary px-2'>Connecting Students, Universities <br className="hidden md:block" /> & Employers at Scale</h2>

            <div className='text-base md:text-xl mb-8 md:mb-12 text-secondary px-2 max-w-3xl'>
              Discover careers, build skills, access internships, hire talent, and <br className="hidden md:block" /> participate in India's largest career & employability ecosystem.
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-8 md:mb-10 w-full px-4 sm:w-auto">
              <button 
                onClick={() => handleOpenModal("EMPLOYER")}
                className='w-full sm:w-auto text-base md:text-xl font-semibold flex items-center justify-center gap-2.5 border border-primary/20 rounded-full px-6 py-2.5 bg-primary text-white transition-all shadow-sm hover:opacity-95 cursor-pointer'
              >
                <FaRegUser />Register as Employer
              </button>
              <button 
                onClick={() => handleOpenModal("USER")}
                className='w-full sm:w-auto text-base md:text-xl font-semibold text-primary inline-flex items-center justify-center gap-2.5 border border-primary/20 rounded-full px-6 py-2.5 bg-primary text-white transition-all shadow-sm hover:opacity-95 cursor-pointer'
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
                <span className='text-secondary text-sm md:text-xl mt-2'>Career Events</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* OTP Auth Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

          
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                {selectedRole === "EMPLOYER" ? "Employer Signup / Login" : "Job Seeker Signup / Login"}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-3">
                {step === "EMAIL" ? "Welcome to Career Fairs" : "Verify OTP"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {step === "EMAIL" 
                  ? "Enter your email to receive a verification code" 
                  : `We sent a 6-digit code to ${email}`}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            
            {step === "EMAIL" ? (
              <form onSubmit={handleSendOtpSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 text-left">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@company.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-primary focus:bg-white text-gray-800 font-medium"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 text-left">
                    New users will receive a one-time OTP for email verification.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {loading ? "Logging in..." : "Log In"}
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
           
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 text-left">Enter 6-Digit OTP</label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      placeholder="000000"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-center text-xl tracking-[0.4em] font-bold outline-none transition focus:border-primary focus:bg-white text-gray-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-sm font-semibold text-white transition hover:bg-secondary/90 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                  <ArrowRight size={16} />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep("EMAIL"); setOtp(""); setErrorMsg(""); }}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Change Email / Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
