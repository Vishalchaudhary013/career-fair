/**
 * Job Fair Routes — handles creating, editing, deleting, and fetching job fairs
 */
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const JobFair = require("../models/JobFair");
const router = express.Router();
console.log("jobFair.js loaded successfully");

/* -------------------- Ensure Upload Directory Exists -------------------- */
const uploadDir = path.join(__dirname, "../uploads/jobBanners");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* -------------------- Multer Storage Config -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

/* ---------------- CREATE JOB FAIR ----------------------*/
router.post(
  "/create",
  upload.fields([
    { name: "fairBanner", maxCount: 1 },
    { name: "fairLogo", maxCount: 1 },
    { name: "instructionPDF", maxCount: 1 },
    { name: "companyLogo", maxCount: 50 },
  ]),
  async (req, res) => {
    try {
      console.log("/api/jobFair/create route hit");

      // Helper for safe extraction
      const safe = (val) => (Array.isArray(val) ? val[0] : val ?? "");

      /* -------------------- Parse Venue Fields -------------------- */
      let venue = {};
      try {
        venue = JSON.parse(req.body.venue || "{}");
      } catch (err) {
        console.error("Error parsing venue JSON:", err.message);
      }
      console.log("Normalized Venue Data:", venue);
      console.log("Normalized Venue Data:", venue);

      // Validate critical venue fields
      if (!venue.address || !venue.city || !venue.state || !venue.pinCode) {
        return res.status(400).json({
          error:
            "All required venue fields (address, city, state, pinCode) must be filled.",
        });
      }

      /* -------------------- Parse JSON Arrays -------------------- */
      let parsedFaq = [];
      let parsedJobCards = [];
      try {
        parsedFaq = JSON.parse(req.body.faq || "[]");
        parsedJobCards = JSON.parse(req.body.fairJobCards || "[]");
      } catch (err) {
        console.error("JSON Parse Error:", err.message);
      }

      /* -------------------- Handle File Uploads -------------------- */
      const fairBanner = req.files?.fairBanner?.[0]
        ? `uploads/jobBanners/${req.files.fairBanner[0].filename}`
        : null;

      const fairLogo = req.files?.fairLogo?.[0]
        ? `uploads/jobBanners/${req.files.fairLogo[0].filename}`
        : null;

      const instructionPDF = req.files?.instructionPDF?.[0]
        ? `uploads/jobBanners/${req.files.instructionPDF[0].filename}`
        : null;

      //  Attach each company logo to corresponding job card
      if (req.files?.companyLogo) {
        req.files.companyLogo.forEach((file, index) => {
          if (!parsedJobCards[index]) parsedJobCards[index] = {};
          parsedJobCards[
            index
          ].companyLogo = `uploads/jobBanners/${file.filename}`;
        });
      }

      console.log(" Final Job Cards:", parsedJobCards);

      /* -------------------- Create JobFair Entry -------------------- */
      const newJobFair = new JobFair({
        jobFairId: uuidv4(),
        adminId: safe(req.body.adminId),
        jobFairName: safe(req.body.jobFairName),
        organizedBy: safe(req.body.organizedBy),
        fairType: safe(req.body.fairType),
        whatsappNumber: safe(req.body.whatsappNumber),
        registrationDateTime: safe(req.body.registrationDateTime),
        jobFairStart: safe(req.body.jobFairStart),
        jobFairEnd: safe(req.body.jobFairEnd),
        venue,
        locationUrl: safe(req.body.locationUrl),
        phone: safe(req.body.phone),
        additionalPhone: safe(req.body.additionalPhone),
        additionalPhone2: safe(req.body.additionalPhone2),
        additionalPhone3: safe(req.body.additionalPhone3),
        email: safe(req.body.email),
        facebook: safe(req.body.facebook),
        instagram: safe(req.body.instagram),
        linkedin: safe(req.body.linkedin),
        twitter: safe(req.body.twitter),
        description: safe(req.body.description),
        eligibility: safe(req.body.eligibility),
        faq: parsedFaq,
        fairBanner,
        fairLogo,
        instructionPDF,
        fairJobCards: parsedJobCards,
        companies: safe(req.body.companies),
        jobRoles: safe(req.body.jobRoles),
        activeParticipants: safe(req.body.activeParticipants),
        totalStates: safe(req.body.totalStates),
        totalCities: safe(req.body.totalCities),
        totalHallTickets: safe(req.body.totalHallTickets),
      });

      await newJobFair.save();

      console.log("Job Fair saved successfully:", {
        jobFairName: newJobFair.jobFairName,
        city: newJobFair.venue.city,
        companyLogos: newJobFair.fairJobCards.map((c) => c.companyLogo),
      });

      res.status(201).json({
        message: "Job fair created successfully",
        jobFair: newJobFair,
      });
    } catch (error) {
      console.error("Error creating job fair:", error);
      res.status(500).json({
        error: error.message || "Error creating job fair",
      });
    }
  }
);

