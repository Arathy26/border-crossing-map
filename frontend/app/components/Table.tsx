"use client";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Crossing } from "../types";

type Props = {
  crossings: Crossing[];
};

const columnHelper = createColumnHelper<Crossing>();

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

const columns = [
  columnHelper.accessor("name", {
    header: "Crossing",
    cell: (info) => (
      <span className="font-medium text-white">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("country", {
    header: "Country",
    cell: (info) => (
      <span className="text-gray-400">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("wait_time", {
    header: "Wait Time",
    cell: (info) => (
      <span
        className="font-bold"
        style={{
          color:
            info.getValue() > 60
              ? "#EF4444"
              : info.getValue() > 30
              ? "#FBBF24"
              : "#4ADE80",
        }}
      >
        {info.getValue()} min
      </span>
    ),
  }),
  columnHelper.accessor("throughput", {
    header: "Throughput",
    cell: (info) => (
      <span className="text-green-400">
        {info.getValue().toLocaleString()}/day
      </span>
    ),
  }),
  columnHelper.accessor("commodity", {
    header: "Commodity",
    cell: (info) => (
      <span className="text-gray-300">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className="px-2 py-0.5 rounded-lg text-xs"
        style={{
          border: `1px solid ${statusColors[info.getValue()]}`,
          color: statusColors[info.getValue()],
        }}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("risk_level", {
    header: "Risk",
    cell: (info) => (
      <span
        className="font-bold"
        style={{ color: riskColors[info.getValue()] }}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => (
      <span className="text-gray-400 text-xs">{info.getValue()}</span>
    ),
  }),
];

export default function DataTable({ crossings }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: crossings,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div
      className="rounded-2xl p-5"
      style={{ border: "1px solid #1F2937", background: "#0B1117" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-widest text-gray-500">
          📋 Data Table (TanStack Table)
        </h3>
        <input
          type="text"
          placeholder="Search table..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="rounded-xl px-3 py-1.5 text-xs text-white outline-none"
          style={{
            background: "#030712",
            border: "1px solid #1F2937",
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ borderBottom: "1px solid #1F2937" }}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left pb-2 pr-4 cursor-pointer select-none"
                    style={{ color: "#6B7280" }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                      {!header.column.getIsSorted() && " ↕"}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition"
                style={{ borderBottom: "1px solid #111827" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1F2937";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2.5 pr-4">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing {table.getRowModel().rows.length} of {crossings.length} crossings
        </span>
        <span>Click column headers to sort ↕</span>
      </div>
    </div>
  );
}