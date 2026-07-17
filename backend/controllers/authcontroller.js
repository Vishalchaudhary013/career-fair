import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { encrypt } from "../utils/encryption.js";
import crypto from "crypto"
export const registerUser = async (req,res) => {

  try {
    const {name,number,organisationName,password,userName} = req.body
    const email = req.body.email?.toLowerCase()?.trim() || ""

    let exitisUser = await User.findOne({
      $or : [{email},{userName}]
    })
    
    if(exitisUser){
      return res.status(400).json({
        message:"User is already exists with this email and username"
      })
    }

    // const salt = await bcrypt.getSalt(10)
    const hashPassword = await bcrypt.hash(password,10)
    const adminVisiblePassword = encrypt(password);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await User.create({
      name, 
      email,
      organisationName,
      number,
      userName,
      password:hashPassword,
      adminVisiblePassword,
      role: "ORGANIZER",
      otp,
      otpExpires,
      isVerified: false,
      isApproved: false
    });

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Account Verification Code",
        html: `<p>Hello ${newUser.name},</p>
               <p>Your code for account verification is: <strong>${otp}</strong></p>
               <p>This code is valid for 10 minutes.</p>`
      });
      console.log(`OTP sent to ${newUser.email}: ${otp}`);
    } catch (err) {
      console.error("Failed to send OTP email:", err.message);
      console.log(`[FALLBACK] OTP for ${newUser.email} is: ${otp}`);
    }

    // Send email to Super Admins for approval
    try {
      const superAdmins = await User.find({ role: "SUPER_ADMIN" });
      const approvalUrl = `${req.protocol}://${req.get("host")}/api/superadmin/approve-admin/${newUser._id}`;
      
      for (const sa of superAdmins) {
        await sendEmail({
          email: sa.email,
          subject: "New Organizer Pending Approval",
          html: `<p>Hello Super Admin,</p>
                 <p>A new user has registered as an Organizer and is awaiting your approval.</p>
                 <ul>
                   <li><strong>Name:</strong> ${newUser.name}</li>
                   <li><strong>Email:</strong> ${newUser.email}</li>
                   <li><strong>Organisation:</strong> ${newUser.organisationName}</li>
                 </ul>
                 <p>Click the link below to approve them instantly:</p>
                 <a href="${approvalUrl}" style="display:inline-block;padding:10px 15px;background-color:#110060;color:white;text-decoration:none;border-radius:5px;">Approve Organizer</a>`
        });
      }
    } catch (err) {
      console.error("Failed to send approval email to Super Admins:", err.message);
      // We don't return an error here so the user can still receive their OTP and login
    }

    return res.status(201).json({
      success:true,
      message:"User registered successfully. Please verify your email with the OTP sent.",
      devOtp: otp 
    })

  } catch (error) {

    return res.status(500).json({
      success : false,
      message : error.message
    })
    
  }
  
}

export const loginUser =  async(req,res)=>{

  try {

    const {email,password} = req.body

    const userEmail = email?.toLowerCase().trim() || ""

    const user = await User.findOne({email : userEmail})

    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found"
      })
    }

    if (user.isVerified === false && user.role !== "SUPER_ADMIN") {
      return res.status(401).json({
        success: false,
        message: "Please verify your email address to login."
      });
    }

    if (user.role === "ORGANIZER" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Your account is pending Super Admin approval. You will receive an email once approved."
      });
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });

    }

    const token = jwt.sign(
      {
      id:user._id,
      role:user.role
      },
        process.env.JWT_SECRET,
      {
        expiresIn : "7d"
      }
    )

    res.status(200).json({
      success:true,
      message:"user login successfully",
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        userName:user.userName,
        organisationName:user.organisationName,
        role:user.role
      }
    })
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }

}

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userEmail = email?.toLowerCase().trim() || "";

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User is already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    if (user.role === "ORGANIZER" && !user.isApproved) {
      return res.status(200).json({
        success: true,
        message: "Email verified successfully! However, your account is pending Super Admin approval. You will be notified once approved.",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Account verified and logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userName: user.userName,
        organisationName: user.organisationName,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


export const forgetPassword = async (req,res) => {
  try {
    const email = req.body.email?.toLowerCase()?.trim()

    if(!email){
      return res.status(400).json({
        success:false,
        message:"Email is required"
      })
    }

    const user = await User.findOne({email})

    if(!user){
      // We return 200 so we don't leak user existence
      return res.status(200).json({
        success:true,
        message:"If an account exists with this email, a reset link has been sent."
      })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    user.passwordResetToken = hashedToken
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000 // 15 mins

    await user.save();

    // Send email
    const resetUrl = `${req.protocol}://${req.get("host") === "localhost:5000" ? "localhost:5173" : req.get("host")}/reset-password/${resetToken}`;
    
    const message = `You requested a password reset. Please click on the link below to reset your password:\n\n${resetUrl}\n\nThis link is valid for 15 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Please click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display:inline-block;padding:10px 15px;background-color:#110060;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>This link is valid for 15 minutes.</p>
          </div>
        `
      });
      // console.log(`email sent  ${user.email}`);
    } catch (err) {
      
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: "There was an error sending the email. Try again later." });
    }

    res.status(200).json({
      success:true,
      message:"If an account exists with this email, a reset link has been sent."
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Token is invalid or has expired." });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.adminVisiblePassword = encrypt(password); // Also update encrypted version

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been successfully reset. You can now login."
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).send({ error: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET
//   );
//   res.send({ token });
// };

// module.exports = { login };


