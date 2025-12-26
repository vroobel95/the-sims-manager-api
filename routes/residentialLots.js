import express from 'express';
import { pool } from '../server.js';
const router = express.Router();

// Get all residential lots
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM residential_lots ORDER BY address asc'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get residential lot by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM residential_lots WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Residential lot not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Add residential lot
router.post('/', async (req, res) => {
  try {
    const { name, address, neighbourhood_id, lot_price, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const result = await pool.query(
      'INSERT INTO residential_lots (name, address, neighbourhood_id, lot_price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        name,
        address || null,
        neighbourhood_id || null,
        lot_price || null,
        image_url || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Edit residential lot
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, neighbourhood_id, lot_price, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const result = await pool.query(
      'UPDATE residential_lots SET name = $1, address = $2, neighbourhood_id = $3, lot_price = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [
        name,
        address || null,
        neighbourhood_id || null,
        lot_price || null,
        image_url || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Residential lot not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete residential lot
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM residential_lots WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Residential lot not found' });
    }

    res.status(200).json({
      message: 'Residential lot deleted successfully',
      residentialLot: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;
