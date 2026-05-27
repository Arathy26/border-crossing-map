"use client";

const events = [
  {
    title: "Synthetic Wait Event",
    detail: "Wagah Border delay increased by +18 mins",
    severity: "High"
  },
  {
    title: "Synthetic Throughput Spike",
    detail: "US–Mexico crossing throughput +22%",
    severity: "Medium"
  },
  {
    title: "Mock Congestion Event",
    detail: "Heavy cargo backlog detected",
    severity: "High"
  }
];

export default function SyntheticEvents() {
  return (
    <div className="rounded-2xl p-5 bg-[#0B1117] border border-gray-800 mt-4">
      <h2 className="text-cyan-400 font-bold mb-4">
        Synthetic Events
      </h2>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-[#111827]"
          >
            <p className="font-medium">
              {event.title}
            </p>

            <p className="text-sm text-gray-400">
              {event.detail}
            </p>

            <span className="text-xs text-red-400">
              {event.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}