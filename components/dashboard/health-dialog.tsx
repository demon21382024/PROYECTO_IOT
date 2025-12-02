"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"

interface HealthDialogProps {
    children: React.ReactNode
    dailyVisits: number
}

export function HealthDialog({ children, dailyVisits }: HealthDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Lógica de Salud (Estándares Veterinarios)
    // Normal: 2-5 visitas
    // Warning: 0-1 (Obstrucción) o 6-8 (Posible infección)
    // Alert: > 8 (Urgente)

    let status: "Normal" | "Warning" | "Alert" = "Normal"
    let statusColor = "text-emerald-500"
    let statusBg = "bg-emerald-500/10 border-emerald-500/20"
    let statusIcon = <CheckCircle className="w-6 h-6 text-emerald-500" />
    let statusTitle = "Salud Óptima"
    let statusDesc = "La frecuencia de visitas está dentro del rango normal (2-5 veces al día)."

    if (dailyVisits <= 1) {
        status = "Warning"
        statusColor = "text-amber-500"
        statusBg = "bg-amber-500/10 border-amber-500/20"
        statusIcon = <AlertTriangle className="w-6 h-6 text-amber-500" />
        statusTitle = "Atención Requerida"
        statusDesc = "Frecuencia baja. Podría indicar retención urinaria o estreñimiento si persiste."
    } else if (dailyVisits >= 6 && dailyVisits <= 8) {
        status = "Warning"
        statusColor = "text-amber-500"
        statusBg = "bg-amber-500/10 border-amber-500/20"
        statusIcon = <AlertTriangle className="w-6 h-6 text-amber-500" />
        statusTitle = "Precaución"
        statusDesc = "Frecuencia elevada. Vigila si hay cambios en el consumo de agua."
    } else if (dailyVisits > 8) {
        status = "Alert"
        statusColor = "text-red-500"
        statusBg = "bg-red-500/10 border-red-500/20"
        statusIcon = <Activity className="w-6 h-6 text-red-500" />
        statusTitle = "Alerta Médica"
        statusDesc = "Frecuencia anormalmente alta. Se recomienda consultar al veterinario."
    }

    // Datos para la gráfica
    const data = [
        { name: "Mínimo", visits: 2, type: "Rango Normal" },
        { name: "Tu Gato", visits: dailyVisits, type: "Actual" },
        { name: "Máximo", visits: 5, type: "Rango Normal" },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Activity className="w-5 h-5 text-primary" />
                        Reporte de Salud Diario
                    </DialogTitle>
                    <DialogDescription>
                        Análisis basado en la frecuencia de uso del arenero hoy.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status Banner */}
                    <div className={`flex items-start gap-4 p-4 rounded-xl border ${statusBg}`}>
                        <div className="mt-1">{statusIcon}</div>
                        <div>
                            <h4 className={`text-lg font-bold ${statusColor}`}>{statusTitle}</h4>
                            <p className="text-sm text-foreground/80 mt-1">{statusDesc}</p>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-foreground">Comparativa de Frecuencia</h4>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                Estándar Veterinario
                            </span>
                        </div>

                        <div className="h-[250px] w-full border border-border rounded-lg p-4 bg-card/50">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={80}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '8px',
                                            color: 'hsl(var(--popover-foreground))'
                                        }}
                                    />
                                    <Bar dataKey="visits" radius={[0, 4, 4, 0]} barSize={32}>
                                        {data.map((entry, index) => {
                                            let fillColor = "#e5e7eb" // Default muted gray

                                            if (entry.type === "Actual") {
                                                if (status === "Normal") fillColor = "#10b981" // Emerald-500
                                                else if (status === "Warning") fillColor = "#f59e0b" // Amber-500
                                                else if (status === "Alert") fillColor = "#ef4444" // Red-500
                                            }

                                            return <Cell key={`cell-${index}`} fill={fillColor} />
                                        })}
                                    </Bar>
                                    {/* Reference Lines for Normal Range */}
                                    <ReferenceLine x={2} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Min (2)', fill: '#10b981', fontSize: 10 }} />
                                    <ReferenceLine x={5} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Max (5)', fill: '#10b981', fontSize: 10 }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            * La línea punteada verde indica el rango saludable (2 a 5 visitas).
                        </p>
                    </div>

                    {/* Info Footer */}
                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>
                            Este análisis es referencial y no sustituye el diagnóstico de un profesional.
                            Si notas comportamientos extraños (maullidos al orinar, sangre, esfuerzo excesivo), acude al veterinario inmediatamente.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
