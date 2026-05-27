"use client";

const flows = [
  {
    commodity: "Electronics",
    route: "US → Mexico",
    volume: "82K"
  },
  {
    commodity: "Agriculture",
    route: "EU → UK",
    volume: "61K"
  },
  {
    commodity: "Textiles",
    route: "India → Bangladesh",
    volume: "43K"
  }
];

export default function CommodityFlow() {
  return (
    <div className="rounded-2xl p-5 bg-[#0B1117] border border-gray-800 mt-4">
      <h2 className="text-cyan-400 font-bold mb-4">
        Commodity Flow Analytics
      </h2>

      <div className="space-y-3">
        {flows.map((item, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-[#111827]"
          >
            <p className="font-medium">
              {item.commodity}
            </p>

            <p className="text-sm text-gray-400">
              {item.route}
            </p>

            <p className="text-cyan-400">
              {item.volume}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}