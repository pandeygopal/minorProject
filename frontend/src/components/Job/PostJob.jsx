import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food & Beverage");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState(1000);
  const [salaryTo, setSalaryTo] = useState(10000);
  // Add coordinates if needed, but for now we'll just send standard data.

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const handleJobPost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        {
          title,
          description,
          category,
          country,
          city,
          location,
          salaryFrom,
          salaryTo,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Create Job Post</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Recruit the best talent in your neighborhood.</p>
        </div>

        <form onSubmit={handleJobPost} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-6 sm:p-8 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Job Title</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">work</span>
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Senior Barista"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">category</span>
                      <select
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option>Food & Beverage</option>
                        <option>Retail</option>
                        <option>Logistics</option>
                        <option>Healthcare</option>
                        <option>Customer Service</option>
                        <option>Technology</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Country</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">City</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Salary Range</label>
                    <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full text-sm">
                      ${salaryFrom} - ${salaryTo}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      placeholder="Min Salary"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      placeholder="Max Salary"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Job Description</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder="Describe the role and what you are looking for..."
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4">
                <button type="submit" className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all transform hover:-translate-y-0.5">
                  Post Job
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  Set Shop Location
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner group">
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    <img className="w-full h-full object-cover" alt="Map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmq65yBVP0NHCWOlJ_uVJMg6saKwsdCbLP0VlvHXJljgoLTPAzc1A_NX6ogQEfBgLQWWJE6JRuA4nM9cc_TJY-lvYGmTvgr8lXQUKI-yC0U3H4Tg42pe1-iK1RT6YpKdjliqkQH_AB8Lbq2msQWgN2F_H9Nd69Mj1CWnOauzlwBBBt10AziHJ-mtxMKjZq1cpoiHR45n9NWVqRsQc6llEy1Rii12DJMJmpjkcoq3po2X2D50U870z_4kN9oavLoAGYoaUhw4c5skOO" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                    <div className="bg-primary text-white p-2 rounded-full shadow-lg animate-bounce">
                      <span className="material-symbols-outlined block">store</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input
                      className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Full Address / Location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Hyperlocal Boost</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Target workers within your radius automatically.</p>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-primary/10 text-8xl rotate-12 select-none">rocket_launch</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PostJob;
