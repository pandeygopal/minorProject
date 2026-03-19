// import app from "./app.js";         // Import the app (express app)
// import cloudinary from "cloudinary"; // Import Cloudinary package

// // Cloudinary configuration
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLIENT_NAME,  // Use env variables for credentials
//   api_key: process.env.CLOUDINARY_CLIENT_API,
//   api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
// });

// // Start the server
// app.listen(process.env.PORT, () => {
//   console.log(`Server running at port ${process.env.PORT}`);
// });


import app from "./app.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import dbConnection from "./database/dbConnection.js";

// load environment variables
dotenv.config({ path: "./config/config.env" });

// connect database
dbConnection();

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// start server
app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});