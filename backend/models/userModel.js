/**
 * This is the user schema which is designed to create the admins by super-admins.
 */
import mongoose  from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number : {type:Number, required:true},
  password: { type: String, required: true },
   userName: {
      type: String,
      required: true,
      unique: true,
    },
   adminVisiblePassword: { type: String },
   organisationName: {
      type: String,
      default: "Individual",
    },
   role: {
      type: String,
      enum: ["USER", "ORGANIZER", "ADMIN", "SUPER_ADMIN"],
      default: "USER"
   },
   isApproved: { type: Boolean, default: false }, 
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
