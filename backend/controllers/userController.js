import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import twilio from "twilio";
import crypto from "crypto";
import axios from "axios";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form !"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered !"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered Sucessfully !");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role !"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password !", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found !`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In Sucessfully !");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully !",
    });
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const sendOtp = catchAsyncErrors(async (req, res, next) => {
  const { phone, role } = req.body;
  if (!phone || !role) {
    return next(new ErrorHandler("Phone number and role are required", 400));
  }

  let user = await User.findOne({ phone, role });
  if (!user) {
    // We can auto-register basic users or wait for full registration.
    // For passwordless flow, let's create a temporary shell user if needed, OR throw an error instructing to register.
    // Let's assume registration must be done first through the normal /register route or we just send it.
    return next(new ErrorHandler("User not found with this phone. Please register first.", 404));
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash and save OTP
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  user.otpHash = otpHash;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  await user.save({ validateBeforeSave: false });

  // Send SMS using Twilio if configured
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your Hyperlocal Hiring OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}` // assuming India +91 for now based on UI localization 
      });
    } catch (err) {
      console.error("Twilio SMS failed:", err);
      // fallback to mock
    }
  }

  console.log(`[MOCK SMS] OTP for ${phone}: ${otp}`);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully to your number."
  });
});

export const verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { phone, role, otp } = req.body;
  if (!phone || !role || !otp) {
    return next(new ErrorHandler("Please provide phone, role, and OTP", 400));
  }

  const user = await User.findOne({ phone, role }).select("+otpHash +otpExpiry");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (!user.otpHash || !user.otpExpiry) {
    return next(new ErrorHandler("No active OTP session found.", 400));
  }

  if (new Date(Date.now()) > user.otpExpiry) {
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("OTP expired. Please request a new one.", 400));
  }

  const providedHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (user.otpHash !== providedHash) {
    return next(new ErrorHandler("Invalid OTP.", 400));
  }

  user.otpHash = undefined;
  user.otpExpiry = undefined;
  user.phoneVerified = true;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res, "Logged In via OTP Successfully!");
});

export const aiVoiceSetup = catchAsyncErrors(async (req, res, next) => {
  const { transcript } = req.body;
  if (!transcript) {
    return next(new ErrorHandler("Transcript is required.", 400));
  }

  // Use the GitHub token provided by the user for the GitHub Models API
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return next(new ErrorHandler("GitHub LLM Token is not configured.", 500));
  }

  try {
    // Calling GitHub Models inference API (Azure)
    const aiResponse = await axios.post(
      "https://models.inference.ai.azure.com/chat/completions",
      {
        model: "gpt-4o", // using gpt-4o which is supported on GH models
        messages: [
          {
            role: "system",
            content: "You are an assistant that parses spoken text to extract a user's registering details. You must respond ONLY with a raw JSON object and nothing else. The keys should be exact: 'name', 'email', 'phone', 'role'. If a field is missing or unintelligible, set its value to an empty string. Example: {\"name\": \"John Doe\", \"email\": \"john@example.com\", \"phone\": \"9998887777\", \"role\": \"Job Seeker\"}"
          },
          {
            role: "user",
            content: transcript
          }
        ],
        temperature: 0.1,
      },
      {
        headers: {
          "Authorization": `Bearer ${githubToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const resultText = aiResponse.data.choices[0].message.content;
    const jsonStr = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(jsonStr);

    res.status(200).json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    const apiErrorDetail = error.response?.data?.error?.message || error.response?.data?.message || error.message;
    console.error("GitHub LLM API Error Detail:", apiErrorDetail);
    return next(new ErrorHandler("AI Error: " + apiErrorDetail, 500));
  }
});