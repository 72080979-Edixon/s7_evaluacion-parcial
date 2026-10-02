import { sql } from '../config/neon-config.js';

export async function guardarRegistro(datos) {
  const codigo = 'COD-' + Date.now().toString().slice(-8);

  await sql`
    INSERT INTO compras_entradas_eventos (codigo_seguimiento, nombre_cliente, evento, tipo, cantidad)
    VALUES (${codigo}, ${datos.nombre_cliente}, ${datos.evento}, ${datos.tipo}, ${datos.cantidad})
  `;
  return codigo;
}

// Escuchar el formulario de pago
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-pago");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const evento = params.get("evento")?.replace(/_/g, " ") || "Evento desconocido";

    // 🔑 Aquí tomamos el usuario de la sesión
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const nombreCliente = usuario ? usuario.nombre : "Cliente demo";

    const datos = {
      nombre_cliente: nombreCliente,
      evento: evento,
      tipo: form.tipo.value,
      cantidad: parseInt(form.cantidad.value)
    };

    const codigo = await guardarRegistro(datos);

    const mensaje = document.getElementById("mensaje-confirmacion");
    mensaje.textContent = `¡${datos.tipo.toUpperCase()} confirmada! ${datos.cantidad} entrada(s) para ${datos.evento}. Código: ${codigo}`;
    mensaje.classList.add("mostrar");
  });
});