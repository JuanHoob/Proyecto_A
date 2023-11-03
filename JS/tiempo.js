"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const imagen = document.getElementById("imagen");
  const city = document.getElementById("city");
  const temper = document.getElementById("temper");
  const hume = document.getElementById("hume");
  const viento = document.getElementById("viento");
  const fecha = document.getElementById("fecha");

  function actualizarImagen() {
    const ahora = new Date();
    const hora = ahora.getHours();

    if (hora >= 7 && hora < 18) {
      imagen.src = "../img/dia.jpg";
      document.body.style.color = "black";
    } else {
      imagen.src = "../img/noche.jpg";
      document.body.style.color = "white";
    }
  }

  actualizarImagen();

  setInterval(actualizarImagen, 60000);

  function actualizarInfoUbicacion() {
    obtenerUbicacionYTemperatura();
    setInterval(obtenerUbicacionYTemperatura, 60000);
  }

  actualizarInfoUbicacion();
});

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
          const temperatura = (datos.main.temp - 273.15).toFixed(0);
          const humedad = datos.main.humidity;
          const velocidadViento = datos.wind.speed;
          const fechaActual = new Date();

          const fechaFormateada = fechaActual.toLocaleDateString("es-ES", {
            month: "long",
            day: "numeric",
          });
          city.textContent = ciudad;
          temper.textContent = temperatura;
          hume.textContent = `Humedad: ${humedad}%`;
          viento.textContent = `Viento: ${(velocidadViento * 3.6).toFixed(
            0
          )} km/h`;
          fecha.textContent = fechaFormateada;

          obtenerPronósticoLluvia(latitud, longitud);
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

function obtenerPronósticoLluvia(latitud, longitud) {
  const apiKey = "113ab78dfa3e32fdc67b5a19d67c0d9f"; // Clave de la API de OpenWeatherMap
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const pronósticoLluvia = verificarPronósticoLluvia(data);
      mensajeLluvia.textContent = pronósticoLluvia;
    })
    .catch((error) => {
      console.error("Error al obtener datos meteorológicos:", error);
    });
}

function verificarPronósticoLluvia(data) {
  const pronósticoPorHora = data.list;
  const pronósticoLluviaProximas8Horas = pronósticoPorHora
    .slice(0, 8)
    .some((hora) => {
      const probabilidadLluvia = hora.rain && hora.rain["3h"];
      return probabilidadLluvia > 0.1;
    });

  return pronósticoLluviaProximas8Horas ? "Sí lloverá" : "No lloverá";
}
