/**
 * Student Registration Routes
 * Handles registration for Job Fairs + PDF generation
 */

const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const Student = require("../models/StudentDetail");
const HallTicket = require("../models/HallTicket");
const JobFair = require("../models/JobFair");


const router = express.Router();

// MAIN HELPER HERE (same file)
async function generateSequentialHallTicketNumber(jobFairId, mobileNumber) {
  const year = new Date().getFullYear();

  const prefix = `HT-${year}-${jobFairId.slice(0, 6)}-${mobileNumber.slice(-6)}`;

  const lastTicket = await HallTicket.findOne({
    hallTicketNumber: { $regex: `^${prefix}` }
  }).sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastTicket) {
    const lastPart = lastTicket.hallTicketNumber.split("-").pop();
    nextNumber = parseInt(lastPart) + 1;
  }

  const padded = String(nextNumber).padStart(3, "0");

  return `${prefix}-${padded}`;
}

/* --------- Allow both Mongo ObjectId and UUID for JobFair ID ----------------------- */
const isValidJobFairId = (id) => {
  return (
    /^[0-9a-fA-F]{24}$/.test(id) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
  );
};

/* ------- Configure Multer for Resume Uploads ---------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF, DOC, or DOCX files are allowed!"));
  },
});

/* ------------ Helper: Generate Student Registration PDF (Styled, One Page Fixed Layout) ------------------ */
const generateStudentPDF = (student, jobFairName) => {
  const pdfDir = path.join(__dirname, "../uploads/pdfs");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

  const fileName = `${Date.now()}-${student.personalDetails.fullName.replace(/\s+/g, "_")}_Registration.pdf`;
  const pdfPath = path.join(pdfDir, fileName);

  const doc = new PDFDocument({
    size: "A4",
    margin: 40
  });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  let y = 40; // Y Position Tracker

  /* ------------------------------------------------------
     HEADER (Logo Left, Student ID Right)
  ------------------------------------------------------ */
  const logoPath = path.join(__dirname, "../uploads/logo/edeco-logo.jpeg");
  if (fs.existsSync(logoPath)) doc.image(logoPath, 40, y, { width: 60 });

  doc.font("Helvetica")
  .fontSize(10)
  .fillColor("#333")
  .text(`Student ID: ${student._id}`, 300, 55, {
    width: 250,
    align: "right"
  });

  y += 60;

  /* ------------------------------------------------------
     TITLE
  ------------------------------------------------------ */
  doc.font("Helvetica-Bold")
    .fontSize(15)
    .text("Application", 40, y, { align: "center", underline: true });
  y += 40;

  /* === UTILITIES === */
  const heading = (title) => {
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#004B8D").text(title, 40, y);
    y += 18;
    doc.moveTo(40, y).lineTo(550, y).strokeColor("#cccccc").lineWidth(1).stroke();
    y += 15;
  };

  const twoCol = (left, right) => {
    doc.font("Helvetica").fontSize(11).fillColor("#000");
    doc.text(left, 40, y, { width: 230 });
    doc.text(right, 300, y, { width: 230 });
    y += 22;
  };

  /* ------------------------------------------------------
     PERSONAL INFORMATION
  ------------------------------------------------------ */
  heading("Personal Information");

  const p = student.personalDetails;
  twoCol(`1. Full Name: ${p.fullName}`, `2. Gender: ${p.gender}`);
  twoCol(`3. Contact No.: ${p.contactNumber}`, `4. Email Id: ${p.email}`);
  twoCol(
    `5. Date of Birth: ${new Date(p.dob).toLocaleDateString()}`,
    `6. Current City: ${p.currentCity}`
  );

  /* ---------------- ACADEMIC DETAILS -------------------------- */
heading("Academic Details");

const a = student.academicDetails;

// Row 1 (Highest Qualification / Discipline)
twoCol(
  `1. Highest Qualification: ${a.highestQualification}`,
  `2. Discipline: ${a.discipline}`
);

y += 8; // 👈 extra bottom margin

// Row 2
twoCol(
  `3. Year of Graduation: ${a.yearOfGraduation}`,
  `4. Aggregate: ${a.aggregate}`
);

y += 8; // 👈 extra bottom margin

// Row 3
twoCol(
  `5. College/University: ${a.collegeOrUniversity}`,
  `6. Location: ${a.collegeCity}`
);

/* ------------- CAREER PREFERENCES -------------------------- */
heading("Career Preferences");

const c = student.careerPreferences;

doc.font("Helvetica").fontSize(11).fillColor("black");

doc.text(`1. Desired Job Location: ${c.preferredLocations.join(", ")}`, 40, y);
y += 22;

doc.text(`2. Preferred Industries: ${c.preferredIndustry.join(", ")}`, 40, y);
y += 22;

doc.text(`3. Desired Job Roles: ${c.desiredJobRole.join(", ")}`, 40, y);
y += 22;

doc.text(`4. Willing to Relocate: ${c.willingToRelocate}`, 40, y);
y += 28;

/* ------------- DOCUMENTS & LINKS ------------------------- */
heading("Documents and Links");

const d = student.documentsAndLinks;

// Always black
doc.font("Helvetica").fontSize(11).fillColor("black");

// 1. LinkedIn (label normal, URL clickable WITHOUT underline)
doc.text("1. LinkedIn: ", 40, y, { continued: true });
doc.fillColor("black").text(d.linkedinProfile || "N/A", {
  link: d.linkedinProfile || undefined,
  underline: false
});
y += 22;

// 2. GitHub (same: black + no underline)
doc.fillColor("black").text("2. Portfolio/Github: ", 40, y, { continued: true });
doc.text(d.portfolioOrGithub || "N/A", {
  link: d.portfolioOrGithub || undefined,
  underline: false
});
y += 30;


 /* ---------------- DECLARATION & CONSENT -------------------------------- */
heading("Declaration and Consent");

const dec = student.declarationAndConsent;

// First point → black + normal font
doc.font("Helvetica").fontSize(11).fillColor("black");

let heard = dec.heardFrom.join(", ");
if (dec.heardFrom.includes("Others") && dec.otherSource)
  heard = heard.replace("Others", `Others - ${dec.otherSource}`);

doc.text(`1. Heard From: ${heard}`, 40, y);
y += 25;

// Row 2
twoCol(
  `2. Attended Previous Job Fair: ${dec.attendedPreviousFair}`,
  `3. Declaration Confirmed: ${dec.declarationConfirmed ? "Yes" : "No"}`
);

// Row 3
twoCol(
  `4. Consent to Share Profile: ${dec.consentToShareProfile ? "Yes" : "No"}`,
  `5. Date of Submission: ${new Date(dec.dateOfSubmission).toLocaleDateString()}`
);

y += 18;


  /* --------------- FOOTER (LOCKED ON SAME PAGE) --------------------- */
  doc.moveTo(40, 780).lineTo(550, 780).strokeColor("#cccccc").stroke();

  doc.fontSize(10).fillColor("#444");
  doc.text(`Auto Generated Ticket by ${jobFairName}, powered by edeco`, 40, 790);
  doc.text(`© edeco Consulting | All Rights Reserved`, 40, 790, { align: "right" });

  doc.end();
  return pdfPath;
};


