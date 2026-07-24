import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const OtpModal = ({ isOpen, onClose, defaultRole = "USER" }) => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loading } = useAuth();

  const [step, setStep] = useState("EMAIL"); // "EMAIL" or "OTP"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("EMAIL");
      setEmail("");
      setOtp("");
      setErrorMsg("");
      setDevOtp("");
      setSelectedRole(defaultRole);
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  const handleSendOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim()) return;

    try {
      const res = await sendOtp({ email: email.trim(), role: selectedRole });
      if (res?.alreadyVerified) {
        onClose();
        const loggedInUser = res.user;
        if (loggedInUser.role === "SUPER_ADMIN") {
          navigate('/super-admin-dashboard');
        } else if (loggedInUser.role === "ADMIN") {
          navigate(loggedInUser.id ? `/admin-dashboard/${loggedInUser.id}` : '/admin-dashboard');
        } else if (loggedInUser.role === "EMPLOYER") {
          navigate('/employer-dashboard');
        } else {
          navigate('/fairs');
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
      onClose();
      
      const loggedInUser = res.user || JSON.parse(localStorage.getItem("user") || "{}");
      if (loggedInUser.role === "SUPER_ADMIN") {
        navigate('/super-admin-dashboard');
      } else if (loggedInUser.role === "ADMIN") {
        navigate(loggedInUser.id ? `/admin-dashboard/${loggedInUser.id}` : '/admin-dashboard');
      } else if (loggedInUser.role === "EMPLOYER") {
        navigate('/employer-dashboard');
      } else {
        navigate('/fairs');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 p-8">
        <button
          onClick={onClose}
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
  );
};

export default OtpModal;
