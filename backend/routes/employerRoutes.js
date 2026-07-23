import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { 
  getEmployerDashboard, 
  joinAsPartner, 
  updateEmployerJob, 
  deleteEmployerJob 
} from '../controllers/eventController.js';
import { employerProtect } from '../middleware/adminMiddleware.js';

const router = express.Router();


router.get('/my-dashboard', employerProtect, getEmployerDashboard);

router.post('/:id/join-as-partner', employerProtect, upload.fields([
  { name: 'companyLogo', maxCount: 1 }
]), joinAsPartner);

router.put('/:id/job/:jobId', employerProtect, upload.fields([
  { name: 'companyLogo', maxCount: 1 }
]), updateEmployerJob);

router.delete('/:id/job/:jobId', employerProtect, deleteEmployerJob);

export default router;
