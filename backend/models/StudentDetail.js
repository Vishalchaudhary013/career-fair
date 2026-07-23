const mongoose = require("mongoose");

const studentDetailSchema = new mongoose.Schema(
  {
    jobFairId: {
      type: String,
      required: true,
      ref: "JobFair",
    },

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

    careerPreferences: {
      preferredIndustry: {
        type: [String],
        required: true,
      },
      desiredJobRole: {
        type: [String],
        required: true,
      },

      preferredLocations: {
        type: [String], 
        required: true,
      },
      willingToRelocate: {
        type: String,
        enum: ["Yes", "No"],
        required: true,
      },
    },


    documentsAndLinks: {
      resume: {
        type: String,
        required: true, 
      },

      linkedinProfile: {
        type: String,
        validate: {
          validator: function (v) {
            if (!v) return true; 
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
        type: String, 
        default: "", 
      },
    },

    
    declarationAndConsent: {
      heardFrom: {
        type: [String], 
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
        type: String, 
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
    timestamps: true, 
  }
);

module.exports = mongoose.model("StudentDetail", studentDetailSchema);
