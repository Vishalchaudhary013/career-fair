import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
import uploadRoutes from "./routes/uploadRoutes.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

import path from "path";
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




app.use("/api/auth", authRoutes);
app.use("/api/fair", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/superadmin", superAdminRoutes);
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`server run on ${port}`);
});

// /**
//  * 🌐 Main server file for Job Fair Backend
//  */

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const mongoose = require("mongoose");
// const connectDB = require("./config/db");
// const User = require("./models/User");
// const authRoutes = require("./routes/auth");
// const jobFairRoutes = require("./routes/jobFair");
// const studentDetailRoutes = require("./routes/studentDetail");
// const hallTicketRoutes = require("./routes/hallTicket");

// // 🔹 Load environment variables
// dotenv.config();

// // 🔹 Validate Mongo URI before connecting
// if (!process.env.MONGO_URI) {
//   console.error("❌ MONGO_URI not found in .env. Exiting...");
//   process.exit(1);
// }

// const MONGO_URI = process.env.MONGO_URI;
// connectDB(MONGO_URI);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // 🔹 Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use('/uploads', express.static('uploads'));

// 🔹 Super Admin Seeder
// const seedSuperAdmin = async () => {
//   try {
//     const existingSuperAdmin = await User.findOne({ role: "SUPER_ADMIN" });
//     if (!existingSuperAdmin) {
//       const email = process.env.SUPER_ADMIN_EMAIL || "superadmin@example.com";
//       const password = process.env.SUPER_ADMIN_PASSWORD || "superadmin123";
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await User.create({
//         name: "Super Admin",
//         email: email,
//         password: hashedPassword,
//         number: 1234567890,
//         userName: "superadmin",
//         role: "SUPER_ADMIN",
//       });
//       console.log("✅ Super Admin created successfully");
//     } else {
//       console.log("ℹ️ Super Admin already exists");
//     }
//   } catch (error) {
//     console.error("❌ Error seeding Super Admin:", error.message);
//   }
// };

// seedSuperAdmin();

// // 🔹 Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/jobFair", jobFairRoutes);
// app.use("/api/studentDetail", studentDetailRoutes);
// app.use("/api/hallTicket", hallTicketRoutes);

// // 🔹 Start Server
// app.listen(PORT, "0.0.0.0", () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );
