// index.js
const express = require("express");
const db = require("./db");

const app = express();
const PORT = 7050;

app.use(express.json());
app.use(express.static("public"));

/* 
   RUTA GET /usos → todos los usos
 */
app.get("/usos", async (req, res) => {
  try {
    const resultados = await db.sql(`
      SELECT t.id_uso, p.nombre_provincia, e.nombre_empresa, t.dia_transporte,
             t.linea, t.tipo_transporte, t.cantidad, t.dato_preliminar
      FROM transporte_uso t
      JOIN provincia p ON t.id_provincia = p.id_provincia
      JOIN empresa_transporte e ON t.id_empresa = e.id_empresa
    `);
    res.status(200).json(resultados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 
   RUTA GET /usos/:id → uso individual
 */
app.get("/usos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const resultados = await db.sql(`
      SELECT t.id_uso, p.nombre_provincia, e.nombre_empresa, t.dia_transporte,
             t.linea, t.tipo_transporte, t.cantidad, t.dato_preliminar
      FROM transporte_uso t
      JOIN provincia p ON t.id_provincia = p.id_provincia
      JOIN empresa_transporte e ON t.id_empresa = e.id_empresa
      WHERE t.id_uso = ${id}
    `);

    if (resultados.length === 0) {
      return res.status(404).json({ error: "Uso no encontrado" });
    }

    res.status(200).json(resultados[0]); // sin .toJSON()
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/usos", async (req, res) => {
    //Usamos esta forma abreviada para sacar todos los campos del req.body de una sola vez.
  const {
    id_provincia,
    id_empresa,
    dia_transporte,
    linea,
    tipo_transporte,
    cantidad,
    dato_preliminar
  } = req.body;

  // Validación 
  //Evita que se intente insertar un registro si algún campo obligatorio no está presente.
  //Evita que se intente hacer un INSERT INTO con campos vacíos
  if (
    !id_provincia || !id_empresa || !dia_transporte ||
    !linea || !tipo_transporte || cantidad == null || !dato_preliminar
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const query = `
      INSERT INTO transporte_uso (
        id_provincia, id_empresa, dia_transporte,
        linea, tipo_transporte, cantidad, dato_preliminar
      )
      VALUES (
        ${id_provincia}, ${id_empresa}, '${dia_transporte}',
        '${linea}', '${tipo_transporte}', ${cantidad}, '${dato_preliminar}'
      )
    `;
    await db.sql(query);
    res.status(201).json({ message: "Uso agregado con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 
   RUTA GET /usos/rango/:desde/:hasta → por ID de rango
 */
app.get("/usos/rango/:desde/:hasta", async (req, res) => {
  // Convertimos los parámetros a números
  const desde = parseInt(req.params.desde);
  const hasta = parseInt(req.params.hasta);

  // Validación básica: ambos deben ser números válidos
  if (isNaN(desde) || isNaN(hasta)) {
    return res.status(400).json({ error: "Los parámetros deben ser números" });
  }

  if (desde > hasta) {
    return res.status(400).json({ error: "El valor 'desde' no puede ser mayor que 'hasta'" });
  }

  try {
    // Hacemos la consulta con BETWEEN
    const resultados = await db.sql(`
      SELECT t.id_uso, p.nombre_provincia, e.nombre_empresa, t.dia_transporte,
             t.linea, t.tipo_transporte, t.cantidad, t.dato_preliminar
      FROM transporte_uso t
      JOIN provincia p ON t.id_provincia = p.id_provincia
      JOIN empresa_transporte e ON t.id_empresa = e.id_empresa
      WHERE t.id_uso BETWEEN ${desde} AND ${hasta}
    `);

    // Devolvemos el resultado
    res.status(200).json(resultados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* 
   RUTA PUT /usos/:id → actualizar un uso
 */
app.put("/usos/:id", async (req, res) => {
  // Extraemos el ID de la URL y lo convertimos en número
  const id = parseInt(req.params.id);

  // Extraemos los datos del body (igual que en POST)
  const {
    id_provincia,
    id_empresa,
    dia_transporte,
    linea,
    tipo_transporte,
    cantidad,
    dato_preliminar
  } = req.body;

  // Validación simple (como en POST)
  if (
    !id_provincia || !id_empresa || !dia_transporte ||
    !linea || !tipo_transporte || cantidad == null || !dato_preliminar
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    // Query SQL para actualizar el uso por ID
    const query = `
      UPDATE transporte_uso SET
        id_provincia = ${id_provincia},
        id_empresa = ${id_empresa},
        dia_transporte = '${dia_transporte}',
        linea = '${linea}',
        tipo_transporte = '${tipo_transporte}',
        cantidad = ${cantidad},
        dato_preliminar = '${dato_preliminar}'
      WHERE id_uso = ${id}
    `;

    // Ejecutamos el UPDATE
    await db.sql(query);

    // Respondemos con éxito
    res.status(200).json({ message: `Uso con ID ${id} actualizado con éxito` });
  } catch (err) {
    // Si algo sale mal, mostramos el error
    res.status(500).json({ error: err.message });
  }
});

/* 
   RUTA DELETE /usos/:id → eliminar un uso
 */
app.delete("/usos/:id", async (req, res) => {
  // Extraemos el ID de la URL
  const id = parseInt(req.params.id);

  try {
    // Primero verificamos si el ID existe
    const resultado = await db.sql(`SELECT * FROM transporte_uso WHERE id_uso = ${id}`);

    if (resultado.length === 0) {
      return res.status(404).json({ error: `No se encontró un uso con ID ${id}` });
    }

    // Ejecutamos el DELETE
    await db.sql(`DELETE FROM transporte_uso WHERE id_uso = ${id}`);

    // Respondemos con mensaje de éxito
    res.status(200).json({ message: `Uso con ID ${id} eliminado con éxito` });
  } catch (err) {
    // Si hay un error, lo devolvemos
    res.status(500).json({ error: err.message });
  }
});


/* ----------------------------
   INICIAR SERVIDOR
----------------------------- */
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

