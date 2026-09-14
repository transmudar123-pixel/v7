document.addEventListener("DOMContentLoaded", function () {
  // Año en el footer
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Animación al hacer scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      obs.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // Menu activo segun la seccion visible (scroll-spy), y el menu se
  // desliza horizontalmente para que el link activo siempre se vea.
  var navLinks = document.querySelectorAll(".nav-links a[href*='#']");
  var navContainer = document.querySelector(".nav-links");
  if (navLinks.length && navContainer && "IntersectionObserver" in window) {
    var idsASecciones = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute("href").split("#")[1];
      var seccion = document.getElementById(id);
      if (seccion) idsASecciones[id] = a;
    });

    function activarLink(id) {
      var link = idsASecciones[id];
      if (!link) return;
      navLinks.forEach(function (a) { a.classList.remove("active"); });
      link.classList.add("active");
      // Deslizar el menu para que el link activo quede visible
      var offset = link.offsetLeft - navContainer.clientWidth / 2 + link.clientWidth / 2;
      navContainer.scrollTo({ left: offset, behavior: "smooth" });
    }

    var spyObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activarLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    Object.keys(idsASecciones).forEach(function (id) {
      spyObs.observe(document.getElementById(id));
    });
  }
});
