import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    venueName: {
      type: String,
      trim: true,
      default: "",
    },
    addressLine1: {
      type: String,
      default: "",
    },
    addressLine2: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    pincode: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    nearestBusStop: {
      type: String,
      trim: true,
      default: "",
    },
    nearestAirport: {
      type: String,
      trim: true,
      default: "",
    },
    nearestRailwayStation: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  open: {
    type: Boolean,
    default: true,
  },
});

const contactSchema = new mongoose.Schema({
  whatsappNumber: {
    type: String,
    required: true,
    trim: true,
  },
  primaryNumber: {
    type: String,
    required: true,
    trim: true,
  },
  additionalNumber1: {
    type: String,
    trim: true,
  },
  additionalNumber2: {
    type: String,
    trim: true,
  },
  additionalNumber3: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
}
});

const socialLinksSchema = new mongoose.Schema({
  facebook: {
    type: String,
    trim: true,
    default: "",
  },
  instagram: {
    type: String,
    trim: true,
    default: "",
  },
  linkedin: {
    type: String,
    trim: true,
    default: "",
  },
  twitter: {
    type: String,
    trim: true,
    default: "",
  },
});

const statisticSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const hiringPartnerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
    default: "",
  },
  logo: {
    type: String,
    default: "",
    trim: true,
  },
  logoLink: {
    type: String,
    default: "",
    trim: true,
  },
  postingType: {
    type: String,
    enum: ["Job", "Internship", "Apprenticeship"],
    default: "Job",
  },
  language: {
    type: String,
    trim: true,
    default: "English",
  },
  showDetailsInUI: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Approved", 
  },
  jobProfile: {
    type: String,
    trim: true,
    default: "",
  },
  location: {
    type: String,
    trim: true,
    default: "",
  },
  candidatesRequired: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  jobType: { type: String, trim: true, default: "" },
  qualification: { type: String, trim: true, default: "" },
  minSalary: { type: Number },
  maxSalary: { type: Number },
  salaryType: { type: String, default: "Per Month", trim: true },
  minExperience: { type: Number },
  maxExperience: { type: Number },
  experienceType: { type: String, default: "Years", trim: true },
  jobLocationState: { type: String, trim: true, default: "" },
  jobLocationCity: { type: String, trim: true, default: "" },
  pincode: { type: String, trim: true, default: "" },
  locations: [{
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true }
  }],
  jobExpiryDate: { type: Date },
  hiringProcess: [{ type: String }],
  positionOpenFor: [{ type: String }],
  otherBenefit: { type: String, trim: true, default: "" },
  openForPhysicallyChallenged: { type: String, trim: true, default: "" },
  organisationName: { type: String, trim: true, default: "" },
  
  // Your Details section
  companyType: { type: String, trim: true, default: "" },
  contactPersonName: { type: String, trim: true, default: "" },
  designation: { type: String, trim: true, default: "" },
  mobileNumber: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, default: "" },
  yourDetailsJobRole: { type: String, trim: true, default: "" },
  yourDetailsTotalOpenings: { type: Number },
  yourDetailsState: { type: String, trim: true, default: "" },
  yourDetailsCity: { type: String, trim: true, default: "" },
  yourDetailsMinSalary: { type: Number },
  yourDetailsMaxSalary: { type: Number },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postedByEmail: {
    type: String,
    trim: true,
  },
});

const eligibilitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
});

const ticketSchema = new mongoose.Schema({
  ticketButtonText: {
    type: String,
    default: "Book Tickets",
  },
  ticketName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["Free", "Paid"],
    default: "Free",
  },
  totalQuantity: {
    type: Number,
  },
  minBooking: { type: Number },
  maxBooking: { type: Number },

  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  startFroms: {
    type: Date,
    required: true,
  },
  endsat: {
    type: Date,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    enum: [
      "text",
      "textarea",
      "email",
      "number",
      "select",
      "radio",
      "checkbox",
      "date",
      "file",
    ],
    default: "text",
  },

  required: {
    type: Boolean,
    default: false,
  },

  status: {
    
      type: String,
      enum: ["Mandatory", "Optional"],
      default: "Mandatory",
    
},

  showforallTickets: {
    
      type: String,
      enum: ["All Tickets", "Selected Tickets"],
      default: "All Tickets",
    
   },

  isDefault: {
    type: Boolean,
    default: false,
  },

  options: [{
    id: { type: mongoose.Schema.Types.Mixed },
    value: { type: String }
  }],
  allowOther: {
    type: Boolean,
    default: false
  }
});

const eventSchema = new mongoose.Schema(
  {
    fairName: {
      type: String,
      required: true,
      trim: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    language: {
      type: String,
      default: "English",
    },
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    venue: venueSchema,

    category: {
      type: String,
      default: "",
    },
    fairType: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    organizerName: {
      type: String,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    contact: contactSchema,
    socialLinks: socialLinksSchema,
    statistics: [statisticSchema],
    hiringPartners: [hiringPartnerSchema],
    companyListDocument: {
      type: String,
      default: "",
    },
    whoCanApply: [eligibilitySchema],

    instructions: {
      type: String,
      trim: true,
      default: "",
    },
    termAndConditions: {
      type: String,
      trim: true,
      default: "",
    },
    faqs: [faqSchema],

    fairBanner: {
      type: String,
      default: "",
    },
    fairLogo: {
      type: String,
      default: "",
    },

    tickets: [ticketSchema],
    questions: [questionSchema],
    bookingCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
