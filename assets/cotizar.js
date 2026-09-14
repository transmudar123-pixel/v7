document.addEventListener("DOMContentLoaded", function () {
  /**
   * Reduce el tamaño de la foto (para que el envío sea rápido) y la
   * convierte a base64, en el formato que espera el Apps Script.
   */
  function comprimirYConvertirABase64(file) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var lector = new FileReader();
      lector.onerror = reject;
      lector.onload = function () {
        img.onload = function () {
          var maxLado = 1280;
          var w = img.width;
          var h = img.height;
          if (Math.max(w, h) > maxLado) {
            var escala = maxLado / Math.max(w, h);
            w = Math.round(w * escala);
            h = Math.round(h * escala);
          }
          var canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          var dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          resolve({
            nombre: (file.name || "foto.jpg").replace(/[^a-zA-Z0-9._-]/g, "_"),
            tipo: "image/jpeg",
            base64: dataUrl.split(",")[1],
          });
        };
        img.onerror = reject;
        img.src = lector.result;
      };
      lector.readAsDataURL(file);
    });
  }
  var TOTAL_PASOS = 5;
  var pasoActual = 1;
  var titulos = {
    1: "¿De dónde salimos?",
    2: "¿A dónde vamos?",
    3: "Inventario",
    4: "Servicio",
    5: "Contacto",
  };

  var estado = {
    origen: {},
    destino: {},
    inventario: {},
    desarmeCamas: null,
    elementosEspeciales: [],
    plan: null,
    serviciosAdicionales: [],
    fechaEstimada: "",
    horarioPreferido: null,
    fotos: [],
  };

  // ---------- Construir contadores del inventario ----------
  document.querySelectorAll(".inv-item[data-item]").forEach(function (item) {
    var nombre = item.dataset.item;
    estado.inventario[nombre] = 0;
    var controles = document.createElement("div");
    controles.className = "inv-controles";
    controles.innerHTML =
      '<button type="button" class="inv-btn" data-accion="restar">\u2013</button>' +
      '<span class="inv-count">0</span>' +
      '<button type="button" class="inv-btn" data-accion="sumar">+</button>';
    item.appendChild(controles);

    controles.querySelector('[data-accion="restar"]').addEventListener("click", function () {
      estado.inventario[nombre] = Math.max(0, estado.inventario[nombre] - 1);
      controles.querySelector(".inv-count").textContent = estado.inventario[nombre];
    });
    controles.querySelector('[data-accion="sumar"]').addEventListener("click", function () {
      estado.inventario[nombre] = estado.inventario[nombre] + 1;
      controles.querySelector(".inv-count").textContent = estado.inventario[nombre];
    });
  });

  // ---------- Botones tipo pildora (Si/No/No se) ----------
  document.querySelectorAll(".pill-group").forEach(function (grupo) {
    var campo = grupo.dataset.campo;
    grupo.querySelectorAll(".pill-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        grupo.querySelectorAll(".pill-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var valor = btn.dataset.valor;
        if (campo === "horario_preferido") {
          estado.horarioPreferido = valor;
        } else if (campo === "inv_desarme_camas") {
          estado.desarmeCamas = valor;
        } else if (campo.indexOf("origen_") === 0) {
          estado.origen[campo.replace("origen_", "")] = valor;
        } else if (campo.indexOf("destino_") === 0) {
          estado.destino[campo.replace("destino_", "")] = valor;
        }
      });
    });
  });

  // ---------- Elementos especiales (checkboxes) ----------
  var elementosEspecialesBox = document.getElementById("elementos-especiales");
  if (elementosEspecialesBox) {
    elementosEspecialesBox.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("change", function () {
        estado.elementosEspeciales = Array.from(
          elementosEspecialesBox.querySelectorAll('input[type="checkbox"]:checked')
        ).map(function (c) { return c.value; });
      });
    });
  }

  // ---------- Servicios adicionales (checkboxes, paso 4) ----------
  var serviciosBox = document.getElementById("servicios-adicionales");
  if (serviciosBox) {
    serviciosBox.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("change", function () {
        estado.serviciosAdicionales = Array.from(
          serviciosBox.querySelectorAll('input[type="checkbox"]:checked')
        ).map(function (c) { return c.value; });
      });
    });
  }

  // ---------- Tarjetas de plan (paso 4) ----------
  var planOpciones = document.getElementById("plan-opciones");
  if (planOpciones) {
    planOpciones.querySelectorAll(".servicio-card").forEach(function (card) {
      card.addEventListener("click", function () {
        planOpciones.querySelectorAll(".servicio-card").forEach(function (c) { c.classList.remove("active"); });
        card.classList.add("active");
        estado.plan = card.dataset.valor;
      });
    });
  }

  // ---------- Campos de texto simples (origen/destino/contacto) ----------
  function vincular(id, obj, prop) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function () { obj[prop] = el.value; });
  }
  vincular("origen_ciudad", estado.origen, "ciudad");
  vincular("origen_direccion", estado.origen, "direccion");
  vincular("origen_piso", estado.origen, "piso");
  vincular("destino_ciudad", estado.destino, "ciudad");
  vincular("destino_direccion", estado.destino, "direccion");
  vincular("destino_piso", estado.destino, "piso");

  var origenTipo = document.getElementById("origen_tipo_inmueble");
  if (origenTipo) origenTipo.addEventListener("change", function () { estado.origen.tipoInmueble = origenTipo.value; });
  var destinoTipo = document.getElementById("destino_tipo_inmueble");
  if (destinoTipo) destinoTipo.addEventListener("change", function () { estado.destino.tipoInmueble = destinoTipo.value; });

  var fechaInput = document.getElementById("fecha_estimada");
  if (fechaInput) fechaInput.addEventListener("input", function () { estado.fechaEstimada = fechaInput.value; });

  // ---------- Fotos ----------
  var fotosInput = document.getElementById("fotos-input");
  var fotosContador = document.getElementById("fotos-contador");
  if (fotosInput) {
    fotosInput.addEventListener("change", function () {
      estado.fotos = Array.from(fotosInput.files);
      if (fotosContador) {
        fotosContador.textContent = estado.fotos.length
          ? estado.fotos.length + " foto(s) seleccionada(s)"
          : "";
      }
    });
  }

  // ---------- Navegación del asistente ----------
  var pasos = document.querySelectorAll(".wizard-step");
  var pasoLabel = document.getElementById("paso-label");
  var pasoTitulo = document.getElementById("paso-titulo");
  var progressFill = document.getElementById("progress-fill");

  function mostrarPaso(n) {
    pasos.forEach(function (p) {
      p.hidden = Number(p.dataset.step) !== n;
    });
    pasoActual = n;
    pasoLabel.textContent = "Paso " + n + " de " + TOTAL_PASOS;
    pasoTitulo.textContent = titulos[n];
    progressFill.style.width = (n / TOTAL_PASOS) * 100 + "%";
    window.scrollTo({ top: document.querySelector(".wizard-progress").offsetTop - 20, behavior: "smooth" });
  }

  document.querySelectorAll(".wizard-continuar").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (pasoActual < TOTAL_PASOS) mostrarPaso(pasoActual + 1);
    });
  });
  document.querySelectorAll(".wizard-atras").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (pasoActual > 1) mostrarPaso(pasoActual - 1);
    });
  });

  // ---------- Envio final ----------
  var submitBtn = document.getElementById("submit-btn");
  var msg = document.getElementById("form-msg");

  submitBtn.addEventListener("click", async function () {
    var nombre = (document.getElementById("nombre").value || "").trim();
    var telefono = (document.getElementById("telefono").value || "").trim();
    var whatsapp = (document.getElementById("whatsapp").value || "").trim() || telefono;
    var email = (document.getElementById("email").value || "").trim() || null;
    var observaciones = (document.getElementById("observaciones").value || "").trim() || null;
    var autorizacion = document.getElementById("autorizacion").checked;

    msg.className = "form-msg";
    msg.textContent = "";

    if (!nombre || !telefono) {
      msg.className = "form-msg error";
      msg.textContent = "Por favor completa tu nombre y número de celular.";
      return;
    }
    if (!estado.origen.ciudad || !estado.destino.ciudad) {
      msg.className = "form-msg error";
      msg.textContent = "Falta la ciudad de origen o destino (pasos 1 y 2).";
      return;
    }
    if (!autorizacion) {
      msg.className = "form-msg error";
      msg.textContent = "Debes autorizar el tratamiento de datos personales para continuar.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
      // Comprimir y convertir las fotos a base64 para enviarlas al Apps Script
      var fotosBase64 = [];
      for (var i = 0; i < estado.fotos.length; i++) {
        fotosBase64.push(await comprimirYConvertirABase64(estado.fotos[i]));
      }

      // Inventario: solo los items con cantidad > 0
      var inventarioFinal = {};
      Object.keys(estado.inventario).forEach(function (k) {
        if (estado.inventario[k] > 0) inventarioFinal[k] = estado.inventario[k];
      });
      inventarioFinal["¿Alguna cama requiere desarme?"] = estado.desarmeCamas;
      inventarioFinal["Elementos especiales"] = estado.elementosEspeciales;

      var payload = {
        nombre: nombre,
        telefono: telefono,
        whatsapp: whatsapp,
        email: email,
        origen: estado.origen,
        destino: estado.destino,
        es_nacional:
          (estado.origen.ciudad || "").toLowerCase() !== (estado.destino.ciudad || "").toLowerCase(),
        inventario: inventarioFinal,
        plan: estado.plan,
        servicios_adicionales: estado.serviciosAdicionales,
        fecha_estimada: estado.fechaEstimada || null,
        horario_preferido: estado.horarioPreferido,
        observaciones: observaciones,
        fotos: fotosBase64,
      };

      // Se envía como text/plain a propósito: si se declara application/json,
      // el navegador hace una petición de verificación previa (CORS preflight)
      // que Apps Script no responde correctamente y el envío fallaría.
      var res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      var resultado = await res.json();
      if (!resultado.ok) {
        throw new Error(resultado.error || "No se pudo enviar la solicitud. Intenta de nuevo.");
      }

      msg.className = "form-msg ok";
      msg.textContent =
        "¡Listo! Tu solicitud quedó registrada con el número #" +
        resultado.consecutivo +
        ". Te contactaremos pronto. También puedes continuar por WhatsApp para agilizar la respuesta.";
      submitBtn.textContent = "Enviado";

      var waBtn = document.getElementById("wa-continuar");
      if (waBtn) {
        var lineas = [
          "Hola TRANSMUDAR. Acabo de solicitar una cotización desde la página web (#" + resultado.consecutivo + ").",
          "Nombre: " + nombre,
          "Origen: " + (estado.origen.ciudad || ""),
          "Destino: " + (estado.destino.ciudad || ""),
          estado.fechaEstimada ? "Fecha: " + estado.fechaEstimada : null,
          "Quisiera recibir información sobre mi cotización.",
        ].filter(Boolean);
        waBtn.href = "https://wa.me/" + BRAND.whatsapp + "?text=" + encodeURIComponent(lineas.join("\n"));
        waBtn.style.display = "inline-flex";
      }
    } catch (err) {
      msg.className = "form-msg error";
      msg.textContent = err.message || "Ocurrió un error al enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Ver resumen →";
    }
  });

  // Preseleccionar plan si viene en la URL (?plan=basico|plus|premium)
  var params = new URLSearchParams(window.location.search);
  var planParam = params.get("plan");
  if (planParam && planOpciones) {
    var card = planOpciones.querySelector('[data-valor="' + planParam + '"]');
    if (card) card.click();
  }

  mostrarPaso(1);
});
