# Arquitectura de Vector Lab

## 1. Principio rector

Ningún componente toca datos directamente. Todo pasa por:

```
Componente  →  Store (Zustand) / Hook  →  Servicio  →  Cliente HTTP simulado
```

Hoy el "cliente HTTP simulado" resuelve Promises con `setTimeout` sobre datos
locales (`mock/`, `mathjs`, `localStorage`). El día que exista un backend
real, **solo se reemplaza `services/api/httpClient.js`** por llamadas
`fetch`/`axios` reales. Los servicios (`vectorFieldService.js`,
`historyService.js`) mantienen la misma firma de funciones, así que stores,
hooks y componentes no cambian una sola línea.

## 2. Mapa de carpetas

```
src/
├── components/
│   ├── ui/            Primitivas reutilizables: Button, Card, Slider, Badge, Toggle, NumberField
│   ├── layout/         Sidebar, TopBar, MobileNav — el "chrome" de la app
│   ├── vector-field/   Componentes específicos del módulo actual (Form, Canvas, Toolbar, History,
│   │                    Tooltip, AnalysisCard, PropertiesPanel, InterpretationCard)
│   └── help/           Sistema de ayuda genérico (HelpDrawer, HelpSection, HelpCard, HelpExample,
│                        HelpIconButton) — no exclusivo de ningún laboratorio
├── pages/              Una página por ruta. Componen componentes + hooks + stores, no contienen lógica de negocio
├── layouts/             MainLayout: sidebar + topbar + <Outlet/>
├── router/              createBrowserRouter — única fuente de verdad de rutas y metadatos (título/subtítulo por página)
├── hooks/               Lógica reutilizable: debounce, rAF, tamaño de canvas, cómputo del campo vectorial,
│                        análisis automático del campo (useFieldAnalysis)
├── domain/              Lógica de dominio pura, sin React. field-analysis/ contiene el motor de
│                        clasificación y análisis matemático (ver sección 7)
├── content/             Contenido de datos puro que consumen los componentes (nunca al revés):
│                        educational/ (explicaciones por tipo de campo) y help/ (contenido del Help Drawer)
├── services/            Capa de datos. Simulan una API. Nunca importan React.
│   ├── api/httpClient.js   Simulador de latencia/errores de red — el único punto que cambiará al conectar un backend real
│   └── pdf/                 Generación de reportes PDF (PdfReportGenerator + pdfDrawHelpers), ver sección 8
├── store/               Zustand. Un store por dominio: campo vectorial, historial, UI (incluye el estado del Help Drawer)
├── models/              Forma de los datos + validación/sanitización (VectorFieldConfig, HistoryEntry)
├── utils/                Funciones puras: parser matemático, escala de color, transformaciones de coordenadas,
│                        render de canvas, sistema de partículas, validadores, formateadores
├── constants/            Rutas, catálogo de módulos del sidebar, íconos, tokens de color para canvas, metadata de la app
├── mock/                  Datos simulados (catálogo de presets). Sustituible por respuestas reales de API
└── types/                 (reservado para JSDoc typedefs compartidos entre módulos futuros)
```

## 3. Por qué estas decisiones

**JavaScript en vez de TypeScript.** El enunciado permitía ambos. Se optó por
JS + JSDoc (`@typedef` en `models/`) para mantener el setup mínimo en el MVP;
migrar a TS más adelante es mecánico porque los módulos ya están tipados por
convención y bien acotados.

**Canvas 2D nativo en vez de Plotly.js.** El brief sugería Plotly.js "o la
librería más adecuada". Plotly es potente para gráficos estáticos, pero
redibujar cientos de partículas a 60 fps sobre una capa Plotly es costoso e
introduce una dependencia pesada (~3 MB) para algo que un `<canvas>` nativo
resuelve con más control y cero overhead. Se usan **dos canvases apilados**:
uno estático (ejes + flechas, se redibuja solo cuando cambian los datos) y uno
animado (partículas, se redibuja cada frame). Esto es más barato que
recalcular las flechas 60 veces por segundo.

