# LitterFlow - IoT Smart Litter Box Project

Bienvenido a LitterFlow. Este proyecto es una aplicación web IoT para el monitoreo de la salud de gatos a través de un arenero inteligente.

## Requisitos Previos

- **Node.js**: Asegúrate de tener instalado Node.js (versión 18 o superior recomendada).
- **pnpm**: Recomendamos usar `pnpm` como gestor de paquetes, aunque `npm` también funciona.

## Instalación

1. Clona el repositorio o descarga los archivos.
2. Abre una terminal en la carpeta raíz del proyecto (`c:\PROYECTO_IOT`).
3. Instala las dependencias:

```bash
pnpm install
# O si usas npm:
npm install
```

## Ejecución del Proyecto

Para ejecutar el sistema completo, necesitarás correr tres procesos simultáneamente (puedes usar diferentes terminales):

### 1. Servidor de Desarrollo (Frontend)

Inicia la aplicación Next.js:

```bash
pnpm dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 2. Backend (Servidor de Datos)

Ejecuta el script que simula el backend y maneja la lógica de datos:

```bash
node prueba_backend.js
```

### 3. Simulador IoT (Arenero)

Ejecuta el simulador que genera datos de los sensores del arenero:

```bash
node simulador_arenero.js
```

## Estructura del Proyecto

- **/app**: Código fuente de la aplicación Next.js (páginas, layouts).
- **/components**: Componentes de React reutilizables.
- **prueba_backend.js**: Script del servidor backend.
- **simulador_arenero.js**: Script de simulación de hardware IoT.
