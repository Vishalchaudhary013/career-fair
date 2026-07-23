import express from 'express'
import { upload } from '../middleware/uploadMiddleware.js'
import { 
  createFair, 
  getAllFairs, 
  getFairById, 
  updateFair, 
  deleteFair, 
  joinAsPartner, 
  getEmployerDashboard, 
  updateEmployerJob, 
  deleteEmployerJob
} from '../controllers/eventController.js'
import { employerProtect } from '../middleware/adminMiddleware.js'

const router = express.Router()

router.post('/create',upload.fields([
    {
        name:"fairBanner",
        maxCount : 1,
    },
    {
        name:"fairLogo",
        maxCount : 1,
    },
    {
        name:"companyLogo",
        maxCount : 20,
    },
    {
        name:"companyListDocument",
        maxCount : 1,
    },

]),createFair)

router.get('/all', getAllFairs)
router.get('/:id', getFairById)
router.put('/update/:id', upload.fields([
    { name: "fairBanner", maxCount: 1 },
    { name: "fairLogo", maxCount: 1 },
    { name: "companyLogo", maxCount: 20 },
    { name: "companyListDocument", maxCount: 1 },
]), updateFair)
router.delete('/delete/:id', deleteFair)

router.get('/employer/my-dashboard', employerProtect, getEmployerDashboard)
router.post('/:id/join-as-partner', employerProtect, upload.fields([{ name: "companyLogo", maxCount: 1 }]), joinAsPartner)
router.post('/:id/post-job', employerProtect, upload.fields([{ name: "companyLogo", maxCount: 1 }]), joinAsPartner)
router.put('/:id/job/:jobId', employerProtect, upload.fields([{ name: "companyLogo", maxCount: 1 }]), updateEmployerJob)
router.delete('/:id/job/:jobId', employerProtect, deleteEmployerJob)

export default router