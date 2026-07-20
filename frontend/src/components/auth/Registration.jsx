import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Mail, ShieldCheck, UserRound, Phone, KeyRound, Eye, Check } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useState } from "react";


const Registration = () => {

  const {register, verifyOtp, loading} = useAuth()
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formData, setFormData] = useState({
  name: "",
  organisationName: "",
  email: "",
  number: "",
  userName: "",
  password: "",
});

const navigate = useNavigate()

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
    setErrorMsg("");
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setErrorMsg("");
    try{
      await register(formData)
      setRegisteredEmail(formData.email)
      setShowOtpModal(true)
    }catch(error){
       setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
       console.log(error.response?.data);
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    try {
      const res = await verifyOtp({ email: registeredEmail, otp: otpValue });
      if (res && res.message && res.message.includes("pending")) {
        setPendingApproval(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(17,0,96,0.16),transparent_30%),linear-gradient(180deg,#fbfbff_0%,#ffffff_48%,#f3f5fb_100%)] px-4 ">
      <div className="mx-auto grid min-h-0 lg:min-h-[calc(100vh-5rem)] w-full max-w-[1400px] overflow-hidden rounded-lg sm:rounded-xl border border-black/5 bg-white shadow-[0_30px_80px_rgba(17,0,96,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden bg-primary px-6 sm:px-8 py-8 sm:py-10 text-white lg:px-14">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight">
                Career Fairs
              </Link>
              <h2 className="mt-8 max-w-lg text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Create your admin profile
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Admin users can sign up with identity, organization details, and work email. Account activation requires email verification and Super Admin approval.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pt-8 sm:px-10 lg:px-14 lg:pt-12">
          <div className="mx-auto flex h-full max-w-2xl flex-col justify-center">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Admin Signup
              </span>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-black sm:text-4xl text-center">
                Sign up to create and manage fairs
              </h1>
              
            </div>
            <form className="space-y-5  p-5 " onSubmit={handleSubmit}>
              
              {errorMsg && (
                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">Host Name</label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      name="name"
                      placeholder="Enter host name"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-4 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">Organisation Name</label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                    value={formData.organisationName}
onChange={handleChange}
                      type="text"
                      name="organisationName"
                      placeholder="Enter organisation name"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-4 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">Work Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                    value={formData.email}
onChange={handleChange}
                      type="email"
                      name="email"
                      placeholder="Enter work email"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-4 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">Contact Number</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                    value={formData.number}
onChange={handleChange}
                      type="tel"
                      name="number"
                      placeholder="Enter contact number (e.g. +91...)"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-4 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">User Name</label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                    value={formData.userName}
onChange={handleChange}
                      type="text"
                      name="userName"
                      placeholder="Create user name"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-4 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">Create Password</label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                    value={formData.password}
onChange={handleChange}
                      type="password"
                      name="password"
                      placeholder="Create password"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-12 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35 hover:text-black/60 transition-colors"
                      tabIndex="-1"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-secondary px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-secondary/90 disabled:opacity-50"
              >
                {loading ? "Creating" : "Create account"}
                <ArrowRight size={16} />
              </button>

              {/* <div className="relative py-2 text-center text-xs font-medium uppercase tracking-[0.3em] text-black/35">
                <span className="relative z-10 bg-white px-3">Or continue with</span>
                <span className="absolute left-0 top-1/2 h-px w-full bg-black/10" />
              </div> */}

              {/* <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:border-primary/25 hover:bg-black/2 cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:border-primary/25 hover:bg-black/2 cursor-not-allowed opacity-50">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
                    <path d="M9 17H6.5v-7H9v7zM7.75 8.9c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM18 17h-2.4v-3.8c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6 1.6V17H10v-7h2.4v1c.4-.7 1.2-1.2 2.1-1.2 1.7 0 3.5 1.3 3.5 3.5V17z" fill="white" />
                  </svg>
                  LinkedIn
                </button>
              </div> */}

              <p className=" text-sm text-center leading-6 text-black/55">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary underline decoration-primary/30 underline-offset-4"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            
            {pendingApproval ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                  <Check size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful</h3>
                <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                  Your email has been verified! However, since you registered as an Admin, your account is currently pending <span className="font-semibold text-gray-900">Super Admin approval</span>. You will receive an email as soon as it is approved.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-center text-sm text-gray-500 mb-6">
                  We've sent a 6-digit verification code to <span className="font-semibold text-gray-800">{registeredEmail}</span>.
                </p>
                
                <form onSubmit={handleVerifyOtp} className="space-y-4">
              {otpError && (
                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {otpError}
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-black/75">Enter OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="000000"
                  className="w-full rounded-xl border border-black/10 bg-black/2 py-3 px-4 text-center text-2xl tracking-[0.5em] font-semibold outline-none transition focus:border-primary/35 focus:bg-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || otpValue.length !== 6}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;