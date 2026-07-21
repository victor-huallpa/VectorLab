# Vector Lab — Laboratorio Virtual de Cálculo Vectorial

Laboratorio de **Visualizador de Campos Vectoriales 2D**, con un motor de
**análisis matemático y clasificación automática**, un **sistema de ayuda**
reutilizable y **reportes PDF profesionales**. Todo construido sobre una
arquitectura pensada para crecer con los módulos futuros (Gradiente,
Divergencia, Rotacional, Integrales, etc.) sin necesidad de rehacer nada.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Otros comandos:

```bash
npm run build     # build de producción en /dist
npm run preview   # sirve el build de producción localmente
npm run lint      # revisa el código con ESLint
```

## Qué incluye esta versión

**Visualización**
- Visualizador interactivo de campos vectoriales F(x, y) = P(x, y) i + Q(x, y) j
- Configuración de dominio, densidad de vectores y escala de flechas
- Coloreado por magnitud y tooltip al pasar el mouse (coordenadas, vector, magnitud)
- Simulación de partículas siguiendo el flujo del campo

**Análisis del Campo (nuevo)**
- Clasificación automática del campo (fuente radial, sumidero, rotación pura,
  punto silla, campo uniforme, campo ondulatorio o personalizado), calculada
  con el jacobiano de (P, Q) — sin listas de casos hardcodeadas
- Cálculo automático de divergencia, rotacional, magnitud (mín/máx/prom.),
  dirección predominante, tipo de flujo y comportamiento cerca del origen
- Interpretación en lenguaje simple orientada a estudiantes
- Todo se actualiza solo al cambiar P, Q o el dominio — no requiere ningún botón

**Sistema de ayuda (nuevo)**
- Panel de ayuda (Drawer lateral) reutilizable por cualquier laboratorio futuro
- Explica qué es un campo vectorial, sintaxis de funciones, cómo interpretar
  la gráfica, magnitud, divergencia y rotacional, con ejemplos aplicables con un clic
- Iconos de ayuda contextual en cada sección importante del formulario

**Reportes y persistencia**
- Exportación a **reporte PDF profesional** de 3 páginas (portada, datos
  técnicos, análisis matemático y educativo) apto como evidencia académica
- Historial de consultas persistido en el navegador (LocalStorage)

**Interfaz**
- Barra lateral de navegación con los módulos futuros deshabilitados ("Próximamente")
- Interfaz responsive (desktop, tablet, móvil), tema oscuro

## Documentación técnica

Ver [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) para:

- Mapa completo de carpetas y su responsabilidad
- Cómo funciona el motor de análisis (`FieldClassifier`, `FieldAnalyzer`, `FieldInterpreter`)
- Cómo está armado el sistema de ayuda reutilizable
- Cómo está desacoplada la capa de datos (servicios simulados) del resto de la app
- Cómo conectar una API real en el futuro sin tocar componentes ni estado
- Cómo agregar un nuevo módulo (ej. Gradiente) siguiendo el mismo patrón

Ver también [`CHANGELOG.md`](./CHANGELOG.md) para el historial de versiones.

## Stack

React 18 · Vite · Tailwind CSS · React Router · Zustand · Math.js · Canvas 2D
nativo · jsPDF · Lucide React
