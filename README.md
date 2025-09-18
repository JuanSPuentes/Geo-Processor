# Geo-Processor

Geo‑Processor is a microservice ecosystem for processing geographic coordinates and visualizing the results on a map. It consists of three services — FastAPI (Python), NestJS (Node.js) and Next.js — that communicate with each other and run via Docker and Docker Compose.

## Table of contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Quick start with Docker Compose](#quick-start-with-docker-compose)
5. [Running services individually](#running-services-individually)
6. [API usage](#api-usage)
7. [Contributing](#contributing)

## Features

- Calculates the centroid and bounding box for a set of geographic points.
- Python **FastAPI** service that performs the mathematical operations:contentReference[oaicite:0]{index=0}.
- **NestJS** service that acts as an orchestrator: exposes REST endpoints and calls the Python microservice:contentReference[oaicite:1]{index=1}.
- **Next.js** front‑end using React‑Leaflet to visualise the results on an interactive map.

## Project Structure

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


### fastapi/

Exposes a `POST /process` endpoint that accepts a list of `{lat, lng}` points and returns the centroid and the northern, southern, eastern and western bounds:contentReference[oaicite:2]{index=2}. Runs on port **8000**:contentReference[oaicite:3]{index=3}.

### nest/

NestJS microservice that listens on `POST /geo/process`, validates input, calls the FastAPI service and caches responses. Runs on port **3001**:contentReference[oaicite:4]{index=4}.

### next/

Next.js app with React‑Leaflet UI. Lets users input points, compute the result and display it on a map. Runs on port **3000**:contentReference[oaicite:5]{index=5}.

## Prerequisites

- **Docker** and **Docker Compose** installed.
- Optional for manual execution:
  - **Python 3.11**
  - **Node.js** (v18 or later)
  - **npm** or **yarn**

## Quick start with Docker Compose

The easiest way to run everything is via Docker Compose:

```bash
# Clone this repository
git clone https://github.com/JuanSPuentes/Geo-Processor.git
cd Geo-Processor

# Build and run the containers
docker compose up --build

Docker Compose will download dependencies, build the images and start all services:

FastAPI: http://localhost:8000

NestJS: http://localhost:3001

Next.js: http://localhost:3000

Open http://localhost:3000 in your browser to interact with the application.