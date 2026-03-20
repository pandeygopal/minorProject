import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  // AI fields
  const [skills, setSkills] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  // Handle Application Submit
  const handleApplication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post application");
    }
  };

  const generateAICoverLetter = async () => {
    if (!skills) {
      toast.error("Please enter some skills to generate a targeted cover letter.");
      return;
    }
    setIsGenerating(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/ai-generate-cover-letter",
        { jobId: id, userName: name || user?.name, skills },
        { withCredentials: true }
      );
      if (data.success && data.coverLetter) {
        setCoverLetter(data.coverLetter);
        toast.success("AI Cover Letter Generated!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized || (user && user.role === "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-[calc(100vh-64px)] py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Application Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
          <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Submit Application</h2>
            <p className="text-slate-500 font-medium mt-1">Provide your details and upload your resume to apply.</p>
          </div>

          <form onSubmit={handleApplication} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Your Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Phone Number</label>
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (123) 456-7890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, New York"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Cover Letter</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write your cover letter here, or use the Groq AI assistant on the right to autocomplete..."
                className="w-full px-4 py-3 h-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Upload Resume (PDF/DOC)</label>
              <input
                type="file"
                accept=".webp, .png, .jpg" // Based on Cloudinary config inside applicationSchema/Controller usually accepting images in original project
                onChange={(e) => setResume(e.target.files[0])}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 cursor-pointer text-sm"
                required
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-black text-lg shadow-lg hover:scale-[1.01] transition-transform">
              Send Application
            </button>
          </form>
        </div>

        {/* AI Assistant Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500">
              <span className="material-symbols-outlined text-9xl text-primary">auto_awesome</span>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">Groq AI</h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">Cover Letter Writer</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium">
                Struggling with words? Tell our AI your core skills, and we'll instantly generate a highly tailored cover letter utilizing Groq's high-speed Llama3 models.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Your Key Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, Leadership"
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>

                <button
                  onClick={generateAICoverLetter}
                  disabled={isGenerating}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  <span className={`material-symbols-outlined ${isGenerating ? 'animate-spin' : ''}`}>
                    {isGenerating ? 'refresh' : 'auto_awesome'}
                  </span>
                  {isGenerating ? 'Generating...' : 'Auto-Generate'}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Application;
