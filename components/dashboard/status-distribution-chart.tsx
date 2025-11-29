"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

type StatusDatum = {
  status: string
  value: number
}

const COLORS = {
  completada: "var(--color-emerald-500, #22c55e)",
  "en curso": "var(--color-amber-500, #eab308)",
  otra: "var(--color-muted-foreground, #a1a1aa)",
}

interface StatusDistributionChartProps {
  readonly data?: StatusDatum[]
}

export default function StatusDistributionChart({ data = [] }: StatusDistributionChartProps) {
  const chartData = data.length
    ? data
    : [
        {
          status: "Sin datos",
          value: 1,
        },
      ]

  const getColor = (status: string) => {
    const key = status.toLowerCase()
    if (key.includes("complet")) return COLORS["completada"]
    if (key.includes("curso")) return COLORS["en curso"]
    return COLORS.otra
  }

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer>
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
              color: "var(--color-foreground)",
            }}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="status"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
          >
            {chartData.map((entry, index) => (
              <Cell key={`${entry.status}-${index}`} fill={getColor(entry.status)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}


