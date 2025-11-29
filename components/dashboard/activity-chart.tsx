"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Lun", visits: 8 },
  { day: "Mar", visits: 12 },
  { day: "Mié", visits: 9 },
  { day: "Jue", visits: 15 },
  { day: "Vie", visits: 11 },
  { day: "Sáb", visits: 13 },
  { day: "Dom", visits: 12 },
]

export default function ActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            color: "var(--color-foreground)",
          }}
        />
        <Bar dataKey="visits" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
