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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cat, CreditCard, Lock, Pencil, Save, User, X } from "lucide-react"

interface ProfileDialogProps {
    children: React.ReactNode
    userEmail: string
    catName: string
}

export function ProfileDialog({ children, userEmail, catName }: ProfileDialogProps) {
    const [pets, setPets] = useState([catName, "Luna", "Felix"])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editValue, setEditValue] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordMessage, setPasswordMessage] = useState("")

    // Plan Management State
    const [showPlans, setShowPlans] = useState(false)
    const [currentPlan, setCurrentPlan] = useState("VIP")
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [processingPayment, setProcessingPayment] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    const plans = [
        { name: "Gratuito", price: "$0", features: ["Monitoreo básico", "1 Gato"] },
        { name: "VIP", price: "$9.99", features: ["Monitoreo avanzado", "3 Gatos", "Alertas de salud"] },
        { name: "BLACK", price: "$19.99", features: ["Todo ilimitado", "Soporte prioritario", "Análisis genético"] },
    ]

    const handlePlanSelect = (planName: string) => {
        setSelectedPlan(planName)
    }

    const handleConfirmChange = () => {
        setProcessingPayment(true)
        // Simular proceso de pago
        setTimeout(() => {
            setProcessingPayment(false)
            setPaymentSuccess(true)
            // Finalizar cambio
            setTimeout(() => {
                if (selectedPlan) setCurrentPlan(selectedPlan)
                setPaymentSuccess(false)
                setSelectedPlan(null)
                setShowPlans(false)
            }, 2000)
        }, 2000)
    }

    const handleEditStart = (index: number) => {
        setEditingIndex(index)
        setEditValue(pets[index])
    }

    const handleEditSave = (index: number) => {
        const newPets = [...pets]
        newPets[index] = editValue
        setPets(newPets)
        setEditingIndex(null)
        // Here you would typically save to backend/localStorage
        if (index === 0) {
            localStorage.setItem("catName", editValue)
        }
    }

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setPasswordMessage("Las contraseñas no coinciden")
            return
        }
        if (newPassword.length < 6) {
            setPasswordMessage("La contraseña debe tener al menos 6 caracteres")
            return
        }
        setPasswordMessage("¡Contraseña actualizada correctamente!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setPasswordMessage(""), 3000)
    }

    if (showPlans) {
        if (paymentSuccess) {
            return (
                <Dialog>
                    <DialogTrigger asChild>{children}</DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] flex flex-col items-center justify-center py-10">
                        {/* Assuming BadgeCheck is imported, if not I might need to check imports */}
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CreditCard className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl mb-2">¡Pago Exitoso!</DialogTitle>
                        <DialogDescription className="text-center">
                            Tu plan ha sido actualizado a {selectedPlan} correctamente.
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            )
        }

        if (selectedPlan) {
            return (
                <Dialog>
                    <DialogTrigger asChild>{children}</DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Confirmar Cambio de Plan</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas cambiar al plan {selectedPlan}?
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                            <div className="bg-muted/50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Nuevo Plan:</span>
                                    <span className="font-bold">{selectedPlan}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Precio:</span>
                                    <span className="font-bold text-primary">
                                        {plans.find(p => p.name === selectedPlan)?.price} / mes
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Al confirmar, se realizará el cargo a tu método de pago registrado.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedPlan(null)} disabled={processingPayment}>
                                Cancelar
                            </Button>
                            <Button onClick={handleConfirmChange} disabled={processingPayment}>
                                {processingPayment ? "Procesando pago..." : "Sí, pagar y cambiar"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }

        return (
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Elige tu Plan</DialogTitle>
                        <DialogDescription>
                            Selecciona el plan que mejor se adapte a tus necesidades.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition hover:border-primary ${currentPlan === plan.name ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                                    }`}
                                onClick={() => handlePlanSelect(plan.name)}
                            >
                                <div>
                                    <p className="font-semibold">{plan.name}</p>
                                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                                        {plan.features.map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{plan.price}</p>
                                    <p className="text-xs text-muted-foreground">/mes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => setShowPlans(false)}>
                        Volver
                    </Button>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Perfil de Usuario</DialogTitle>
                    <DialogDescription>
                        Gestiona tu cuenta, tus mascotas y tu seguridad.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="pets">Mascotas</TabsTrigger>
                        <TabsTrigger value="security">Seguridad</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Plan</CardTitle>
                                <CardDescription>Detalles de tu suscripción actual</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/20 rounded-full">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">Plan {currentPlan}</p>
                                            <p className="text-sm text-muted-foreground">Activo</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setShowPlans(true)}>
                                        Gestionar
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Fecha de Inicio</Label>
                                        <p className="font-medium">01 Nov, 2025</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Próxima Renovación</Label>
                                        <p className="font-medium">01 Dic, 2025</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">Email</Label>
                                        <p className="font-medium">{userEmail}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">ID de Usuario</Label>
                                        <p className="font-medium text-xs font-mono text-muted-foreground mt-1">
                                            USR-7823-X92
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pets" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mis Mascotas</CardTitle>
                                <CardDescription>Gestiona los perfiles de tus gatos</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pets.map((pet, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="p-2 bg-accent/20 rounded-full">
                                                <Cat className="w-5 h-5 text-accent" />
                                            </div>
                                            {editingIndex === index ? (
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="h-8 max-w-[200px]"
                                                />
                                            ) : (
                                                <span className="font-medium">{pet}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {editingIndex === index ? (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-emerald-500"
                                                        onClick={() => handleEditSave(index)}
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => setEditingIndex(null)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleEditStart(index)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full border-dashed">
                                    + Agregar Mascota
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Cambiar Contraseña</CardTitle>
                                <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current">Contraseña Actual</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="current"
                                                type="password"
                                                className="pl-9"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new">Nueva Contraseña</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="new"
                                                type="password"
                                                className="pl-9"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirm"
                                                type="password"
                                                className="pl-9"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {passwordMessage && (
                                        <p className={`text-sm ${passwordMessage.includes("correctamente") ? "text-emerald-500" : "text-destructive"}`}>
                                            {passwordMessage}
                                        </p>
                                    )}

                                    <div className="flex justify-end">
                                        <Button type="submit">Actualizar Contraseña</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
