import { sql } from "../config/neon-config.js";

const usuarioGuardado =
    sessionStorage.getItem("usuario");

if (!usuarioGuardado) {
    window.location.href =
        "../html/login.html";
}

const usuario =
    JSON.parse(usuarioGuardado);

const params =
    new URLSearchParams(
        window.location.search
    );

const entradaId =
    params.get("id");

const eventos = {
    Shakira_World_Tour: {
        nombre: "Shakira World Tour",
        fecha: "2026-10-15",
        lugar: "Lima",
        precio: 350
    },

    Coldplay_Live: {
        nombre: "Coldplay Live",
        fecha: "2026-10-25",
        lugar: "Lima",
        precio: 400
    },

    Grupo5_Fiesta_Norteña: {
        nombre: "Grupo 5 – Fiesta Norteña",
        fecha: "2026-10-20",
        lugar: "Chiclayo",
        precio: 120
    },

    Festival_Marinera: {
        nombre: "Festival de Marinera",
        fecha: "2026-10-28",
        lugar: "Lima",
        precio: 90
    },

    Broadway_Teatro: {
        nombre: "Obra de Teatro – Broadway",
        fecha: "2026-11-05",
        lugar: "Lima",
        precio: 80
    },

    Feria_Libro: {
        nombre: "Feria Internacional del Libro",
        fecha: "2026-11-25",
        lugar: "Lima",
        precio: 0
    },

    Clasico_Futbol: {
        nombre: "Clásico Alianza vs Universitario",
        fecha: "2026-11-18",
        lugar: "Lima",
        precio: 150
    },

    Sudamericano_Voley: {
        nombre: "Campeonato Sudamericano de Vóley",
        fecha: "2026-11-22",
        lugar: "Trujillo",
        precio: 100
    }
};

const form =
    document.getElementById(
        "form-actualizar"
    );

const eventoSelect =
    document.getElementById(
        "evento"
    );

const tipoSelect =
    document.getElementById(
        "tipo"
    );

const mensaje =
    document.getElementById(
        "mensaje"
    );

async function cargarEntrada() {

    if (!entradaId) {

        mensaje.textContent =
            "No se encontró la entrada.";

        return;
    }

    try {

        const entradas = await sql`
            SELECT
                id,
                evento,
                fecha_evento,
                lugar,
                tipo,
                precio,
                codigo,
                estado
            FROM entradas
            WHERE id = ${entradaId}
            AND usuario_id = ${usuario.id}
        `;

        if (
            entradas.length === 0
        ) {

            mensaje.textContent =
                "La entrada no existe o no te pertenece.";

            return;
        }

        const entrada =
            entradas[0];

        if (
            entrada.estado === "cancelada"
        ) {

            mensaje.textContent =
                "Esta entrada fue cancelada y no puede modificarse.";

            form.style.display =
                "none";

            return;
        }

        for (const clave in eventos) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = clave;

            option.textContent =
                eventos[clave].nombre;

            eventoSelect.appendChild(
                option
            );
        }

        const eventoActual =
            Object.keys(eventos).find(
                clave =>
                    eventos[clave].nombre ===
                    entrada.evento
            );

        if (eventoActual) {
            eventoSelect.value =
                eventoActual;
        }

        tipoSelect.value =
            entrada.tipo;

        document.getElementById(
            "codigo"
        ).textContent =
            entrada.codigo;

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No se pudo cargar la entrada.";
    }
}

eventoSelect.addEventListener(
    "change",
    () => {

        const evento =
            eventos[eventoSelect.value];

        if (!evento) return;

        document.getElementById(
            "fecha"
        ).textContent =
            evento.fecha;

        document.getElementById(
            "lugar"
        ).textContent =
            evento.lugar;

        document.getElementById(
            "precio"
        ).textContent =
            "S/ " + evento.precio;
    }
);

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const evento =
            eventos[eventoSelect.value];

        if (!evento) {

            alert(
                "Selecciona un evento."
            );

            return;
        }

        try {

            await sql`
                UPDATE entradas
                SET
                    evento = ${evento.nombre},
                    fecha_evento = ${evento.fecha},
                    lugar = ${evento.lugar},
                    tipo = ${tipoSelect.value},
                    precio = ${evento.precio}
                WHERE id = ${entradaId}
                AND usuario_id = ${usuario.id}
            `;

            mensaje.textContent =
                "Entrada actualizada correctamente.";

            setTimeout(() => {

                window.location.href =
                    "consulta.html";

            }, 1200);

        } catch (error) {

            console.error(error);

            mensaje.textContent =
                "No se pudo actualizar la entrada.";
        }
    }
);

document
    .getElementById("btn-cancelar")
    .addEventListener(
        "click",
        async () => {

            const confirmar =
                confirm(
                    "¿Seguro que deseas cancelar esta entrada?"
                );

            if (!confirmar) return;

            try {

                await sql`
                    UPDATE entradas
                    SET estado = 'cancelada'
                    WHERE id = ${entradaId}
                    AND usuario_id = ${usuario.id}
                `;

                alert(
                    "Entrada cancelada correctamente."
                );

                window.location.href =
                    "consulta.html";

            } catch (error) {

                console.error(error);

                alert(
                    "No se pudo cancelar la entrada."
                );
            }
        }
    );

cargarEntrada();