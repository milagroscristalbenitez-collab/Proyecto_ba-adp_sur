/* ============================================================
   Compartimos, Aprendemos y Servimos
   JavaScript del sitio
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    iniciarMenuLateral();
    iniciarMenuActividades();
    marcarEnlaceActivo();
    iniciarCarrusel();
    iniciarAparicionScroll();
    iniciarFormularioContacto();
    prepararLogos();
    prepararImagenesOpcionales();
    iniciarGaleriaAmpliada();
});

/* Si una foto todavía no está en la carpeta img, se deja el espacio preparado */
function prepararImagenesOpcionales() {
    var imagenes = document.querySelectorAll("[data-imagen-opcional]");

    imagenes.forEach(function (imagen) {
        var aviso = imagen.parentElement.querySelector(".espacio-foto");

        function ocultarImagen() {
            imagen.style.display = "none";
            if (aviso) {
                aviso.style.display = "block";
            }
        }

        function mostrarImagen() {
            imagen.style.display = "block";
            if (aviso) {
                aviso.style.display = "none";
            }
        }

        imagen.addEventListener("error", ocultarImagen);
        imagen.addEventListener("load", mostrarImagen);

        if (imagen.complete) {
            if (imagen.naturalWidth === 0) {
                ocultarImagen();
            } else {
                mostrarImagen();
            }
        }
    });
}

/* Si el archivo del logo aún no está, se muestra un recuadro de respaldo */
function prepararLogos() {
    var imagenes = document.querySelectorAll(".menu-marca img");

    imagenes.forEach(function (imagen) {
        function usarRespaldo() {
            var respaldo = document.createElement("span");
            respaldo.className = "logo-respaldo";
            respaldo.textContent = "CAS";
            if (imagen.parentNode) {
                imagen.replaceWith(respaldo);
            }
        }

        imagen.addEventListener("error", usarRespaldo);

        if (imagen.complete && imagen.naturalWidth === 0) {
            usarRespaldo();
        }
    });
}

/* ------------------------------------------------------------
   Menú lateral en celular
   ------------------------------------------------------------ */
function iniciarMenuLateral() {
    var boton = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".menu-lateral");
    var fondo = document.querySelector(".menu-fondo");

    if (!boton || !menu) {
        return;
    }

    function cerrar() {
        menu.classList.remove("abierto");
        boton.setAttribute("aria-expanded", "false");
        if (fondo) {
            fondo.classList.remove("visible");
        }
    }

    function abrir() {
        menu.classList.add("abierto");
        boton.setAttribute("aria-expanded", "true");
        if (fondo) {
            fondo.classList.add("visible");
        }
    }

    boton.addEventListener("click", function () {
        if (menu.classList.contains("abierto")) {
            cerrar();
        } else {
            abrir();
        }
    });

    if (fondo) {
        fondo.addEventListener("click", cerrar);
    }
}

/* ------------------------------------------------------------
   Desplegable de Actividades
   ------------------------------------------------------------ */
