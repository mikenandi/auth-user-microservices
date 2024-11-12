# User Management Microservice

This User Management Microservice is built using NestJS, TypeORM, and Winston for logging. It provides endpoints for creating, updating, retrieving, and removing users. It communicates with the Auth Microservice for user creation and role management via TCP transport.

## Tech Stack

- **NestJS**: Framework for building server-side applications.
- **TypeORM**: ORM for managing database operations.
- **Winston**: Structured logging for monitoring and troubleshooting.
- **TCP**: Communication between microservices.

## Features

- User creation, retrieval, update, and deletion functionality.
- Role-based user management and integration with the Auth Microservice.
- Logging with Winston to track events and errors.

## Getting Started

### Prerequisites

- Node.js (v14+)
- Yarn (or npm)
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/user-management-microservice.git
   cd user-management-microservice
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables (e.g., database credentials).

### Running the Service

To run the service locally:

```bash
yarn start:dev
```

## Microservice Communication

This service communicates with the Auth Microservice via TCP. It listens for commands such as `create_user`, `update_user`, and others for user-related actions.