**Zustand en vez de Context API.** Con 3 dominios de estado (campo, historial,
UI) y actualizaciones frecuentes (cada slider), Context obligaría a memoizar
manualmente para evitar renders innecesarios. Zustand da selectors granulares
gratis.

**Servicios como Promises, siempre.** Incluso el parser matemático síncrono
(`mathParser.js`) se envuelve en una Promise dentro de `vectorFieldService.js`
al exponerse hacia afuera, para que ningún componente necesite cambiar su
forma de consumir datos cuando la Promise empiece a venir de una API real en
vez de `setTimeout`.

**Historial en LocalStorage, detrás de un servicio.** `historyService.js`
expone `fetchHistory / saveHistoryEntry / deleteHistoryEntry / clearHistory`
con la misma forma que tendrían endpoints REST (`GET/POST/DELETE
/api/history`). Ningún componente sabe que hay un `localStorage.getItem` de
por medio.

## 4. Cómo agregar un módulo nuevo (ej. Gradiente)

1. `constants/modules.js`: cambiar `available: false` → `true` para ese módulo.
2. `router/index.jsx`: reemplazar su `<ComingSoonPage />` por el componente de página real.
3. Crear `pages/GradientPage.jsx`, `components/gradient/*`, `store/useGradientStore.js`,
   `services/gradientService.js`, siguiendo exactamente el mismo patrón que
   `vector-field/*` y `useFieldStore.js`.
4. Si el módulo necesita nuevos tipos de datos simulados, agregar un archivo en `mock/`.

Ningún archivo de `layouts/`, `router/` (salvo la línea de la ruta), o
`components/ui/` necesita tocarse.

## 5. Flujo de datos del módulo de Campos Vectoriales

```
FieldForm (input del usuario)
   → useFieldStore (Zustand: p, q, config)
      → useVectorFieldGrid (hook: valida + debounce + llama al servicio)
         → vectorFieldService.fetchVectorField (Promise simulada)
            → mathParser.evaluateAt (math.js, con caché de compilación)
      ← vectors[] (grilla calculada)
      → useFieldAnalysis (hook: mismo debounce, corre en paralelo)
         → analyzeField → classifyField → interpretField (domain/field-analysis)
      ← { analysis, classification, interpretation }
   → FieldCanvas (dibuja ejes, flechas y partículas)
   → AnalysisCard / PropertiesPanel / InterpretationCard (renderizan el análisis)
   → FieldToolbar → exportService.exportFieldToPdf → PdfReportGenerator (jsPDF, 3 páginas)
   → useHistoryStore.addEntry → historyService.saveHistoryEntry (LocalStorage)
```

## 6. Límites conocidos de este MVP

- El historial no tiene paginación (aceptable para uso local en un navegador).
- La densidad de vectores está acotada a 5–40 por eje para mantener el render fluido.
- No hay autenticación ni sincronización entre dispositivos — está fuera de
  alcance de este MVP y llegará junto con la API real.

## 7. Motor de análisis de campos (`domain/field-analysis/`)

Vive completamente fuera de React — son módulos `.js` puros que reciben
strings y números, y devuelven strings y números. Esto es deliberado: se
puede probar con `node --check`/tests unitarios sin levantar ningún
componente, y un futuro laboratorio de Divergencia o Rotacional puede
reutilizar `vectorCalculus.js` sin arrastrar ninguna dependencia de UI.

