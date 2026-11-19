# Pantallas del diseño

Lista oficial de pantallas y estados del diseño aprobado. La matriz de flujos
(`pruebas/flujos.md`) referencia cada pantalla por su **id**: es el mismo
ancla de la maqueta (`web.html#web-inicio`, `panel.html#panel-agenda-hoy`) y
se abre sola con `#solo-<id>` (por ejemplo `panel.html#solo-panel-cita-pago`).

El código (W01, P01…) es solo para ordenar; el **id** es lo que no cambia.

## Web pública (`web.html`)

| Código | id | Pantalla |
|---|---|---|
| W01 | `web-inicio` | Inicio |
| W02 | `web-menu` | Menú (móvil) |
| W03 | `web-reservar-1-vacio` | Reservar · Paso 1 · Sin barbero elegido |
| W04 | `web-reservar-1` | Reservar · Paso 1 · Barbero y servicio elegidos |
| W05 | `web-reservar-1-sin-servicios` | Reservar · Paso 1 · Barbero sin servicios |
| W06 | `web-reservar-2-cargando` | Reservar · Paso 2 · Cargando agenda |
| W07 | `web-reservar-2` | Reservar · Paso 2 · Día y hora elegidos |
| W08 | `web-reservar-2-sin-horas` | Reservar · Paso 2 · Día sin horas libres |
| W09 | `web-reservar-2-error` | Reservar · Paso 2 · Error al cargar la agenda |
| W10 | `web-reservar-2-hora-ocupada` | Reservar · Paso 2 · La hora se acaba de ocupar |
| W11 | `web-reservar-3` | Reservar · Paso 3 · Confirmar (cliente nuevo) |
| W12 | `web-reservar-3-recurrente` | Reservar · Paso 3 · Cita que se repite y cliente conocido |
| W13 | `web-reservar-3-datos-incompletos` | Reservar · Paso 3 · Datos incompletos |
| W14 | `web-reservar-3-guardando` | Reservar · Paso 3 · Guardando |
| W15 | `web-reservar-3-error` | Reservar · Paso 3 · Error al guardar |
| W16 | `web-reserva-confirmada` | Reserva confirmada |
| W17 | `web-reserva-confirmada-serie` | Reserva confirmada · Cita que se repite |
| W18 | `web-mis-citas-buscar` | Mis citas · Buscar por número |
| W19 | `web-mis-citas-buscar-error` | Mis citas · Número vacío |
| W20 | `web-mis-citas-cargando` | Mis citas · Buscando |
| W21 | `web-mis-citas` | Mis citas · Próxima cita |
| W22 | `web-mis-citas-confirmar-cancelar` | Mis citas · Confirmar cancelación |
| W23 | `web-mis-citas-cancelando` | Mis citas · Cancelando |
| W24 | `web-mis-citas-error-cancelar` | Mis citas · No se pudo cancelar |
| W25 | `web-mis-citas-ultima-hora` | Mis citas · Falta menos de 1 hora |
| W26 | `web-mis-citas-cancelada` | Mis citas · Cita cancelada |
| W27 | `web-mis-citas-vacio` | Mis citas · Sin citas próximas |
| W28 | `web-resena` | Reseña · Sin puntuar |
| W29 | `web-resena-lista` | Reseña · Lista para enviar |
| W30 | `web-resena-enviando` | Reseña · Enviando |
| W31 | `web-resena-error` | Reseña · No se pudo enviar |
| W32 | `web-resena-gracias` | Reseña · Gracias |

## Panel del barbero (`panel.html`)

Mismas secciones y nombres que el panel actual. Sidebar: Agenda (Calendario,
Hoy, Esta semana, Todas las citas, Nueva cita), Mi trabajo (Mi horario,
Bloquear espacios, Balance, Reseñas) y Administración (Clientes, Inventario,
Personalizar web). Barra inferior del teléfono: Agenda, Hoy, Nueva cita,
Balance y Más.

