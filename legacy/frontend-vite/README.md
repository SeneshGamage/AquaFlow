# AquaFlow Frontend

![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61dafb)
![Node](https://img.shields.io/badge/Node-20-success)

## Overview
AquaFlow Frontend is a React + TypeScript web application for the AquaFlow platform.  
It provides role-based experiences for **OWNER**, **SUPPLIER**, and **BUYER** users.

## Tech Stack
- React 18, TypeScript, Vite
- React Router v6
- Tailwind CSS (shadcn/ui-ready styling)
- React Query (TanStack Query)
- Zustand (auth state)
- Axios
- Recharts

## Getting Started

### Prerequisites
- Node.js 20+

### Install & run

```bash
npm install
npm run dev
```

The backend should be running at `http://localhost:8080`.  
Vite proxies `/api` → `http://localhost:8080`.

## User Roles & Features

| Role | Key pages/features |
|---|---|
| OWNER | Dashboard, Inventory management, Orders, Shipments |
| SUPPLIER | Confirm orders, manage shipments |
| BUYER | Fish catalog, place orders, track shipments |

## Pages / Routes
- `/login`, `/register`
- `/dashboard`, `/inventory`, `/orders`, `/shipments` (OWNER)
- `/fish` (BUYER)
- `/orders/my` (BUYER, SUPPLIER)
- `/shipments/my` (BUYER)
- `/unauthorized`

## Environment Variables
Optional:
- `VITE_API_URL` (if you choose to override; default uses `/api` proxy)

## Build & Deploy

```bash
npm run build
docker build -t aquaflow-frontend:latest .
```

## CI/CD
- **CI**: lint + build on pull requests
- **CD**: build Docker image and deploy to Oracle Cloud VM

## Project Structure

```text
aquaflow-frontend/
  src/
    api/
    components/
    pages/
    store/
    types/
  Dockerfile
  nginx.conf
  .github/workflows/
```

