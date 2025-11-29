"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { time: "08:00", duration: 2.5, anomaly: false },
  { time: "10:30", duration: 3.2, anomaly: false },
  { time: "13:00", duration: 5.8, anomaly: true },
  { time: "15:45", duration: 2.9, anomaly: false },
  { time: "18:15", duration: 3.1, anomaly: false },
  { time: "20:30", duration: 4.2, anomaly: false },
  { time: "22:00", duration: 2.8, anomaly: false },
]

export default function DurationChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            color: "var(--color-foreground)",
          }}
        />
        <Bar dataKey="duration" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.anomaly ? "var(--color-destructive)" : "var(--color-chart-2)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
