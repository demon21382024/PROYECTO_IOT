"use client"

import { useState } from "react"
import { Activity, Weight, Heart, Calendar, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ActivityChart from "./activity-chart"
import WeightChart from "./weight-chart"
import DurationChart from "./duration-chart"

interface DashboardContentProps {
  catName: string
  userEmail: string
}

export default function DashboardContent({ catName, userEmail }: DashboardContentProps) {
  const [selectedCat, setSelectedCat] = useState(catName)
  const cats = [catName, "Luna", "Felix"]

  // Mock data for the today's activity
  const todayStats = {
    visits: 12,
    lastVisit: "14:32 hace 5 minutos",
    avgDuration: "3m 24s",
    averageWeight: "4.2 kg",
  }

  return (
    <div className="space-y-8">
      {/* Header with cat selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">¡Hola de nuevo!</h2>
          <p className="text-muted-foreground">Monitoreando a {selectedCat}</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
          >
            {cats.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Reportar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Actividad Hoy</p>
              <p className="text-3xl font-bold text-foreground">{todayStats.visits}</p>
              <p className="text-xs text-muted-foreground mt-2">visitas al arenero</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Última Visita</p>
              <p className="text-lg font-bold text-foreground">14:32</p>
              <p className="text-xs text-muted-foreground mt-2">hace 5 minutos</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duración Promedio</p>
              <p className="text-2xl font-bold text-foreground">3m 24s</p>
              <p className="text-xs text-muted-foreground mt-2">por visita</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-chart-2/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Peso Promedio</p>
              <p className="text-2xl font-bold text-foreground">4.2 kg</p>
              <p className="text-xs text-muted-foreground mt-2">estable</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-chart-3/20 flex items-center justify-center">
              <Weight className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6 border border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Visitas por Día</h3>
            <p className="text-sm text-muted-foreground">Últimos 7 días</p>
          </div>
          <ActivityChart />
        </Card>

        <Card className="p-6 border border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Tendencia de Peso</h3>
            <p className="text-sm text-muted-foreground">Últimos 30 días</p>
          </div>
          <WeightChart />
        </Card>
      </div>

      {/* Duration Chart */}
      <Card className="p-6 border border-border">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Duración de Visitas</h3>
          <p className="text-sm text-muted-foreground">Detección de anomalías en rojo</p>
        </div>
        <DurationChart />
      </Card>

      {/* Health Alerts */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Alertas de Salud</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm">
            <p className="font-medium text-foreground">✓ Estado Normal</p>
            <p className="text-muted-foreground text-xs mt-1">Todos los parámetros dentro de los rangos normales</p>
          </div>
          <div className="p-3 rounded-lg bg-muted border border-border text-sm">
            <p className="font-medium text-foreground">📊 Análisis de IA</p>
            <p className="text-muted-foreground text-xs mt-1">El próximo análisis se realizará en 6 horas</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
