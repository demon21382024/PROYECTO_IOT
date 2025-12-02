# Guía de Despliegue a Producción - LitterFlow

¡Felicidades por llegar a esta etapa! Para llevar tu proyecto a producción, debemos dividirlo en dos partes, ya que tienen necesidades diferentes.

## 1. Arquitectura Recomendada

| Componente | Tecnología | Dónde alojarlo (Recomendación) | Costo (Aprox) |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js | **Vercel** | Gratis (Hobby) |
| **Backend (Worker)** | Node.js (MQTT) | **Railway** o **Render** | ~$5/mes (o Gratis limitado) |
| **Base de Datos** | PostgreSQL | **Supabase** | Gratis (500MB) |
| **MQTT Broker** | MQTT | **HiveMQ Cloud** | Gratis (100 conexiones) |

---

## 2. Frontend (Tu Web App) -> Vercel

Vercel son los creadores de Next.js, así que es la mejor opción.

1.  Crea una cuenta en [vercel.com](https://vercel.com).
2.  Conecta tu cuenta de GitHub.
3.  Haz clic en **"Add New Project"** e importa tu repositorio `PROYECTO_IOT`.
4.  En **Environment Variables**, añade las mismas que tienes en `.env.local`:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5.  Haz clic en **Deploy**.

¡Listo! Vercel te dará una URL (ej: `litterflow.vercel.app`) donde tu web estará accesible para todo el mundo.

---

## 3. Backend (Tu Script MQTT) -> Railway

Tu archivo `prueba_backend.js` es especial: necesita estar **siempre encendido** escuchando mensajes MQTT. Vercel no sirve para esto (porque se "apaga" cuando nadie visita la web).

Recomiendo **Railway** (railway.app) porque es muy fácil de usar.

1.  Crea una cuenta en [railway.app](https://railway.app).
2.  Crea un **New Project** desde GitHub y selecciona el mismo repo.
3.  Railway intentará detectar qué correr. Debemos decirle que corra el script del backend.
4.  Ve a **Settings** > **Build & Deploy** > **Start Command** y pon:
    ```bash
    node prueba_backend.js
    ```
5.  En **Variables**, añade también tus credenciales de Supabase y cualquier otra necesaria.

---

## 4. MQTT Broker (Importante)

Actualmente usas `broker.hivemq.com` que es **PÚBLICO**. Cualquiera podría leer tus datos o enviar comandos falsos a tu arenero.

Para producción:
1.  Regístrate en [HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/).
2.  Crea un cluster gratuito.
3.  Te darán una URL (ej: `cluster-xyz.s1.eu.hivemq.cloud`), un usuario y contraseña.
4.  Actualiza tu código (`prueba_backend.js` y el código del ESP32) para usar estas credenciales seguras.

## Resumen de Pasos

1.  [ ] Subir código a GitHub (¡Ya hecho!).
2.  [ ] Desplegar Frontend en Vercel.
3.  [ ] Crear cuenta en HiveMQ Cloud y obtener credenciales seguras.
4.  [ ] Actualizar código para usar HiveMQ seguro.
5.  [ ] Desplegar Backend (Worker) en Railway con el comando de inicio personalizado.
