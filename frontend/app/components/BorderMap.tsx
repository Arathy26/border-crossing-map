"use client";
import { useEffect, useRef } from "react";
import { Crossing } from "../types";

type Props = {
  crossings: Crossing[];
  selectedCrossing: Crossing | null;
  onSelectCrossing: (crossing: Crossing) => void;
};

const riskColors: Record<string, string> = {
  Low: "#4ADE80",
  Medium: "#FBBF24",
  High: "#EF4444",
};

export default function BorderMap({
  crossings,
  selectedCrossing,
  onSelectCrossing,
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    import("maplibre-gl").then((maplibre) => {
      import("maplibre-gl/dist/maplibre-gl.css");

      const map = new maplibre.Map({
        container: mapContainer.current!,
        style: {
          version: 8,
          sources: {
            "carto-dark": {
              type: "raster",
              tiles: [
                "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              ],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap &copy; CartoDB",
            },
          },
          layers: [
            {
              id: "carto-dark-layer",
              type: "raster",
              source: "carto-dark",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
        center: [0, 20],
        zoom: 1.8,
      });

      mapRef.current = map;

      // Wait for BOTH load and style to be ready
      map.on("load", () => {
        waitForStyle(maplibre, map);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Wait for style to load before adding markers
  function waitForStyle(maplibre: any, map: any) {
    if (map.isStyleLoaded()) {
      addMarkers(maplibre, map);
    } else {
      map.once("styledata", () => {
        waitForStyle(maplibre, map);
      });
    }
  }

  useEffect(() => {
    if (!mapRef.current) return;
    import("maplibre-gl").then((maplibre) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (mapRef.current.isStyleLoaded()) {
        addMarkers(maplibre, mapRef.current);
      } else {
        mapRef.current.once("styledata", () => {
          addMarkers(maplibre, mapRef.current);
        });
      }
    });
  }, [crossings, selectedCrossing]);

  function addMarkers(maplibre: any, map: any) {
    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Draw markers
    crossings.forEach((crossing) => {
      const isSelected = crossing.id === selectedCrossing?.id;
      const color = riskColors[crossing.risk_level];

      // Marker element
      const el = document.createElement("div");
      el.style.width = isSelected ? "22px" : "14px";
      el.style.height = isSelected ? "22px" : "14px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = isSelected
        ? "3px solid white"
        : "2px solid rgba(255,255,255,0.3)";
      el.style.cursor = "pointer";
      el.style.boxShadow = `0 0 ${isSelected ? "12px" : "6px"} ${color}`;
      el.style.transition = "all 0.3s ease";
      el.style.position = "relative";

      // Tooltip
      const tooltip = document.createElement("div");
      tooltip.style.cssText = `
        position: absolute;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        background: #0B1117;
        border: 1px solid #1F2937;
        border-radius: 8px;
        padding: 8px 10px;
        font-family: sans-serif;
        font-size: 11px;
        color: white;
        white-space: nowrap;
        pointer-events: none;
        display: none;
        z-index: 1000;
        min-width: 160px;
      `;
      tooltip.innerHTML = `
        <div style="font-weight:700;color:#38BDF8;margin-bottom:4px;">
          ${crossing.name}
        </div>
        <div style="color:#9CA3AF;margin-bottom:6px;">
          ${crossing.country}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;">
          <span style="color:#6B7280;">Wait</span>
          <span style="color:#FBBF24;font-weight:600;">${crossing.wait_time}min</span>
          <span style="color:#6B7280;">Flow</span>
          <span style="color:#4ADE80;font-weight:600;">${crossing.throughput.toLocaleString()}</span>
          <span style="color:#6B7280;">Risk</span>
          <span style="font-weight:600;color:${color};">${crossing.risk_level}</span>
          <span style="color:#6B7280;">Status</span>
          <span style="color:#38BDF8;">${crossing.status}</span>
        </div>
      `;

      el.appendChild(tooltip);

      el.addEventListener("mouseenter", () => {
        tooltip.style.display = "block";
      });
      el.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });

      el.addEventListener("click", () => {
        onSelectCrossing(crossing);
        map.flyTo({
          center: [crossing.lng, crossing.lat],
          zoom: 5,
          duration: 1500,
        });
      });

      const marker = new maplibre.Marker({ element: el })
        .setLngLat([crossing.lng, crossing.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Remove old flow lines
    if (map.getSource("flow-lines")) {
      map.removeLayer("flow-lines-layer");
      map.removeSource("flow-lines");
    }

    // Draw flow lines
    const features: any[] = [];
    crossings.forEach((from, i) => {
      crossings.forEach((to, j) => {
        if (i >= j) return;
        if (from.risk_level !== "High" && to.risk_level !== "High") return;
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [from.lng, from.lat],
              [to.lng, to.lat],
            ],
          },
        });
      });
    });

    if (features.length > 0) {
      map.addSource("flow-lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });

      map.addLayer({
        id: "flow-lines-layer",
        type: "line",
        source: "flow-lines",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#38BDF8",
          "line-width": 1,
          "line-opacity": 0.3,
          "line-dasharray": [2, 4],
        },
      });
    }
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
        background: "#0B1117",
      }}
    >
      <div
        ref={mapContainer}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
}