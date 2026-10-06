import { sql } from "./config/neon-config.js";

console.log("Empleado.js cargado");

const usuario = JSON.parse(sessionStorage.getItem("usuario"));

if (!usuario) {
    window.location.href = "../index.html";
}

if (
    usuario.rol !== "empleado" &&
    usuario.rol !== "administrador" &&
    usuario.rol !== "admin"
) {
    alert("Acceso no autorizado");
    window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const nombreEmpleado =
        document.getElementById("nombreEmpleado");

    if (nombreEmpleado) {
        nombreEmpleado.textContent =
            `👤 ${usuario.nombre}`;
    }
    const btnPanel =
    document.getElementById(
        "btnPanel"
    );

if (
    usuario.rol === "empleado" ||
    usuario.rol === "administrador" ||
    usuario.rol === "admin"
) {

    btnPanel.style.display =
        "inline-block";

}

    cargarCompras();
});

/* =========================
   CERRAR SESIÓN
========================= */

function cerrarSesion() {
 
if (!confirm(
"¿Desea cerrar sesión?"
)) {
return;
}
 
sessionStorage.removeItem(
"usuario"
);
 
window.location.href =
"../html/login.html";
}

window.cerrarSesion = cerrarSesion;
document
    .getElementById("btnCerrarSesion")
    ?.addEventListener(
        "click",
        cerrarSesion
    );

/* =========================
   VALIDAR ENTRADA
========================= */

async function validarEntrada() {

    const codigo =
        document.getElementById("codigoEntrada")
        .value
        .trim();

    const mensaje =
        document.getElementById("mensaje");

    if (!codigo) {

        mensaje.className = "estado-error";
        mensaje.textContent =
            "Ingrese un código.";

        return;
    }

    try {

        const entrada = await sql`
            SELECT *
            FROM entradas
            WHERE codigo = ${codigo}
        `;

        if (entrada.length === 0) {

            mensaje.className =
                "estado-error";

            mensaje.textContent =
                "Entrada no encontrada.";

            return;
        }

        if (entrada[0].usada) {

            mensaje.className =
                "estado-error";

            mensaje.textContent =
                "La entrada ya fue utilizada.";

            return;
        }

        await sql`
            UPDATE entradas
            SET
                usada = TRUE,
                estado = 'atendido'
            WHERE codigo = ${codigo}
        `;

        mensaje.className =
            "estado-correcto";

        mensaje.textContent =
            `✅ Entrada válida para ${entrada[0].evento}`;

        document.getElementById(
            "codigoEntrada"
        ).value = "";

    } catch (error) {

        console.error(error);

        mensaje.className =
            "estado-error";

        mensaje.textContent =
            "Error al validar entrada.";
    }
}

window.validarEntrada =
    validarEntrada;

/* =========================
   BUSCAR COMPRA
========================= */

async function buscarCompra() {

    const codigo =
        document.getElementById("idCompra")
        .value
        .trim();

    const resultado =
        document.getElementById(
            "resultadoCompra"
        );

    if (!codigo) {

        resultado.className =
            "estado-error";

        resultado.textContent =
            "Ingrese un código.";

        return;
    }

    try {

        const compra = await sql`
            SELECT *
            FROM compras_entradas_eventos
            WHERE codigo_seguimiento
            ILIKE ${"%" + codigo + "%"}
        `;

        if (compra.length === 0) {

            resultado.className =
                "estado-error";

            resultado.textContent =
                "Compra no encontrada.";

            return;
        }

        const c = compra[0];

        resultado.className =
            "estado-correcto";

        resultado.innerHTML = `
            <p><strong>Código:</strong> ${c.codigo_seguimiento}</p>
            <p><strong>Cliente:</strong> ${c.nombre_cliente}</p>
            <p><strong>Evento:</strong> ${c.evento}</p>
            <p><strong>Tipo:</strong> ${c.tipo}</p>
            <p><strong>Cantidad:</strong> ${c.cantidad}</p>
            <p><strong>Estado:</strong> ${c.estado}</p>
        `;

    } catch (error) {

        console.error(error);

        resultado.className =
            "estado-error";

        resultado.textContent =
            "Error al buscar compra.";
    }
}

window.buscarCompra =
    buscarCompra;

/* =========================
   REGISTRAR INCIDENCIA
========================= */

async function guardarIncidencia() {

    const incidencia = document
        .getElementById("incidencia")
        .value
        .trim();

    if (!incidencia) {

        alert("Ingrese una incidencia.");
        return;
    }

    try {

        await sql`
            INSERT INTO incidencias
            (
                empleado_id,
                descripcion
            )
            VALUES
            (
                ${usuario.id},
                ${incidencia}
            )
        `;

        alert(
            "Incidencia registrada correctamente."
        );

        document.getElementById(
            "incidencia"
        ).value = "";

    } catch (error) {

        console.error(error);

        alert(
            "Error al registrar incidencia."
        );
    }
}

window.guardarIncidencia =
    guardarIncidencia;

/* =========================
   TABLA DE COMPRAS
========================= */

async function cargarCompras() {

    const tabla =
        document.getElementById(
            "tablaCompras"
        );

    if (!tabla) return;

    try {

        const compras = await sql`
            SELECT *
            FROM compras_entradas_eventos
            ORDER BY id DESC
        `;

        tabla.innerHTML = "";

        compras.forEach(compra => {

            tabla.innerHTML += `
                <tr>
                    <td>${compra.id}</td>
                    <td>${compra.nombre_cliente}</td>
                    <td>${compra.evento}</td>
                    <td>${compra.estado}</td>
                </tr>
            `;
        });

    } catch (error) {

        console.error(error);

        tabla.innerHTML = `
            <tr>
                <td colspan="4">
                    Error al cargar compras
                </td>
            </tr>
        `;
    }
}
