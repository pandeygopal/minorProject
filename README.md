# Job Portal App with MERN Stack

A comprehensive job portal application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This application allows users to browse job listings, apply for jobs, and manage their applications seamlessly.

## Features

- **User Authentication:** Secure authentication using JWT (JSON Web Tokens) for both job seekers and employers.
- **Job Listings:** Browse through a wide range of job listings fetched from MongoDB.
- **Application Management:** Job seekers can manage their job applications, and employers can view and manage received applications.
- **Responsive Design:** Ensures a seamless experience across all devices.

## Technologies Used

- **Frontend:** React.js, React Router, Tailwind CSS, Socket.IO client
- **Backend:** Node.js, Express.js, MongoDB, Socket.IO
- **Authentication:** JWT (JSON Web Tokens), Bcrypt for password hashing
- **Image Upload:** Cloudinary for storing and managing uploaded images
- **Deployment:** Vercel for frontend, Render for backend, MongoDB Atlas for database

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js installed on your machine with latest version or v22.2.0 above
- MongoDB Atlas account (or local MongoDB server)
- Cloudinary account for image storage

### Installation

1. Clone the repo.
2. Install dependencies in both apps:
   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. Set up environment variables:
   - Copy [backend/config/config.env.example](backend/config/config.env.example) to `backend/config/config.env`.
   - Copy [frontend/.env.example](frontend/.env.example) to `frontend/.env`.
   - Update the values for your local machine and hosted services.
4. Start the backend server:
   ```sh
   cd backend
   npm run dev
   ```
5. Start the frontend app in a second terminal:
   ```sh
   cd frontend
   npm run dev
   ```
6. Open the frontend URL shown by Vite, usually `http://localhost:5173`.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the project.
2. Create your feature branch.
3. Commit your changes.
4. Push to the branch.
5. Open a pull request.

## Please give a star to the repository if you like it.

## Contact
