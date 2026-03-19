import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");

  // OTP states
  const [loginMode, setLoginMode] = useState("password");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error("Please enter a phone number");
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/send-otp",
        { phone, role },
        { withCredentials: true }
      );
      toast.success(data.message);
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/verify-otp",
        { phone, role, otp },
        { withCredentials: true }
      );
      toast.success(data.message);
      setPhone("");
      setOtp("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-3xl text-primary block">
              {loginMode === "otp" ? "pin_invoke" : "login"}
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium mt-1">Login to access your dashboard</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl mb-6">
          <button type="button" onClick={() => { setLoginMode("password"); setOtpSent(false); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMode === "password" ? "bg-white dark:bg-slate-700 shadow text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Password</button>
          <button type="button" onClick={() => setLoginMode("otp")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMode === "otp" ? "bg-white dark:bg-slate-700 shadow text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>OTP Login</button>
        </div>

        <form onSubmit={loginMode === "password" ? handlePasswordLogin : (otpSent ? handleVerifyOtp : handleSendOtp)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Login As</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("Job Seeker")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all ${role === "Job Seeker" ? 'border-primary bg-primary/10 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary/50'}`}
              >
                <span className="material-symbols-outlined text-xl">engineering</span>
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("Employer")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all ${role === "Employer" ? 'border-primary bg-primary/10 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary/50'}`}
              >
                <span className="material-symbols-outlined text-xl">storefront</span>
                Employer
              </button>
            </div>
          </div>

          {loginMode === "password" ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Phone Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone</span>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all disabled:opacity-50"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Enter OTP</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">pin</span>
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium tracking-widest text-center focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-xl"
                      placeholder="••••••"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            {loading && <span className="material-symbols-outlined animate-spin">refresh</span>}
            {loginMode === "password" ? "LOGIN" : (otpSent ? "VERIFY OTP" : "SEND OTP")}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Don't have an account? <Link to="/register" className="text-primary hover:underline font-bold ml-1">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