| Código | id | Pantalla |
|---|---|---|
| P01 | `panel-login` | Entrar |
| P02 | `panel-login-error` | Entrar · Datos incorrectos |
| P03 | `panel-login-entrando` | Entrar · Entrando |
| P04 | `panel-calendario` | Calendario (administrador) |
| P05 | `panel-calendario-dia` | Calendario · Citas del día |
| P06 | `panel-hoy` | Hoy (barbero) |
| P07 | `panel-hoy-vacio` | Hoy · Sin citas |
| P08 | `panel-hoy-cargando` | Hoy · Cargando citas |
| P09 | `panel-semana` | Esta semana (administrador) |
| P10 | `panel-todas` | Todas las citas |
| P11 | `panel-cita-pago` | Completar cita · ¿Cómo pagó el cliente? |
| P12 | `panel-cita-cancelar` | Cancelar cita · Confirmación |
| P13 | `panel-avisos` | Avisos |
| P14 | `panel-avisos-vacio` | Avisos · Sin avisos |
| P15 | `panel-nueva-cita` | Nueva cita |
| P16 | `panel-nueva-cita-error` | Nueva cita · No cabe o faltan datos |
| P17 | `panel-nueva-cita-ok` | Nueva cita · Agendada |
| P18 | `panel-horario` | Mi horario (barbero) |
| P19 | `panel-horario-admin` | Mi horario · Administrador (precios por barbero y propuestas) |
| P20 | `panel-horario-error` | Mi horario · Error al guardar |
| P21 | `panel-bloquear` | Bloquear espacios |
| P22 | `panel-balance` | Balance (administrador) |
| P23 | `panel-balance-vacio` | Balance · Sin datos |
| P24 | `panel-resenas` | Reseñas |
| P25 | `panel-resenas-vacio` | Reseñas · Sin reseñas y QR no disponible |
| P26 | `panel-clientes` | Clientes |
| P27 | `panel-inventario` | Inventario |
| P28 | `panel-inventario-eliminar` | Inventario · Confirmar eliminación |
| P29 | `panel-web` | Personalizar web |
| P30 | `panel-mas` | Más (móvil) |

## Correspondencia con lo que existe hoy

| Hoy en el código | Pantallas nuevas |
|---|---|
| `index.html` · hero, `#nosotros`, `#servicios`, `#galeria`, `#contacto`, footer | W01 |
| `#mobileMenu` | W02 |
| `#bookingOverlay` · `#bview-1` | W03–W05 |
| `#bookingOverlay` · `#bview-2` (`#slotsContent`) | W06–W10 |
| `#bookingOverlay` · `#bview-3` (`#bConfirmForm`) | W11–W15 |
| `#bookingOverlay` · `#bSuccess` | W16–W17 |
| `#myCitasOverlay` (`mcPhoneForm`, `mcLoading`, `mcCard`, `mcDone`, `mcEmpty`; `mcSetActions`) | W18–W27 |
| `#resenaOverlay` (`resForm`, `resOk`) | W28–W32 |
| Engranaje `.settings-wrap` y opción de tema del menú | Se retiran: la apariencia sigue al sistema |
| `panel-barbero.html` · `#loginScreen` | P01–P03 |
| `setTab('calendario')`, `#dayModalOverlay` | P04–P05 |
| `setTab('hoy')`, `#resumenBar` | P06–P08 |
| `setTab('semana')`, `#agendaScopeWrap` | P09 |
| `setTab('todas')` | P10 |
| `openPayModal`, `updateStatus` | P11–P12 |
| `#notifPanel` | P13–P14 |
| `setTab('nuevacita')` | P15–P17 |
| `setTab('horario')` (con precios por barbero solo admin) | P18–P20 |
| `setTab('bloquear')` | P21 |
| `setTab('balance')` | P22–P23 |
| `setTab('resenas')` | P24–P25 |
| `setTab('clientes')` | P26 |
| `setTab('inventario')` | P27–P28 |
| `setTab('web')` | P29 |
| `#mbnMoreSheet` | P30 |
