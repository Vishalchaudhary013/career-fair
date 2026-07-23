import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";


const Login = () => {
  const [showPassword,setShowPassword] = useState(false)
   const navigate = useNavigate();
  
const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  

  // const handleGoogleSuccess = async (tokenResponse) => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const res = await handleGoogleAccessTokenLogin(tokenResponse.access_token);
  //     if (res && res.role === "superadmin") {
  //       navigate("/super-admin-dashboard", { replace: true });
  //     } else {
  //       const from = location.state?.from || "/";
  //       navigate(from, { replace: true });
  //     }
  //   } catch (err) {
  //     setError(err.message || "Google login failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGoogleError = () => {
  //   setError("Google Sign-In failed. Please try again.");
  // };

  // const loginWithGoogleCustom = useGoogleLogin({
  //   onSuccess: handleGoogleSuccess,
  //   onError: handleGoogleError,
  // });

  const [errorMsg, setErrorMsg] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const data = await login(formData)

      console.log(data)
      if (data.user.role === "SUPER_ADMIN") {
        navigate('/super-admin-dashboard');
      } else if (data.user.role === "ADMIN" || data.user.role === "ORGANIZER") {
        navigate(`/admin-dashboard/${data.user.id || ""}`);
      } else if (data.user.role === "EMPLOYER") {
        navigate('/employer-dashboard');
      } else {
        navigate('/fairs');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login failed. Please check your credentials.");
      console.log(error.response?.data);
    }
    
  };
  return (
     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(17,0,96,0.18),transparent_35%),linear-gradient(180deg,#f8f7ff_0%,#ffffff_45%,#f4f5fb_100%)] px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-0 lg:min-h-[calc(100vh-5rem)] w-full max-w-[500px] items-center justify-center">
        <div className="w-full overflow-hidden rounded-lg sm:rounded-xl border border-black/5 bg-white shadow-[0_30px_80px_rgba(17,0,96,0.12)]">
         

          <div className="px-5 py-8">
            <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
              <div>
                
                <h1 className="mt-5 text-3xl text-center font-semibold tracking-tight text-black sm:text-4xl">
                  Login  
                </h1>
                <p className="mt-3 mb-5 max-w-lg text-sm leading-6 text-black/65 sm:text-base text-center mx-auto">
                  Enter your email and password to access your  account.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5 rounded-2xl sm:rounded-[1.75rem]   p-5 sm:p-8">
               
                {errorMsg && (
                  <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-black/75">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-black/10 bg-black/2 py-3.5 pl-11 pr-4 outline-none transition focus:border-primary/35 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex justify-between items-center text-sm font-medium text-black/75">
                    <span>Password</span>
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required 
                      placeholder="Enter your password"
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

                <div className="w-full">
                  <button disabled={loading} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-12 py-3 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:bg-secondary/90 disabled:opacity-50">
                    {loading ? "Logging in..." : "Login"}
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* <div className="relative py-2 text-center text-xs font-medium uppercase tracking-[0.3em] text-black/35">
                  <span className="relative z-10 bg-white px-3">Or continue with</span>
                  <span className="absolute left-0 top-1/2 h-px w-full bg-black/10" />
                </div> */}

                {/* <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button"  className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:border-primary/25 hover:bg-black/2 cursor-pointer">
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

                <p className="text-center text-sm leading-6 text-black/55">
                  New here? <Link to="/signup" className="font-semibold text-primary underline decoration-primary/30 underline-offset-4">Create an account</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
