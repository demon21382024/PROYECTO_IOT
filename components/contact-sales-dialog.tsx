'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type ContactSalesDialogProps = {
  triggerLabel?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  size?: React.ComponentProps<typeof Button>['size']
  className?: string
}

export function ContactSalesDialog({
  triggerLabel = 'Contactar ventas',
  variant = 'outline',
  size = 'lg',
  className,
}: ContactSalesDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !message.trim()) {
      return
    }

    setIsSubmitting(true)

    // Simula un envío al backend
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSubmitting(false)
    setSubmitted(true)

    // Limpia el formulario después de un breve tiempo
    setTimeout(() => {
      setSubmitted(false)
      setOpen(false)
      setName('')
      setEmail('')
      setMessage('')
    }, 1200)
  }

  const isValid = name.trim() && email.trim() && message.trim()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contactar al equipo de ventas</DialogTitle>
          <DialogDescription>
            Cuéntanos brevemente sobre tu proyecto y cómo podemos ayudarte. Te responderemos lo antes posible.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
              Nombre
            </label>
            <Input
              id="contact-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </label>
            <Input
              id="contact-email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
              Mensaje
            </label>
            <Textarea
              id="contact-message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Cuéntanos sobre tu caso, cuántos gatos tienes o qué tipo de solución necesitas…"
              rows={4}
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Enviando…' : submitted ? 'Enviado' : 'Enviar mensaje'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


