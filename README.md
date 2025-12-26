# The Sims Manager API

A backend API for managing The Sims game data, including aspirations and badges. Built with Node.js, Express, and PostgreSQL.

## Features

- **Aspirations Management**: Retrieve and manage game aspirations
- **Badges Management**: Retrieve and manage achievement badges
- **Households Management**: Create, retrieve, update, and delete household data
- **Image Storage**: Cloudinary integration for storing aspiration and badge images
- **CORS Support**: Configurable cross-origin requests for frontend integration
- **PostgreSQL Database**: Persistent data storage
- **Railway Deployment**: Ready for deployment on Railway

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Environment Management**: dotenv
- **Cross-Origin**: CORS

## Prerequisites

Before running this project, ensure you have:

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (free tier available)
- Git (for version control)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd the-sims-manager-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sims_manager
PORT=5000
UI_ORIGIN=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Environment Variables

| Variable                | Description                      | Example                                         |
| ----------------------- | -------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string     | `postgresql://user:pass@localhost/sims_manager` |
| `PORT`                  | Server port                      | `5000`                                          |
| `UI_ORIGIN`             | Allowed CORS origin for frontend | `http://localhost:3000`                         |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name    | `your-cloud`                                    |
| `CLOUDINARY_API_KEY`    | Cloudinary API key               | `your-api-key`                                  |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret            | `your-api-secret`                               |

## Getting Started

### Development Mode

Run the server in watch mode with automatic reloading:

```bash
npm run dev
```

The server will restart automatically when you make changes to the code.

### Production Mode

Start the server:

```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check

- **GET** `/` - Check if the API is running
  - Response: `"The Sims Manager API is running"`

### Aspirations

- **GET** `/api/aspirations` - Retrieve all aspirations
  - Response: Array of aspiration objects

### Badges

- **GET** `/api/badges` - Retrieve all badges (sorted by name)
  - Response: Array of badge objects

### Careers

- **GET** `/api/careers` - Retrieve all careers
  - Response: Array of career objects

### Chemistries

- **GET** `/api/chemistries` - Retrieve all chemistries
  - Response: Array of chemistry objects

### College Majors

- **GET** `/api/collegeMajors` - Retrieve all college majors
  - Response: Array of college major objects

### Hobbies

- **GET** `/api/hobbies` - Retrieve all hobbies
  - Response: Array of hobby objects

### Lifetime Wants

- **GET** `/api/lifetimeWants` - Retrieve all lifetime wants
  - Response: Array of lifetime want objects

### Neighbourhoods

- **GET** `/api/neighbourhoods` - Retrieve all neighbourhoods
  - Response: Array of neighbourhood objects

### Zodiac Signs

- **GET** `/api/zodiacSigns` - Retrieve all zodiac signs
  - Response: Array of zodiac sign objects

### Households

- **GET** `/api/households` - Retrieve all households
  - Response: Array of household objects
- **GET** `/api/households/:id` - Retrieve a specific household by ID
  - Response: Single household object
- **POST** `/api/households` - Create a new household
  - Body: `{ name, round, house_id, funds, wealth, image_url }`
  - Required: `name`, `round`, `funds`, `wealth`
  - Response: Created household object
- **PUT** `/api/households/:id` - Update a household
  - Body: `{ name, round, house_id, funds, wealth, image_url }`
  - Required: `name`, `round`, `funds`, `wealth`
  - Response: Updated household object
- **DELETE** `/api/households/:id` - Delete a household
  - Response: Deleted household object with success message

## Project Structure

```
the-sims-manager-api/
├── server.js              # Main Express server configuration
├── cloudinary.js          # Cloudinary configuration
├── package.json           # Project dependencies and scripts
├── routes/
│   ├── aspirations.js     # Aspirations endpoints
│   ├── badges.js          # Badges endpoints
│   └── households.js      # Households endpoints
├── .env                   # Environment variables (not in git)
└── .gitignore             # Git ignore rules
```

## Database Schema

Ensure your PostgreSQL database has the following tables:

### aspirations

```sql
CREATE TABLE aspirations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  -- Add other relevant fields
);
```

### badges

```sql
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  -- Add other relevant fields
);
```

### households

```sql
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  round INTEGER NOT NULL,
  house_id UUID,
  funds INTEGER NOT NULL,
  wealth INTEGER NOT NULL,
  image_url VARCHAR(255)
);
```

## File Upload

Both aspirations and badges support image uploads via Cloudinary:

- Aspirations images are stored in the `aspirations/` folder
- Badges images are stored in the `badges/` folder
- Files are automatically converted to PNG format
- Files are named with timestamp and original filename

## CORS Configuration

The API enforces CORS security:

- Only requests from the origin specified in `UI_ORIGIN` environment variable are allowed
- Requests without an origin (like curl or Postman) are allowed
- All other origins will receive a CORS error

## Deployment

This project is configured for deployment on Railway.

### Deploy to Railway

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign in to [Railway.app](https://railway.app)
3. Create a new project and connect your repository
4. Configure environment variables in the Railway dashboard:
   - `DATABASE_URL`
   - `UI_ORIGIN`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `PORT` (optional, Railway assigns a default)
5. Deploy

Railway will automatically detect the Node.js project and build it based on `package.json`.

## Error Handling

The API returns the following status codes:

- `200` - Success
- `400` - Bad Request
- `500` - Server Error

## Development Tips

- Use `npm run dev` for development with auto-reload
- Check the console logs for debugging information
- Ensure your PostgreSQL database is running before starting the server
- Verify Cloudinary credentials are correct in your `.env` file

## Troubleshooting

### Database Connection Error

- Verify `DATABASE_URL` is correct in `.env`
- Ensure PostgreSQL server is running
- Check database credentials

### Cloudinary Upload Failing

- Verify Cloudinary credentials are correct
- Check that the `aspirations` and `badges` folders exist in Cloudinary
- Ensure your Cloudinary account has available storage

### CORS Error

- Check that `UI_ORIGIN` in `.env` matches your frontend URL
- Verify the frontend is making requests to the correct API endpoint

## License

ISC

## Author

Created for managing The Sims game data.
