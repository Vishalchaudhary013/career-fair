import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/public', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Return relative URL for frontend to use
    const fileUrl = `/uploads/files/${req.file.filename}`;
    res.status(200).json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

export default router;
