"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchAllLaunchesForCharts } from "@/lib/api";

type ChartType = "line" | "bar";

interface YearData {
  year: number;
  successful: number;
  failed: number;
}

function buildYearData(
  launches: Array<{ date_utc: string; success: boolean | null }>,
  fromYear: number,
  toYear: number
): YearData[] {
  const map = new Map<number, YearData>();

  for (const launch of launches) {
    const year = new Date(launch.date_utc).getFullYear();
    if (year < fromYear || year > toYear) continue;

    if (!map.has(year)) {
      map.set(year, { year, successful: 0, failed: 0 });
    }
    const entry = map.get(year)!;
    if (launch.success === true) {
      entry.successful += 1;
    } else if (launch.success === false) {
      entry.failed += 1;
    }
  }

  for (let y = fromYear; y <= toYear; y++) {
    if (!map.has(y)) {
      map.set(y, { year: y, successful: 0, failed: 0 });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.year - b.year);
}

export default function LaunchesChart() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["launches-chart"],
    queryFn: fetchAllLaunchesForCharts,
    staleTime: 5 * 60 * 1000,
  });

  const allYears = useMemo(() => {
    if (!data) return [];
    const years = data.map((l) => new Date(l.date_utc).getFullYear());
    const min = Math.min(...years);
    const max = Math.max(...years);
    const result: number[] = [];
    for (let y = min; y <= max; y++) result.push(y);
    return result;
  }, [data]);

  const minYear = allYears[0] ?? 2006;
  const maxYear = allYears[allYears.length - 1] ?? new Date().getFullYear();

  const [fromYear, setFromYear] = useState<number | null>(null);
  const [toYear, setToYear] = useState<number | null>(null);
  const [chartType, setChartType] = useState<ChartType>("line");

  const effectiveFrom = fromYear ?? minYear;
  const effectiveTo = toYear ?? maxYear;

  const chartData = useMemo(() => {
    if (!data) return [];
    return buildYearData(data, effectiveFrom, effectiveTo);
  }, [data, effectiveFrom, effectiveTo]);

  const fromOptions = allYears.filter((y) => y <= effectiveTo);
  const toOptions = allYears.filter((y) => y >= effectiveFrom);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        Loading chart data…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        Failed to load launch data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg overflow-hidden border border-zinc-700">
          <button
            onClick={() => setChartType("line")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              chartType === "line"
                ? "bg-blue-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              chartType === "bar"
                ? "bg-blue-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            Bar
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <label htmlFor="from-year" className="text-zinc-400">From</label>
          <select
            id="from-year"
            value={effectiveFrom}
            onChange={(e) => setFromYear(Number(e.target.value))}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fromOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <label htmlFor="to-year" className="text-zinc-400">To</label>
          <select
            id="to-year"
            value={effectiveTo}
            onChange={(e) => setToYear(Number(e.target.value))}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {toOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <ResponsiveContainer width="100%" height={400}>
          {chartType === "line" ? (
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#f4f4f5" }}
                labelStyle={{ color: "#a1a1aa" }}
              />
              <Legend wrapperStyle={{ paddingTop: "16px", color: "#a1a1aa", fontSize: "13px" }} />
              <Line
                type="monotone"
                dataKey="successful"
                name="Successful"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3, fill: "#22c55e" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="failed"
                name="Failed"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3, fill: "#ef4444" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#f4f4f5" }}
                labelStyle={{ color: "#a1a1aa" }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "16px", color: "#a1a1aa", fontSize: "13px" }} />
              <Bar dataKey="successful" name="Successful" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
