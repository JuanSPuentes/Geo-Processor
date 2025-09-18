# Geo-Processor

Geo‑Processor is a microservice ecosystem for processing geographic coordinates and visualizing results on a map. It consists of three services—FastAPI (Python), NestJS (Node.js) and Next.js—that communicate with each other and run via Docker and Docker Compose.

## Table of Contents

1. **Features**
2. **Project Structure**
3. **Prerequisites**
4. **Quick Start with Docker Compose**
5. **Running Services Individually**
6. **API Usage**
7. **Contributing**

## Features

- Calculates the centroid and bounding box for a set of geographic points.
- Python **FastAPI** service performs the mathematical operations.
- **NestJS** service acts as an orchestrator: it exposes REST endpoints and calls the Python microservice.
- **Next.js** front‑end with React‑Leaflet for interactive map visualization.

## Project Structure
```bash
├── fastapi/ # Python service (FastAPI)
│ ├── app.py
│ ├── requirements.txt
│ └── Dockerfile
├── nest/ # Node.js service (NestJS)
│ ├── src/
│ ├── package.json
│ └── Dockerfile
├── next/ # Web interface (Next.js)
│ ├── app/
│ ├── package.json
│ └── Dockerfile
└── docker-compose.yml
```

### fastapi/

Exposes a `POST /process` endpoint that accepts a list of `{lat, lng}` points and returns the centroid and the northern, southern, eastern and western bounds. Runs on port **8000**.

### nest/

NestJS microservice that listens on `POST /geo/process`, validates input, calls the FastAPI service, and caches responses. Runs on port **3001**.

### next/

Next.js app with React‑Leaflet UI. Allows users to input points, compute the result and display it on a map. Runs on port **3000**.

## Prerequisites

- **Docker** and **Docker Compose** installed.
- Optional for manual execution:
  - **Python 3.12.3**
  - **Node.js** (version 20 or later)
  - **npm** or **yarn**

## Quick Start with Docker Compose

The easiest way to run everything is via Docker Compose:

```bash
# Clone this repository
git clone https://github.com/JuanSPuentes/Geo-Processor.git
cd Geo-Processor

# Build and run the containers
docker compose up --build
```

Docker Compose will download dependencies, build the images and start all services:

- FastAPI: http://localhost:8000

- NestJS: http://localhost:3001

- Next.js: http://localhost:3000

Open http://localhost:3000
 in your browser to interact with the application. Stop the services with:

```bash
docker compose down
```


# Running Services Individually

To develop each microservice separately, run them manually.

## FastAPI service
```bash
cd fastapi
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## NestJS service
```bash
cd nest
npm install
# Development with hot reload
npm run start:dev
# Production
npm run start
```

## NestJS service
```bash
cd next
npm install
# Development
npm run dev
# Production
npm run build
npm run start
```

# API Usage

You can call the API directly without the front‑end.

POST /geo/process
```bash
POST http://localhost:3001/geo/process
Content-Type: application/json

{
  "points": [
    {"lat": 40.7128, "lng": -74.0060},
    {"lat": 34.0522, "lng": -118.2437}
  ]
}

```
## response
```bash
{
  "centroid": {
    "lat": 37.3825,
    "lng": -96.12485
  },
  "bounds": {
    "north": 40.7128,
    "south": 34.0522,
    "east": -74.006,
    "west": -118.2437
  }
}
```