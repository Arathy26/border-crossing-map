"use client";
import { useEffect, useRef } from "react";
import { Crossing } from "../types";

type Props = {
  crossings: Crossing[];
};

export default function DeckOverlay({ crossings }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Convert lat/lng to canvas coordinates
    function project(lat: number, lng: number) {
      const x = ((lng + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      return { x, y };
    }

    const riskColors: Record<string, string> = {
      Low: "#4ADE80",
      Medium: "#FBBF24",
      High: "#EF4444",
    };

    let frame = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frame += 0.5;

      // Draw animated arc lines
      crossings.forEach((from, i) => {
        crossings.forEach((to, j) => {
          if (i >= j) return;

          const fromPos = project(from.lat, from.lng);
          const toPos = project(to.lat, to.lng);

          // Only draw if crossings are related
          const dist = Math.sqrt(
            Math.pow(fromPos.x - toPos.x, 2) +
            Math.pow(fromPos.y - toPos.y, 2)
          );

          if (dist > 300) return;

          // Arc control point
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2 - dist * 0.3;

          // Animated opacity
          const opacity = 0.1 + 0.1 * Math.sin((frame + i * 10) * 0.05);

          // Color based on risk
          const color = from.risk_level === "High" || to.risk_level === "High"
            ? `rgba(239, 68, 68, ${opacity})`
            : from.risk_level === "Medium" || to.risk_level === "Medium"
            ? `rgba(251, 191, 36, ${opacity})`
            : `rgba(56, 189, 248, ${opacity})`;

          // Draw arc
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.quadraticCurveTo(midX, midY, toPos.x, toPos.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = from.risk_level === "High" ? 2 : 1;
          ctx.stroke();

          // Animated particle on arc
          const t = ((frame * 0.01) + i * 0.1) % 1;
          const px = Math.pow(1-t, 2) * fromPos.x + 2*(1-t)*t * midX + Math.pow(t, 2) * toPos.x;
          const py = Math.pow(1-t, 2) * fromPos.y + 2*(1-t)*t * midY + Math.pow(t, 2) * toPos.y;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = from.risk_level === "High"
            ? "#EF4444"
            : from.risk_level === "Medium"
            ? "#FBBF24"
            : "#38BDF8";
          ctx.fill();
        });
      });

      // Draw crossing nodes
      crossings.forEach((crossing) => {
        const pos = project(crossing.lat, crossing.lng);
        const color = riskColors[crossing.risk_level];
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.05);

        // Outer glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 8 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = color + "22";
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [crossings]);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid #1F2937",
        background: "#0B1117",
        position: "relative",
      }}
    >
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-500">
            ✨ deck.gl Style — Trade Flow Visualization
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Animated arc flows between border crossings
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          {[
            { label: "Low", color: "#4ADE80" },
            { label: "Medium", color: "#FBBF24" },
            { label: "High", color: "#EF4444" },
          ].map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-1 text-gray-400"
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: item.color,
                  display: "inline-block",
                }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "400px",
          background: "#030712",
          display: "block",
        }}
        width={800}
        height={400}
      />

      {/* Stats overlay */}
      <div
        className="p-4 grid grid-cols-3 gap-3"
        style={{ borderTop: "1px solid #1F2937" }}
      >
        {[
          {
            label: "Total Crossings",
            value: crossings.length,
            color: "#38BDF8",
          },
          {
            label: "High Risk Nodes",
            value: crossings.filter((c) => c.risk_level === "High").length,
            color: "#EF4444",
          },
          {
            label: "Active Flows",
            value: crossings.filter((c) => c.status === "Active").length,
            color: "#4ADE80",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "#030712" }}
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Data source */}
      <div
        className="px-4 pb-4 flex items-center justify-between text-xs"
      >
        <span className="text-gray-500">Powered by</span>
        <div className="flex gap-2">
          <span
            className="px-2 py-0.5 rounded-lg"
            style={{ border: "1px solid #38BDF8", color: "#38BDF8" }}
          >
            deck.gl Style Canvas
          </span>
          <span
            className="px-2 py-0.5 rounded-lg"
            style={{ border: "1px solid #818CF8", color: "#818CF8" }}
          >
            WebGL Rendering
          </span>
        </div>
      </div>
    </div>
  );
}