module.exports = router;

/* --------------- GET ALL JOB FAIRS -------------------- */
router.get("/all", async (req, res) => {
  try {
    const jobFairs = await JobFair.find();
    res.status(200).json(jobFairs);
  } catch (error) {
    console.error("Error fetching job fairs:", error);
    res.status(500).json({ error: "Error fetching job fairs" });
  }
});

/* ------------------ GET JOB FAIRS BY ADMIN ID -------------- */
router.get("/admin/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const jobFairs = await JobFair.find({ adminId });
    if (!jobFairs.length)
      return res
        .status(404)
        .json({ message: "No job fairs found for this admin" });

    res.status(200).json(jobFairs);
  } catch (error) {
    console.error("Error fetching job fairs:", error);
    res.status(500).json({ error: "Error fetching job fairs" });
  }
});

/* -------------------- GET SINGLE JOB FAIR BY ID -----------------*/
router.get("/:jobFairId", async (req, res) => {
  try {
    const { jobFairId } = req.params;
    const jobFair = await JobFair.findOne({ jobFairId });
    if (!jobFair) return res.status(404).json({ error: "Job fair not found" });

    res.status(200).json(jobFair);
  } catch (error) {
    console.error("Error fetching job fair data:", error);
    res.status(500).json({ error: "Error fetching job fair data" });
  }
});

/* ---------- DELETE JOB FAIR BY ID (Handles both _id and jobFairId) -----------*/
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE API HIT with ID:", id);
    // Try deleting by jobFairId first, then by _id as fallback
    const deletedJobFair =
      (await JobFair.findOneAndDelete({ jobFairId: id })) ||
      (await JobFair.findByIdAndDelete(id));
    if (!deletedJobFair) {
      console.log("No Job Fair found for ID:", id);
      return res.status(404).json({ error: "Job fair not found" });
    }
    console.log(
      "Job Fair deleted successfully:",
      deletedJobFair.jobFairName
    );
    res.status(200).json({
      message: "Job fair deleted successfully",
      deletedJobFair,
    });
  } catch (error) {
    console.error("Error deleting job fair:", error);
    res.status(500).json({ error: "Error deleting job fair" });
  }
});

