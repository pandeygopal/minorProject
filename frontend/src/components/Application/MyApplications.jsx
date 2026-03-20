import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch applications");
    }
  }, [isAuthorized, user]);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo]);

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">
          {user?.role === "Employer" ? "Received Applications" : "My Applications"}
        </h1>

        {applications.length <= 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">description</span>
            <p className="mt-4 text-slate-500 font-medium">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((element) => (
              <div
                key={element._id}
                className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">Name</p>
                    <p className="text-slate-900 dark:text-white font-medium">{element.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">Email</p>
                    <p className="text-slate-900 dark:text-white font-medium">{element.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">Phone</p>
                    <p className="text-slate-900 dark:text-white font-medium">{element.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">Address</p>
                    <p className="text-slate-900 dark:text-white font-medium">{element.address}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Cover Letter</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{element.coverLetter}</p>
                </div>

                {user?.role === "Job Seeker" && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => deleteApplication(element._id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      Delete Application
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
