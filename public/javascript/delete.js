document.getElementById("formulario-delete").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("id_borrar").value;

  try {
    const res = await fetch(`http://localhost:7050/usos/${id}`, {
      method: "DELETE"
    });

    const json = await res.json();

    if (res.ok) {
      document.getElementById("mensaje-delete").innerText = `✅ Elimiado con exito`;
    } else {
      document.getElementById("mensaje-delete").innerText = `❌ Error: ${json.error}`;
    }

  } catch (err) {
    document.getElementById("mensaje-delete").innerText = "❌ Error al conectar con el servidor";
  }
});
