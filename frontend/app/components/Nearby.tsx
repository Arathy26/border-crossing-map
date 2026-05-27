"use client";
import { useState } from "react";
import { Crossing } from "../types";

type Props = {
  crossing: Crossing | null;
};

type OSMPlace = {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    highway?: string;
  };
};

export default function NearbyInfrastructure({ crossing }: Props) {
  const [places, setPlaces] = useState<OSMPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function fetchNearby() {
    if (!crossing) return;
    setLoading(true);

    const query = `
      [out:json][timeout:10];
      (
        node["highway"="customs"](around:50000,${crossing.lat},${crossing.lng});
        node["amenity"="customs"](around:50000,${crossing.lat},${crossing.lng});
        node["border_control"="yes"](around:50000,${crossing.lat},${crossing.lng});
      );
      out body 10;
    `;

    try {
      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        { method: "POST", body: query }
      );
      const data = await response.json();
      setPlaces(data.elements || []);
      setLoaded(true);
    } catch {
      setPlaces([]);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  if (!crossing) return null;

  return (
    <div
      className="rounded-2xl p-5 mt-4"
      style={{ border: "1px solid #1F2937", background: "#0B1117" }}
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
        🗺️ Nearby Infrastructure (OpenStreetMap)
      </h3>

      <p className="text-xs text-gray-400 mb-3">
        Find real border infrastructure near{" "}
        <span className="text-cyan-400">{crossing.name}</span>
      </p>

      <button
        onClick={fetchNearby}
        disabled={loading}
        className="w-full rounded-xl py-2 text-xs font-medium transition mb-3"
        style={{
          background: loading ? "#1F2937" : "#38BDF822",
          color: loading ? "#4B5563" : "#38BDF8",
          border: "1px solid #38BDF8",
        }}
      >
        {loading
          ? "Fetching from OpenStreetMap..."
          : "🔍 Fetch Nearby Infrastructure"}
      </button>

      {loaded && (
        <div>
          {places.length === 0 ? (
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "#030712" }}
            >
              <p className="text-xs text-gray-500">
                No infrastructure found nearby
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Using synthetic data for this crossing
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg"
                  style={{ background: "#030712" }}
                >
                  <span className="text-gray-300">
                    {place.tags.name ?? "Unnamed facility"}
                  </span>
                  <span className="text-cyan-400">
                    {place.tags.amenity ??
                      place.tags.highway ??
                      "border"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-gray-500">Source</span>
            <span
              className="px-2 py-0.5 rounded-lg"
              style={{
                border: "1px solid #38BDF8",
                color: "#38BDF8",
              }}
            >
              OpenStreetMap Overpass API
            </span>
          </div>
        </div>
      )}
    </div>
  );
}