"use client";

import { Crossing } from "../types";

type Props = {
  crossing: Crossing | null;
  allCrossings: Crossing[];
  onSelect: React.Dispatch<React.SetStateAction<Crossing | null>>;
};

export default function Sidebar({
  crossing,
  allCrossings,
  onSelect,
}: Props) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        border: "1px solid #1F2937",
        background: "#0B1117",
      }}
    >
      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
        Border Details
      </h3>

      {crossing ? (
        <>
          <h2 className="text-cyan-400 text-lg font-bold">
            {crossing.name}
          </h2>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Country:</span>{" "}
              {crossing.country}
            </p>

            <p>
              <span className="text-gray-500">Commodity:</span>{" "}
              {crossing.commodity}
            </p>

            <p>
              <span className="text-gray-500">Wait Time:</span>{" "}
              {crossing.wait_time} min
            </p>

            <p>
              <span className="text-gray-500">Throughput:</span>{" "}
              {crossing.throughput.toLocaleString()}
            </p>

            <p>
              <span className="text-gray-500">Status:</span>{" "}
              {crossing.status}
            </p>

            <p>
              <span className="text-gray-500">Risk:</span>{" "}
              {crossing.risk_level}
            </p>

            {/* New Section */}

            <div className="mt-6 border-t border-gray-700 pt-4">
              <h4 className="text-cyan-400 font-semibold mb-2">
                Why this matters
              </h4>

              <p className="text-gray-400 text-sm">
                Border crossings affect trade flow,
                supply chains, transportation efficiency,
                and regional security.
              </p>

              <h4 className="text-cyan-400 font-semibold mt-4 mb-2">
                Who controls this
              </h4>

              <p className="text-gray-400 text-sm">
                Customs agencies, border security,
                transportation authorities, and
                government trade departments.
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm">
          Select a crossing
        </p>
      )}

      <div className="mt-6">
        <h4 className="text-xs text-gray-500 mb-2">
          Quick Select
        </h4>

        <div className="space-y-2 max-h-60 overflow-auto">
          {(allCrossings || []).map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="w-full text-left p-2 rounded-lg hover:bg-[#1F2937] text-sm"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}