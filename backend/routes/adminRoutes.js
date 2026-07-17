import express from 'express';
import { getAllUsers, impersonateUser, changeUserPassword, deleteUser } from '../controllers/adminController.js';
import { superAdminProtect } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get("/users", superAdminProtect, getAllUsers);
router.post("/users/:id/impersonate", superAdminProtect, impersonateUser);
router.put("/users/:id/password", superAdminProtect, changeUserPassword);
router.delete("/users/:id", superAdminProtect, deleteUser);

export default router;
