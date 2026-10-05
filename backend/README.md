# AquaFlow Backend API

<!-- Badges -->
![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
![Java](https://img.shields.io/badge/Java-17-informational)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## Overview
AquaFlow is an Import/Export Fish Business Management Platform.  
This repository contains the Spring Boot REST API for authentication, inventory, orders, shipments, and an owner dashboard summary.

## Architecture
- **Modules**: Auth, Inventory, Orders, Shipments, Dashboard
- **Auth**: JWT (Bearer) with role-based access control
- **Data**: PostgreSQL (JPA/Hibernate) + Redis (cache)
- **Docs**: Springdoc OpenAPI (Swagger UI)

> Architecture diagram: _add link here_

## Tech Stack

| Backend | Database | Cache | Auth | Docs | Testing | DevOps |
|---|---|---|---|---|---|---|
| Spring Boot 3.2 | PostgreSQL 15 | Redis 7 | JWT (jjwt) | springdoc-openapi | JUnit 5, Mockito, Testcontainers | Docker, GitHub Actions |

## Getting Started

### Prerequisites
- Java 17
- Maven
- Docker + Docker Compose

### Run locally with Docker Compose

```bash
docker-compose up --build
```

### Access
- **API**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/api-docs`

## API Endpoints (high level)

### Auth
- `POST /api/auth/register` (public)
- `POST /api/auth/login` (public)

### Inventory
- `GET /api/fish` (public)
- `GET /api/fish/{id}` (public)
- `GET /api/fish/search?name=` (public)
- `POST /api/fish` (OWNER)
- `PUT /api/fish/{id}` (OWNER)
- `DELETE /api/fish/{id}` (OWNER)
- `PATCH /api/fish/{id}/stock?quantity=` (OWNER, SUPPLIER)

### Orders
- `POST /api/orders` (BUYER)
- `GET /api/orders` (OWNER)
- `GET /api/orders/my` (BUYER, SUPPLIER)
- `GET /api/orders/{id}` (authenticated)
- `PATCH /api/orders/{id}/status?status=` (OWNER, SUPPLIER)

### Shipments
- `POST /api/shipments` (OWNER, SUPPLIER)
- `GET /api/shipments` (OWNER)
- `GET /api/shipments/{id}` (authenticated)
- `GET /api/shipments/order/{orderId}` (authenticated)
- `PATCH /api/shipments/{id}/status?status=` (OWNER, SUPPLIER)
- `GET /api/shipments/my` (BUYER)

### Dashboard
- `GET /api/dashboard/summary` (OWNER)

## Environment Variables

| Name | Description | Default |
|---|---|---|
| `DB_URL` | JDBC URL for Postgres | `jdbc:postgresql://localhost:5432/aquaflow` |
| `DB_USERNAME` | DB user | `aquaflow` |
| `DB_PASSWORD` | DB password | `aquaflow` |
| `REDIS_HOST` | Redis host | `localhost` |
| `JWT_SECRET` | JWT signing secret | `aquaflow-secret-key-for-development-only-change-in-prod` |

## Running Tests

```bash
mvn test
```

> Testcontainers requires Docker running locally.

## CI/CD
- **CI**: runs on pull requests to `main` and `develop` (build + tests)
- **CD**: on push to `main` builds and pushes Docker image and deploys to Oracle Cloud VM over SSH

## Monitoring

Start monitoring stack:

```bash
docker-compose -f docker-compose.yml up -d
docker-compose -f docker-compose.monitoring.yml up -d
```

- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3000`

## Project Structure

```text
aquaflow-backend/
  src/main/java/com/aquaflow/...
  src/main/resources/application.yml
  docker/
  prometheus/
  .github/workflows/
```

