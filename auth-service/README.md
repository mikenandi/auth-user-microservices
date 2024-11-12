# Auth Microservice

This Auth Microservice is built using NestJS, TypeORM, and Winston for logging. It handles user authentication, registration, and token management, providing secure login and role-based access control. It also communicates with other services via TCP transport.

## Tech Stack

- **NestJS**: Framework for building server-side applications.
- **TypeORM**: ORM for managing database operations.
- **Winston**: Structured logging for monitoring and troubleshooting.
- **TCP**: Communication between microservices.

## Features

- User sign-up and sign-in functionality.
- JWT-based authentication.
- Role-based access control for secure user permissions.
- Logging with Winston to track events and errors.

## Getting Started

### Prerequisites

- Node.js (v14+)
- Yarn (or npm)
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/auth-microservice.git
   cd auth-microservice
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables (e.g., database credentials, JWT secret).

### Running the Service

To run the service locally:

```bash
yarn start:dev
```

## Microservice Communication

This service uses TCP for inter-service communication.
