"use client";

export default function Insights() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">

      <div className="rounded-2xl p-5 bg-[#0B1117] border border-gray-800">
        <h2 className="text-cyan-400 font-bold mb-3">
          Why This Matters
        </h2>

        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Border delays increase logistics costs</li>
          <li>• Congestion impacts supply chains</li>
          <li>• Throughput affects trade efficiency</li>
          <li>• Infrastructure bottlenecks create risk</li>
        </ul>
      </div>

      <div className="rounded-2xl p-5 bg-[#0B1117] border border-gray-800">
        <h2 className="text-cyan-400 font-bold mb-3">
          Who Controls the Rail
        </h2>

        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Customs agencies</li>
          <li>• Border authorities</li>
          <li>• Freight operators</li>
          <li>• Trade agreements</li>
          <li>• Port infrastructure owners</li>
        </ul>
      </div>

    </div>
  );
}