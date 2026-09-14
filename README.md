# TRANSMUDAR — Web oficial (versión simple, sin build)

Sitio web de TRANSMUDAR: HTML, CSS y JavaScript puro, sin ningún paso de
compilación. Ideal para publicar directamente en GitHub Pages arrastrando
los archivos, sin necesitar Node.js, npm ni GitHub Actions.

## Archivos

- `index.html` — página de inicio (servicios, planes, galería, FAQ).
- `cotizar.html` — formulario de cotización. Envía los datos directo a
  Supabase desde el navegador (sin servidor).
- `privacidad.html`, `terminos-y-condiciones.html`, `tratamiento-de-datos.html`
  — páginas legales.
- `404.html` — página para rutas no encontradas (redirige al inicio).
- `assets/styles.css` — todos los estilos del sitio.
- `assets/site.js` — menú móvil, animaciones y año del footer.
- `assets/brand.js` — datos de contacto y WhatsApp.
- `assets/fotos.js` — fotos de la galería (actualmente genéricas).
- `assets/supabase-config.js` — llave pública de Supabase.
- `assets/cotizar.js` — lógica de envío del formulario.

## Cómo publicarlo en GitHub Pages

1. Sube todos estos archivos a la raíz de tu repositorio (arrastrando desde
   GitHub Desktop o por la web, ya que son pocos archivos).
2. En GitHub → Settings → Pages → Source, elige **"Deploy from a branch"**,
   rama `main`, carpeta `/ (root)`.
3. Tu sitio queda en `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

No hace falta configurar ninguna ruta base ni workflow — al ser HTML plano,
funciona igual sin importar el nombre del repositorio.

## Fotos reales

Las fotos de la galería (`assets/fotos.js`) son genéricas por ahora. Para
usar las reales:

1. Coloca los archivos de imagen dentro de `assets/fotos/`.
2. En `assets/fotos.js`, cambia cada `url: placeholderFoto(...)` por
   `url: "assets/fotos/tu-archivo.webp"`.

## Notificaciones de nuevas cotizaciones

El formulario ya guarda las solicitudes en Supabase. Para recibir un aviso
(WhatsApp/correo) cada vez que llega una nueva, configura un **Database
Webhook** en el panel de Supabase (Database → Webhooks) apuntando a una Web
App de Google Apps Script.
