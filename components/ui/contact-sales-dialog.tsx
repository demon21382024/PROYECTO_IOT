"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function ContactSalesDialog() {
  const [open, setOpen] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Aquí es donde harías la llamada a tu API para enviar el correo.
    // Por ahora, solo simularemos el éxito y mostraremos una notificación.
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log("Datos del formulario de contacto:", data)

    // Cerramos el diálogo
    setOpen(false)

    // Mostramos una notificación de éxito
    toast.success("Mensaje enviado con éxito", {
      description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Contactar Ventas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Contactar con Ventas</DialogTitle>
          <DialogDescription>
            Rellena el formulario y nuestro equipo se pondrá en contacto contigo lo antes posible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" name="name" placeholder="Tu nombre" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="¿En qué podemos ayudarte?"
                className="min-h-[120px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Enviar Mensaje</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
