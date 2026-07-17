import express from "express"
import { loginUser, registerUser, verifyOTP, forgetPassword, resetPassword } from "../controllers/authcontroller.js"

const router = express.Router()

router.post("/signup",registerUser)

router.post("/login",loginUser)

router.post("/verify-otp", verifyOTP)

router.post("/forgot-password", forgetPassword)
router.post("/reset-password/:token", resetPassword)

export default router;

























// /**
//  * These APIs are used for the admin details and super admin details.
//  */

// const mongoose = require("mongoose");
// const express = require("express");
// const crypto = require("crypto");
// const User = require("../models/User");
// const router = express.Router();

// /**
//  * Function is used to encrypt the password to store in the database.
//  * - We have used the AES mechanism of the encryption. (Two way encryption and decryption)
//  */
// const encryptPassword = (password) => {
//   const algorithm = "aes-256-cbc";
//   const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Ensure 32 bytes
//   const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex"); // Ensure 16 bytes

//   const cipher = crypto.createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(password, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// };

// /**
//  * Function is used to register the new admin by the super admin.
//  */
// router.post("/register-admin", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email }); // Check if the user already exists
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const hashedPassword = encryptPassword(password);
//     const newUser = new User({
//       // Create a new admin user
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin",
//     });
//     await newUser.save(); // Save the user to the database
//     res.status(201).json({ message: "Admin registered successfully" }); // Respond with success message
//   } catch (error) {
//     console.error("Error registering admin:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * Function is used to login the new admins details and see the admin dashboard.
//  */
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res
//       .status(400)
//       .json({
//         message: "Invalid credentials. Please check your email and password.",
//       });
//   }
//   const decryptedPassword = decryptPassword(user.password);
//   if (decryptedPassword !== password) {
//     return res
//       .status(400)
//       .json({
//         message: "Invalid credentials. Please check your email and password.",
//       });
//   }
//   res.json({ role: user.role, adminId: user._id });
// });

// /**
//  * Function is used to decrypt the function when data is fetched so that super admin can see the password.
//  */
// const decryptPassword = (encryptedPassword) => {
//   try {
//     const algorithm = "aes-256-cbc";
//     const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Ensure 32 bytes
//     const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex"); // Ensure 16 bytes
//     const decipher = crypto.createDecipheriv(algorithm, key, iv);
//     let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
//   } catch (error) {
//     console.error("Decryption failed:", error.message);
//     return "Decryption error";
//   }
// };

// /**
//  * Function is used to fetch the details of all the admins registered by the super admins.
//  */
// router.get("/admins", async (req, res) => {
//   try {
//     const admins = await User.find({ role: "admin" });
//     const adminsWithDecryptedPasswords = admins.map((admin) => ({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role: admin.role,
//       password: decryptPassword(admin.password),
//     }));
//     // Respond with the list of admins
//     res.status(200).json(adminsWithDecryptedPasswords);
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * Function is used to delete the admin and its complete details from the database.
//  */
// router.delete("/admins/:_id", async (req, res) => {
//   try {
//     const { _id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(_id)) {
//       return res.status(400).json({ message: "Invalid admin ID" });
//     }
//     const adminId = new mongoose.Types.ObjectId(_id);
//     const deletedAdmin = await User.findByIdAndDelete(adminId);
//     if (!deletedAdmin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     res.status(200).json({ message: "Admin deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting admin:", error);
//     res.status(500).json({ message: "Error deleting admin" });
//   }
// });

// /**
//  * Function is used to update the details of an admin.
//  */
// router.put("/admins/:id", async (req, res) => {
//   try {
//     const { id } = req.params; // Get admin ID from params
//     const { name, email, password } = req.body; // Get updated details
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid admin ID" });
//     }
//     // Find the admin
//     const admin = await User.findById(id);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     // Update fields only if they are provided
//     if (name) admin.name = name;
//     if (email) admin.email = email;
//     if (password) {
//       admin.password = encryptPassword(password); // Encrypt new password
//     }
//     await admin.save(); // Save the updated admin
//     res.status(200).json({ message: "Admin updated successfully" });
//   } catch (error) {
//     console.error("Error updating admin:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// /**
//  * Function is used to fetch the details of a specific admin by ID.
//  */
// router.get("/admins/:id", async (req, res) => {
//   try {
//     const { id } = req.params; // Extract admin ID from request parameters
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid admin ID" });
//     }
//     const admin = await User.findById(id);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }
//     res.status(200).json({
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//     });
//   } catch (error) {
//     console.error("Error fetching admin details:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// module.exports = router;