/* ------EDIT / UPDATE JOB FAIR BY jobFairId  --------------------*/
router.put(
  "/edit/:jobFairId",
  upload.fields([
    { name: "fairBanner", maxCount: 1 },
    { name: "fairLogo", maxCount: 1 },
    { name: "instructionPDF", maxCount: 1 },
    { name: "companyLogo", maxCount: 50 },
  ]),
  async (req, res) => {
    try {
      const { jobFairId } = req.params;
      console.log("Edit request for Job Fair:", jobFairId);

      const jobFair = await JobFair.findOne({ jobFairId });
      if (!jobFair)
        return res.status(404).json({ error: "Job fair not found" });

      /* -------------------- Parse Venue -------------------- */
      let venue = jobFair.venue || {};
      try {
        if (req.body.venue) {
          // case: frontend sends JSON string
          venue = JSON.parse(req.body.venue);
        } else {
          // case: frontend sends flattened FormData keys
          venue = {
            address: req.body["venue[address]"] || jobFair.venue?.address || "",
            city: req.body["venue[city]"] || jobFair.venue?.city || "",
            state: req.body["venue[state]"] || jobFair.venue?.state || "",
            pinCode: req.body["venue[pinCode]"] || jobFair.venue?.pinCode || "",
            nearestBusStop:
              req.body["venue[nearestBusStop]"] ||
              jobFair.venue?.nearestBusStop ||
              "",
            nearestAirport:
              req.body["venue[nearestAirport]"] ||
              jobFair.venue?.nearestAirport ||
              "",
            nearestTrainStation:
              req.body["venue[nearestTrainStation]"] ||
              jobFair.venue?.nearestTrainStation ||
              "",
          };
        }
      } catch (err) {
        console.warn("Venue parse failed:", err.message);
      }

      /* -------------------- Parse FAQ & Job Cards -------------------- */
      let faq = jobFair.faq || [];
      let fairJobCards = jobFair.fairJobCards || [];

      try {
        if (req.body.faq) {
          const parsedFaq = JSON.parse(req.body.faq);
          // Merge new + old FAQs (avoid duplicates)
          const uniqueFaqs = [...faq];
          parsedFaq.forEach((item) => {
            if (!uniqueFaqs.some((f) => f.question === item.question)) {
              uniqueFaqs.push(item);
            }
          });
          faq = uniqueFaqs;
        }
        if (req.body.fairJobCards) {
          const parsedCards = JSON.parse(req.body.fairJobCards);
          // Merge new + old Job Cards (avoid duplicates by company name)
          const mergedCards = [...fairJobCards];
          parsedCards.forEach((card) => {
            if (!mergedCards.some((c) => c.companyName === card.companyName)) {
              mergedCards.push(card);
            }
          });
          fairJobCards = mergedCards;
        }
      } catch (err) {
        console.warn("FAQ/JobCards JSON parse failed:", err.message);
      }

      /* --------------------  Handle File Uploads -------------------- */
      const uploadPath = "uploads/jobBanners/";

      if (req.files?.fairBanner?.[0]) {
        jobFair.fairBanner = `${uploadPath}${req.files.fairBanner[0].filename}`;
      }
      if (req.files?.fairLogo?.[0]) {
        jobFair.fairLogo = `${uploadPath}${req.files.fairLogo[0].filename}`;
      }
      if (req.files?.instructionPDF?.[0]) {
        jobFair.instructionPDF = `${uploadPath}${req.files.instructionPDF[0].filename}`;
      }

      if (req.files?.companyLogo) {
        req.files.companyLogo.forEach((file, index) => {
          if (!fairJobCards[index]) fairJobCards[index] = {};
          fairJobCards[index].companyLogo = `${uploadPath}${file.filename}`;
        });
      }

      /* -------------------- Update Fields -------------------- */
      const safeAssign = (key, value) => {
        if (value !== undefined && value !== "") jobFair[key] = value;
      };

      safeAssign("jobFairName", req.body.jobFairName);
      safeAssign("organizedBy", req.body.organizedBy);
      safeAssign("fairType", req.body.fairType);
      safeAssign("whatsappNumber", req.body.whatsappNumber);
      safeAssign("registrationDateTime", req.body.registrationDateTime);
      safeAssign("jobFairStart", req.body.jobFairStart);
      safeAssign("jobFairEnd", req.body.jobFairEnd);
      jobFair.venue = venue;
      safeAssign("locationUrl", req.body.locationUrl);
      safeAssign("phone", req.body.phone);
      safeAssign("additionalPhone", req.body.additionalPhone);
      safeAssign("additionalPhone2", req.body.additionalPhone2);
      safeAssign("additionalPhone3", req.body.additionalPhone3);
      safeAssign("email", req.body.email);
      safeAssign("facebook", req.body.facebook);
      safeAssign("instagram", req.body.instagram);
      safeAssign("linkedin", req.body.linkedin);
      safeAssign("twitter", req.body.twitter);
      safeAssign("description", req.body.description);
      safeAssign("eligibility", req.body.eligibility);
      safeAssign("companies", req.body.companies);
      safeAssign("jobRoles", req.body.jobRoles);
      safeAssign("activeParticipants", req.body.activeParticipants);
      safeAssign("totalStates", req.body.totalStates);
      safeAssign("totalCities", req.body.totalCities);
      safeAssign("totalHallTickets", req.body.totalHallTickets);

      jobFair.faq = faq;
      jobFair.fairJobCards = fairJobCards;

      /* -------------------- Save and Return -------------------- */
      await jobFair.save();
      console.log("Job Fair updated successfully:", jobFair.jobFairName);

      res.json({ message: "Job fair updated successfully", jobFair });
    } catch (error) {
      console.error("Error updating job fair:", error);
      res
        .status(500)
        .json({ error: error.message || "Error updating job fair" });
    }
  }
);

module.exports = router;
