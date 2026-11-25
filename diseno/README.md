# Sistema de diseño de 9SM NEXO

Sistema visual de la web pública (`index.html`) y del panel del barbero
(`panel-barbero.html`), basado en las Human Interface Guidelines de Apple
(developer.apple.com/design/human-interface-guidelines, leídas el
19-11-2026). La web se ve como apple.com y el panel como una app de iOS o
macOS. La marca 9SM queda en el logo y las fotos.

## Qué hay en esta carpeta

| Archivo | Qué es | ¿Va a producción? |
|---|---|---|
| `tokens.css` | Colores semánticos claro/oscuro, tipografía (escala Dynamic Type), espaciado, radios, materiales, sombras, movimiento y la base de accesibilidad | Sí |
| `componentes.css` | Componentes: botones, campos, listas, sheets, alertas, tab bar, sidebar, agenda, etc. | Sí |
| `iconos.svg` | Glifos de interfaz (sprite SVG) | Sí, pegado al inicio de cada `<body>` |
| `sistema.html` | Documentación visual del sistema y de cada componente | No |
| `web.html` | Maquetas de todas las pantallas y estados de la web | No (referencia) |
| `panel.html` | Maquetas de todas las pantallas y estados del panel | No (referencia) |
| `pantallas.md` | Nombres e ids exactos de cada pantalla, para `pruebas/flujos.md` | No |
| `maqueta.css`, `maqueta.js` | Visor de las maquetas (marcos de móvil y escritorio, botones Claro/Oscuro) | No |
| `assets/` | Copias reducidas de fotos y video solo para las maquetas | No (producción usa `/assets`) |

Las maquetas se abren en el navegador. Cada pantalla tiene un ancla
(`web.html#web-inicio`) y una vista suelta (`web.html#solo-web-inicio`).

## Cómo se usa en los dos HTML

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=swap">
<link rel="stylesheet" href="diseno/tokens.css">
<link rel="stylesheet" href="diseno/componentes.css">
…
<body>
  <!-- contenido de iconos.svg -->
  <div class="app">            <!-- web -->
  <div class="app app--grouped"> <!-- panel -->
