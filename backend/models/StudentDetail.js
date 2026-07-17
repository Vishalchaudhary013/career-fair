const mongoose = require("mongoose");

const studentDetailSchema = new mongoose.Schema(
  {
    // Job Fair Reference
    jobFairId: {
      type: String,
      required: true,
      ref: "JobFair",
    },

    // Personal Details
    personalDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit number"],
      },
      currentCity: {
        type: String,
        required: true,
        trim: true,
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
      dob: {
        type: Date,
        required: true,
      },
    },

    // Academic Details
    academicDetails: {
      highestQualification: {
        type: String,
        required: true,
      },
      discipline: {
        type: String,
        required: true,
      },
      yearOfGraduation: {
        type: Number,
        required: true,
        min: 1950,
        max: new Date().getFullYear() + 1,
      },
      aggregate: {
        type: String,
        required: true,
      },
      collegeOrUniversity: {
        type: String,
        required: true,
      },
      collegeCity: {
        type: String,
        required: true,
      },
    },

    // Career Preferences
    careerPreferences: {
      preferredIndustry: {
        type: [String],
        required: true, // still required, but no limit
      },
      desiredJobRole: {
        type: [String],
        required: true,
      },

      preferredLocations: {
        type: [String], // multiple inputs
        required: true,
      },
      willingToRelocate: {
        type: String,
        enum: ["Yes", "No"],
        required: true,
      },
    },

    // Documents & Links
    documentsAndLinks: {
      resume: {
        type: String,
        required: true, // resume is mandatory
      },

      linkedinProfile: {
        type: String,
        validate: {
          validator: function (v) {
            if (!v) return true; // allow empty
            return /^(https?:\/\/)?(www\.)?linkedin\.com(\/.*)?$/.test(v);
          },
          message: "Please enter a valid LinkedIn URL",
        },
      },

      portfolioOrGithub: {
        type: String,
        validate: {
          validator: function (v) {
            if (!v) return true;
            return /^(https?:\/\/)?(www\.)?(github\.com|behance\.net|dribbble\.com|portfolio\.)/i.test(
              v
            );
          },
          message: "Please enter a valid GitHub or portfolio link",
        },
      },

      registrationPDF: {
        type: String, // path to generated registration summary PDF
        default: "", // in case PDF not generated yet
      },
    },

    // Declaration & Consent
    declarationAndConsent: {
      heardFrom: {
        type: [String], // multiple checkbox options
        enum: [
          "Social Media (LinkedIn/Instagram/etc.)",
          "College Placement Cell",
          "Friend/Referral",
          "Website/Advertisement",
          "Others",
        ],
        required: true,
      },
      otherSource: {
        type: String, // optional input if "Others" selected
      },
      attendedPreviousFair: {
        type: String,
        enum: ["Yes", "No"],
        required: true,
      },
      declarationConfirmed: {
        type: Boolean,
        required: true,
        default: false,
      },
      consentToShareProfile: {
        type: Boolean,
        required: true,
        default: false,
      },
      dateOfSubmission: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("StudentDetail", studentDetailSchema);
