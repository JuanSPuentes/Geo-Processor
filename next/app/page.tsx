'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./SimpleMap'), { ssr: false });

export default function Home() {
    const [points, setPoints] = useState([
        { lat: 40.7128, lng: -74.0060 },
        { lat: 34.0522, lng: -118.2437 }
    ]);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>("");

    const onSubmit = async () => {
        setError(""); setResult(null);
        try {
            const res = await fetch('/api/geo/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error');
            setResult(data);
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            <h1>Geo Processor</h1>
            <p>Ingresa puntos y calcula centroide y bounding box.</p>

            <pre style={{ background: '#f4f4f4', padding: 12 }}>
                {JSON.stringify(points, null, 2)}
            </pre>
            <button onClick={onSubmit}>Calcular</button>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {result && (
                <div style={{ marginTop: 16 }}>
                    <h3>Resultado</h3>
                    <pre style={{ background: '#f4f4f4', padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>
                    <Map centroid={result.centroid} bounds={result.bounds} />
                </div>
            )}
        </div>
    );
}