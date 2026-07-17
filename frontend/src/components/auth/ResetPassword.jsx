import { Link, useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { resetPassword } from "../services/authApi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setMessage("");

    try {
      const data = await resetPassword(token, password);
      setMessage(data.message || "Password reset successfully");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Invalid or expired token. Please try requesting a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(17,0,96,0.18),transparent_35%),linear-gradient(180deg,#f8f7ff_0%,#ffffff_45%,#f4f5fb_100%)] px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-0 lg:min-h-[calc(100vh-5rem)] w-full max-w-[650px] items-center justify-center">
        <div className="w-full overflow-hidden rounded-lg sm:rounded-xl border border-black/5 bg-white shadow-[0_30px_80px_rgba(17,0,96,0.12)]">
          <div className="px-5 py-8">
            <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
              <div>
                <h1 className="mt-5 text-3xl text-center font-semibold tracking-tight text-black sm:text-4xl">
                  Reset Password
                </h1>
                <p className="mt-3 mb-5 max-w-lg text-sm leading-6 text-black/65 sm:text-base text-center mx-auto">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl sm:rounded-[1.75rem] p-5 sm:p-8">
                {errorMsg && (
                  <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {errorMsg}
                  </div>
                )}
                
                {message && (
                  <div className="p-3 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    {message}
                    <p className="mt-2 text-xs">Redirecting to login...</p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">New Password</label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      placeholder="Enter new password"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-12 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35 hover:text-black/60 transition-colors"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">Confirm New Password</label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      placeholder="Confirm new password"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-12 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <button 
                    disabled={loading || !!message} 
                    type="submit" 
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-12 py-3 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:bg-secondary/90 disabled:opacity-50"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
