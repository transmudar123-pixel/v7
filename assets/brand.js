var BRAND = {
  nombre: "TRANSMUDAR",
  tagline: "Servicio de mudanzas",
  telefono: "3112543114",
  telefonoFormateado: "311 254 3114",
  whatsapp: "573112543114",
  instagram: "https://www.instagram.com/transmudar._?igsi=eHJpNGQ0NGdvODM2",
  email: "transmudar123@gmail.com",
};

function waLink(mensaje) {
  var texto =
    mensaje ||
    "Hola TRANSMUDAR. Estoy en la página web y quisiera información sobre una mudanza.";
  return "https://wa.me/" + BRAND.whatsapp + "?text=" + encodeURIComponent(texto);
}
