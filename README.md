# Mimmo · Sitio web de servicio de aseo

Sitio web para la empresa de aseo **Mimmo**, con un panel de administracion visual
para gestionar todo el contenido sin tocar codigo, incluso despues de publicarlo.

## Secciones del sitio

- **Inicio** (hero + carrusel)
- **Servicios**
- **Planes y precios**
- **Antes y despues** (comparador deslizable)
- **Quienes somos**
- **Testimonios / resenas**
- **Clientes** (logos)
- **Galeria de video**
- **Blog / tips de limpieza** (con vista de lectura)
- **Contacto** (formulario + mapa de Google + WhatsApp flotante)

## Funciones clave

- **3 disenos intercambiables** desde el panel (para elegir antes de produccion):
  - `Classic` — verde profesional (basado en el logo).
  - `Apple` — minimalista inspirado en el ecosistema iPhone (tipografia grande, mucho espacio).
  - `Aurora` — moderno con gradientes y efecto vidrio.
- **Modo claro / oscuro** (boton en la barra superior, lo elige el visitante).
- **Selector de idioma ES / EN** para la interfaz; el contenido principal (hero y
  "quienes somos") admite version en ingles editable desde el panel.
- **Colores de marca personalizables** y **cambio de logo** desde el panel.
- **Carrusel** con reordenar arrastrando, titulo, ajuste y zoom por imagen.
- **Formulario de cotizacion** que envia por **correo (SMTP/Nodemailer)** y/o **WhatsApp**.
- **Multiusuario con roles** (propietario / editor) y **registro de cambios** (auditoria).
- **Agendamiento de citas** con calendario: el visitante elige fecha y horario disponible;
  evita dobles reservas y notifica por correo/WhatsApp. La disponibilidad (dias, horario,
  duracion) se configura desde el panel.

## Panel de administracion (`/admin`)

Acceso con usuario y contrasena. Usuario inicial: `admin` / contrasena de `ADMIN_PASSWORD`
(por defecto `mimmo2026`). Secciones:

| Seccion | Que puedes hacer |
|---|---|
| Resumen | Vista rapida: citas proximas, actividad reciente y contadores del sitio |
| Diseno | Elegir tema, colores de marca y logo |
| Carrusel | Subir, reordenar, redimensionar (zoom/ajuste) y borrar imagenes |
| Textos y servicios | Editar hero, "quienes somos", servicios (reordenables) y versiones EN |
| Planes | Crear/editar paquetes con precio y caracteristicas |
| Antes y despues | Subir pares de fotos antes/despues |
| Testimonios | Resenas con foto, rol y calificacion |
| Clientes | Logos de empresas |
| Videos | Subir y administrar videos |
| Blog | Entradas con portada, fecha, resumen y contenido |
| Contacto | Telefono, WhatsApp, correo, redes y mapa de Google |
| Citas | Disponibilidad (dias/horario) y lista de citas con estado |
| Correo | Credenciales SMTP + contenido del mensaje + correo de prueba |
| Usuarios | Crear usuarios, asignar roles, cambiar contrasenas (solo propietario) |
| Registro | Historial de acciones del panel |

## Requisitos

- Node.js 18 o superior (probado con Node 24).

## Ejecutar en local

```bash
npm install
npm start
```

- Sitio: http://localhost:3000
- Panel: http://localhost:3000/admin

Para regenerar el contenido desde cero: borra `data/content.json` y `public/uploads/`,
luego ejecuta `node scripts/seed.js`.

## Configurar el correo (cotizaciones por email)

En el panel, seccion **Correo**:

1. Activa "Activar envio por correo".
2. Completa los datos SMTP. Ejemplo con Gmail:
   - Host: `smtp.gmail.com`, Puerto: `587`, Conexion segura: apagada.
   - Usuario: tu correo, Contrasena: una **App Password** de Google (no tu clave normal).
3. En "Contenido del mensaje" pon el correo que recibe las cotizaciones, el asunto y el texto.
4. Usa "Enviar correo de prueba" para verificar.

Si el correo esta apagado o falla, el formulario sigue funcionando y abre WhatsApp.

## Variables de entorno (produccion)

Crea un `.env` basado en `.env.example` y cambia:

- `ADMIN_PASSWORD` → contrasena del usuario inicial `admin`.
- `SESSION_SECRET` → cadena larga y aleatoria (firma las sesiones).
- `PORT` → opcional.

## Publicar (produccion)

Las fotos y los textos se guardan en archivos (`data/` y `public/uploads/`), asi que
necesitas un hosting con **disco persistente** para no perder los cambios del panel:

1. **Render / Railway / Fly.io**: servicio Node, comando `npm start`, variables de
   entorno y un **disco persistente** montado en la carpeta del proyecto.
2. **VPS** (DigitalOcean, Hostinger): Node + `pm2 start server.js` + Nginx con HTTPS.

> Evita hostings 100% serverless (Vercel/Netlify funciones): su disco es temporal y
> los cambios del panel se perderian.

## Estructura

```
server.js              Servidor Express + API protegida + correo + usuarios
lib/content.js         Defaults del contenido y lectura/escritura
data/content.json      Todo el contenido editable
public/
  index.html app.js styles.css themes.css i18n.js   Sitio publico
  admin.html admin.js admin.css                      Panel de administracion
  uploads/             Imagenes y videos
  assets/logo.png      Logo
scripts/
  seed.js              Carga inicial de fotos/videos
  extract-colors.js    Extrae la paleta del logo
```

## Seguridad

- Panel protegido por usuario/contrasena (hash bcrypt) y sesion con cookie.
- Cabeceras de seguridad con **helmet** y cookie `secure` automatica en produccion (`NODE_ENV=production`).
- **Limite de peticiones** (rate limiting) en el login (anti fuerza bruta) y en los formularios publicos de cotizacion y citas (anti spam).
- Validacion y limite de longitud de todos los campos enviados desde el sitio.
- Escritura **atomica** de `content.json` (archivo temporal + rename) y **cola de escrituras** para evitar corrupcion o datos pisados por peticiones simultaneas. El agendamiento comprueba e inserta la cita de forma atomica (sin dobles reservas).
- Contrasenas de usuario con minimo de 8 caracteres.
- La API publica nunca expone usuarios, contrasenas SMTP ni el registro de cambios.
- Cambia `ADMIN_PASSWORD` y `SESSION_SECRET` antes de publicar (define `NODE_ENV=production`).
- Solo se aceptan imagenes y videos en las subidas; las imagenes se reprocesan con `sharp`.
- `robots.txt` y `sitemap.xml` generados automaticamente; datos estructurados `LocalBusiness` y `FAQPage` para SEO.
- El cliente recibe un correo de confirmacion (cotizacion y cita) cuando el SMTP esta configurado.
