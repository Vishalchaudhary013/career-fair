

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const jobFairSchema = new mongoose.Schema({

  jobFairId: { type: String, required: true, default: uuidv4 },

  
  jobFairName: { type: String, required: true },
  organizedBy: { type: String, required: true },
  fairType: {
  type: String,
  enum: [
    "Career Fair",
    "Education Fair",
    "Career & Education Fair",
    "Conference"
  ],
  required: true,
  },
  whatsappNumber: { type: String , required: true},
  registrationDateTime: { type: Date, required: true },
  jobFairStart: { type: Date, required: true },
  jobFairEnd: { type: Date, required: true },

  
  venue: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    nearestBusStop: { type: String, required: true },
    nearestAirport: { type: String, required: true },
    nearestTrainStation: { type: String, required: true },
  },

  
  locationUrl: { type: String, required: true },

  
  phone: { type: String, required: true },
  additionalPhone: { type: String, required: true },
  additionalPhone2: { type: String },
  additionalPhone3: { type: String },
  email: { type: String, required: true },


  facebook: { type: String, required: true },
  instagram: { type: String, required: true },
  linkedin: { type: String, required: false },
  twitter: { type: String, required: false },

  
  description: { type: String, required: true },
  eligibility: { type: String, required: true },

  
  faq: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],

  
  fairBanner: { type: String, required: true },
  fairLogo: { type: String, required: true },
  instructionPDF: { type: String, required: true },

  
  fairJobCards: [
    {
      companyLogo: { type: String, required: true },
      companyName: { type: String, required: true },
      jobProfile: { type: String, required: true },
      candidatesRequired: { type: Number, required: true },
      jobLocation: { type: String, required: true },
    },
  ],

  
  companies: { type: Number, required: true },
  jobRoles: { type: Number, required: true },
  activeParticipants: { type: Number, required: false },
  totalStates: { type: Number, required: false },
  totalCities: { type: Number, required: false },
  totalHallTickets: { type: Number, required: false },

  
  adminId: { type: String, required: true },
});

const JobFair = mongoose.model("JobFair", jobFairSchema);
module.exports = JobFair;
