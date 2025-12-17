import express from 'express';
import { pool } from '../server.js';
const router = express.Router();

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'badges',
    format: async () => 'png',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM badges ORDER BY name asc');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;
