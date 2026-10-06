import { sql } from "../config/neon-config.js";

/* REGISTRO */

export async function registrarUsuario(nombre, correo, contrasena) {
    await sql`
        INSERT INTO usuarios (nombre, correo, contrasena, rol)
        VALUES (${nombre}, ${correo}, ${contrasena}, 'cliente')
    `;
}

/* LOGIN */

export async function iniciarSesion(correo, contrasena) {

    const usuario = await sql`
        SELECT
            id,
            nombre,
            correo,
            rol,
            turno,
            hora_inicio,
            hora_fin
        FROM usuarios
        WHERE correo = ${correo}
        AND contrasena = ${contrasena}
    `;

    if (usuario.length === 0) {
        return null;
    }

    const datosUsuario = usuario[0];

    datosUsuario.fueraHorario = false;

    if (
        datosUsuario.rol === "empleado" &&
        datosUsuario.hora_inicio &&
        datosUsuario.hora_fin
    ) {

        const horaActual =
            new Date().getHours();

        const horaInicio =
            Number(
                datosUsuario.hora_inicio
                    .split(":")[0]
            );

        const horaFin =
            Number(
                datosUsuario.hora_fin
                    .split(":")[0]
            );

        if (
            horaActual < horaInicio ||
            horaActual >= horaFin
        ) {

            alert(
                `Fuera de horario.

Turno: ${datosUsuario.turno}

Ingresará en modo consulta.`
            );

            datosUsuario.fueraHorario = true;

        } else {

            datosUsuario.fueraHorario = false;
        }
    }

    sessionStorage.setItem(
        "usuario",
        JSON.stringify(datosUsuario)
    );

    return datosUsuario;
}

/* CERRAR */

export function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html";
}

/* SESIÓN */

export function exigirSesion() {

    const usuario =
        sessionStorage.getItem("usuario");

    if (!usuario) {

        window.location.href =
            "login.html";

        return null;
    }

    return JSON.parse(usuario);
}

/* REGISTRO */

const formRegistro =
    document.getElementById("formRegistro");

if (formRegistro) {

    formRegistro.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            try {

                const nombre =
                    document.getElementById("nombre").value;

                const correo =
                    document.getElementById("correo").value;

                const contrasena =
                    document.getElementById("contrasena").value;

                await registrarUsuario(
                    nombre,
                    correo,
                    contrasena
                );

                const mensaje =
                    document.getElementById(
                        "mensaje-registro"
                    );

                mensaje.textContent =
                    "Cuenta creada correctamente.";

                formRegistro.reset();

            } catch (error) {

                console.error(error);

                alert(
                    "Error al registrar usuario."
                );
            }
        }
    );
}

/* LOGIN */

const formLogin =
    document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            try {

                const correo =
                    document.getElementById(
                        "correoLogin"
                    ).value;

                const contrasena =
                    document.getElementById(
                        "contrasenaLogin"
                    ).value;

                const usuario =
                    await iniciarSesion(
                        correo,
                        contrasena
                    );

                const mensaje =
                    document.getElementById(
                        "mensaje-registro"
                    );

                if (!usuario) {

                    mensaje.textContent =
                        "Correo o contraseña incorrectos.";

                    return;
                }

                console.log("Usuario:", usuario);
                console.log("Rol:", usuario.rol);

                const rol =
                    usuario.rol
                        .toLowerCase()
                        .trim();

                mensaje.textContent =
                    `Bienvenido ${usuario.nombre}`;

                setTimeout(() => {

                    if (rol === "cliente") {

                        window.location.href =
                            "catalogo.html";

                    } else if (rol === "empleado") {

                        window.location.href =
                            "empleado.html";

                    } else if (
                        rol === "administrador" ||
                        rol === "admin"
                    ) {

                        window.location.href =
                            "panel.html";

                    } else {

                        mensaje.textContent =
                            `Rol no reconocido: ${usuario.rol}`;
                    }

                }, 1000);

            } catch (error) {

                console.error(error);

                alert(
                    "Error al iniciar sesión."
                );
            }
        }
    );
}
