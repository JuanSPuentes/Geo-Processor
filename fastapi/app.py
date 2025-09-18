from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, confloat
from typing import List

class Point(BaseModel):
    lat: confloat(ge=-90, le=90)
    lng: confloat(ge=-180, le=180)

class PointsRequest(BaseModel):
    points: List[Point]

class Bounds(BaseModel):
    north: float
    south: float
    east: float
    west: float

class ProcessResponse(BaseModel):
    centroid: Point
    bounds: Bounds

app = FastAPI(title="Geo Processor", version="1.0.0")

@app.post("/process", response_model=ProcessResponse)
def process_points(req: PointsRequest):
    if not req.points:
        raise HTTPException(status_code=400, detail="`points` no puede estar vacío")

    lats = [p.lat for p in req.points]
    lngs = [p.lng for p in req.points]

    centroid = Point(lat=sum(lats)/len(lats), lng=sum(lngs)/len(lngs))
    bounds = Bounds(north=max(lats), south=min(lats), east=max(lngs), west=min(lngs))

    return ProcessResponse(centroid=centroid, bounds=bounds)