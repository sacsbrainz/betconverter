# Bet Booking Code Converter

## Overview
Bet Booking Code Converter is a tool that allows users to convert bet booking codes from one platform to another. For example, it can convert a code from `sportybet.com` to `football.com` or `msports` and other supported platforms.

## Project Structure
The project is structured as a monorepo with separate `backend` and `frontend` directories:
```
BETCONVERTER/
│── backend/       # Backend service
│   ├── src/       # Source code for the backend
│   ├── storage/   # Storage files
│   ├── package.json  # Dependencies for backend
│   ├── Dockerfile # Containerization setup
│   ├── .env.example # Environment variables
│   └── README.md  # Backend-specific documentation
│
│── frontend/      # Frontend application
│   ├── src/       # Source code for the frontend
│   ├── public/    # Static files
│   ├── package.json  # Dependencies for frontend
│   ├── Dockerfile # Containerization setup
│   ├── .env.example # Environment variables
│   └── README.md  # Frontend-specific documentation
```

## Features
- Convert bet booking codes between different betting platforms
- Fast and reliable conversion
- Frontend UI for user-friendly interactions
- API-based backend for handling conversions
- Support for multiple betting websites

## Installation & Setup

### Prerequisites
- Ensure you have [Bun.js](https://bun.sh/) installed (for frontend and backend)
- Ensure you have [Docker](https://www.docker.com/) installed (optional, for containerized deployment)

### Backend Setup
```sh
cd backend
bun install  # Install dependencies
cp .env.example .env  # Configure environment variables
bun run dev  # Start backend in development mode
```

### Frontend Setup
```sh
cd frontend
bun install  # Install dependencies
cp .env.example .env  # Configure environment variables
bun run dev  # Start frontend in development mode
```

### Running with Docker (Optional)
```sh
docker-compose up --build
```

## Supported Platforms
- SportyBet
- Football.com
- MSports
- (Add more platforms as supported)

## Contribution
Contributions are welcome! Please open an issue or submit a pull request if you find bugs or want to add new features.

## License
This project is licensed under the Unlicense License. See [LICENSE](https://unlicense.org/) for details.

## Contact
For support or inquiries, reach out via:
- GitHub: [sacsbrainz](https://github.com/sacsbrainz)
- Email: support@betconverter.xyz

