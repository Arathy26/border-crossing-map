"use client";
import { useState } from "react";

type TradeFlow = {
  reporter: string;
  partner: string;
  commodity: string;
  trade_value_usd: number;
  year: number;
  flow: "Export" | "Import";
};

// Mock UN Comtrade data (labeled as synthetic)
const mockTradeData: TradeFlow[] = [
  {
    reporter: "USA",
    partner: "Canada",
    commodity: "Automobiles",
    trade_value_usd: 48000000000,
    year: 2023,
    flow: "Export",
  },
  {
    reporter: "USA",
    partner: "Mexico",
    commodity: "Consumer Goods",
    trade_value_usd: 32000000000,
    year: 2023,
    flow: "Import",
  },
  {
    reporter: "France",
    partner: "United Kingdom",
    commodity: "Mixed Goods",
    trade_value_usd: 28000000000,
    year: 2023,
    flow: "Export",
  },
  {
    reporter: "India",
    partner: "Bangladesh",
    commodity: "Agricultural",
    trade_value_usd: 12000000000,
    year: 2023,
    flow: "Export",
  },
  {
    reporter: "Singapore",
    partner: "Malaysia",
    commodity: "Electronics",
    trade_value_usd: 65000000000,
    year: 2023,
    flow: "Export",
  },
  {
    reporter: "Hong Kong",
    partner: "China",
    commodity: "Electronics",
    trade_value_usd: 89000000000,
    year: 2023,
    flow: "Import",
  },
  {
    reporter: "Turkey",
    partner: "Syria",
    commodity: "Humanitarian",
    trade_value_usd: 2000000000,
    year: 2023,
    flow: "Export",
  },
  {
    reporter: "India",
    partner: "Pakistan",
    commodity: "Agricultural",
    trade_value_usd: 3000000000,
    year: 2023,
    flow: "Export",
  },
];

export default function TradeData() {
  const [filter, setFilter] = useState<"All" | "Export" | "Import">("All");

  const filtered =
    filter === "All"
      ? mockTradeData
      : mockTradeData.filter((d) => d.flow === filter);

  function formatValue(val: number) {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs uppercase tracking-widest text-gray-500">
            🌍 UN Comtrade Style Trade Flows
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-lg"
            style={{ border: "1px solid #FBBF24", color: "#FBBF24" }}
          >
            ~ Synthetic Data
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Mock trade flow data modeled after UN Comtrade format.
          Real integration requires UN Comtrade API key.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["All", "Export", "Import"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-xl text-xs font-medium transition"
            style={{
              background: filter === f ? "#38BDF8" : "transparent",
              color: filter === f ? "#000" : "#6B7280",
              border:
                filter === f ? "1px solid #38BDF8" : "1px solid #1F2937",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Trade Flow Cards */}
      <div className="space-y-3">
        {filtered.map((trade, i) => (
          <div
            key={i}
            className="rounded-2xl p-4"
            style={{ border: "1px solid #1F2937", background: "#0B1117" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {trade.reporter}
                </span>
                <span className="text-gray-500">
                  {trade.flow === "Export" ? "→" : "←"}
                </span>
                <span className="text-sm font-bold text-white">
                  {trade.partner}
                </span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                style={{
                  background:
                    trade.flow === "Export" ? "#38BDF822" : "#818CF822",
                  color: trade.flow === "Export" ? "#38BDF8" : "#818CF8",
                  border: `1px solid ${
                    trade.flow === "Export" ? "#38BDF8" : "#818CF8"
                  }`,
                }}
              >
                {trade.flow}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Commodity</p>
                <p className="text-sm text-gray-300">{trade.commodity}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Trade Value ({trade.year})</p>
                <p className="text-xl font-bold text-cyan-400">
                  {formatValue(trade.trade_value_usd)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Source */}
      <div
        className="rounded-2xl p-4"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Data modeled after</span>
          <div className="flex gap-2">
            <span
              className="px-2 py-0.5 rounded-lg"
              style={{ border: "1px solid #FBBF24", color: "#FBBF24" }}
            >
              UN Comtrade Format
            </span>
            <span
              className="px-2 py-0.5 rounded-lg"
              style={{ border: "1px solid #FBBF24", color: "#FBBF24" }}
            >
              Synthetic
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}