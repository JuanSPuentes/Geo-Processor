'use client';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Rectangle } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function SimpleMap({
    centroid,
    bounds,
}: {
    centroid: { lat: number; lng: number };
    bounds: { north: number; south: number; east: number; west: number };
}) {
    const rectBounds: [LatLngExpression, LatLngExpression] = [
        [bounds.south, bounds.west],
        [bounds.north, bounds.east],
    ];
    const center: LatLngExpression = [centroid.lat, centroid.lng];

    return (
        <div style={{ height: 400, width: '100%', marginTop: 12 }}>
            {/* @ts-expect-error react-leaflet type mismatch in some setups */}
            <LeafletMapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={center} />
                <Rectangle bounds={rectBounds} />
            </LeafletMapContainer>
        </div>
    );
}
