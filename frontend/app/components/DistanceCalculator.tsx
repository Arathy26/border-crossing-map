"use client";
import { useState } from "react";
import * as turf from "@turf/turf";
import { Crossing } from "../types";

type Props = {
  crossings: Crossing[];
};

export default function DistanceCalculator({ crossings }: Props) {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  function calculate() {
    const fromCrossing = crossings.find((c) => c.name === from);
    const toCrossing = crossings.find((c) => c.name === to);

    if (!fromCrossing || !toCrossing) return;

    const point1 = turf.point([fromCrossing.lng, fromCrossing.lat]);
    const point2 = turf.point([toCrossing.lng, toCrossing.lat]);
    const distance = turf.distance(point1, point2, { units: "kilometers" });
    setResult(Math.round(distance));
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ border: "1px solid #1F2937", background: "#0B1117" }}
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
        📏 Distance Calculator (Turf.js)
      </h3>

      <div className="space-y-3">
        {/* From */}
        <div>
          <p className="text-xs text-gray-500 mb-1">From Crossing</p>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none"
            style={{ background: "#030712", border: "1px solid #1F2937" }}
          >
            <option value="">Select crossing...</option>
            {crossings.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* To */}
        <div>
          <p className="text-xs text-gray-500 mb-1">To Crossing</p>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none"
            style={{ background: "#030712", border: "1px solid #1F2937" }}
          >
            <option value="">Select crossing...</option>
            {crossings.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculate}
          disabled={!from || !to}
          className="w-full rounded-xl py-2 text-sm font-medium transition"
          style={{
            background: from && to ? "#38BDF8" : "#1F2937",
            color: from && to ? "#000" : "#4B5563",
          }}
        >
          Calculate Distance
        </button>

        {/* Result */}
        {result !== null && (
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: "#030712", border: "1px solid #38BDF8" }}
          >
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-3xl font-bold text-cyan-400">
              {result.toLocaleString()}
              <span className="text-sm font-normal text-gray-500 ml-1">km</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {from} → {to}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}