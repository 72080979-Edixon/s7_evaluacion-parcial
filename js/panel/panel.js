import { sql } from "../config/neon-config.js";

const usuario = JSON.parse(sessionStorage.getItem("usuario"));

window.addEventListener("DOMContentLoaded", () => {

    const btnEmpleado =
        document.getElementById(
            "btnEmpleado"
        );

    if(!btnEmpleado) return;

    if(usuario.rol === "empleado"){

        btnEmpleado.style.display =
            "inline-block";

    }else{

        btnEmpleado.style.display =
            "none";

    }

});

if (!usuario) {
    window.location.href = "../html/login.html";
}

if (
    usuario.rol !== "administrador" &&
    usuario.rol !== "admin" &&
    usuario.rol !== "empleado"
) {
    alert("Acceso denegado");
    window.location.href = "../html/catalogo.html";
}

const titulo = document.querySelector(".encabezado h2");

if (titulo) {

    if (usuario.rol === "empleado") {

        titulo.textContent =
            `Panel de Empleado - ${usuario.nombre}`;

    } else {

        titulo.textContent =
            `Panel de Administrador - ${usuario.nombre}`;
    }
}

if (usuario.rol === "empleado") {

    window.addEventListener("load", () => {

        document.getElementById("btnUsuarios")
            ?.parentElement.style.setProperty(
                "display",
                "none"
            );

        document.getElementById("btnEmpleados")
            ?.parentElement.style.setProperty(
                "display",
                "none"
            );

    });

}

document.getElementById("btnCerrarSesion")?.addEventListener("click", () => {
    sessionStorage.removeItem("usuario");
    window.location.href = "../html/login.html";
});

/* =========================
   ESTADÍSTICAS
========================= */

async function cargarEstadisticas() {
    try {
        const usuarios =
    await sql`
        SELECT *
        FROM usuarios
        WHERE activo = TRUE
    `;
        const empleados =
    await sql`
        SELECT *
        FROM usuarios
        WHERE rol='empleado'
        AND activo = TRUE
    `;
        const compras = await sql`SELECT * FROM compras_entradas_eventos`;
        const entradas = await sql`SELECT * FROM entradas`;

        document.getElementById("totalUsuarios").textContent = usuarios.length;
        document.getElementById("totalEmpleados").textContent = empleados.length;
        document.getElementById("totalCompras").textContent = compras.length;
        document.getElementById("totalEntradas").textContent = entradas.length;
    } catch (error) {
        console.error(error);
    }
}

/* =========================
   USUARIOS
========================= */

async function mostrarUsuarios() {
    document.getElementById("cabeceraTabla").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
        </tr>
    `;

    const usuarios = await sql`
        SELECT id,nombre,correo,rol
        FROM usuarios
        WHERE activo = TRUE
        ORDER BY id
    `;

    const tabla = document.getElementById("tablaDatos");
    tabla.innerHTML = "";

    usuarios.forEach(u => {
        tabla.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>${u.rol}</td>
               <td>

    <button
        class="btn-eliminar"
        onclick="eliminarUsuario(${u.id})">

        Eliminar

    </button>

</td>
            </tr>
        `;
    });
}

/* =========================
   EMPLEADOS
========================= */

