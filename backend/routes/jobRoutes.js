import express from "express";
import {
  deleteJob,
  getAllJobs,
  getMyJobs,
  getSingleJob,
  postJob,
  updateJob,
  getJobsWithinRadius
} from "../controllers/jobController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getAllJobs);
router.get("/radius/:radius/center/:lat,:lng", getJobsWithinRadius);
router.post("/post", isAuthenticated, postJob);
router.get("/getmyjobs", isAuthenticated, getMyJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);
router.get("/:id", isAuthenticated, getSingleJob);

export default router;
