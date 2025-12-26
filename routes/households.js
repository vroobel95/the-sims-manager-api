import express from 'express';
import { pool } from '../server.js';
const router = express.Router();

// Get all households
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM households ORDER BY name asc'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get household by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM households WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Add household
router.post('/', async (req, res) => {
  try {
    const { name, round, house_id, funds, wealth, image_url } = req.body;

    if (
      !name ||
      round === undefined ||
      funds === undefined ||
      wealth === undefined
    ) {
      return res
        .status(400)
        .json({ message: 'Name, round, funds, and wealth are required' });
    }

    const result = await pool.query(
      'INSERT INTO households (name, round, house_id, funds, wealth, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, round, house_id || null, funds, wealth, image_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Edit household
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, round, house_id, funds, wealth, image_url } = req.body;

    if (
      !name ||
      round === undefined ||
      funds === undefined ||
      wealth === undefined
    ) {
      return res
        .status(400)
        .json({ message: 'Name, round, funds, and wealth are required' });
    }

    const result = await pool.query(
      'UPDATE households SET name = $1, round = $2, house_id = $3, funds = $4, wealth = $5, image_url = $6 WHERE id = $7 RETURNING *',
      [name, round, house_id || null, funds, wealth, image_url || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete household
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM households WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.status(200).json({
      message: 'Household deleted successfully',
      household: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;
