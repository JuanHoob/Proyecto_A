"use strict";
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

          const pronosticoLluvia = datos.weather[0].main === "Rain";

          // Para mostrar el mensaje de pronóstico de lluvia
          mensajeLluvia.textContent = pronosticoLluvia
            ? "Va a llover en las próximas 8 horas"
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
