'use client';
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Sparkles, Crosshair, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";

const Map = dynamic(() => import("./SimpleMap"), { ssr: false });

type Point = { lat: string; lng: string };
type Bounds = { north: number; south: number; east: number; west: number };
type GeoResult = { centroid: { lat: number; lng: number }; bounds: Bounds };

const toNumber = (v: string) => (v.trim() === "" ? NaN : parseFloat(v));
const isValid = (lat: number, lng: number) =>
    Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

export default function Home() {
    const [points, setPoints] = useState<Point[]>([
        { lat: "4.7110", lng: "-74.0721" },
        { lat: "6.2442", lng: "-75.5812" },
    ]);
    const [result, setResult] = useState<GeoResult | null>(null);
    const [error, setError] = useState("");
    const [live, setLive] = useState(true);
    const [loading, setLoading] = useState(false);

    const parsed = useMemo(() => points.map((p) => ({ lat: toNumber(p.lat), lng: toNumber(p.lng) })), [points]);
    const allValid = parsed.every((p) => isValid(p.lat, p.lng));

    const updatePoint = (index: number, field: "lat" | "lng", value: string) => {
        setPoints((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
        setError("");
    };

    const compute = async () => {
        setError("");
        setResult(null);
        const body = points.map((p) => ({ lat: toNumber(p.lat), lng: toNumber(p.lng) }));
        if (body.some((p) => !isValid(p.lat, p.lng))) {
            setError("Todos los puntos deben tener valores válidos (lat −90..90, lng −180..180).");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/geo/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ points: body }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Error procesando puntos");
            setResult(data as GeoResult);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Cálculo en vivo opcional: llama al API al cambiar puntos
    React.useEffect(() => {
        if (!live) return;
        const ready = parsed.length >= 2 && allValid;
        if (!ready) return;
        const t = setTimeout(() => {
            // Debounce simple
            compute();
        }, 400);
        return () => clearTimeout(t);
    }, [points, live]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-5xl p-6">
                {/* Header */}
                <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ rotate: -10, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 12 }}
                            className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white shadow"
                        >
                            <Sparkles className="h-5 w-5" />
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Geo Processor</h1>
                            <p className="text-sm text-slate-600">Enter two points to calculate the centroid and bounding box.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch id="live" checked={live} onCheckedChange={setLive} />
                        <Label htmlFor="live" className="text-sm">Live Calculation</Label>
                    </div>
                </header>

                {/* Points Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Points</CardTitle>
                        <CardDescription>Latitude in degrees (−90..90) and longitude in degrees (−180..180).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {points.map((pt, index) => {
                                const lat = toNumber(pt.lat);
                                const lng = toNumber(pt.lng);
                                const valid = isValid(lat, lng) || (pt.lat === "" && pt.lng === "");
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`grid grid-cols-1 gap-4 rounded-2xl border p-4 shadow-sm md:grid-cols-12 ${valid ? "bg-slate-50" : "bg-rose-50 border-rose-200"
                                            }`}
                                    >
                                        <div className="md:col-span-6">
                                            <Label className="text-xs uppercase text-slate-500">Latitude {index + 1}</Label>
                                            <Input
                                                inputMode="decimal"
                                                type="text"
                                                value={pt.lat}
                                                onChange={(e) => updatePoint(index, "lat", e.target.value)}
                                                placeholder="E.g.: 4.7110"
                                                aria-label={`Latitude ${index + 1}`}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="md:col-span-6">
                                            <Label className="text-xs uppercase text-slate-500">Longitude {index + 1}</Label>
                                            <Input
                                                inputMode="decimal"
                                                type="text"
                                                value={pt.lng}
                                                onChange={(e) => updatePoint(index, "lng", e.target.value)}
                                                placeholder="E.g.: -74.0721"
                                                aria-label={`Longitude ${index + 1}`}
                                                className="mt-1"
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <Button onClick={compute} disabled={loading || (!allValid && !live)}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                                        </>
                                    ) : (
                                        "Calculate"
                                    )}
                                </Button>
                            </div>

                            {!allValid && (
                                <p className="text-sm text-rose-600">There are out-of-range or invalid coordinates. Please check them.</p>
                            )}
                            {error && <p className="text-sm text-rose-600">{error}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Result + Map */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Crosshair className="h-5 w-5" /> Result</CardTitle>
                            <CardDescription>Centroid and bounds {live ? "(live)" : "(manual)"}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {result ? (
                                <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-sm text-slate-600">Enter valid coordinates and {live ? "wait a moment" : "press Calculate"}.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Map</CardTitle>
                            <CardDescription>It centers on the centroid and fits the bounding box.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {result ? (
                                <div className="h-72 w-full overflow-hidden rounded-xl border">
                                    <Map centroid={result.centroid} bounds={result.bounds} />
                                </div>
                            ) : (
                                <div className="grid h-72 w-full place-items-center rounded-xl border bg-slate-50 text-sm text-slate-500">
                                    Map awaiting data
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <footer className="mt-8 text-center text-xs text-slate-500">
                    Made with ❤ using Tailwind, shadcn/ui, and Framer Motion.
                    Juan Sebastian Puentes Coronado
                </footer>
            </div>
        </div>
    );

}
