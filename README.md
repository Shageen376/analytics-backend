# Analytics App

A scalable backend API for a Website Analytics app that can be integrated with any website or mobile app. The system will allow clients to collect detailed analytics events such as clicks, website visits, referrer data, and device metrics. The APIs can handle high traffic, provide efficient aggregation endpoints, and be containerized for deployment.
**Production URL:** [https://analytics-backend.up.railway.app](https://analytics-backend.up.railway.app)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [Testing](#testing)

## Features

### API Key Management

- Websites and apps must register to obtain an API key.
- API keys are required for authentication when sending events (use headers to send API keys).
- Endpoints support creating, revoking, regenerating API keys, and handling expiration.

### Event Data Collection

- Accepts analytics events such as clicks, visits, referrer info, and device details.
- Ensures data integrity and high availability for large-scale event ingestion.

### Analytics & Reporting

- Provides insights via time-based, event-based, app-based, and user-based data aggregation.
- Supports caching using Redis for frequently requested data.

## Tech Stack

### Backend

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL

### DevOps & Deployment

- **Deployment:** Railway
- **Containerization:** Docker
- **Environment Management:** dotenv / Environment Variables

### Testing & Validation

- **Manual API Testing:** Postman (for testing all endpoints and API flows)
- **Validation:** class-validator, class-transformer (to ensure request data integrity)

### Others

- **API Documentation:** Swagger https://analytics-backend.up.railway.app/api-docs
- **Version Control:** Git / GitHub https://github.com/Shageen376/analytics-backend.git

## Local Setup

Follow these steps to get the Analytics Backend App running on your local machine at http://localhost:3000

**1. Clone the repository**

```bash
git clone https://github.com/Shageen376/analytics-backend.git
cd analytics-app
```

**2. Install dependencies**

```
npm install
```

**3. Set up Environment Variables**

Create .env file with following variables

```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

**4. Run the application**


- **Development mode (with live reload)**

```
npm run start:dev
```

- **Production mode**

```
npm run start
```

- **Run using Docker**

```
docker build -t analytics-backend .
docker run -p 3000:3000 analytics-backend
```
## Testing

To test the API endpoints, import the provided Postman collection from the app
```
Analytics-Backend.postman_collection.json
```
into Postman. This collection includes all major routes and sample requests for easy testing and validation.