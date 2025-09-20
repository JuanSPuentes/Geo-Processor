'use client';

import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Rectangle } from 'react-leaflet';
import type { LatLngExpression, LatLngBoundsExpression } from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: (markerIcon2x as unknown as { src: string }).src ?? (markerIcon2x as any),
    iconUrl: (markerIcon as unknown as { src: string }).src ?? (markerIcon as any),
    shadowUrl: (markerShadow as unknown as { src: string }).src ?? (markerShadow as any),
});

export default function SimpleMap({
    centroid,
    bounds,
}: {
    centroid: { lat: number; lng: number };
    bounds: { north: number; south: number; east: number; west: number };
}) {
    const center: LatLngExpression = [centroid.lat, centroid.lng];
    const rectBounds: LatLngBoundsExpression = [
        [bounds.south, bounds.west],
        [bounds.north, bounds.east],
    ];

    return (
        <div style={{ height: 400, width: '100%', marginTop: 12 }}>
            <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={center} />
                <Rectangle bounds={rectBounds} />
            </MapContainer>
        </div>
    );
}
