import { Job } from "./models/jobSchema.js";
import { User } from "./models/userSchema.js";
import dbConnection from "./database/dbConnection.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const seedJobs = async () => {
  try {
    await dbConnection();
    let employer = await User.findOne({ role: "Employer" });
    if (!employer) {
      employer = await User.create({
        name: "Acme Corp",
        email: "hr@acmecorp.com",
        phone: "1234567890",
        password: "password123",
        role: "Employer"
      });
    }

    const jobsData = [
      {
        title: "Senior React Developer",
        description: "Join our fast-paced product team to build next-generation web applications using React, TailwindCSS, and Node.js. Minimum 4 years of scalable frontend experience required. We offer incredible remote perks and health benefits.",
        category: "Software Development",
        country: "India",
        city: "Bangalore",
        location: "Koramangala, Bangalore",
        locationPoint: { type: 'Point', coordinates: [77.6271, 12.9352] },
        fixedSalary: 150000,
        postedBy: employer._id
      },
      {
        title: "Marketing Manager",
        description: "Looking for an aggressive and experienced Marketing Manager to drive our B2B campaigns. Must have enterprise SaaS experience and proven track record of generating inbound leads. We provide top-tier tools.",
        category: "Marketing",
        country: "USA",
        city: "New York",
        location: "Manhattan, NY",
        locationPoint: { type: 'Point', coordinates: [-73.9851, 40.7580] },
        salaryFrom: 80000,
        salaryTo: 120000,
        postedBy: employer._id
      },
      {
        title: "Head Barista",
        description: "Artisan coffee shop in downtown seeking a Head Barista to lead our front-of-house team. Must have 3+ years specialty coffee experience, excellent latte art skills, and a friendly personality.",
        category: "Food & Beverage",
        country: "India",
        city: "Mumbai",
        location: "Bandra West, Mumbai",
        locationPoint: { type: 'Point', coordinates: [72.8347, 19.0596] },
        fixedSalary: 45000,
        postedBy: employer._id
      },
      {
        title: "Data Scientist (AI/ML)",
        description: "We are integrating cutting-edge LLMs (GPT-4, LLaMA) into our proprietary financial models. Seeking a brilliant Data Scientist with PyTorch and NLP experience.",
        category: "Data Science",
        country: "USA",
        city: "San Francisco",
        location: "Silicon Valley, CA",
        locationPoint: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        salaryFrom: 130000,
        salaryTo: 190000,
        postedBy: employer._id
      },
      {
        title: "Graphic Designer",
        description: "Creative agency seeking a Graphic Designer comfortable with Figma, Adobe CC, and modern minimalist brand identity. Portfolio submission is mandatory.",
        category: "Design",
        country: "UK",
        city: "London",
        location: "Soho, London",
        locationPoint: { type: 'Point', coordinates: [-0.1340, 51.5136] },
        fixedSalary: 65000,
        postedBy: employer._id
      }
    ];

    await Job.insertMany(jobsData);
    console.log("Successfully seeded 5 premium jobs!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedJobs();
