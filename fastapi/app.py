from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, confloat, conlist
from typing import List

class Point(BaseModel):
    lat: confloat(ge=-90, le=90)
    lng: confloat(ge=-180, le=180)

class PointsRequest(BaseModel):
    points: conlist(Point, min_length=1)

class Bounds(BaseModel):
    north: float
    south: float
    east: float
    west: float

class ProcessResponse(BaseModel):
    centroid: Point
    bounds: Bounds

app = FastAPI(title="Geo Processor", version="1.0.0")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={
            "error": "The body must have 'points' as a non-empty array of objects with valid numeric 'lat' and 'lng'.",
            "details": exc.errors(),
        },
    )

@app.post("/process", response_model=ProcessResponse)
def process_points(req: PointsRequest):
    lats = [p.lat for p in req.points]
    lngs = [p.lng for p in req.points]

    centroid = Point(lat=sum(lats)/len(lats), lng=sum(lngs)/len(lngs))
    bounds = Bounds(north=max(lats), south=min(lats), east=max(lngs), west=min(lngs))

    return ProcessResponse(centroid=centroid, bounds=bounds)
