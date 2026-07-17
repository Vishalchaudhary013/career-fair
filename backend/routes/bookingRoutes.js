import express from 'express';
import { createBooking, getBookingById, verifyQR, getBookingsByEvent, deleteBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/event/:eventId', getBookingsByEvent);
router.get('/:id', getBookingById);
router.delete('/:id', deleteBooking);
router.post('/verify-qr', verifyQR);

export default router;
