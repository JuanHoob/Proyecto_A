"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const imagen = document.getElementById("imagen");

  function actualizarImagen() {
    const ahora = new Date();
    const hora = ahora.getHours();

    if (hora >= 7 && hora < 18) {
      // Si es de día (entre las 7:00 y las 17:59), muestra la imagen del día.
      imagen.src = "/img/dia.jpg";
    } else {
      // En cualquier otro momento, muestra la imagen de la noche.
      imagen.src = "/img/noche.jpg";
    }
  }

  actualizarImagen();

  // Actualiza la imagen cada minuto para reflejar el cambio de hora.
  setInterval(actualizarImagen, 60000); // 60000 milisegundos = 1 minuto
});

/*document.addEventListener("DOMContentLoaded", function () {
  const resultadoBoton = document.getElementById("resultadoBoton");

  function actualizarColorFuente() {
    const ahora = new Date();
    const hora = ahora.getHours();

    if (hora >= 7 && hora < 18) {
      // Si es de día (entre las 6:00 y las 17:59), aplica el estilo de "dia" (color azul).
      resultadoBoton.className = "dia";
    } else {
      // En cualquier otro momento, aplica el estilo de "noche" (color blanco).
      resultadoBoton.className = "noche";
    }
  }

  // Actualiza el color de la fuente al cargar la página.
  actualizarColorFuente();

  // Actualiza el color de la fuente cada minuto para reflejar el cambio de hora.
  setInterval(actualizarColorFuente, 60000); // 60000 milisegundos = 1 minuto
});*/

const CLAVE_API = "113ab78dfa3e32fdc67b5a19d67c0d9f";
const botonObtenerUbicacion = document.getElementById("obtenerUbicacion");
const infoUbicacion = document.getElementById("resultadoBoton");
const mensajeLluvia = document.getElementById("mensajeLluvia");
function inicializar() {
  botonObtenerUbicacion.addEventListener("click", obtenerUbicacionYTemperatura);
}
document.addEventListener("DOMContentLoaded", inicializar);
function obtenerUbicacionYTemperatura() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (posición) {
      const latitud = posición.coords.latitude;
      const longitud = posición.coords.longitude;
      const urlOpenWeatherMap = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${CLAVE_API}`;
      fetch(urlOpenWeatherMap)
        .then((respuesta) => respuesta.json())
        .then((datos) => {
          const ciudad = datos.name;
          const temperatura = (datos.main.temp - 273.15).toFixed(2); // Convertir a grados Celsius
          // Muestra la ubicación y temperatura actual
          let textoInfo = `Estás en ${ciudad}, actual es ${temperatura}°C.`;
          const fechaActual = new Date();
          const fechaFormateada = fechaActual.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          textoInfo += ` ${fechaFormateada}`;
          // A continuación, verificamos el pronóstico de lluvia
          const pronosticoLluvia = datos.weather[0].main.toLowerCase();
          // Para mostrar el mensaje de pronóstico de lluvia
          mensajeLluvia.textContent = pronosticoLluvia.includes("rain")
            ? "Va a llover en las próximas horas"
            : "No se esperan lluvias.";
          infoUbicacion.textContent = textoInfo;
        })
        .catch((error) => {
          infoUbicacion.textContent = `Error al obtener la ubicación o la temperatura: ${error.message}`;
        });
    });
  } else {
    infoUbicacion.textContent =
      "La geolocalización no está disponible en este navegador.";
  }
}
