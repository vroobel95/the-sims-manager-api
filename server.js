import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
import aspirations from './routes/aspirations.js';
import badges from './routes/badges.js';
import careers from './routes/careers.js';
import chemistries from './routes/chemistries.js';
import collegeMajors from './routes/collegeMajors.js';
import hobbies from './routes/hobbies.js';
import households from './routes/households.js';
import lifetimeWants from './routes/lifetimeWants.js';
import neighbourhoods from './routes/neighbourhoods.js';
import residentialLots from './routes/residentialLots.js';
import zodiacSigns from './routes/zodiacSigns.js';

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
// dictionaries
app.use('/api/aspirations', aspirations);
app.use('/api/badges', badges);
app.use('/api/careers', careers);
app.use('/api/chemistries', chemistries);
app.use('/api/collegeMajors', collegeMajors);
app.use('/api/hobbies', hobbies);
app.use('/api/lifetimeWants', lifetimeWants);
app.use('/api/neighbourhoods', neighbourhoods);
app.use('/api/zodiacSigns', zodiacSigns);

// entities
app.use('/api/households', households);
app.use('/api/residentialLots', residentialLots);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server runs on http://localhost:${PORT}`);
});
