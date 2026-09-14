document.addEventListener("DOMContentLoaded", function () {
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
      // Subir fotos
      var rutasFotos = [];
      if (estado.fotos.length) {
        var carpeta = crypto.randomUUID();
        for (var i = 0; i < estado.fotos.length; i++) {
          var file = estado.fotos[i];
          var ext = (file.name.split(".").pop() || "jpg").toLowerCase();
          var ruta = carpeta + "/" + Date.now() + "-" + i + "." + ext;
          var up = await fetch(SUPABASE_URL + "/storage/v1/object/cotizaciones/" + ruta, {
            method: "POST",
            headers: {
              apikey: SUPABASE_PUBLISHABLE_KEY,
              Authorization: "Bearer " + SUPABASE_PUBLISHABLE_KEY,
              "Content-Type": file.type || "image/jpeg",
            },
            body: file,
          });
          if (up.ok) rutasFotos.push(ruta);
        }
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
        fotos: rutasFotos,
      };

      var res = await fetch(SUPABASE_URL + "/rest/v1/solicitudes_cotizacion", {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: "Bearer " + SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        var errText = await res.text();
        throw new Error("No se pudo enviar la solicitud (" + res.status + "). " + errText);
      }

      msg.className = "form-msg ok";
      msg.textContent = "¡Listo! Recibimos tu solicitud. Te contactaremos pronto. También puedes continuar por WhatsApp para agilizar la respuesta.";
      submitBtn.textContent = "Enviado";

      var waBtn = document.getElementById("wa-continuar");
      if (waBtn) {
        var lineas = [
          "Hola TRANSMUDAR. Acabo de solicitar una cotización desde la página web.",
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