async function mostrarEmpleados() {
    document.getElementById("cabeceraTabla").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
        </tr>
    `;

    const empleados = await sql`
        SELECT id,nombre,correo,rol
        FROM usuarios
        WHERE rol='empleado'
        AND activo = TRUE
        ORDER BY id
    `;

    const tabla = document.getElementById("tablaDatos");
    tabla.innerHTML = "";

    empleados.forEach(e => {
        tabla.innerHTML += `
            <tr>
                <td>${e.id}</td>
                <td>${e.nombre}</td>
                <td>${e.correo}</td>
                <td>${e.rol}</td>
            </tr>
        `;
    });
}

/* =========================
   COMPRAS
========================= */

async function mostrarCompras() {
    document.getElementById("cabeceraTabla").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Evento</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Acciones</th>
        </tr>
    `;

    const compras = await sql`
        SELECT *
        FROM compras_entradas_eventos
        ORDER BY id DESC
    `;

    const tabla = document.getElementById("tablaDatos");
    tabla.innerHTML = "";

    compras.forEach(c => {
        tabla.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.nombre_cliente}</td>
                <td>${c.evento}</td>
                <td>${c.cantidad}</td>
                <td>${c.estado}</td>
                <td>
                    <button onclick="editarCompra(${c.id})">Editar</button>
                    <button onclick="eliminarCompra(${c.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

/* =========================
   ENTRADAS
========================= */

async function mostrarEntradas() {
    document.getElementById("cabeceraTabla").innerHTML = `
        <tr>
            <th>ID</th>
            <th>Evento</th>
            <th>Lugar</th>
            <th>Estado</th>
            <th>Código</th>
            <th>Acciones</th>
        </tr>
    `;

    const entradas = await sql`
        SELECT *
        FROM entradas
        ORDER BY id DESC
    `;

    const tabla = document.getElementById("tablaDatos");
    tabla.innerHTML = "";

    entradas.forEach(e => {
    tabla.innerHTML += `
        <tr>
            <td>${e.id}</td>
            <td>${e.evento}</td>
            <td>${e.lugar}</td>
            <td>${e.estado}</td>
            <td>${e.codigo}</td>

            <td>
                <div class="acciones">

                    <button
                        class="btn-editar"
                        onclick="editarEntrada(${e.id})">
                        Editar
                    </button>

                    <button
                        class="btn-eliminar"
                        onclick="eliminarEntrada(${e.id})">
                        Eliminar
                    </button>

                </div>
            </td>

        </tr>
    `;
});
}

/* =========================
   CREAR COMPRA
========================= */

document.getElementById("btnCrearCompra")?.addEventListener("click", async () => {
    try {
        const cliente = document.getElementById("clienteCompra").value;
        const evento = document.getElementById("eventoCompra").value;
        const cantidad = document.getElementById("cantidadCompra").value;

        const codigo = "COD-" + Math.floor(Math.random() * 99999999);

        await sql`
            INSERT INTO compras_entradas_eventos
            (
                codigo_seguimiento,
                nombre_cliente,
                evento,
                tipo,
                cantidad,
                estado
            )
            VALUES
            (
                ${codigo},
                ${cliente},
                ${evento},
                'reserva',
                ${cantidad},
                'registrado'
            )
        `;

        alert("Compra registrada");
        mostrarCompras();
        cargarEstadisticas();

    } catch (error) {
        console.error(error);
    }
});

/* =========================
   EDITAR
========================= */

async function editarCompra(id) {
    const estado = prompt("Nuevo estado:", "registrado");

    if (!estado) return;

    try {
        await sql`
            UPDATE compras_entradas_eventos
            SET estado = ${estado}
            WHERE id = ${id}
        `;

        mostrarCompras();

    } catch (error) {
        console.error(error);
    }
}

async function editarEntrada(id) {

    const estado = prompt(
        "Nuevo estado:",
        "valida"
    );

    if (!estado) return;

    try {

        await sql`
            UPDATE entradas
            SET estado = ${estado}
            WHERE id = ${id}
        `;

        mostrarEntradas();

    } catch(error) {

        console.error(error);
    }
}
/* =========================
   ELIMINAR
========================= */

async function eliminarCompra(id) {
    if (!confirm("¿Eliminar compra?")) return;

    try {
        await sql`
            DELETE FROM compras_entradas_eventos
            WHERE id = ${id}
        `;

        mostrarCompras();
        cargarEstadisticas();

    } catch (error) {
        console.error(error);
    }
}

async function eliminarEntrada(id) {
 
const confirmar = confirm(
"¿Eliminar entrada?"
);
 
if (!confirmar) return;
 
try {
 
await sql`
DELETE FROM entradas
WHERE id = ${id}
`;
 
mostrarEntradas();
cargarEstadisticas();
 
} catch(error) {
 
console.error(error);
}
}

async function eliminarUsuario(id){

    const confirmar = confirm(
        "¿Eliminar usuario?"
    );

    if(!confirmar) return;

    try{

        await sql`
            UPDATE usuarios
            SET activo = FALSE
            WHERE id = ${id}
        `;

        alert(
            "Usuario eliminado correctamente"
        );

        mostrarUsuarios();

        cargarEstadisticas();

    }catch(error){

        console.error(error);

        alert(
            "No se pudo eliminar el usuario"
        );
    }
}
/* =========================
   BOTONES
========================= */

document.getElementById("btnUsuarios")?.addEventListener("click", mostrarUsuarios);
document.getElementById("btnEmpleados")?.addEventListener("click", mostrarEmpleados);
document.getElementById("btnCompras")?.addEventListener("click", mostrarCompras);
document.getElementById("btnEntradas")?.addEventListener("click", mostrarEntradas);

/* =========================
   GLOBALES
========================= */

window.editarCompra = editarCompra;
window.eliminarCompra = eliminarCompra;
window.editarEntrada = editarEntrada;
window.eliminarEntrada = eliminarEntrada;
window.eliminarUsuario = eliminarUsuario;

/* =========================
   INICIO
========================= */

cargarEstadisticas();
mostrarUsuarios();
