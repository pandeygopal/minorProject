import { Job } from "./models/jobSchema.js";
import dbConnection from "./database/dbConnection.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const clearOldJobs = async () => {
  try {
    await dbConnection();
    const result = await Job.deleteMany({ title: { $ne: 'Chaiwala' } });
    console.log(`Successfully deleted ${result.deletedCount} seed jobs.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

clearOldJobs();