```

- Todo el contenido va dentro de `.app`. Los componentes cambian con
  media queries de ancho (HIG › Layout › Size classes): compact < 734 px,
  regular ≥ 734 px, wide ≥ 1068 px. No uso container queries: un contenedor
  con `container-type` se vuelve el bloque contenedor de los elementos
  `position: fixed`, y la tab bar, las sheets y las alertas dejarían de
  anclarse a la pantalla. Por eso el visor pinta cada marco en un iframe del
  ancho del dispositivo.
- Se retiran Playfair Display, la carga de Inter 300 y el `:root` actual de
  cada archivo. Ningún color, tamaño o radio se escribe a mano: siempre un
  token.
- La marcación de cada pantalla está en `web.html` y `panel.html`, dentro de
  `<template data-shot="…">`. Las piezas repetidas (`<x-part>`) son solo del
  visor: en producción se escriben en su sitio.

## Decisiones

| Decisión | Por qué (HIG) |
|---|---|
| **Acento grafito**: #1D1D1F en claro, #F5F5F7 en oscuro (elegido por 9SM) | Color › Liquid Glass color: «If your app features colorful backgrounds or visually rich content, prefer a monochromatic appearance». Branding: «Apply your app's accent color judiciously». Las fotos son muy coloridas y el logo es negro. |
| **Apariencia según el sistema**; se quitan el engranaje y la opción de tema del menú (elegido por 9SM) | Dark Mode: «Avoid offering an app-specific appearance setting». |
| **Hero con el logo de 9SM** grande y flotando suave (sube 10 px y vuelve, 6 s, `ease-in-out`), sin video ni 3D; sigue la apariencia del sistema y queda quieto con Reducir movimiento (elegido por 9SM) | Branding: «Ensure branding always defers to content». Motion: «Make motion optional»; Accessibility › Cognitive: con Reducir movimiento, sin desplazamientos. |
| **Una sola familia**: SF Pro (`-apple-system`) con Inter de respaldo | Typography: «Minimize the number of typefaces». SF Pro no puede servirse como webfont fuera de equipos Apple; Inter cubre Android y Windows. |
| **Escala Dynamic Type en rem** (1 rem = 17 pt; en iPhone y iPad sigue el tamaño de texto del sistema con `font: -apple-system-body`) | Typography › Supporting Dynamic Type; Accessibility › Vision: «Support larger text sizes». |
| **Colores de estado partiendo de los valores de alto contraste** de la HIG, oscurecidos (claro) o aclarados (oscuro) lo justo para pasar 4,5:1 donde se usan: sobre blanco, #F2F2F7 y su propio relleno translúcido | Accessibility › Vision: contraste mínimo 4,5:1. Los valores por defecto (#0088FF, #FF383C…) no llegan ni sobre blanco. |
| **Iconos propios** con el estilo de SF Symbols | La licencia de SF Symbols limita su uso a plataformas Apple; la mayoría de clientes reserva desde Android. Icons: trazo y peso consistentes. |
| **Se retiran** la cinta animada «9SM NEXO · BARBERÍA…», los números de sección y los iconos de cada servicio | Branding: «Ensure branding always defers to content». Accessibility › Cognitive: evitar animación repetitiva. |
| **Horas en formato de Colombia**: «3:15 p. m.» (hoy «3:15 PM») | Writing: lenguaje consistente y para todos. `toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })`. |
| **Liquid Glass aproximado** con `backdrop-filter` solo en barras y controles que flotan | Materials: «Don't use Liquid Glass in the content layer». |

## Tokens (resumen; el detalle con valores está en `tokens.css` y `sistema.html`)

- **Color** (HIG › Color, Dark Mode): `--bg`, `--bg-secondary`, `--bg-grouped*`,
  `--bg-elevated*`, `--label` a `--label-quaternary`, `--placeholder`,
  `--separator*`, `--fill*`, `--accent`, `--on-accent`, `--accent-tint`,
  `--focus`, `--red/orange/green/blue/yellow…` con sus `*-fill`,
  `--barber-1…3`. Cada uno con variante oscura y de más contraste
  (`prefers-contrast: more`).
- **Tipografía** (Typography › Specifications): `--text-large-title` a
  `--text-caption-2` con su `--leading-*`; `--text-display-1/2` y
  `--text-lead` para la web; `--leading-loose` para párrafos.
- **Espaciado** (Layout; Accessibility › Mobility): `--space-1` (4 px) a
  `--space-30` (120 px); márgenes `--margin-compact/regular/wide`; safe areas
  `--safe-*`; `--target-min: 44px`.
- **Radios** (Toolbars: radios concéntricos): `--radius-xs` 6 a
  `--radius-xl` 28 y `--radius-capsule`.
- **Materiales y sombras** (Materials): `--material-ultrathin` a `--thick`,
  `--glass-*`, `--material-blur`, `--dim`, `--shadow-*`. Con
  `prefers-reduced-transparency` se vuelven opacos.
- **Movimiento** (Motion; Accessibility › Cognitive): `--dur-*`, `--ease-*`,
  `--enter-offset`, `--press-scale`. Con `prefers-reduced-motion` no hay
  desplazamientos, solo fundidos.

## Componentes y su base en la HIG

| Componente | Clases | Regla clave |
|---|---|---|
| Botón | `.btn` + `--filled` `--tinted` `--gray` `--plain` `--destructive` `--glass` `--on-media`; `--small` `--large` `--block`; `.is-loading` | Buttons: una acción prominente por vista, estado presionado, 44 × 44, indicador dentro si tarda, destructivo nunca primario. |
| Botón de icono | `.icon-btn`, `.count-badge` | Toolbars: símbolos sin borde; siempre `aria-label`. |
| Campo | `.field`, `.field__control`, `.field__input/select/textarea`, `.field__hint`, `.field__error`, `.field--error`, `.field__clear` | Text fields: etiqueta visible, teclado correcto, error junto al campo, botón de borrar. |
| Lista agrupada | `.list`, `.row` (+ `__icon` `__main` `__title` `__subtitle` `__detail` `__chevron` `__check`), `.list-header`, `.list-footer` | Lists and tables: estilo agrupado, marca de verificación en opciones, filas de 44 pt mínimo que se apilan con texto grande. |
| Tabla | `.table-wrap`, `.table` | Lists and tables › macOS: encabezados descriptivos. En compact se muestra como lista. |
| Segmentado | `.segmented`, `.segmented__item` | Segmented controls: subvistas muy relacionadas, ≤ 5 en iPhone. |
| Fichas y horas | `.chip`, `.choice`, `.slot`, `.day`, `.star` | Toggles › iOS: botón que se comporta como interruptor; el estado no depende solo del color. |
| Interruptor | `.switch` (checkbox con `role="switch"`) | Toggles: solo dentro de filas de lista. |
| Insignia | `.badge--pending/done/cancelled/blocked/confirmed` | Color › Inclusive color: siempre icono + texto. |
| Aviso | `.notice--error/warning/success/info`, `.status-inline` | Feedback: estado integrado junto a lo que describe. |
| Vacío | `.empty` | Writing: «Provide clear next steps on any blank screens». |
| Carga | `.spinner`, `.skeleton`, `.loading-block` | Loading: «Show something as soon as possible»; texto concreto, no solo «Cargando». |
| Sheet | `.scrim`, `.sheet` (+ `--full` `--grouped`), `__grabber` `__bar` `__title` `__body` `__footer`; `.steps` | Sheets, Modality: una a la vez; Cancelar a la izquierda, Listo a la derecha; flecha atrás en pasos; se cierra con botón, Esc y deslizando. En pantallas anchas es una form sheet centrada. |
| Alerta | `.alert`, `.alert__actions` | Alerts: solo para lo crítico o irreversible; botones que dicen el resultado; salida segura siempre. |
| Hoja de acción | `.action-sheet` | Action sheets: opciones ligadas a una acción que la persona inició. |
| Popover | `.popover` | Avisos del panel en escritorio; en compact, sheet. |
| Navegación web | `.navbar`, `.menu-sheet`, `.float-cta` | Materials: vidrio en la capa de controles. |
| Navegación panel | `.shell`, `.sidebar`, `.tabbar`, `.toolbar`, `.page-head` | Las secciones del panel actual. Sidebars (≤ 2 niveles); Toolbars (título grande); tab bar flotante en vidrio. |
| Agenda | `.appt`, `.summary-bar`, `.month`, `.mday`, `.legend` | Color: el color del barbero va siempre con su nombre o iniciales. |
| Cifras y gráfico | `.stat`, `.stats`, `.bars` | Charts: `role="img"` con descripción. |
| Web | `.hero-brand` (en el `<style>` de `index.html`), `.about`, `.service`, `.gallery`, `.contact`, `.booking-cta`, `.footer` | Layout: jerarquía de arriba abajo; Accessibility › Cognitive: el logo del hero se detiene con Reducir movimiento. |

## Cambios de comportamiento que traen las maquetas

Las maquetas no añaden funciones nuevas. Estos cambios son de presentación y
los dos hilos de implementación deben aplicarlos:

**Web**
1. Sin interruptor de tema: la apariencia sigue al sistema.
2. Hero: el logo de 9SM flotando en lugar del video o del 3D; con Reducir movimiento, quieto.
3. Paso 2: si el día no tiene horas, botón al siguiente día con horas.
4. Si la hora se ocupó al confirmar, aviso arriba del paso 2 (hoy el mensaje
   sale en el paso 3).
5. Errores de datos junto a cada campo, no en un párrafo al final.
6. Éxito: «Listo» cierra; «Reservar otra cita» empieza de nuevo sin recargar
   la página.
7. Mis citas: cancelar pide confirmación en una alerta (hoy es en línea);
   el estado vacío ofrece «Reservar cita».
8. Se retiran las reseñas (formulario por QR y estrellas de los barberos),
   por decisión de 9SM.

**Panel**

El panel conserva las mismas secciones, grupos, nombres, campos y botones del
panel actual. Solo cambia el aspecto:

- Sidebar en el computador: Agenda (Calendario, Hoy, Esta semana, Todas las
  citas, Nueva cita), Mi trabajo (Mi horario, Bloquear espacios, Balance)
  y Administración (Clientes, Inventario, Personalizar web).
- Barra inferior en el teléfono: Agenda, Hoy, Nueva cita, Balance y Más, con
  la hoja «Más» de siempre. La HIG pide no poner acciones en la tab bar
  («Nueva cita» lo es), pero se mantiene porque es una sección del panel
  actual y los barberos ya la usan así.
- Cada cita conserva sus acciones: Recordar, Completar y Cancelar si está
  pendiente; Registrar pago si se completó sin método; Avisar si se canceló.
- Se retira la sección Reseñas y sus códigos QR, por decisión de 9SM.
- Lo único nuevo en el panel es la confirmación al cancelar una cita
  (alerta, HIG › Alerts), porque no se puede deshacer. El resto de ventanas
  (método de pago, citas del día, eliminar producto) ya existen y solo
  cambian de aspecto.

## Accesibilidad: lo que se verifica

- Contraste AA en claro y oscuro (4,5:1 texto; 3:1 texto grande y controles).
- Objetivos táctiles de 44 × 44 como mínimo.
- Foco visible con teclado (`:focus-visible`, anillo azul de 3 px).
- Nada comunicado solo con color.
- Texto que crece sin cortarse (filas que se apilan).
- `prefers-reduced-motion`, `prefers-contrast`, `prefers-reduced-transparency`.
- HTML semántico: `button`, `a`, `label`, `input`; `aria-label` en botones de
  solo icono; `role="radiogroup"` en grupos de opciones; diálogos con
  `aria-modal`.

## Límites conocidos

- SF Pro solo se ve en equipos Apple; en Android se ve Inter.
- El vidrio (Liquid Glass) es una aproximación con `backdrop-filter`; en
  navegadores sin soporte se ve el fondo semitransparente.

## Páginas de la HIG consultadas

Design principles; Foundations: Color, Dark Mode, Typography, Layout,
Materials, Accessibility, Motion, Icons, Branding, Images, Inclusion, Writing,
Privacy; Patterns: Launching, Onboarding, Loading, Feedback, Entering data,
Managing accounts, Modality, Searching; Components: Tab bars, Sidebars,
Toolbars, Lists and tables, Collections, Buttons, Text fields, Sheets,
Alerts, Action sheets, Popovers, Segmented controls, Toggles, Pickers, Menus,
Progress indicators, Labels, Scroll views, Split views, Charts; Designing for
iOS y Designing for macOS.
