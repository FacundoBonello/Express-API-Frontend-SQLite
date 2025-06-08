# 🚌 Proyecto API SUBE + Frontend Interactivo

Este proyecto es una **aplicación** desarrollada con **Node.js + Express** para manejar datos de transporte público (como los viajes SUBE), conectada a una base de datos remota en **SQLiteCloud**. Incluye un **frontend simple** en HTML, CSS y JavaScript puro para interactuar con la API.

---

## Tecnologías utilizadas

- **Backend:** Node.js, Express
- **Base de datos remota:** SQLiteCloud.io
- **Frontend:** HTML, CSS, JS 
- **Pruebas:** Thunder Client


---

## Funcionalidades

### Backend CRUD (rutas disponibles):

- `GET /usos` → Lista todos los viajes.
- `GET /usos/:id` → Muestra un viaje específico por ID.
- `GET /usos/rango/:desde/:hasta` → Muestra viajes entre dos IDs.
- `POST /usos` → Agrega un nuevo viaje.
- `PUT /usos/:id` → Modifica un viaje existente.
- `DELETE /usos/:id` → Elimina un viaje por ID.


### Frontend (disponible en `/public`):

- `index.html` → Pantalla principal con acceso a todas las funciones.
- `get.html` → Obtener viajes (todos, por ID, entre dos IDs).
- `put.html` → Modificar un viaje existente.
- `post.html` → Agregar un nuevo viaje.
- `delete.html` → Eliminar viajes por ID.

---


