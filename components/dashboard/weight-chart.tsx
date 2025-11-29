"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "1", weight: 4.0 },
  { day: "5", weight: 4.1 },
  { day: "10", weight: 4.15 },
  { day: "15", weight: 4.2 },
  { day: "20", weight: 4.18 },
  { day: "25", weight: 4.2 },
  { day: "30", weight: 4.2 },
]

export default function WeightChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" domain={[3.8, 4.4]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            color: "var(--color-foreground)",
          }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="var(--color-chart-3)"
          strokeWidth={2}
          dot={{ fill: "var(--color-chart-3)", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
