import User from "../models/userModel.js";
import Event from "../models/eventModel.js";
import Booking from "../models/Booking.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "../utils/encryption.js";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: "7d",
  });
};


export const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const eventsCount = await Event.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    res.json({
      users: usersCount,
      events: eventsCount,
      bookings: bookingsCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "SUPER_ADMIN" } }).select("-password").sort({ createdAt: -1 });
    

    const usersWithDecryptedPasswords = users.map((u) => {
      const userObj = u.toObject();
      if (userObj.adminVisiblePassword) {
        userObj.decryptedPassword = decrypt(userObj.adminVisiblePassword);
      } else {
        userObj.decryptedPassword = null;
      }
      delete userObj.adminVisiblePassword;
      return userObj;
    });

    res.json(usersWithDecryptedPasswords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Event.deleteMany({ organizer: req.params.id });
    
    await user.deleteOne();
    res.json({ message: "User and associated data removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "userName hostName workEmail organisationName")
      .sort({ createdAt: -1 });

    const eventsWithBookingCount = await Promise.all(events.map(async (event) => {
      const eventObj = event.toObject();
      const count = await Booking.countDocuments({ event: event._id });
      eventObj.bookingCount = count;
      return eventObj;
    }));

    res.json(eventsWithBookingCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event and associated bookings removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const impersonateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      userName: user.userName,
      hostName: user.hostName,
      workEmail: user.workEmail,
      token: generateToken(user._id),
      impersonated: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const changeUserPassword = async (req, res) => {
  try {
    const { password, notifyUser } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.adminVisiblePassword = encrypt(password);
    
    if (!user.isVerified) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
    }
    
    await user.save();

    if (notifyUser && user.workEmail) {
      try {
        await sendEmail({
          email: user.workEmail,
          subject: "Your Password Has Been Updated",
          message: `Hello ${user.hostName || user.userName || 'User'},\n\nYour account password has been updated by an administrator.\n\nPlease with administrator for password.\n\nBest regards,\nEvents Platform Team`,
        });
      } catch (emailErr) {
        console.error("Failed to send password notification email:", emailErr);
      }
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateSuperAdminProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    // Verify current password
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    // Update email if provided
    if (email && email !== user.email) {
      // Check if email is already taken
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already taken" });
      }
      user.email = email;
    }

    // Update password if provided
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.adminVisiblePassword = encrypt(newPassword);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.find({ role: "ORGANIZER", isApproved: false }).select("-password").sort({ createdAt: -1 });
    res.json(pendingAdmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const approveAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await User.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    if (admin.isApproved) {
      return res.status(400).send("<html><body><h2>Admin is already approved.</h2></body></html>");
    }
    
    admin.isApproved = true;
    await admin.save();
    
    try {
      await sendEmail({
        email: admin.email,
        subject: "Your Organizer Account is Approved!",
        message: `Hello ${admin.name},\n\nYour account has been approved by the Super Admin.\nYou can now login and start creating events.\n\nThank you,\nCareer Fair Team`
      });
    } catch (err) {
      console.error("Failed to send approval success email", err);
    }
    
    res.status(200).send("<html><body style='font-family:sans-serif; text-align:center; margin-top:50px;'><h2>Organizer Approved Successfully!</h2><p>An email has been sent to the organizer.</p></body></html>");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
