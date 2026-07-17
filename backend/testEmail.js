import mongoose from 'mongoose';
import User from './models/userModel.js';
import dotenv from 'dotenv';
import sendEmail from './utils/sendEmail.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  
  const users = await User.find({}, 'email name role');
  console.log('Users in DB:');
  console.table(users.map(u => ({ email: u.email, name: u.name, role: u.role })));
  
  try {
    console.log('Testing email send...');
    await sendEmail({
      email: process.env.EMAIL_USER, // send to self
      subject: 'Test Email',
      message: 'This is a test email to verify credentials.',
      html: '<p>This is a test email to verify credentials.</p>'
    });
    console.log('Test email sent successfully.');
  } catch (err) {
    console.error('Error sending test email:', err.message);
  }
  
  mongoose.disconnect();
}

run();
