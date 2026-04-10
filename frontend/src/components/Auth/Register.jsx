import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import API_BASE_URL from "../../utils/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const startVoiceSetup = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return toast.error("Your browser does not support Voice Recognition. Please use Chrome/Edge.");
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast.success("Listening... Speak your name, email, phone, etc.", { duration: 4000 });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      if(event.error !== 'no-speech') {
        toast.error("Microphone error: " + event.error);
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsProcessing(true);
      toast.loading("AI is parsing your voice...", { id: "ai-parse" });
      
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/v1/user/ai-voice-setup`, { transcript });
        const parsed = data.data;
        
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.role) {
           const parsedRole = parsed.role.toLowerCase().includes("employer") ? "Employer" : "Job Seeker";
           setRole(parsedRole);
        }
        
        toast.success("Form magically auto-filled!", { id: "ai-parse" });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "AI parsing failed.", { id: "ai-parse" });
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.start();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/register`,
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[calc(100vh-64px)] overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-10">
        <form onSubmit={handleRegister} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">Create Profile</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 font-medium">Easy Registration for the Hyperlocal Network</p>
            </div>

            <div className="flex flex-col gap-6 bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-full">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Select Your Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("Job Seeker")}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group ${role === "Job Seeker" ? 'border-primary bg-primary/10' : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'}`}
                  >
                    <span className={`material-symbols-outlined text-4xl ${role === "Job Seeker" ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>engineering</span>
                    <span className={`font-bold ${role === "Job Seeker" ? 'text-primary' : 'text-slate-700 dark:text-slate-300 group-hover:text-primary'}`}>Job Seeker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("Employer")}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all group ${role === "Employer" ? 'border-primary bg-primary/10' : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'}`}
                  >
                    <span className={`material-symbols-outlined text-4xl ${role === "Employer" ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>storefront</span>
                    <span className={`font-bold ${role === "Employer" ? 'text-primary' : 'text-slate-700 dark:text-slate-300 group-hover:text-primary'}`}>Employer</span>
                  </button>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                    placeholder="Enter your full name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                  <input className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                    placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone</span>
                    <input className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                      placeholder="Phone number" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                    <input className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                      placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={startVoiceSetup}
              className={`bg-primary/5 border cursor-pointer transition-all border-dashed rounded-2xl p-6 flex items-center justify-between ${isRecording ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' : 'border-primary/30 hover:border-primary/50'}`}
            >
              <div className="flex items-center gap-6 pointer-events-none">
                <div className={`text-white h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-all ${isRecording ? 'bg-red-500 animate-pulse scale-110 shadow-red-500/50' : 'bg-primary shadow-primary/30'}`}>
                  <span className="material-symbols-outlined text-3xl">{isRecording ? 'mic' : (isProcessing ? 'hourglass_empty' : 'mic')}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">{isRecording ? 'Listening...' : (isProcessing ? 'Analyzing Voice...' : 'AI Voice Setup')}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {isRecording ? "Speak normally now..." : "Tell Groq & GitHub AI your details to auto-fill!"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map & Submit */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col justify-between">

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    Confirm Your Location
                  </h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">LIVE GPS</span>
                </div>

                <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <div className="w-full h-full bg-cover bg-center grayscale opacity-60 dark:opacity-30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjTN_aGznEX1RHai6I1d7F5THlBWkZmiSfVUQDZd5hI25LDRyOUiSsh0rEoEFGAXROjU2jINxOIktdGiXUZj-4_idSRdYVeJV3OxfwJiE0j5Lk-OEscyIxkBtcp1STL0wKios1ZVNGwCDj-MplHlLkD5Dd1a3ZISZOemMDVDGpPnF_bPn_BN4KRJISxqgN_8qhpQiyfcEtsNUGlSnW_1siWPeAZb4BUYbWZEsLR1RCcPYqKQeQT-jhTZiIb2yqJ_Fb-_2bgo-w62c-')" }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
                        <span className="material-symbols-outlined text-primary text-5xl relative z-10">location_on</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all">
                  REGISTER NOW
                </button>
                <div className="text-center text-sm font-medium">
                  Already have an account? <Link to="/login" className="text-primary hover:underline">Login Now</Link>
                </div>
              </div>

            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
