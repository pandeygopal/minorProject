import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [100, "Title cannot exceed 100 Characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide description."],
    minLength: [10, "Description must contain at least 10 Characters!"],
    maxLength: [5000, "Description cannot exceed 5000 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
    minLength: [5, "Location must contain at least 5 characters!"],
  },
  locationPoint: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  },
  fixedSalary: {
    type: Number,
  },
  salaryFrom: {
    type: Number,
  },
  salaryTo: {
    type: Number,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create sparse index dynamically to avoid index errors on empty coordinates
jobSchema.index({ locationPoint: '2dsphere' }, { sparse: true });

export const Job = mongoose.model("Job", jobSchema);