/* ---------- Register Student + Generate PDF ----------------- */
router.post(
  "/register/:jobFairId",
  upload.single("resume"),
  async (req, res) => {
    try {
      const { jobFairId } = req.params;
      if (!isValidJobFairId(jobFairId)) {
        return res.status(400).json({ message: "Invalid Job Fair ID" });
      }

      const {
        fullName,
        email,
        contactNumber,
        currentCity,
        gender,
        dob,
        highestQualification,
        discipline,
        yearOfGraduation,
        aggregate,
        collegeOrUniversity,
        collegeCity,
        preferredIndustry,
        desiredJobRole,
        preferredLocations,
        willingToRelocate,
        linkedinProfile,
        portfolioOrGithub,
        heardFrom,
        otherSource,
        attendedPreviousFair,
        declarationConfirmed,
        consentToShareProfile,
        dateOfSubmission,
      } = req.body;

      const resumePath = req.file ? req.file.path : null;
      if (!resumePath) {
        return res.status(400).json({ error: "Resume upload is required." });
      }

      // Save Student
      const newStudent = new Student({
        jobFairId,
        personalDetails: {
          fullName,
          email,
          contactNumber,
          currentCity,
          gender,
          dob,
        },
        academicDetails: {
          highestQualification,
          discipline,
          yearOfGraduation,
          aggregate,
          collegeOrUniversity,
          collegeCity,
        },
        careerPreferences: {
          preferredIndustry: preferredIndustry
            ? preferredIndustry.split(",")
            : [],
          desiredJobRole: desiredJobRole ? desiredJobRole.split(",") : [],
          preferredLocations: preferredLocations
            ? preferredLocations.split(",")
            : [],
          willingToRelocate,
        },
        documentsAndLinks: {
          resume: resumePath,
          linkedinProfile,
          portfolioOrGithub,
        },
        declarationAndConsent: {
          heardFrom: heardFrom
            ? Array.isArray(heardFrom)
              ? heardFrom
              : heardFrom.split(",")
            : [],
          otherSource,
          attendedPreviousFair,
          declarationConfirmed:
            declarationConfirmed === "true" || declarationConfirmed === true,
          consentToShareProfile:
            consentToShareProfile === "true" || consentToShareProfile === true,
          dateOfSubmission: dateOfSubmission || new Date().toISOString(),
        },
      });

      await newStudent.save();

      // ----------------- GENERATE HALL TICKET -----------------
// Generate Hall Ticket Number
const hallTicketNumber = await generateSequentialHallTicketNumber(
  newStudent.jobFairId,
  newStudent.personalDetails.contactNumber
);

const hallTicket = await HallTicket.create({
  hallTicketNumber,
  jobFairId: newStudent.jobFairId,
  fullName: newStudent.personalDetails.fullName,
  gender: newStudent.personalDetails.gender,
  dob: newStudent.personalDetails.dob,
  email: newStudent.personalDetails.email,
  mobileNumber: newStudent.personalDetails.contactNumber,
  highestQualification: newStudent.academicDetails.highestQualification,
    discipline: newStudent.academicDetails.discipline,
});

const jobFair = await JobFair.findOne({ jobFairId: jobFairId });
const jobFairName = jobFair?.name || "Career Fair";

const pdfPath = generateStudentPDF(newStudent, jobFairName);

      // Force relative URL path instead of absolute Windows path
      const pdfFileName = path.basename(pdfPath);
      const pdfRelativePath = `uploads/pdfs/${pdfFileName}`;

      newStudent.documentsAndLinks.registrationPDF = pdfRelativePath;
      await newStudent.save();

      res.status(201).json({
        message: "Student registered successfully!",
        student: newStudent,
        hallTicket: hallTicket
      });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  }
);

/* ----------- Fetch All Students for a Job Fair ------------------ */
router.get("/students/:jobFairId", async (req, res) => {
  try {
    const { jobFairId } = req.params;
    if (!isValidJobFairId(jobFairId)) {
      return res.status(400).json({ message: "Invalid Job Fair ID" });
    }
    const students = await Student.find({ jobFairId });
    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for this Job Fair." });
    }
    res.status(200).json({ students });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

/* ---------- Delete Student Record + Cleanup Files ------------------- */
router.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Student ID" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete associated resume and PDF if they exist
    const resumePath = student.documentsAndLinks?.resume;
    const pdfPath = student.documentsAndLinks?.registrationPDF;

    [resumePath, pdfPath].forEach((filePath) => {
      if (filePath) {
        const fullPath = path.join(__dirname, "../", filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlink(fullPath, (err) => {
            if (err) console.error("Failed to delete file:", filePath, err);
            else console.log("Deleted:", filePath);
          });
        }
      }
    });

    await Student.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Student deleted successfully & files removed" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

module.exports = router;
