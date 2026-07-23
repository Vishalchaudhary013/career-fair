import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    required: true
  },
  tickets: [{
    ticketId: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number }
  }],
  totalPrice: { type: Number, default: 0 },
  totalItems: { type: Number, default: 1 },
  answers: {
    type: mongoose.Schema.Types.Mixed, 
    default: {}
  },
  qrCodeId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Attended'],
    default: 'Confirmed'
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
