import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";

export const getPlatformStats = catchAsyncErrors(async (req, res, next) => {
    const usersCount = await User.countDocuments();
    const employersCount = await User.countDocuments({ role: "Employer" });
    const jobSeekersCount = await User.countDocuments({ role: "Job Seeker" });
    const jobsCount = await Job.countDocuments();

    res.status(200).json({
        success: true,
        stats: {
            totalUsers: usersCount,
            employers: employersCount,
            jobSeekers: jobSeekersCount,
            totalJobs: jobsCount,
        }
    });
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find().select("-otpHash -password");
    res.status(200).json({ success: true, users });
});
