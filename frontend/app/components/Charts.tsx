"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Crossing } from "../types";

type Props = {
  crossings: Crossing[];
};

export default function Charts({ crossings }: Props) {
  // Wait time data for bar chart
  const waitTimeData = crossings
    .sort((a, b) => b.wait_time - a.wait_time)
    .slice(0, 8)
    .map((c) => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + "..." : c.name,
      wait_time: c.wait_time,
      fill:
        c.risk_level === "High"
          ? "#EF4444"
          : c.risk_level === "Medium"
          ? "#FBBF24"
          : "#4ADE80",
    }));

  // Throughput data
  const throughputData = crossings
    .sort((a, b) => b.throughput - a.throughput)
    .slice(0, 8)
    .map((c) => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + "..." : c.name,
      throughput: c.throughput,
    }));

  return (
    <div className="space-y-6">

      {/* Wait Time Chart */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          ⏱️ Wait Time by Crossing (minutes)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={waitTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 10 }}
              axisLine={{ stroke: "#1F2937" }}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 10 }}
              axisLine={{ stroke: "#1F2937" }}
            />
            <Tooltip
              contentStyle={{
                background: "#0B1117",
                border: "1px solid #1F2937",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="wait_time" fill="#38BDF8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Throughput Chart */}
      <div
        className="rounded-2xl p-5"
        style={{ border: "1px solid #1F2937", background: "#0B1117" }}
      >
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          📦 Throughput by Crossing (per day)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={throughputData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 10 }}
              axisLine={{ stroke: "#1F2937" }}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 10 }}
              axisLine={{ stroke: "#1F2937" }}
            />
            <Tooltip
              contentStyle={{
                background: "#0B1117",
                border: "1px solid #1F2937",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="throughput" fill="#818CF8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}