function iniciarMenuActividades() {
    var boton = document.querySelector(".menu-actividades-btn");
    var contenedor = document.querySelector(".menu-desplegable");

    if (!boton || !contenedor) {
        return;
    }

    boton.addEventListener("click", function () {
        var abierto = contenedor.classList.toggle("abierto");
        boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
}

/* ------------------------------------------------------------
   Marca la página actual en el menú
   ------------------------------------------------------------ */
function marcarEnlaceActivo() {
    var archivo = window.location.pathname.split("/").pop() || "index.html";
    var enlaces = document.querySelectorAll(".menu-lista a");
    var paginasActividad = [
        "recreacion.html",
        "club-ciencias.html",
        "cuentos.html",
        "arte.html",
        "refuerzo.html",
        "merienda.html"
    ];

    enlaces.forEach(function (enlace) {
        var href = enlace.getAttribute("href");
        if (href === archivo) {
            enlace.classList.add("activo");
        }
    });

    if (paginasActividad.indexOf(archivo) !== -1) {
        var desplegable = document.querySelector(".menu-desplegable");
        var boton = document.querySelector(".menu-actividades-btn");
        if (desplegable && boton) {
            desplegable.classList.add("abierto");
            boton.setAttribute("aria-expanded", "true");
        }
    }
}

/* ------------------------------------------------------------
   Carrusel de galería: avanza o retrocede UNA imagen
   ------------------------------------------------------------ */
function iniciarCarrusel() {
    var carrusel = document.querySelector("[data-carrusel]");

    if (!carrusel) {
        return;
    }

    var pista = carrusel.querySelector(".carrusel-pista");
    var slides = carrusel.querySelectorAll(".carrusel-slide");
    var btnPrev = carrusel.querySelector(".carrusel-btn.prev");
    var btnNext = carrusel.querySelector(".carrusel-btn.next");
    var indicadoresCaja = carrusel.querySelector(".carrusel-indicadores");
    var total = slides.length;
    var indice = 0;

    if (!pista || total === 0) {
        return;
    }

    function crearIndicadores() {
        if (!indicadoresCaja) {
            return;
        }

        indicadoresCaja.innerHTML = "";

        for (var i = 0; i < total; i++) {
            var punto = document.createElement("button");
            punto.type = "button";
            punto.setAttribute("aria-label", "Ir a la imagen " + (i + 1));
            punto.addEventListener("click", function (posicion) {
                return function () {
                    indice = posicion;
                    actualizar();
                };
            }(i));
            indicadoresCaja.appendChild(punto);
        }
    }

    function actualizar() {
        var ancho = carrusel.querySelector(".carrusel-vista").clientWidth;
        pista.style.transform = "translateX(-" + (indice * ancho) + "px)";

        if (!indicadoresCaja) {
            return;
        }

        var puntos = indicadoresCaja.querySelectorAll("button");
        puntos.forEach(function (punto, i) {
            if (i === indice) {
                punto.classList.add("activo");
            } else {
                punto.classList.remove("activo");
            }
        });
    }

    crearIndicadores();
    actualizar();
    window.addEventListener("resize", actualizar);

    if (btnNext) {
        btnNext.addEventListener("click", function () {
            indice = (indice + 1) % total;
            actualizar();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener("click", function () {
            indice = (indice - 1 + total) % total;
            actualizar();
        });
    }
}

/* ------------------------------------------------------------
   Aparición suave al hacer scroll
   ------------------------------------------------------------ */
function iniciarAparicionScroll() {
    var elementos = document.querySelectorAll(".js-scroll");

    if (!elementos.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        elementos.forEach(function (el) {
            el.classList.add("visible");
        });
        return;
    }

    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.14
    });

    elementos.forEach(function (el) {
        observador.observe(el);
    });
}

/* ------------------------------------------------------------
   Formulario de contacto: solo visual, sin envío real
   ------------------------------------------------------------ */
function iniciarFormularioContacto() {
    var formulario = document.querySelector("#formulario-contacto");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        var aviso = document.querySelector(".aviso-formulario");
        if (aviso) {
            aviso.classList.add("visible");
        }
    });
}


/* Galería: abrir fotografías en una ventana ampliada */
function iniciarGaleriaAmpliada() {
    var modal = document.querySelector('[data-lightbox-modal]');
    if (!modal) return;
    var imagenGrande = modal.querySelector('[data-lightbox-img]');
    var texto = modal.querySelector('[data-lightbox-caption]');
    var cerrar = modal.querySelector('.lightbox-cerrar');
    var botones = document.querySelectorAll('[data-lightbox]');
    var anteriorFoco = null;

    function abrir(boton) {
        anteriorFoco = boton;
        imagenGrande.src = boton.getAttribute('data-lightbox');
        imagenGrande.alt = boton.getAttribute('data-alt') || 'Fotografía del proyecto';
        texto.textContent = imagenGrande.alt;
        modal.classList.add('abierto');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        cerrar.focus();
    }
    function cerrarModal() {
        modal.classList.remove('abierto');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        imagenGrande.src = '';
        if (anteriorFoco) anteriorFoco.focus();
    }
    botones.forEach(function (boton) {
        boton.addEventListener('click', function () { abrir(boton); });
    });
    cerrar.addEventListener('click', cerrarModal);
    modal.addEventListener('click', function (evento) {
        if (evento.target === modal) cerrarModal();
    });
    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape' && modal.classList.contains('abierto')) cerrarModal();
    });
}
