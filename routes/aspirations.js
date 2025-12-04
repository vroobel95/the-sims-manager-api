import express from 'express';
import { pool } from '../server.js';
const router = express.Router();

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'aspirations',
    format: async () => 'png',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

export const upload = multer({ storage });

// Get all aspirations
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aspirations');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get aspiration by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM aspirations WHERE id = '${req.params.id}'::uuid`
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Post aspiration
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Pobranie URL zdjęcia z Cloudinary
    const imageUrl = req.file.path;

    // Pobranie danych z requesta (np. nazwy aspiracji)
    const name = req.body.name;

    // Zapis do bazy danych
    const newAspiration = await db.query(
      `INSERT INTO aspirations (name, icon_url) VALUES (${name}, ${imageUrl}) RETURNING *`
    );

    res.json(newAspiration.rows[0]); // Zwracamy zapisany rekord
  } catch (error) {
    console.error('Upload failed', error);
    res.status(500).json({ error: 'Failed to upload aspiration' });
  }
});

// Put aspiration
router.put(':id', upload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    let imageUrl;

    // Sprawdzenie, czy przesłano nowy obrazek
    if (req.file) {
      imageUrl = req.file.path; // Pobranie nowego URL-a z Cloudinary
    }

    // Aktualizacja w bazie danych
    const result = await db.query(
      `UPDATE aspirations 
         SET name = ${name}, icon_url = COALESCE(${imageUrl}, icon_url) 
         WHERE id = ${id} RETURNING *`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aspiration not found' });
    }

    res.json(result.rows[0]); // Zwrócenie zaktualizowanego rekordu
  } catch (error) {
    console.error('Update failed', error);
    res.status(500).json({ error: 'Failed to update aspiration' });
  }
});

export default router;
