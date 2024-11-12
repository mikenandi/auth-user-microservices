# Microservices Architecture

This repository contains the `Auth Microservice` and the `User Management Microservice`, both of which are built using NestJS, TypeORM, and Winston for logging. The services communicate with each other via TCP transport and are orchestrated using Docker Compose with a shared PostgreSQL database.

## Tech Stack

- **NestJS**: Framework for building server-side applications.
- **TypeORM**: ORM for managing database operations.
- **Winston**: Structured logging for monitoring and troubleshooting.
- **TCP**: Communication between microservices.
- **Docker**: Containerization and orchestration of services.
- **PostgreSQL**: Database used by both microservices.

## Features

- **Auth Microservice**: Handles user authentication, registration, JWT token generation, and role-based access control.
- **User Management Microservice**: Manages user CRUD operations and interacts with the Auth Microservice for role management and user creation.
- **Inter-Service Communication**: Microservices communicate via TCP for user creation and updates.

## Getting Started

### Prerequisites

- Node.js (v14+)
- Docker & Docker Compose (for running services in containers)
- Yarn (or npm) for dependency management

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/microservices-architecture.git
   cd microservices-architecture
   ```

2. Navigate into each service and install dependencies:

   For **Auth Microservice**:

   ```bash
   cd auth-microservice
   yarn install
   ```

   For **User Management Microservice**:

   ```bash
   cd user-management-microservice
   yarn install
   ```

3. Set up environment variables for each service. Each service has a `.env` file or environment configuration required (e.g., database credentials, JWT secret).

### Running the Services with Docker Compose

To run both services and a PostgreSQL database locally with Docker Compose, execute the following command from the root directory:

```bash
docker-compose up --build
```

This will:

- Build and start the Auth and User Management microservices.
- Start a PostgreSQL container for database access.
- Ensure the services can communicate with each other via TCP.

### Running Locally Without Docker

If you prefer to run the services without Docker, follow the steps below:

1. For the **Auth Microservice**:

   ```bash
   cd auth-microservice
   yarn start:dev
   ```

2. For the **User Management Microservice**:

   ```bash
   cd user-management-microservice
   yarn start:dev
   ```

Ensure that the database is running and properly configured.

### Docker Compose Configuration

The `docker-compose.yml` file is located in the root directory. It includes configurations for the PostgreSQL database and both microservices.

### Microservice Communication

- The **User Management Microservice** sends messages to the **Auth Microservice** via TCP.
- The **Auth Microservice** listens for commands like `create_user`, `update_user`, and processes them accordingly.
