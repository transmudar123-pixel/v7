// Fotos reales de TRANSMUDAR, organizadas por categoría.
// Cada foto puede pertenecer a una o varias categorías (categorias: []).
// Para agregar una foto nueva: coloca el archivo en assets/fotos/ y añade
// un objeto aquí con su url, alt (descripción) y categorías.
var FOTOS = [
  { url: "assets/fotos/general-01.jpg", alt: "Elementos de cocina y objetos delicados empacados en una canastilla", categorias: [] },
  { url: "assets/fotos/embalaje-01.jpg", alt: "Mesa embalada con plástico vinipel y marcada para identificarla en el traslado", categorias: ["Embalaje"] },
  { url: "assets/fotos/proteccion-01.jpg", alt: "Muebles envueltos con plástico vinipel y mantas protectoras antes del traslado", categorias: ["Protección"] },
  { url: "assets/fotos/embalaje-02.jpg", alt: "Mueble protegido y marcado con el nombre de la habitación a la que pertenece", categorias: ["Embalaje"] },
  { url: "assets/fotos/general-02.jpg", alt: "Detalle del proceso de empaque de TRANSMUDAR", categorias: [] },
  { url: "assets/fotos/general-03.jpg", alt: "Elementos organizados y protegidos durante la mudanza", categorias: [] },
  { url: "assets/fotos/general-04.jpg", alt: "Elementos de cocina y objetos delicados empacados en una canastilla", categorias: [] },
  { url: "assets/fotos/transporte-01.jpg", alt: "Cajas y canastillas organizadas dentro de una bodega de almacenamiento", categorias: ["Transporte"] },
  { url: "assets/fotos/transporte-02.jpg", alt: "Elementos de la mudanza empacados y almacenados de forma ordenada", categorias: ["Transporte"] },
  { url: "assets/fotos/transporte-03.jpg", alt: "Canastillas y cajas apiladas, listas para transportar", categorias: ["Transporte"] },
  { url: "assets/fotos/embalaje-03.jpg", alt: "Escritorio embalado con plástico protector antes de la mudanza", categorias: ["Embalaje"] },
  { url: "assets/fotos/general-05.jpg", alt: "Detalle del proceso de empaque de TRANSMUDAR", categorias: [] },
  { url: "assets/fotos/embalaje-04.jpg", alt: "Mueble envuelto cuidadosamente para su transporte", categorias: ["Embalaje"] },
  { url: "assets/fotos/transporte-04.jpg", alt: "Bodega con cajas y elementos organizados para el traslado", categorias: ["Transporte"] },
  { url: "assets/fotos/general-06.jpg", alt: "Elementos organizados y protegidos durante la mudanza", categorias: [] },
  { url: "assets/fotos/cargue-01.jpg", alt: "Cama desarmada y protegida, lista para el cargue", categorias: ["Cargue"] },
  { url: "assets/fotos/delicados-01.jpg", alt: "Vajilla y utensilios de cocina protegidos con plástico burbuja en una canastilla", categorias: ["Muebles delicados"] },
  { url: "assets/fotos/proteccion-02.jpg", alt: "Operario de TRANSMUDAR junto a muebles protegidos y organizados para la mudanza", categorias: ["Protección"] },
  { url: "assets/fotos/proteccion-03.jpg", alt: "Muebles grandes forrados con plástico protector, listos para el cargue", categorias: ["Protección"] },
  { url: "assets/fotos/general-07.jpg", alt: "Elementos de cocina y objetos delicados empacados en una canastilla", categorias: [] },
  { url: "assets/fotos/cargue-02.jpg", alt: "Mueble embalado listo para ser cargado en el vehículo", categorias: ["Cargue"] },
  { url: "assets/fotos/general-08.jpg", alt: "Detalle del proceso de empaque de TRANSMUDAR", categorias: [] },
  { url: "assets/fotos/general-09.jpg", alt: "Elementos organizados y protegidos durante la mudanza", categorias: [] },
  { url: "assets/fotos/proteccion-04.jpg", alt: "Cajas y muebles protegidos apilados de forma organizada", categorias: ["Protección"] },
  { url: "assets/fotos/proteccion-05.jpg", alt: "Protección completa de muebles con plástico vinipel antes de moverlos", categorias: ["Protección"] },
  { url: "assets/fotos/general-10.jpg", alt: "Elementos de cocina y objetos delicados empacados en una canastilla", categorias: [] },
  { url: "assets/fotos/cargue-03.jpg", alt: "Elementos organizados y protegidos antes del cargue", categorias: ["Cargue"] },
  { url: "assets/fotos/general-11.jpg", alt: "Detalle del proceso de empaque de TRANSMUDAR", categorias: [] },
  { url: "assets/fotos/general-12.jpg", alt: "Elementos organizados y protegidos durante la mudanza", categorias: [] },
  { url: "assets/fotos/general-13.jpg", alt: "Elementos de cocina y objetos delicados empacados en una canastilla", categorias: [] },
  { url: "assets/fotos/delicados-02.jpg", alt: "Objetos delicados envueltos individualmente antes de empacarlos", categorias: ["Muebles delicados"] },
  { url: "assets/fotos/embalaje-05.jpg", alt: "Mesa embalada con plástico vinipel y marcada para identificarla en el traslado", categorias: ["Embalaje", "Muebles delicados"] },
  { url: "assets/fotos/general-14.jpg", alt: "Detalle del proceso de empaque de TRANSMUDAR", categorias: [] },
  { url: "assets/fotos/embalaje-06.jpg", alt: "Mueble protegido y marcado con el nombre de la habitación a la que pertenece", categorias: ["Embalaje"] },
  { url: "assets/fotos/embalaje-07.jpg", alt: "Escritorio embalado con plástico protector antes de la mudanza", categorias: ["Embalaje"] },
  { url: "assets/fotos/delicados-03.jpg", alt: "Elementos frágiles de cocina organizados y protegidos en una caja", categorias: ["Muebles delicados"] }
];

var CATEGORIAS_GALERIA = ["Protección", "Embalaje", "Cargue", "Transporte", "Muebles delicados"];

var FOTO_HERO = FOTOS.find(function (f) { return f.url.indexOf("proteccion-01") !== -1; }) || FOTOS[0];
var FOTO_CTA = FOTOS.find(function (f) { return f.url.indexOf("transporte-01") !== -1; }) || FOTOS[1];
var FOTO_COTIZAR = FOTOS.find(function (f) { return f.url.indexOf("cargue-01") !== -1; }) || FOTOS[2];
