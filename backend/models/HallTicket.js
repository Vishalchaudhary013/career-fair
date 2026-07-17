const mongoose = require("mongoose");

const HallTicketSchema = new mongoose.Schema({
  hallTicketNumber: { type: String, unique: true, required: true },

  jobFairId: { type: String, required: true },

  fullName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },

  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },

  highestQualification: { type: String },
  discipline: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("HallTicket", HallTicketSchema);

