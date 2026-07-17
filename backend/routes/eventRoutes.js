import express from 'express'
import { upload } from '../middleware/uploadMiddleware.js'
import { createFair, getAllFairs, getFairById, updateFair, deleteFair } from '../controllers/eventController.js'

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

export default router