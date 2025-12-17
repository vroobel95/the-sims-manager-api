import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
import aspirations from './routes/aspirations.js';

const { Pool } = pkg;

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.UI_ORIGIN === origin) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json());

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/', (req, res) => {
  res.send('The Sims Manager API is running');
});

// routes
app.use('/api/aspirations', aspirations);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server runs on port: ${PORT}`);
});
