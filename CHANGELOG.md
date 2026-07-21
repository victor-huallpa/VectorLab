# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [0.2.0] — Módulo de Análisis del Campo, Sistema de Ayuda y Reporte PDF profesional

### Agregado

- **Motor de análisis matemático** (`domain/field-analysis/`), 100% fuera de React:
  - `vectorCalculus.js` — derivadas parciales, jacobiano, divergencia y rotacional puntuales.
  - `FieldAnalyzer.js` — divergencia y rotacional (promedio y en el origen), magnitud
    mín/máx/promedio, dirección predominante, tipo de flujo, comportamiento cerca del origen.
  - `FieldClassifier.js` — clasificación automática por plano traza-determinante del
    jacobiano: fuente radial, sumidero, rotación pura, punto silla, campo uniforme,
    campo ondulatorio o personalizado. Catálogo cerrado, nunca inventa categorías.
  - `FieldInterpreter.js` — traduce clasificación + análisis a explicaciones en
    lenguaje simple para estudiantes.
- **Contenido educativo** (`content/educational/fieldEducationalContent.js`): nombre,
  descripción, explicación, propiedades, aplicaciones, ejemplos, nivel de dificultad
  y conceptos relacionados por cada tipo de campo.
- **Hook `useFieldAnalysis`**: ejecuta el análisis automáticamente al cambiar P, Q o
  el dominio (mismo debounce que la grilla del canvas), sin botón "Analizar".
- **Nuevos componentes del laboratorio**: `AnalysisCard`, `PropertiesPanel`,
  `InterpretationCard`, debajo del visualizador.
- **Sistema de ayuda reutilizable** (`components/help/`): `HelpDrawer`, `HelpSection`,
  `HelpCard`, `HelpExample`, `HelpIconButton` — genérico, pensado para cualquier
  laboratorio futuro. Contenido específico del módulo actual en
  `content/help/vectorFieldHelpContent.js` (qué es un campo vectorial, sintaxis de
  funciones, cómo interpretar la gráfica, magnitud, divergencia, rotacional, ejemplos
  aplicables con un clic).
- Iconos de ayuda contextual en las secciones "Funciones", "Dominio" y "Visualización"
  del formulario, y botón "Ayuda" en la barra de herramientas.
- **Reporte PDF profesional** (`services/pdf/PdfReportGenerator.js` +
  `pdfDrawHelpers.js`), de 3 páginas: portada con logo, fecha, hora, versión del
  sistema y laboratorio; datos técnicos (funciones, configuración, imagen del campo);
  análisis matemático y educativo (clasificación, propiedades calculadas,
  interpretación, explicación educativa, aplicaciones, observaciones). Apto como
  evidencia académica.
- `constants/appInfo.js`: fuente única de nombre/versión de la app.

### Cambiado

- `exportService.js` ahora delega en `PdfReportGenerator`, manteniendo la misma
  función pública `exportFieldToPdf` — ningún import existente se rompió.
- `VectorFieldPage.jsx` conecta el nuevo hook de análisis y renderiza las tarjetas
  nuevas y el `HelpDrawer`.
- `useUIStore.js` agrega el estado del panel de ayuda (`helpOpen`, `helpActiveSectionId`).
- `README.md` y `docs/ARCHITECTURE.md` actualizados con las secciones nuevas.

### Sin cambios (por diseño)

- Arquitectura general, stores existentes, `FieldCanvas`, sistema de partículas,
  historial en LocalStorage: intactos.

## [0.1.0] — MVP inicial

### Agregado

- Visualizador interactivo de campos vectoriales F(x, y) = P(x, y) i + Q(x, y) j.
- Configuración de dominio, densidad de vectores y escala de flechas.
- Coloreado por magnitud y tooltip interactivo.
- Simulación de partículas.
- Exportación básica a PDF.
- Historial de consultas en LocalStorage.
- Sidebar con módulos futuros deshabilitados.
- Interfaz responsive, tema oscuro.
