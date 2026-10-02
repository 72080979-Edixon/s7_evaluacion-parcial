let slideActual = 0;
const slides = document.querySelectorAll(".slide");
const indicadores = document.querySelectorAll(".indicador");
const carrusel = document.getElementById("carrusel");
let intervaloCarrusel;

function mostrarSlide(index) {
    if (slides.length === 0) return;

    slideActual = (index + slides.length) % slides.length;

    slides.forEach(slide => {
        slide.classList.remove("activo");
    });

    indicadores.forEach(indicador => {
        indicador.classList.remove("activo");
    });

    slides[slideActual].classList.add("activo");

    if (indicadores[slideActual]) {
        indicadores[slideActual].classList.add("activo");
    }
}

function cambiarSlide(direccion) {
    mostrarSlide(slideActual + direccion);
    reiniciarCarrusel();
}

function irASlide(index) {
    mostrarSlide(index);
    reiniciarCarrusel();
}

function iniciarCarrusel() {
    clearInterval(intervaloCarrusel);

    intervaloCarrusel = setInterval(() => {
        mostrarSlide(slideActual + 1);
    }, 5000);
}

function reiniciarCarrusel() {
    iniciarCarrusel();
}

if (carrusel) {
    carrusel.addEventListener("mouseenter", () => {
        clearInterval(intervaloCarrusel);
    });

    carrusel.addEventListener("mouseleave", () => {
        iniciarCarrusel();
    });
}

mostrarSlide(0);
iniciarCarrusel();