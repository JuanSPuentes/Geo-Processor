import math
import pytest
from fastapi.testclient import TestClient

try:
    from app import app 
except ModuleNotFoundError:
    try:
        from app import app 
    except ModuleNotFoundError as e:
        raise ModuleNotFoundError(
            "Could not import `app`. Ensure your FastAPI instance is named `app` "
            "and lives in app.py or main.py at the project root, or adjust the import."
        ) from e

client = TestClient(app)

def test_process_points_ok_two_points():
    payload = {
        "points": [
            {"lat": 40.7128, "lng": -74.0060},
            {"lat": 34.0522, "lng": -118.2437},
        ]
    }
    r = client.post("/process", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()

    assert "centroid" in data and "bounds" in data
    assert set(data["bounds"].keys()) == {"north", "south", "east", "west"}

    lats = [p["lat"] for p in payload["points"]]
    lngs = [p["lng"] for p in payload["points"]]
    expected_centroid = {
        "lat": sum(lats) / len(lats),
        "lng": sum(lngs) / len(lngs),
    }
    assert math.isclose(data["centroid"]["lat"], expected_centroid["lat"], rel_tol=1e-9)
    assert math.isclose(data["centroid"]["lng"], expected_centroid["lng"], rel_tol=1e-9)
    assert data["bounds"]["north"] == max(lats)
    assert data["bounds"]["south"] == min(lats)
    assert data["bounds"]["east"] == max(lngs)
    assert data["bounds"]["west"] == min(lngs)


def test_process_points_ok_single_point():
    payload = {"points": [{"lat": 10.0, "lng": 20.0}]}
    r = client.post("/process", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["centroid"] == {"lat": 10.0, "lng": 20.0}
    assert data["bounds"] == {"north": 10.0, "south": 10.0, "east": 20.0, "west": 20.0}


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"points": "no-array"},
        {"points": 123},
        {"points": {"lat": 1, "lng": 2}},
        {"points": []},
        {"points": [{"lng": 20.0}]},
        {"points": [{"lat": 10.0}]},
        {"points": [{"lat": "10.0", "lng": 20.0}]},
        {"points": [{"lat": 10.0, "lng": "20.0"}]},
        {"points": [{"lat": -91.0, "lng": 0.0}]},
        {"points": [{"lat": 91.0, "lng": 0.0}]},
        {"points": [{"lat": 0.0, "lng": -181.0}]},
        {"points": [{"lat": 0.0, "lng": 181.0}]},
        {"points": [{"lat": 0.0, "lng": 0.0}, {"lat": 1000, "lng": 0.0}]},
    ],
)
def test_process_points_bad_request(payload):
    r = client.post("/process", json=payload)
    assert r.status_code == 400, r.text
    data = r.json()
    assert "error" in data
    assert "must have 'points' as a non-empty array" in data["error"]
    if "details" in data:
        assert isinstance(data["details"], list)


def test_process_points_content_type_no_json():
    r = client.post("/process", data="not json")
    assert r.status_code == 400
    data = r.json()
    assert "error" in data


def test_process_points_extra_fields_ignored():
    payload = {"points": [{"lat": 1.0, "lng": 2.0, "foo": "bar"}]}
    r = client.post("/process", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["centroid"] == {"lat": 1.0, "lng": 2.0}
    assert data["bounds"] == {"north": 1.0, "south": 1.0, "east": 2.0, "west": 2.0}