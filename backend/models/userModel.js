
import mongoose  from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  number : { type: Number, default: 0 },
  password: { type: String, default: "" },
  userName: {
    type: String,
    sparse: true,
  },
  adminVisiblePassword: { type: String },
  organisationName: {
    type: String,
    default: "Individual",
  },
  role: {
    type: String,
    enum: ["USER", "ORGANIZER", "ADMIN", "SUPER_ADMIN", "EMPLOYER"],
    default: "USER"
  },
  isApproved: { type: Boolean, default: true }, 
  isVerified: { type: Boolean, default: false },
   otp: { type: String },
   otpExpires: { type: Date },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

   passwordResetToken : {
      type : String,
      default : null
   },

   passwordResetExpires:{
      type:Date,
      default:null
   }
});

const User = mongoose.model("User", userSchema);

export default User;
