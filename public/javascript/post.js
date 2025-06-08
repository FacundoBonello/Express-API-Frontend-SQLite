document.getElementById("formulario-post").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    id_provincia: parseInt(document.getElementById("id_provincia").value),
    id_empresa: parseInt(document.getElementById("id_empresa").value),
    dia_transporte: document.getElementById("dia_transporte").value,
    linea: document.getElementById("linea").value,
    tipo_transporte: document.getElementById("tipo_transporte").value,
    cantidad: parseInt(document.getElementById("cantidad").value),
    dato_preliminar: document.getElementById("dato_preliminar").value.toUpperCase()
  };

  try {
    const res = await fetch("http://localhost:7050/usos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (res.ok) {
      document.getElementById("mensaje-post").innerText = `✅ Viaje agregado correctamente `;
    } else {
      document.getElementById("mensaje-post").innerText = `❌ Error: ${json.error}`;
    }
  } catch (err) {
    document.getElementById("mensaje-post").innerText = `❌ Error de red o servidor`;
  }
});
