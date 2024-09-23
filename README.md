# SF Movie Locations API

This project is part of the Kindalab code challenge. It serves data for movie filming locations in San Francisco and integrates with external APIs.

## Tools Used

- Express
- Typescript

## Installation

Follow these steps to set up the backend:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sf-movie-locations-api.git
```

2. Navigate to the project directory:

```bash
cd kl-challenge-backend
```

3. Install dependencies:

```bash
npm install
```

## Running the server

To start the server in development mode, run:

```
npm run dev
```

This will run the app with ts-node and listen on http://localhost:9000.

## Environment Variables

The following environment variable is required to run the server:

| Variable Name         | Description                           | Required |
| --------------------- | ------------------------------------- | -------- |
| `GOOGLE_MAPS_API_KEY` | API key for accessing Google Maps API | Yes      |

You can create a `.env` file at the root of the project:

```
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

# Scripts

- Start development server: `npm run dev`
- Start production server: `npm start`
