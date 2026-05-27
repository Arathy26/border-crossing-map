"use client";
import { Crossing } from "../types";

type Props = {
  crossings: Crossing[];
};

export default function DelayCards({ crossings }: Props) {
  // Sort by wait time descending
  const sorted = [...crossings].sort((a, b) => b.wait_time - a.wait_time);

  function getDelayColor(wait: number) {
    if (wait > 60) return "#EF4444";
    if (wait > 30) return "#FBBF24";
    return "#4ADE80";
  }

  function getDelayLabel(wait: number) {
    if (wait > 60) return "Critical";
    if (wait > 30) return "Moderate";
    return "Normal";
  }

  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
        🚨 Delay Intelligence Cards
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {sorted.map((c) => (
          <div
            key={c.id}
            className="rounded-xl p-4"
            style={{
              border: `1px solid ${getDelayColor(c.wait_time)}33`,
              background: "#030712",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-white truncate">
                {c.name}
              </p>
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: `${getDelayColor(c.wait_time)}22`,
                  color: getDelayColor(c.wait_time),
                }}
              >
                {getDelayLabel(c.wait_time)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{c.country}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500">Wait Time</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: getDelayColor(c.wait_time) }}
                >
                  {c.wait_time}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    min
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Throughput</p>
                <p className="text-sm font-semibold text-green-400">
                  {c.throughput.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Wait time bar */}
            <div
              className="mt-3 rounded-full"
              style={{ background: "#1F2937", height: 4 }}
            >
              <div
                style={{
                  width: `${Math.min((c.wait_time / 180) * 100, 100)}%`,
                  background: getDelayColor(c.wait_time),
                  height: 4,
                  borderRadius: 9999,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}