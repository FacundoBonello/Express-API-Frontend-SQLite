// window.addEventListener('DOMContentLoaded', ...) asegura que el código dentro de esta función
// se ejecutará solo cuando todo el contenido HTML de la página (el DOM) haya sido cargado completamente.
// Esto previene errores si intentamos acceder a elementos HTML que aún no existen.
window.addEventListener('DOMContentLoaded', () => {
  // --- Elementos DOM ---
  // Aquí estamos declarando constantes para referenciar los elementos HTML por su 'id'.
  // Esto nos permite interactuar con ellos desde JavaScript, como agregarles "escuchadores" de eventos
  // (como clicks) o modificar su contenido.

  // Botón para mostrar/ocultar todos los "usos" 
  const btnTodos = document.getElementById('btn-get-todos');
  // Lista donde se mostrarán todos los "usos".
  const listaTodos = document.getElementById('lista-todos');

  // Botón para buscar un "uso" por su ID.
  const btnBuscarId = document.getElementById('btn-buscar-id');
  // Botón para ocultar el resultado de la búsqueda por ID.
  const btnOcultarId = document.getElementById('btn-ocultar-id');
  // Campo de entrada de texto donde el usuario ingresará el ID a buscar.
  const inputId = document.getElementById('input-id');
  // Elemento donde se mostrará el resultado de la búsqueda por ID.
  const resultadoId = document.getElementById('resultado-id');

  // Botón para buscar "usos" dentro de un rango de IDs.
  const btnBuscarRango = document.getElementById('btn-buscar-rango');
  // Botón para ocultar los resultados de la búsqueda por rango.
  const btnOcultarRango = document.getElementById('btn-ocultar-rango');
  // Campo de entrada para el ID inicial del rango.
  const inputDesde = document.getElementById('input-desde');
  // Campo de entrada para el ID final del rango.
  const inputHasta = document.getElementById('input-hasta');
  // Lista donde se mostrarán los resultados de la búsqueda por rango.
  const listaRango = document.getElementById('lista-rango');

  // Variable de estado para saber si estamos mostrando todos los viajes o no.
  // Es un "interruptor" lógico.
  let mostrandoTodos = false;

  // --- Mostrar / Ocultar todos los viajes ---
  // Agregamos un "escuchador de eventos" al botón 'btnTodos'.
  // Cuando se haga clic en este botón, se ejecutará la función asíncrona que le pasamos.
  btnTodos.addEventListener('click', async () => {
    // Si 'mostrandoTodos' es verdadero (es decir, los viajes ya están visibles),
    // entonces queremos ocultarlos.
    if (mostrandoTodos) {
      // Limpiamos el contenido HTML de la lista para vaciarla.
      listaTodos.innerHTML = '';
      // Cambiamos el texto del botón para que diga "Mostrar todos" de nuevo.
      btnTodos.textContent = 'Mostrar todos';
      // Actualizamos el estado a falso, indicando que ya no estamos mostrando todos.
      mostrandoTodos = false;
      // Salimos de la función.
      return;
    }

    // Si llegamos aquí, significa que 'mostrandoTodos' era falso,
    // y queremos mostrar los viajes.
    try {
      // Intentamos hacer una solicitud a la API (servidor) para obtener todos los "usos".
      // 'fetch' es una función moderna para hacer solicitudes de red.
      // 'await' pausa la ejecución hasta que la promesa (la respuesta de la red) se resuelva.
      const res = await fetch('/usos');
      // Una vez que tenemos la respuesta, la convertimos a formato JSON.
      const datos = await res.json();

      // Limpiamos la lista antes de agregar los nuevos elementos, por si había algo.
      listaTodos.innerHTML = '';
      // Iteramos sobre cada 'viaje' en los 'datos' recibidos.
      datos.forEach((viaje) => {
        // Creamos un nuevo elemento de lista (<li>) para cada viaje.
        const li = document.createElement('li');
        // Asignamos el texto al elemento <li> utilizando los datos del viaje.
        // Aquí se está formateando la información del viaje de una manera legible.
        li.textContent = `${viaje.id_uso} - ${viaje.nombre_provincia} - ${viaje.linea} (${viaje.tipo_transporte}) | Fecha: ${viaje.dia_transporte} | Cantidad: ${viaje.cantidad}`;
        // Agregamos el elemento <li> recién creado a la lista <ul> en el HTML.
        listaTodos.appendChild(li);
      });

      // Cambiamos el texto del botón para que ahora diga "Ocultar todos".
      btnTodos.textContent = 'Ocultar todos';
      // Actualizamos el estado a verdadero, indicando que ahora estamos mostrando todos.
      mostrandoTodos = true;
    } catch (err) {
      // Si ocurre algún error durante la solicitud o el procesamiento,
      // mostramos una alerta al usuario y registramos el error en la consola
      // del navegador para depuración.
      alert('Error al obtener todos los viajes');
      console.error(err);
    }
  });

  // --- Buscar por ID ---
  // Agregamos un "escuchador de eventos" al botón 'btnBuscarId'.
  btnBuscarId.addEventListener('click', async () => {
    // Obtenemos el valor que el usuario ingresó en el campo 'inputId'.
    const id = inputId.value;
    // Verificamos si el campo está vacío. Si lo está, mostramos una alerta y salimos.
    if (!id) return alert('Ingresá un ID válido');

    try {
      // Intentamos hacer una solicitud a la API para buscar un "uso" por su ID.
      // La URL incluye el ID directamente (por ejemplo, /usos/123).
      const res = await fetch(`/usos/${id}`);
      // Convertimos la respuesta a JSON.
      const dato = await res.json();

      // Si la respuesta JSON contiene una propiedad 'error',
      // significa que el servidor no encontró el viaje con ese ID.
      if (dato.error) {
        resultadoId.textContent = 'No se encontró el viaje con ese ID.';
      } else {
        // Si no hay error, mostramos los detalles del viaje encontrado.
        resultadoId.textContent = `${dato.id_uso} - ${dato.nombre_provincia} - ${dato.linea} (${dato.tipo_transporte}) | Fecha: ${dato.dia_transporte} | Cantidad: ${dato.cantidad}`;
      }
    } catch (err) {
      // Manejo de errores de la solicitud.
      alert('Error al buscar por ID');
      console.error(err);
    }
  });

  // Agregamos un "escuchador de eventos" al botón 'btnOcultarId'.
  btnOcultarId.addEventListener('click', () => {
    // Cuando se hace clic, limpiamos el contenido del elemento 'resultadoId'.
    resultadoId.innerHTML = '';
  });

  // --- Buscar por rango ---
  // Agregamos un "escuchador de eventos" al botón 'btnBuscarRango'.
  btnBuscarRango.addEventListener('click', async () => {
    // Obtenemos los valores de los campos "desde" y "hasta".
    const desde = inputDesde.value;
    const hasta = inputHasta.value;

    // Verificamos si alguno de los campos está vacío.
    if (!desde || !hasta) return alert('Completá ambos campos');

    try {
      // Hacemos una solicitud a la API para buscar "usos" dentro del rango de IDs.
      // La URL incluye ambos IDs (por ejemplo, /usos/rango/10/20).
      const res = await fetch(`/usos/rango/${desde}/${hasta}`);
      // Convertimos la respuesta a JSON.
      const datos = await res.json();

      // Limpiamos la lista antes de agregar los nuevos elementos.
      listaRango.innerHTML = '';
      // Iteramos sobre cada 'viaje' en los 'datos' recibidos del rango.
      datos.forEach((viaje) => {
        // Creamos un nuevo elemento <li>.
        const li = document.createElement('li');
        // Asignamos el texto al elemento <li> con la información del viaje.
        li.textContent = `${viaje.id_uso} - ${viaje.nombre_provincia} - ${viaje.linea} (${viaje.tipo_transporte}) | Fecha: ${viaje.dia_transporte} | Cantidad: ${viaje.cantidad}`;
        // Agregamos el elemento <li> a la lista de resultados del rango.
        listaRango.appendChild(li);
      });
    } catch (err) {
      // Manejo de errores de la solicitud por rango.
      alert('Error al buscar rango de IDs');
      console.error(err);
    }
  });

  // Agregamos un "escuchador de eventos" al botón 'btnOcultarRango'.
  btnOcultarRango.addEventListener('click', () => {
    // Cuando se hace clic, limpiamos el contenido de la lista de rango.
    listaRango.innerHTML = '';
  });
});