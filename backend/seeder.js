import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User } from "./models/userSchema.js";
import { Job } from "./models/jobSchema.js";

dotenv.config({ path: "./config/config.env" });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            dbName: "Job_Portal",
        });
        console.log("MongoDB Connected for Seeder");
    } catch (error) {
        console.error(`Failed to connect ${error}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Job.deleteMany();
        console.log("Data Destroyed!");

        const users = [];
        const NUM_USERS = 20;

        // Create 5 Employers and 15 Job Seekers
        for (let i = 0; i < NUM_USERS; i++) {
            const role = i < 5 ? "Employer" : "Job Seeker";
            users.push({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.number.int({ min: 1000000000, max: 9999999999 }),
                password: "password123", // Will be hashed by pre-save hook
                role: role
            });
        }

        const createdUsers = await User.create(users);
        console.log(`${createdUsers.length} Users Imported!`);

        const employers = createdUsers.filter(u => u.role === "Employer");
        const jobs = [];
        const NUM_JOBS = 50;
        const categories = ["Technology", "Healthcare", "Finance", "Education", "Engineering", "Marketing"];

        for (let i = 0; i < NUM_JOBS; i++) {
            const randomEmployer = employers[Math.floor(Math.random() * employers.length)];
            const isFixedSalary = Math.random() > 0.5;

            let jobData = {
                title: faker.person.jobTitle().substring(0, 30),
                description: faker.lorem.paragraph().substring(0, 500),
                category: categories[Math.floor(Math.random() * categories.length)],
                country: faker.location.country(),
                city: faker.location.city(),
                location: faker.location.streetAddress() + ", " + faker.location.city(),
                expired: Math.random() > 0.8,
                postedBy: randomEmployer._id,
                locationPoint: {
                    type: "Point",
                    coordinates: [faker.location.longitude(), faker.location.latitude()]
                }
            };

            if (isFixedSalary) {
                jobData.fixedSalary = faker.number.int({ min: 30000, max: 150000 });
            } else {
                const from = faker.number.int({ min: 20000, max: 80000 });
                jobData.salaryFrom = from;
                jobData.salaryTo = from + faker.number.int({ min: 10000, max: 50000 });
            }

            jobs.push(jobData);
        }

        const createdJobs = await Job.create(jobs);
        console.log(`${createdJobs.length} Jobs Imported!`);

        process.exit();
    } catch (error) {
        console.error(`Error with seeder: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        await Job.deleteMany();
        console.log("Data Destroyed!");
        process.exit();
    } catch (error) {
        console.error(`Error with seeder: ${error}`);
        process.exit(1);
    }
}

if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}
