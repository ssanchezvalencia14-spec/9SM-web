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

| Código | id | Pantalla |
|---|---|---|
| P01 | `panel-login` | Entrar |
| P02 | `panel-login-error` | Entrar · Datos incorrectos |
| P03 | `panel-login-entrando` | Entrar · Entrando |
| P04 | `panel-agenda-hoy` | Agenda · Hoy (barbero) |
| P05 | `panel-agenda-semana` | Agenda · Semana (administrador, todo el local) |
| P06 | `panel-agenda-mes` | Agenda · Mes (administrador) |
| P07 | `panel-agenda-dia` | Agenda · Detalle de un día |
| P08 | `panel-agenda-vacia` | Agenda · Sin citas |
| P09 | `panel-agenda-cargando` | Agenda · Cargando |
| P10 | `panel-agenda-todas` | Agenda · Todas las citas |
| P11 | `panel-cita` | Cita · Detalle |
| P12 | `panel-cita-pago` | Cita · ¿Cómo pagó? |
| P13 | `panel-cita-cancelar` | Cita · Confirmar cancelación |
| P14 | `panel-avisos` | Avisos |
| P15 | `panel-avisos-vacio` | Avisos · Sin avisos |
| P16 | `panel-nueva-cita` | Nueva cita |
| P17 | `panel-nueva-cita-error` | Nueva cita · No cabe o faltan datos |
| P18 | `panel-nueva-cita-ok` | Nueva cita · Agendada |
| P19 | `panel-horario` | Horario · Jornada y servicios (barbero) |
| P20 | `panel-horario-admin` | Horario · Administrador (precios por barbero y propuestas) |
| P21 | `panel-horario-error` | Horario · Error al guardar |
| P22 | `panel-bloquear` | Horario · Bloquear turnos |
| P23 | `panel-balance` | Balance (administrador) |
| P24 | `panel-balance-vacio` | Balance · Sin datos en el período |
| P25 | `panel-resenas` | Reseñas y código QR |
| P26 | `panel-resenas-vacio` | Reseñas · Sin reseñas y QR no disponible |
| P27 | `panel-clientes` | Clientes |
| P28 | `panel-inventario` | Inventario |
| P29 | `panel-inventario-eliminar` | Inventario · Confirmar eliminación |
| P30 | `panel-web` | Personalizar web |
| P31 | `panel-mas` | Más (móvil) |

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
| `setTab('calendario' / 'hoy' / 'semana' / 'todas')`, `#dayModalOverlay`, `#resumenBar`, `#agendaScopeWrap` | P04–P10 |
| `apptCardHtml`, `openPayModal`, `updateStatus` | P11–P13 |
| `#notifPanel` | P14–P15 |
| `setTab('nuevacita')` | P16–P18 |
| `setTab('horario')` (incluye precios por barbero solo admin) | P19–P21 |
| `setTab('bloquear')` | P22 |
| `setTab('balance')` | P23–P24 |
| `setTab('resenas')` | P25–P26 |
| `setTab('clientes')` | P27 |
| `setTab('inventario')` | P28–P29 |
| `setTab('web')` | P30 |
| `#mbnMoreSheet` | P31 |
