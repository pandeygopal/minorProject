import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, [id, navigateTo]);

  useEffect(() => {
    if (job.postedBy) {
      const employerId = typeof job.postedBy === 'object' ? job.postedBy._id : job.postedBy;
      axios.get(`http://localhost:4000/api/v1/review/${employerId}`, { withCredentials: true })
        .then(res => setReviews(res.data.reviews || []))
        .catch(err => console.error(err));
    }
  }, [job.postedBy]);

  const handlePostReview = async (e) => {
    e.preventDefault();
    try {
      const employerId = typeof job.postedBy === 'object' ? job.postedBy._id : job.postedBy;
      const { data } = await axios.post("http://localhost:4000/api/v1/review/post", {
        revieweeId: employerId,
        jobId: job._id,
        rating,
        comment
      }, { withCredentials: true });
      toast.success(data.message);
      
      setReviews([...reviews, { ...data.review, reviewerId: { _id: user._id, name: user.name, role: user.role } }]);
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post review");
    }
  };

  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section className="jobDetail page bg-background-light dark:bg-background-dark min-h-[calc(100vh-64px)] py-10">
      <div className="container max-w-4xl mx-auto px-4 space-y-8">
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center">Job Details</h3>
          <div className="banner flex flex-col gap-4">
            <div className="detail-item text-lg">
              <strong className="text-slate-900 dark:text-white">Title:</strong> <span className="text-slate-600 dark:text-slate-400">{job.title}</span>
            </div>
            <div className="detail-item text-lg">
              <strong className="text-slate-900 dark:text-white">Category:</strong> <span className="text-slate-600 dark:text-slate-400">{job.category}</span>
            </div>
            <div className="detail-item text-lg">
              <strong className="text-slate-900 dark:text-white">Country:</strong> <span className="text-slate-600 dark:text-slate-400">{job.country}</span>
            </div>
            <div className="detail-item text-lg">
              <strong className="text-slate-900 dark:text-white">City:</strong> <span className="text-slate-600 dark:text-slate-400">{job.city}</span>
            </div>
            <div className="detail-item text-lg">
              <strong className="text-slate-900 dark:text-white">Location:</strong> <span className="text-slate-600 dark:text-slate-400">{job.location}</span>
            </div>
            <div className="detail-item text-lg">
              <strong className="text-slate-900 dark:text-white">Description:</strong> <span className="text-slate-600 dark:text-slate-400">{job.description}</span>
            </div>
            <div className="detail-item text-lg">
              <strong className="text-slate-900 dark:text-white">Job Posted On:</strong> <span className="text-slate-600 dark:text-slate-400">{job.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString() : ''}</span>
            </div>
            <div className="detail-item text-lg">
              <strong className="text-slate-900 dark:text-white">Salary:</strong>{" "}
              <span className="text-slate-600 dark:text-slate-400">
                {job.fixedSalary ? `$${job.fixedSalary}` : `$${job.salaryFrom} - $${job.salaryTo}`}
              </span>
            </div>

            {user && user.role !== "Employer" && (
              <div>
                <Link to={`/application/${job._id}`} className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-xl text-center shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all">
                  Apply Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">star</span> Employer Trust & Ratings
          </h3>
          
          <div className="space-y-4 mb-8">
            {reviews.length > 0 ? reviews.map(rev => (
              <div key={rev._id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">person</span>
                    {rev.reviewerId?.name || "Unknown User"}
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">{rev.reviewerId?.role || "User"}</span>
                  </div>
                  <div className="flex items-center text-yellow-400 text-sm">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                    {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined">star</span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{rev.comment}</p>
              </div>
            )) : (
              <p className="text-slate-500 italic text-sm">No reviews for this employer yet.</p>
            )}
          </div>

          {user && user.role !== "Employer" && (
            <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Leave a Review</h4>
              <form onSubmit={handlePostReview} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Rating</label>
                  <select 
                    value={rating} 
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Comment</label>
                  <textarea 
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                    placeholder="Share your experience working with this employer..."
                    className="w-full p-3 h-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all">
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
