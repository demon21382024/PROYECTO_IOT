"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  BadgeCheck,
  Cat,
  Clock3,
  Calendar,
  Download,
  Hash,
  Radio,
  Timer,
  StickyNote,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ActivityChart from "./activity-chart"
import DurationChart, { type DurationPoint } from "./duration-chart"
import StatusDistributionChart from "./status-distribution-chart"

interface DashboardContentProps {
  readonly catName: string
  readonly userEmail: string
}

export default function DashboardContent({ catName, userEmail }: DashboardContentProps) {
  const [selectedCat, setSelectedCat] = useState(catName)
  const cats = [catName, "Luna", "Felix"]

  const [todayStats, setTodayStats] = useState({
    visits: 0,
    lastVisitTime: "-",
    lastVisitAgo: "-",
    avgDuration: "-",
    activeTime: "-",
  })

  const [areneroState, setAreneroState] = useState({
    id: "Arenero-001",
    estadoActual: "Desconocido",
    ultimaDuracion: "-",
    ultimaActualizacion: "-",
  })

  const [visitLog, setVisitLog] = useState<
    {
      visitaId: string
      estado: string
      inicio: string
      duracion: string
      nota: string
    }[]
  >([])

  const [activityData, setActivityData] = useState<{ day: string; visits: number }[]>([])
  const [durationData, setDurationData] = useState<DurationPoint[]>([])

  const [sortConfig, setSortConfig] = useState<{
    key: "visitaId" | "estado" | "inicio" | "duracion" | "nota"
    direction: "asc" | "desc"
  } | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    let isMounted = true

    const parseDuration = (seconds: number | undefined | null) => {
      if (!seconds || seconds <= 0) return "0 s"
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = Math.floor(seconds % 60)

      if (h > 0) return `${h} h ${m} min`
      if (m > 0) return `${m} min ${s} s`
      return `${s} s`
    }

    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:3001/metrics")
        if (!res.ok) return

        const data = await res.json()

        if (!isMounted) return

        const resumen = data?.resumen
        const estado = data?.estado
        const visitas = Array.isArray(data?.visitas) ? data.visitas : []

        // Calculate Average Duration for Completed visits only
        let calculatedAvgDuration = 0
        const completedVisits = visitas.filter((v: any) => v.evento === 'salida' && v.duracionSegundos > 0)
        if (completedVisits.length > 0) {
          const totalDuration = completedVisits.reduce((acc: number, v: any) => acc + v.duracionSegundos, 0)
          calculatedAvgDuration = totalDuration / completedVisits.length
        }

        // Find the most recent completed visit for "Última duración"
        let lastCompletedDurationSeconds = 0
        if (completedVisits.length > 0) {
          const lastVisit = completedVisits[completedVisits.length - 1]
          lastCompletedDurationSeconds = lastVisit.duracionSegundos
        }

        if (resumen) {
          const ultimoMovimiento = resumen.ultimoMovimiento ? new Date(resumen.ultimoMovimiento) : null
          const ahora = new Date()
          let lastVisitTime = "-"
          let lastVisitAgo = "-"

          if (ultimoMovimiento) {
            lastVisitTime = ultimoMovimiento.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })
            const diffMs = ahora.getTime() - ultimoMovimiento.getTime()
            const diffMin = Math.round(diffMs / 60000)
            lastVisitAgo = diffMin <= 1 ? "hace un momento" : `hace ${diffMin} min`
          }

          setTodayStats((prev) => ({
            ...prev,
            visits: resumen.visitasHoy ?? prev.visits,
            lastVisitTime,
            lastVisitAgo,
            avgDuration: parseDuration(calculatedAvgDuration),
            activeTime: resumen.visitasHoy && resumen.ultimaDuracion
              ? parseDuration(resumen.visitasHoy * resumen.ultimaDuracion)
              : prev.activeTime,
          }))
        }

        if (estado) {
          setAreneroState((prev) => ({
            ...prev,
            estadoActual: estado.estado ?? prev.estadoActual,
            ultimaDuracion: lastCompletedDurationSeconds > 0
              ? parseDuration(lastCompletedDurationSeconds)
              : prev.ultimaDuracion,
            ultimaActualizacion: estado.actualizadoEn
              ? new Date(estado.actualizadoEn).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })
              : prev.ultimaActualizacion,
          }))
        }

        if (visitas.length > 0) {
          const mapped = visitas
            .map((v: any, index: number) => {
              const inicioDate = v.inicio ? new Date(v.inicio) : null
              const inicio = inicioDate
                ? inicioDate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                : "-"

              const duracionSeg = v.duracionSegundos ?? 0

              return {
                visitaId: (index + 1).toString(),
                estado: v.evento === "salida" ? "Completada" : "En curso",
                inicio,
                duracion: parseDuration(duracionSeg),
                nota: duracionSeg === 0 ? "Fuera del arenero" : "Dentro de lo normal",
              }
            })
            .reverse()

          setVisitLog(mapped)

          // Datos para gráficas a partir de visitas
          // Actividad: visitas agrupadas por fecha (últimos 7 días)
          const byDay = new Map<string, number>()
          visitas.forEach((v: any) => {
            if (!v.inicio) return
            const d = new Date(v.inicio)
            const key = d.toLocaleDateString("es-ES", { weekday: "short" })
            byDay.set(key, (byDay.get(key) ?? 0) + 1)
          })

          const activity = Array.from(byDay.entries()).map(([day, visits]) => ({
            day,
            visits,
          }))

          setActivityData(activity.slice(-7))

          // Duración: últimas 10 visitas con duración
          const durationPoints: DurationPoint[] = visitas
            .filter((v: any) => typeof v.duracionSegundos === "number")
            .slice(-10)
            .map((v: any) => {
              const d = v.inicio ? new Date(v.inicio) : null
              const time = d
                ? d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
                : "-"
              const durSeconds = v.duracionSegundos as number
              return {
                time,
                duration: Math.round(durSeconds / 60 * 10) / 10,
                anomaly: durSeconds > 5 * 60,
              }
            })

          setDurationData(durationPoints)
        }
      } catch { }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const getMoodIconConfig = (estado: string) => {
    const normalized = estado.toLowerCase()

    if (normalized.includes("en curso")) {
      return {
        className: "text-amber-500",
        label: "Gato actualmente dentro del arenero",
      }
    }

    if (normalized.includes("complet")) {
      return {
        className: "text-emerald-500",
        label: "Visita completada con normalidad",
      }
    }

    return {
      className: "text-muted-foreground",
      label: "Gato fuera del arenero",
    }
  }

  const getStatusClasses = (estado: string) => {
    const normalized = estado.toLowerCase()
    if (normalized.includes("en curso")) {
      return "text-amber-500 font-medium"
    }
    if (normalized.includes("complet")) {
      return "text-emerald-500 font-medium"
    }
    return "text-muted-foreground"
  }

  const sortedVisits = (() => {
    const data = [...visitLog]
    if (!sortConfig) return data

    return data.sort((a, b) => {
      const { key, direction } = sortConfig
      const dir = direction === "asc" ? 1 : -1

      const av = a[key]
      const bv = b[key]

      if (key === "duracion") {
        const parseToSeconds = (value: string) => {
          const parts = value.split(":").map((p) => Number(p) || 0)
          if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2]
          }
          return 0
        }
        return (parseToSeconds(av) - parseToSeconds(bv)) * dir
      }

      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  })()

  const totalPages = Math.max(1, Math.ceil(sortedVisits.length / pageSize))
  const currentPageSafe = Math.min(currentPage, totalPages)
  const pageVisits = sortedVisits.slice((currentPageSafe - 1) * pageSize, currentPageSafe * pageSize)

  const handleSort = (key: "visitaId" | "estado" | "inicio" | "duracion" | "nota") => {
    setCurrentPage(1)
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        }
      }
      return { key, direction: "asc" }
    })
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
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => window.open('http://localhost:3001/report', '_blank')}
          >
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
              <p className="text-sm text-muted-foreground mb-1">Visitas Hoy</p>
              <p className="text-3xl font-bold text-foreground">{todayStats.visits}</p>
              <p className="text-xs text-muted-foreground mt-2">registro en tiempo real</p>
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
              <p className="text-lg font-bold text-foreground">{todayStats.lastVisitTime}</p>
              <p className="text-xs text-muted-foreground mt-2">{todayStats.lastVisitAgo}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Radio className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duración Promedio</p>
              <p className="text-2xl font-bold text-foreground">{todayStats.avgDuration}</p>
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
              <p className="text-sm text-muted-foreground mb-1">Tiempo Activo Hoy</p>
              <p className="text-2xl font-bold text-foreground">{todayStats.activeTime}</p>
              <p className="text-xs text-muted-foreground mt-2">suma de permanencia</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-chart-3/20 flex items-center justify-center">
              <Clock3 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Estado del arenero */}
      <Card className="p-6 border border-border">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Estado del {areneroState.id}</h3>
              {(() => {
                const mood = getMoodIconConfig(areneroState.estadoActual)
                return (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Cat className={`w-4 h-4 ${mood.className}`} aria-hidden="true" />
                    <span className="sr-only">{mood.label}</span>
                    <span>
                      {areneroState.estadoActual} • última visita {areneroState.ultimaActualizacion}
                    </span>
                  </p>
                )
              })()}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Última duración</p>
              <p className="text-xl font-semibold text-foreground">{areneroState.ultimaDuracion}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("visitaId")}
                  >
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <span>Visita</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("estado")}
                  >
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3 text-muted-foreground" />
                      <span>Estado</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("inicio")}
                  >
                    <div className="flex items-center gap-1">
                      <Clock3 className="w-3 h-3 text-muted-foreground" />
                      <span>Inicio</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("duracion")}
                  >
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3 text-muted-foreground" />
                      <span>Duración</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("nota")}
                  >
                    <div className="flex items-center gap-1">
                      <StickyNote className="w-3 h-3 text-muted-foreground" />
                      <span>Nota</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageVisits.map((visit, index) => (
                  <TableRow key={`${visit.visitaId}-${index}`}>
                    <TableCell className="font-medium">{visit.visitaId}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {(() => {
                        const mood = getMoodIconConfig(visit.estado)
                        return (
                          <Cat
                            className={`w-4 h-4 shrink-0 ${mood.className}`}
                            aria-hidden="true"
                          />
                        )
                      })()}
                      <span className={getStatusClasses(visit.estado)}>{visit.estado}</span>
                    </TableCell>
                    <TableCell>{visit.inicio}</TableCell>
                    <TableCell>{visit.duracion}</TableCell>
                    <TableCell className="text-muted-foreground">{visit.nota}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
            <span>
              Página {currentPageSafe} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPageSafe <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPageSafe >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="p-6 border border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Visitas por Día</h3>
            <p className="text-sm text-muted-foreground">Últimos 7 días</p>
          </div>
          <ActivityChart data={activityData} />
        </Card>

        <Card className="p-6 border border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Tiempo dentro del arenero</h3>
            <p className="text-sm text-muted-foreground">Comparativo diario</p>
          </div>
          <DurationChart data={durationData} />
        </Card>

        <Card className="p-6 border border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Distribución de estados</h3>
            <p className="text-sm text-muted-foreground">
              Proporción de visitas en curso y completadas
            </p>
          </div>
          <StatusDistributionChart
            data={[
              {
                status: "Completada",
                value: visitLog.filter((v) => v.estado === "Completada").length,
              },
              {
                status: "En curso",
                value: visitLog.filter((v) => v.estado === "En curso").length,
              },
            ]}
          />
        </Card>
      </div>

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
