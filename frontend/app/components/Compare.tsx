"use client";

import { useState } from "react";
import { Crossing } from "../types";

type Props = {
  crossings: Crossing[];
};

const riskColors: Record<string, string> = {
  Low: "#4ADE80",
  Medium: "#FBBF24",
  High: "#EF4444",
};

const statusColors: Record<string, string> = {
  Active: "#38BDF8",
  Restricted: "#EF4444",
  Seasonal: "#FBBF24",
};

export default function Compare({ crossings }: Props) {

  const [firstId, setFirstId] = useState<number | null>(null);
  const [secondId, setSecondId] = useState<number | null>(null);

  const first = crossings.find(
    (c) => c.id === firstId
  );

  const second = crossings.find(
    (c) => c.id === secondId
  );

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        border: "1px solid #1F2937",
        background: "#0B1117"
      }}
    >

      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
        ⚖️ Crossing Comparison
      </h3>

      {/* COMPARE SECTION */}

      <div className="mb-8">

        <h4 className="text-cyan-400 font-bold mb-4">
          Compare Two Crossings
        </h4>

        <div className="grid grid-cols-2 gap-3 mb-5">

          <select
            className="bg-[#111827] p-2 rounded text-white"
            onChange={(e)=>
              setFirstId(Number(e.target.value))
            }
          >

            <option>
              Select first crossing
            </option>

            {crossings.map((c)=>(
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}

          </select>

          <select
            className="bg-[#111827] p-2 rounded text-white"
            onChange={(e)=>
              setSecondId(Number(e.target.value))
            }
          >

            <option>
              Select second crossing
            </option>

            {crossings.map((c)=>(
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}

          </select>

        </div>

        {first && second && (

          <div className="grid grid-cols-2 gap-5 mb-6">

            <div
              className="p-4 rounded-xl"
              style={{
                background:"#111827"
              }}
            >

              <h4 className="font-bold text-cyan-400 mb-2">
                {first.name}
              </h4>

              <p>Wait: {first.wait_time} min</p>

              <p>
                Throughput:
                {" "}
                {first.throughput.toLocaleString()}
              </p>

              <p>
                Risk:
                {" "}
                <span
                  style={{
                    color:riskColors[first.risk_level]
                  }}
                >
                  {first.risk_level}
                </span>
              </p>

              <p>
                Commodity:
                {" "}
                {first.commodity}
              </p>

            </div>


            <div
              className="p-4 rounded-xl"
              style={{
                background:"#111827"
              }}
            >

              <h4 className="font-bold text-cyan-400 mb-2">
                {second.name}
              </h4>

              <p>
                Wait:
                {" "}
                {second.wait_time}
                {" "}min
              </p>

              <p>
                Throughput:
                {" "}
                {second.throughput.toLocaleString()}
              </p>

              <p>
                Risk:
                {" "}
                <span
                  style={{
                    color:riskColors[second.risk_level]
                  }}
                >
                  {second.risk_level}
                </span>
              </p>

              <p>
                Commodity:
                {" "}
                {second.commodity}
              </p>

            </div>

          </div>

        )}

      </div>

      {/* EXISTING TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full text-xs">

          <thead>

            <tr
              style={{
                borderBottom:
                "1px solid #1F2937"
              }}
            >

              {[
                "Crossing",
                "Country",
                "Wait Time",
                "Throughput",
                "Commodity",
                "Status",
                "Risk",
                "Type",
              ].map((col)=>(

                <th
                  key={col}
                  className="text-left pb-2 pr-4"
                  style={{
                    color:"#6B7280"
                  }}
                >
                  {col}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {crossings.map((c)=>(

              <tr
                key={c.id}
                style={{
                  borderBottom:
                  "1px solid #111827"
                }}
                className="hover:bg-[#1F2937] transition"
              >

                <td className="py-2 pr-4 text-white font-medium">
                  {c.name}
                </td>

                <td className="py-2 pr-4 text-gray-400">
                  {c.country}
                </td>

                <td className="py-2 pr-4">

                  <span
                    style={{
                      color:
                      c.wait_time>60
                      ? "#EF4444"
                      : c.wait_time>30
                      ? "#FBBF24"
                      : "#4ADE80"
                    }}
                  >
                    {c.wait_time} min
                  </span>

                </td>

                <td className="py-2 pr-4 text-green-400">
                  {c.throughput.toLocaleString()}
                </td>

                <td className="py-2 pr-4 text-gray-300">
                  {c.commodity}
                </td>

                <td className="py-2 pr-4">

                  <span
                    className="px-2 py-1 rounded-lg"
                    style={{
                      border:
                      `1px solid ${statusColors[c.status]}`,
                      color:
                      statusColors[c.status]
                    }}
                  >
                    {c.status}
                  </span>

                </td>

                <td className="py-2 pr-4">

                  <span
                    className="font-bold"
                    style={{
                      color:
                      riskColors[c.risk_level]
                    }}
                  >
                    {c.risk_level}
                  </span>

                </td>

                <td className="py-2 pr-4 text-gray-400">
                  {c.type}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}