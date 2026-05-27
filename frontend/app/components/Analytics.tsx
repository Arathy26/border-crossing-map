"use client";
import { useEffect, useState } from "react";

type AnalyticsData = {
  avg_wait_by_risk: Record<string, number>;
  avg_throughput_by_type: Record<string, number>;
  total_throughput_by_commodity: Record<string, number>;
  top_delays: { name: string; wait_time: number; country: string }[];
  top_throughput: { name: string; throughput: number; country: string }[];
};

const riskColors: Record<string, string> = {
  Low: "#4ADE80",
  Medium: "#FBBF24",
  High: "#EF4444",
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-cyan-400 text-sm">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-400 text-sm">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Top Delays */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          🚨 Top 3 Highest Delays (Pandas Analysis)
        </h3>
        <div className="space-y-3">
          {data.top_delays.map((item, i) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: "#030712" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-600">
                  #{i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.country}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-red-400">
                {item.wait_time}
                <span className="text-xs font-normal text-gray-500 ml-1">min</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Throughput */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          📦 Top 3 Highest Throughput (Pandas Analysis)
        </h3>
        <div className="space-y-3">
          {data.top_throughput.map((item, i) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: "#030712" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-600">
                  #{i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.country}</p>
                </div>
              </div>
              <p className="text-xl font-bold text-green-400">
                {item.throughput.toLocaleString()}
                <span className="text-xs font-normal text-gray-500 ml-1">/day</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Avg Wait by Risk */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          ⚠️ Avg Wait Time by Risk Level
        </h3>
        <div className="space-y-3">
          {Object.entries(data.avg_wait_by_risk).map(([risk, avg]) => (
            <div key={risk} className="flex items-center gap-3">
              <span
                className="text-xs font-bold w-16"
                style={{ color: riskColors[risk] }}
              >
                {risk}
              </span>
              <div
                className="flex-1 rounded-full"
                style={{ background: "#030712", height: 6 }}
              >
                <div
                  style={{
                    width: `${Math.min((avg / 180) * 100, 100)}%`,
                    background: riskColors[risk],
                    height: 6,
                    borderRadius: 9999,
                  }}
                />
              </div>
              <span
                className="text-xs font-bold"
                style={{ color: riskColors[risk] }}
              >
                {avg} min
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Throughput by Commodity */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          📦 Total Throughput by Commodity
        </h3>
        <div className="space-y-3">
          {Object.entries(data.total_throughput_by_commodity)
            .sort(([, a], [, b]) => b - a)
            .map(([commodity, total]) => (
              <div key={commodity} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-28 truncate">
                  {commodity}
                </span>
                <div
                  className="flex-1 rounded-full"
                  style={{ background: "#030712", height: 6 }}
                >
                  <div
                    style={{
                      width: `${Math.min(
                        (total /
                          Math.max(
                            ...Object.values(
                              data.total_throughput_by_commodity
                            )
                          )) *
                          100,
                        100
                      )}%`,
                      background: "#818CF8",
                      height: 6,
                      borderRadius: 9999,
                    }}
                  />
                </div>
                <span className="text-xs text-indigo-400">
                  {total.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Data Source */}
      <div
        className="rounded-2xl p-4"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Analytics powered by</span>
          <div className="flex gap-2">
            <span
              className="px-2 py-0.5 rounded-lg"
              style={{ border: "1px solid #38BDF8", color: "#38BDF8" }}
            >
              Python Pandas
            </span>
            <span
              className="px-2 py-0.5 rounded-lg"
              style={{ border: "1px solid #818CF8", color: "#818CF8" }}
            >
              FastAPI
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}