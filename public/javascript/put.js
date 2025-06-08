document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-put");
  const mensaje = document.getElementById("mensaje-put");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const id_uso = document.getElementById("id-uso").value;
    const id_provincia = document.getElementById("id-provincia").value;
    const id_empresa = document.getElementById("id-empresa").value;
    const dia_transporte = document.getElementById("dia-transporte").value;
    const linea = document.getElementById("linea").value;
    const tipo_transporte = document.getElementById("tipo-transporte").value;
    const cantidad = document.getElementById("cantidad").value;
    const dato_preliminar = document.getElementById("dato-preliminar").value;

    // Objeto a enviar
    const body = {
      id_provincia,
      id_empresa,
      dia_transporte,
      linea,
      tipo_transporte,
      cantidad,
      dato_preliminar
    };

    try {
      const res = await fetch(`/usos/${id_uso}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        mensaje.textContent = `✅ Viaje ID ${id_uso} modificado correctamente.`;
      } else {
        mensaje.textContent = `❌ Error: ${data.error}`;
      }
    } catch (err) {
      mensaje.textContent = "❌ Error al modificar el viaje.";
      console.error(err);
    }
  });
});
