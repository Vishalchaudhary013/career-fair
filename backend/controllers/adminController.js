import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: "7d",
  });
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/SuperAdmin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Impersonate user
// @route   POST /api/admin/users/:id/impersonate
// @access  Private/SuperAdmin
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

// @desc    Change user password
// @route   PUT /api/admin/users/:id/password
// @access  Private/SuperAdmin
export const changeUserPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    
    if (!user.isVerified) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
    }
    
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/SuperAdmin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
