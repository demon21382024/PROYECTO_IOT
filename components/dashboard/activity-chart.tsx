"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type ActivityPoint = {
  day: string
  visits: number
}

const defaultData: ActivityPoint[] = [
  { day: "Lun", visits: 0 },
  { day: "Mar", visits: 0 },
  { day: "Mié", visits: 0 },
  { day: "Jue", visits: 0 },
  { day: "Vie", visits: 0 },
  { day: "Sáb", visits: 0 },
  { day: "Dom", visits: 0 },
]

interface ActivityChartProps {
  readonly data?: ActivityPoint[]
}

export default function ActivityChart({ data = defaultData }: ActivityChartProps) {
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
