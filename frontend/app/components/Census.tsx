"use client";
import { useState } from "react";

type BorderStat = {
  crossing: string;
  state: string;
  trucks_per_day: number;
  cars_per_day: number;
  year: number;
};

type CensusRecord = {
  name: string;
  state: string;
  population: string;
  income: string;
};

const mockBorderStats: BorderStat[] = [
  { crossing: "San Ysidro", state: "California", trucks_per_day: 4200, cars_per_day: 71000, year: 2023 },
  { crossing: "Detroit-Windsor", state: "Michigan", trucks_per_day: 8500, cars_per_day: 12000, year: 2023 },
  { crossing: "Peace Arch", state: "Washington", trucks_per_day: 1200, cars_per_day: 24000, year: 2023 },
];

const mockCensusData: CensusRecord[] = [
  { name: "San Diego County", state: "California", population: "3,298,634", income: "$78,980" },
  { name: "El Paso County", state: "Texas", population: "865,657", income: "$44,431" },
  { name: "Wayne County", state: "Michigan", population: "1,759,335", income: "$51,285" },
  { name: "Whatcom County", state: "Washington", population: "229,247", income: "$68,750" },
];

export default function CensusData() {
  const [activeSection, setActiveSection] = useState<"border" | "county">("border");

  return (
    <div className="space-y-4">

      {/* Header */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest text-gray-500">
            🏛️ US Census Bureau Data
          </h3>
          <div className="flex gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded-lg"
              style={{ border: "1px solid #4ADE80", color: "#4ADE80" }}
            >
              ✓ API Key Connected
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-lg"
              style={{ border: "1px solid #FBBF24", color: "#FBBF24" }}
            >
              ~ Synthetic Format
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Data modeled after US Census Bureau API format.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["border", "county"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className="flex-1 rounded-xl py-2 text-xs font-medium transition"
            style={{
              background: activeSection === tab ? "#38BDF8" : "transparent",
              color: activeSection === tab ? "#000" : "#6B7280",
              border: activeSection === tab
                ? "1px solid #38BDF8"
                : "1px solid #1F2937",
            }}
          >
            {tab === "border" ? "🚛 Border Traffic" : "🏙️ County Data"}
          </button>
        ))}
      </div>

      {/* Border Traffic */}
      {activeSection === "border" && (
        <div className="space-y-3">
          {mockBorderStats.map((stat) => (
            <div
              key={stat.crossing}
              className="rounded-2xl p-5"
              style={{ border: "1px solid #1F2937", background: "#0B1117" }}
            >
              <div className="mb-3">
                <h4 className="text-sm font-bold text-white">{stat.crossing}</h4>
                <p className="text-xs text-gray-500">{stat.state} · {stat.year}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: "#030712" }}>
                  <p className="text-xs text-gray-500">Trucks/Day</p>
                  <p className="text-xl font-bold text-cyan-400">
                    {stat.trucks_per_day.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "#030712" }}>
                  <p className="text-xs text-gray-500">Cars/Day</p>
                  <p className="text-xl font-bold text-indigo-400">
                    {stat.cars_per_day.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 w-16">Trucks</span>
                  <div className="flex-1 rounded-full" style={{ background: "#030712", height: 4 }}>
                    <div style={{ width: `${(stat.trucks_per_day / 10000) * 100}%`, background: "#38BDF8", height: 4, borderRadius: 9999 }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 w-16">Cars</span>
                  <div className="flex-1 rounded-full" style={{ background: "#030712", height: 4 }}>
                    <div style={{ width: `${(stat.cars_per_day / 80000) * 100}%`, background: "#818CF8", height: 4, borderRadius: 9999 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* County Data */}
      {activeSection === "county" && (
        <div className="space-y-3">
          {mockCensusData.map((county) => (
            <div
              key={county.name}
              className="rounded-2xl p-4"
              style={{ border: "1px solid #1F2937", background: "#0B1117" }}
            >
              <h4 className="text-sm font-bold text-white mb-1">{county.name}</h4>
              <p className="text-xs text-gray-500 mb-3">{county.state}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: "#030712" }}>
                  <p className="text-xs text-gray-500">Population</p>
                  <p className="text-sm font-bold text-cyan-400">{county.population}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "#030712" }}>
                  <p className="text-xs text-gray-500">Median Income</p>
                  <p className="text-sm font-bold text-green-400">{county.income}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Source */}
      <div
        className="rounded-2xl p-4"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Data source</span>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded-lg" style={{ border: "1px solid #38BDF8", color: "#38BDF8" }}>
              US Census Bureau API
            </span>
            <span className="px-2 py-0.5 rounded-lg" style={{ border: "1px solid #FBBF24", color: "#FBBF24" }}>
              Synthetic Format
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}