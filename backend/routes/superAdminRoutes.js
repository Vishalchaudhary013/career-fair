import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllEvents,
  deleteEvent,
  impersonateUser,
  changeUserPassword,
  updateSuperAdminProfile,
  getPendingAdmins,
  approveAdmin,
  getAllBookings
} from '../controllers/superAdminController.js';
import { superAdminProtect } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get("/stats", superAdminProtect, getDashboardStats);

router.get("/users", superAdminProtect, getAllUsers);
router.delete("/users/:id", superAdminProtect, deleteUser);
router.post("/users/:id/impersonate", superAdminProtect, impersonateUser);
router.put("/users/:id/password", superAdminProtect, changeUserPassword);
router.get("/events", superAdminProtect, getAllEvents);
router.delete("/events/:id", superAdminProtect, deleteEvent);
router.put("/profile", superAdminProtect, updateSuperAdminProfile);


router.get("/pending-admins", superAdminProtect, getPendingAdmins);
router.get("/approve-admin/:id", approveAdmin); 
router.get("/bookings", superAdminProtect, getAllBookings); 

export default router;
