"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Crossing } from "./types";
import Sidebar from "./components/Sidebar";
import Charts from "./components/Charts";
import Compare from "./components/Compare";
import DelayCards from "./components/DelayCards";
import Analytics from "./components/Analytics";
import DistanceCalculator from "./components/DistanceCalculator";
import DataTable from "./components/Table";
import TradeData from "./components/TradeData";
import CensusData from "./components/Census";
import NearbyInfrastructure from "./components/Nearby";
import DeckOverlay from "./components/DeckMap";
import SmartSearch from "./components/Search";
import Insights from "./components/Insights";
import CommodityFlow from "./components/CommodityFlow";
import SyntheticEvents from "./components/SyntheticEvents";

const BorderMap = dynamic(
  () => import("./components/BorderMap"),
  { ssr: false }
);

function downloadData(crossings: Crossing[]) {
  const csv = [
    "ID,Name,Country,WaitTime,Throughput,Commodity,Status,RiskLevel,Type",
    ...crossings.map(
      (c) =>
        `${c.id},${c.name},${c.country},${c.wait_time},${c.throughput},${c.commodity},${c.status},${c.risk_level},${c.type}`
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "border_crossings.csv";
  a.click();
  URL.revokeObjectURL(url);
}

type Tab =
  | "map"
  | "charts"
  | "compare"
  | "delays"
  | "analytics"
  | "distance"
  | "table"
  | "trade"
  | "census"
  | "deck";

export default function Home() {
  const [crossings, setCrossings] = useState<Crossing[]>([]);
  const [filtered, setFiltered] = useState<Crossing[]>([]);
  const [selected, setSelected] = useState<Crossing | null>(null);
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/crossings")
      .then((res) => res.json())
      .then((json) => {
        setCrossings(json.data);
        setFiltered(json.data);
        if (json.data.length > 0) setSelected(json.data[0]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to connect to backend");
        setLoading(false);
      });

    fetch("http://localhost:8000/api/stats")
      .then((res) => res.json())
      .then((json) => setStats(json))
      .catch(() => {});
  }, []);

  // Filter by risk and status
  useEffect(() => {
    let result = crossings;
    if (riskFilter !== "All") {
      result = result.filter((c) => c.risk_level === riskFilter);
    }
    if (statusFilter !== "All") {
      result = result.filter((c) => c.status === statusFilter);
    }
    setFiltered(result);
  }, [riskFilter, statusFilter, crossings]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "#030712" }}
      >
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-cyan-400">Loading Border Crossings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "#030712" }}
      >
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <p className="text-gray-500 text-sm">
            Make sure backend is running on port 8000
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      style={{ background: "#030712", minHeight: "100vh" }}
      className="text-white"
    >
      <div className="flex flex-col h-screen">

        {/* HEADER */}
        <header
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #1F2937", background: "#0B1117" }}
        >
          <div>
            <h1 className="text-xl font-bold text-cyan-400">
              🗺️ Border Crossing Activity Map
            </h1>
            <p className="text-xs text-gray-500">
              Real-time Intelligence · POC 39 · Data & Intelligence Rail
            </p>
          </div>

          {/* Stats */}
<div className="flex gap-6">
  {[
    {
      label: "Total",
      value: stats?.total ?? crossings.length,
      color: "#38BDF8",
      tip: "Total border crossings being tracked",
    },
    {
      label: "Active",
      value: stats?.active ?? "-",
      color: "#4ADE80",
      tip: "Currently active crossings",
    },
    {
      label: "Avg Wait",
      value: stats ? `${stats.avg_wait_time}m` : "-",
      color: "#FBBF24",
      tip: "Average waiting time at crossings",
    },
    {
      label: "High Risk",
      value: stats?.high_risk ?? "-",
      color: "#EF4444",
      tip: "Crossings with elevated risk",
    },
    {
      label: "Throughput",
      value: stats
        ? `${(stats.total_throughput / 1000).toFixed(0)}K`
        : "-",
      color: "#818CF8",
      tip: "Total daily throughput across crossings",
    },
  ].map((stat) => (
    <div
      key={stat.label}
      title={stat.tip}
      className="text-center cursor-help"
    >
      <p className="text-xs text-gray-500">
        {stat.label}
      </p>

      <p
        className="text-lg font-bold"
        style={{ color: stat.color }}
      >
        {stat.value}
      </p>
    </div>
  ))}
</div>

          <button
            onClick={() => downloadData(crossings)}
            className="rounded-xl px-4 py-2 text-xs font-medium transition"
            style={{ border: "1px solid #38BDF8", color: "#38BDF8" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#38BDF8";
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#38BDF8";
            }}
          >
            ⬇ Download Data
          </button>
        </header>

        {/* TABS */}
        <div
          className="flex gap-1 px-6 py-2 flex-shrink-0 overflow-x-auto"
          style={{ borderBottom: "1px solid #1F2937", background: "#0B1117" }}
        >
          {(
            [
              { id: "map", label: "🗺️ Map" },
              { id: "charts", label: "📊 Charts" },
              { id: "compare", label: "⚖️ Compare" },
              { id: "delays", label: "🚨 Delays" },
              { id: "analytics", label: "🧠 Analytics" },
              { id: "distance", label: "📏 Distance" },
              { id: "table", label: "📋 Table" },
              { id: "trade", label: "🌍 Trade" },
              { id: "census", label: "🏛️ Census" },
              { id: "deck", label: "✨ deck.gl" },
            ] as { id: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? "#38BDF8" : "transparent",
                color: activeTab === tab.id ? "#000" : "#6B7280",
                border: activeTab === tab.id
                  ? "1px solid #38BDF8"
                  : "1px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT PANEL */}
          <section
            className="flex flex-col p-4 overflow-y-auto"
            style={{ width: "70%", borderRight: "1px solid #1F2937" }}
          >
            {/* Smart Search + Filters */}
            <div className="flex gap-3 mb-3 flex-shrink-0">
              <div className="flex-1">
                <SmartSearch
                  crossings={crossings}
                  onSelect={setSelected}
                  onFilter={setFiltered}
                />
              </div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="rounded-xl px-3 py-2 text-sm text-white outline-none"
                style={{ background: "#0B1117", border: "1px solid #1F2937" }}
              >
                <option value="All">All Risks</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl px-3 py-2 text-sm text-white outline-none"
                style={{ background: "#0B1117", border: "1px solid #1F2937" }}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Restricted">Restricted</option>
                <option value="Seasonal">Seasonal</option>
              </select>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-3 text-xs flex-shrink-0">
              {[
                { label: "Low Risk", color: "#4ADE80" },
                { label: "Medium Risk", color: "#FBBF24" },
                { label: "High Risk", color: "#EF4444" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1 text-gray-400">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: item.color,
                      display: "inline-block",
                    }}
                  />
                  {item.label}
                </span>
              ))}
              <span className="text-gray-600 ml-2">
                Showing {filtered.length} of {crossings.length}
              </span>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "map" && (
              <div
                className="flex-1 rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid #1F2937",
                  background: "#0B1117",
                  minHeight: "400px",
                }}
              >
                <BorderMap
                  crossings={filtered}
                  selectedCrossing={selected}
                  onSelectCrossing={setSelected}
                />
              </div>
            )}

            {activeTab === "charts" && (
              <Charts crossings={filtered} />
            )}

            {activeTab === "compare" && (
              <Compare crossings={filtered} />
            )}

            {activeTab === "delays" && (
              <DelayCards crossings={filtered} />
            )}

            {activeTab === "analytics" && (
              <Analytics />
            )}

            {activeTab === "distance" && (
              <DistanceCalculator crossings={crossings} />
            )}

            {activeTab === "table" && (
              <DataTable crossings={filtered} />
            )}

            {activeTab === "trade" && (
              <TradeData />
            )}

            {activeTab === "census" && (
              <CensusData />
            )}

            {activeTab === "deck" && (
              <DeckOverlay crossings={filtered} />
            )}

          </section>

          {/* RIGHT SIDEBAR */}
          <aside
            className="p-4 overflow-y-auto"
            style={{ width: "30%" }}
          >
            <Sidebar
              crossing={selected}
              allCrossings={crossings}
              onSelect={setSelected}
            />

            <NearbyInfrastructure crossing={selected} />

            {/* Commodity Breakdown */}
            {stats?.commodities && (
              <div
                className="rounded-2xl p-5 mt-4"
                style={{ border: "1px solid #1F2937", background: "#0B1117" }}
              >
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                  📦 Commodity Breakdown
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.commodities).map(([commodity, count]) => (
                    <div key={commodity} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{commodity}</span>
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            width: `${((count as number) / crossings.length) * 80}px`,
                            height: 4,
                            background: "#38BDF8",
                            borderRadius: 9999,
                          }}
                        />
                        <span className="text-cyan-400">{count as number}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Breakdown */}
            {stats?.risk_breakdown && (
              <div
                className="rounded-2xl p-5 mt-4"
                style={{ border: "1px solid #1F2937", background: "#0B1117" }}
              >
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                  ⚠️ Risk Breakdown
                </h3>
                <div className="space-y-2">
                  {[
                    { key: "Low", color: "#4ADE80" },
                    { key: "Medium", color: "#FBBF24" },
                    { key: "High", color: "#EF4444" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between text-xs">
                      <span style={{ color: item.color }}>{item.key}</span>
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            width: `${(stats.risk_breakdown[item.key] / crossings.length) * 80}px`,
                            height: 4,
                            background: item.color,
                            borderRadius: 9999,
                          }}
                        />
                        <span style={{ color: item.color }}>
                          {stats.risk_breakdown[item.key]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>
      <Insights />
      <CommodityFlow />
      <SyntheticEvents />
    </main>
  );
}