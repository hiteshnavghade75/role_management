import jwt from "jsonwebtoken";
import User from "../models/user.js";

const generateOtp = () => {
  // 6-digit
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist. Contact administrator.",
      });
    }

    if (user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "User is deactivated. Cannot login." });
    }

    const otp = generateOtp();
    const otpExpiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 5);

    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
    await user.save();

    console.log(`🔐 OTP for ${user.email}: ${otp}`);

    return res.json({
      message: "OTP generated and logged on server console.",
      otp: otp, 
    });
  } catch (err) {
    console.error("Error in /send-otp:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  console.log("Verifying OTP...",req.body);
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "User is deactivated. Cannot login." });
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No OTP requested" });
    }

    console.log(`Stored OTP: ${user.otpCode}, sent otp: ${req.body.otp}`);

    if (user.otpCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP valid → clear it
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // issue JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    return res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Error in /verify-otp:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// otp setup with Nodemailer and Ethereal

// Comment above code and Uncomment this code below to test the sign in flow with Nodemailer and Ethereal

// import jwt from "jsonwebtoken";
// import User from "../models/user.js";
// import nodemailer from "nodemailer";

// const generateOtp = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const createTransporter = async () => {
//   const testAccount = await nodemailer.createTestAccount();

//   return nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });
// };

// export const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) return res.status(400).json({ message: "Email is required" });

//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user) {
//       return res.status(400).json({
//         message: "User does not exist. Contact administrator.",
//       });
//     }

//     if (user.status === "inactive") {
//       return res
//         .status(403)
//         .json({ message: "User is deactivated. Cannot login." });
//     }

//     const otp = generateOtp();
//     const otpExpiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 5);

//     user.otpCode = otp;
//     user.otpExpiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
//     await user.save();

//     const transporter = await createTransporter();

//     const info = await transporter.sendMail({
//       from: `"Login System" <no-reply@example.com>`,
//       to: user.email,
//       subject: "Your OTP Code",
//       html: `
//         <h2>Your Login OTP</h2>
//         <p>Use this OTP to log in:</p>
//         <h1 style="letter-spacing: 4px;">${otp}</h1>
//         <p>This OTP will expire in <b>${otpExpiryMinutes} minutes</b>.</p>
//       `,
//     });

//     console.log("✉ Ethereal Preview URL:", nodemailer.getTestMessageUrl(info));
//     console.log(`🔐 OTP for ${user.email}: ${otp}`);

//     return res.json({
//       message: "OTP sent to email (Ethereal). Check preview URL in server logs.",
//       previewUrl: nodemailer.getTestMessageUrl(info),
//     });
//   } catch (err) {
//     console.error("Error in /send-otp:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const verifyOtp = async (req, res) => {
//   console.log("Verifying OTP...", req.body);

//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res
//         .status(400)
//         .json({ message: "Email and OTP are required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     if (user.status === "inactive") {
//       return res
//         .status(403)
//         .json({ message: "User is deactivated. Cannot login." });
//     }

//     if (!user.otpCode || !user.otpExpiresAt) {
//       return res.status(400).json({ message: "No OTP requested" });
//     }

//     console.log(`Stored OTP: ${user.otpCode}, sent otp: ${req.body.otp}`);

//     if (user.otpCode !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (user.otpExpiresAt < new Date()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     user.otpCode = undefined;
//     user.otpExpiresAt = undefined;
//     await user.save();

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: process.env.JWT_EXPIRES_IN || "1h",
//       }
//     );

//     return res.json({
//       message: "Logged in successfully",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//         status: user.status,
//       },
//     });
//   } catch (err) {
//     console.error("Error in /verify-otp:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
