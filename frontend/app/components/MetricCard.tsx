"use client";

type Props = {
  title: string;
  value: string | number;
  tooltip: string;
};

export default function MetricCard({
  title,
  value,
  tooltip,
}: Props) {
  return (
    <div
      className="rounded-2xl p-5 bg-[#0B1117] border border-gray-800"
      title={tooltip}
    >
      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-cyan-400 text-2xl font-bold">
        {value}
      </h2>
    </div>
  );
}