```
vectorCalculus.js     Derivadas parciales, jacobiano, divergencia y rotacional puntuales
                        (diferencias centradas, reutiliza mathParser.evaluateAt)
FieldAnalyzer.js       analyzeField({p,q,domain}) → estadísticas: divergencia/rotacional
                        (promedio y en el origen), magnitud min/max/prom., dirección
                        predominante, tipo de flujo, comportamiento cerca del origen
FieldClassifier.js     classifyField({p,q,analysis}) → clasifica usando el plano
                        traza-determinante del jacobiano (método estándar de sistemas
                        dinámicos). Catálogo CERRADO (fieldTypes.constants.js): si nada
                        calza con claridad, devuelve "personalizado" — nunca inventa
                        una categoría nueva
FieldInterpreter.js    interpretField({classification,analysis}) → traduce los números
                        a frases en lenguaje simple para el estudiante
```

Flujo end-to-end:

```
useFieldAnalysis (hook, debounce 250ms sobre p/q/domain)
   → analyzeField()      (FieldAnalyzer)
   → classifyField()     (FieldClassifier, usa analysis.jacobianAtOrigin)
   → interpretField()    (FieldInterpreter)
  ← { analysis, classification, interpretation }
   → AnalysisCard / PropertiesPanel / InterpretationCard (solo renderizan, no calculan)
```

El contenido educativo por tipo de campo (nombre, explicación, propiedades,
aplicaciones, nivel de dificultad, conceptos relacionados) vive aparte, en
`content/educational/fieldEducationalContent.js` — los componentes solo lo
leen, ningún texto educativo está escrito dentro de un `.jsx`.

Para agregar un tipo de campo nuevo al clasificador: (1) agregar la clave en
`fieldTypes.constants.js`, (2) agregar su condición en `FieldClassifier.js`,
(3) agregar su entrada en `fieldEducationalContent.js`, (4) agregar su caso en
`FieldInterpreter.js`. Ningún otro archivo se toca.

## 8. Sistema de ayuda (`components/help/` + `content/help/`)

`HelpDrawer`, `HelpSection`, `HelpCard` y `HelpExample` son genéricos: no
importan nada de `domain/field-analysis` ni saben qué es una divergencia.
Reciben su contenido como datos, con la forma que define
`content/help/vectorFieldHelpContent.js`. El estado de apertura
(`helpOpen`, `helpActiveSectionId`) vive en `useUIStore` porque es UI
transversal, no algo propio del laboratorio de campos vectoriales.

Para que un laboratorio futuro tenga su propio panel de ayuda:

1. Crear `content/help/<laboratorio>HelpContent.js` con la misma forma
   (`labTitle`, `sections[]` con `id/title/paragraphs` y opcionalmente
   `items`/`examples`).
2. Montar `<HelpDrawer content={ese contenido} />` en la página del laboratorio.
3. Usar `<HelpIconButton sectionId="..." />` en los headers de sus tarjetas.

No hace falta tocar `HelpDrawer.jsx` ni ningún componente de `help/`.

## 9. Generador de reportes PDF (`services/pdf/`)

```
pdfDrawHelpers.js       Primitivas de dibujo reutilizables: logo, barra de encabezado,
                          pie de página, títulos de sección, grillas clave/valor, párrafos
                          con salto de línea automático, listas con viñetas
PdfReportGenerator.js    Orquesta el reporte de 3 páginas:
                            1. Portada (logo, título, fecha, hora, versión, laboratorio)
                            2. Datos técnicos (funciones, configuración, imagen del campo)
                            3. Análisis matemático y educativo (clasificación, propiedades,
                               interpretación, explicación educativa, aplicaciones, observaciones)
```

`exportService.js` sigue siendo el único punto de entrada público
(`exportFieldToPdf`), para no romper el import que ya usa `VectorFieldPage.jsx`
— internamente delega en `PdfReportGenerator`. Si el análisis aún no está
disponible (p. ej. la expresión no es válida en el momento de exportar), el
reporte se genera igual pero la página 3 muestra un aviso en vez de datos
vacíos o inventados.

Un laboratorio futuro con su propio tipo de reporte puede reutilizar
`pdfDrawHelpers.js` en un `PdfReportGenerator.js` propio, en vez de
reimplementar el dibujo de portadas y encabezados desde cero.
