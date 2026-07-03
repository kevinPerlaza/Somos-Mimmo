# Mimmo · Sitio web de servicio de aseo

Sitio web para la empresa de aseo **Mimmo**, con un panel de administración visual
para gestionar todo el contenido sin tocar código.

**Demo en vivo:** https://mimmo-be3g.onrender.com

## Secciones del sitio

- **Inicio** (hero + carrusel de imágenes/videos)
- **Servicios**
- **Planes y precios**
- **Cotizador instantáneo** (con cupones de descuento)
- **Antes y después** (comparador deslizable)
- **Quiénes somos**
- **Testimonios**
- **Clientes** (logos)
- **Galería de video** (lightbox con paginación)
- **Blog / tips de limpieza**
- **Agendar cita** (reserva con calendario)
- **FAQ** (con datos estructurados para SEO)
- **Contacto** (formulario + mapa + redes sociales flotantes)

## Funciones clave

- **6 temas visuales** intercambiables desde el panel:
  - `Classic` — verde profesional.
  - `Fresh` — colores vivos, formas orgánicas.
  - `Glass` — glassmorphism, blobs animados, efecto cristal.
  - `Neo` — neobrutalism suave, bordes gruesos, sombras duras.
  - `Chile` — Fiestas Patrias (rojo, blanco, azul + confeti).
  - `Navidad` — Navidad y Año Nuevo (rojo, dorado, nieve animada).
- **Modo claro / oscuro** (lo elige el visitante).
- **Selector de idioma ES / EN**.
- **Colores de marca personalizables** y **cambio de logo** con tamaños por zona.
- **Carrusel** con imágenes y videos, reordenar arrastrando, zoom por elemento.
- **Cotizador** con tipos de espacio, extras, frecuencia y **cupones de descuento**.
- **Formulario de cotización** que envía por **correo SMTP** y/o **WhatsApp**.
- **Agendamiento de citas** con calendario (evita dobles reservas).
- **Web Push Notifications** para el admin (funciona con la pestaña cerrada).
- **Redes sociales flotantes** (WhatsApp, Instagram, Facebook, X) configurables.
- **Multiusuario con roles** (propietario / editor) y **registro de cambios**.
- **SEO**: robots.txt, sitemap.xml, datos estructurados LocalBusiness y FAQPage.
- **Responsive** completo (6 breakpoints, colapso en móvil con "ver más").

## Panel de administración (`/admin`)

Acceso protegido por token de URL + usuario/contraseña.
Usuario inicial: `admin` / contraseña de `ADMIN_PASSWORD` (por defecto `mimmo2026`).

| Sección | Qué puedes hacer |
|---|---|
| Resumen | Citas próximas, actividad reciente y contadores |
| Diseño | Tema, colores de marca, logo y tamaños |
| Carrusel | Subir imágenes/videos, reordenar, zoom/ajuste |
| Animaciones | Decoraciones flotantes, efectos scroll |
| Textos y servicios | Hero, "quiénes somos", servicios, versiones EN |
| Planes | Paquetes con precio y características |
| Cotizador | Tipos de espacio, extras, precios, frecuencias |
| Citas | Disponibilidad y gestión de reservas |
| Descuentos | Cupones con fecha, límite de usos, activar/desactivar |
| Correo | Credenciales SMTP + contenido del mensaje |
| Usuarios | Crear usuarios, roles, contraseñas |
| Registro | Historial de acciones del panel |

## Requisitos

- Node.js 18+ (probado con Node 24).

## Ejecutar en local

```bash
npm install
npm start
```

- Sitio: http://localhost:3000
- Panel: http://localhost:3000/admin

## Variables de entorno (producción)

Crea un `.env` basado en `.env.example`:

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `NODE_ENV` | Sí | `production` para activar cookies seguras y minificación |
| `ADMIN_PASSWORD` | Sí | Contraseña del usuario admin inicial |
| `SESSION_SECRET` | Sí | Cadena larga aleatoria (firma las sesiones) |
| `ADMIN_PATH_TOKEN` | Sí | Token para acceder a /admin (sin él, devuelve 404) |
| `PORT` | No | Puerto del servidor (Render lo asigna automáticamente) |

## Publicar en Render

1. Push a GitHub
2. Render → New Web Service → Connect repo
3. Build command: `npm install && npm run build`
4. Start command: `node server.js`
5. Variables de entorno: las de arriba
6. Listo: te da URL tipo `mimmo.onrender.com`

**Nota:** El plan gratuito de Render usa disco efímero (la DB se resetea en cada deploy).
Para persistencia, usa un Render Disk montado en `/data`.

## Estructura

```
server.js              Servidor Express + API protegida + seguridad
lib/db.js              Base de datos SQLite (WAL mode, migración automática desde JSON)
lib/content.js         Defaults del contenido
data/
  mimmo.db             Base de datos SQLite con todo el contenido editable
  sessions.db          Sesiones persistentes
public/
  index.html           Sitio público
  app.js               Lógica del sitio
  styles.css           Estilos base
  themes.css           6 temas visuales
  i18n.js              Traducciones ES/EN
  sw-push.js           Service Worker para push notifications
  admin.html/js/css    Panel de administración
  uploads/             Imágenes y videos subidos
  assets/logo.png      Logo por defecto
scripts/
  build.js             Minificación (terser + clean-css) → dist/
  seed.js              Carga inicial de demo
  extract-colors.js    Extrae paleta del logo
```

## Seguridad

- **CSP activa**: Content Security Policy que solo permite CDNs necesarios (Google Fonts, Swiper).
- **Protección CSRF**: verificación de origen en todas las rutas API mutantes.
- **Sesiones persistentes**: SQLite store (no MemoryStore).
- **Helmet**: cabeceras de seguridad completas.
- **Rate limiting**: login (10 intentos/15min), formularios públicos (20/10min).
- **ADMIN_PATH_TOKEN obligatorio** en producción: /admin devuelve 404 sin token válido.
- **Subidas seguras**: SVG bloqueado, imágenes máx 15MB, videos máx 150MB.
- **Sanitización de mapEmbed**: solo acepta iframes de Google Maps.
- **Contraseñas**: bcrypt hash, mínimo 8 caracteres.
- **Cookie segura**: httpOnly, sameSite=lax, secure en producción.
- **La API pública nunca expone** usuarios, contraseñas SMTP, VAPID keys ni registro de cambios.
