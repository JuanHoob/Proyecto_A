"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const imagen = document.getElementById("imagen"); // Obtiene el elemento de imagen por su ID
  const infoUbicacion = document.getElementById("resultadoBoton"); // Obtiene el elemento de información de ubicación por su ID
  const mensajeLluvia = document.getElementById("mensajeLluvia"); // Obtiene el elemento de mensaje de lluvia por su ID

  // Función para actualizar la imagen según la hora del día
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

  actualizarImagen(); // Llama a la función para mostrar la imagen inicial

  setInterval(actualizarImagen, 60000); // Actualiza la imagen cada 60 segundos

  // Función para actualizar la información de ubicaciónS
  function actualizarInfoUbicacion() {
    obtenerUbicacionYTemperatura();
    setInterval(obtenerUbicacionYTemperatura, 60000);
  }

  actualizarInfoUbicacion(); // Llama a la función para mostrar la información de ubicación inicialS
});

const CLAVE_API = "113ab78dfa3e32fdc67b5a19d67c0d9f"; // Clave de la API de OpenWeatherMap
const botonObtenerUbicacion = document.getElementById("obtenerUbicacion"); // Obtiene el botón por su ID
const infoUbicacion = document.getElementById("resultadoBoton"); // Obtiene el elemento de información de ubicación por su ID
const mensajeLluvia = document.getElementById("mensajeLluvia"); // Obtiene el elemento de mensaje de lluvia por su ID

// Función para inicializar el botón de obtener ubicación
function inicializar() {
  botonObtenerUbicacion.addEventListener("click", obtenerUbicacionYTemperatura);
}

document.addEventListener("DOMContentLoaded", inicializar); // Llama a la función de inicialización cuando se carga el documento

// Función para obtener la ubicación y la temperatura
function obtenerUbicacionYTemperatura() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (posición) {
      const latitud = posición.coords.latitude; // Obtiene la latitud de la ubicación
      const longitud = posición.coords.longitude; // Obtiene la longitud de la ubicación
      const urlOpenWeatherMap = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${CLAVE_API}`;

      // Realiza una solicitud para obtener los datos meteorológicos
      fetch(urlOpenWeatherMap)
        .then((respuesta) => respuesta.json()) // Convierte la respuesta a formato JSON
        .then((datos) => {
          // Separar los datos obtenidos
          const ciudad = datos.name;
          const temperatura = (datos.main.temp - 273.15).toFixed(0); // Convierte la temperatura a grados Celsius
          const humedad = datos.main.humidity; // Obtiene la humedad
          const velocidadViento = datos.wind.speed; // Obtiene la velocidad del viento
          const fechaActual = new Date();
          // Modifica la salida de la fecha para que esté en formato deseado (día y mes)
          const fechaFormateada = fechaActual.toLocaleDateString("es-ES", {
            month: "long",
            day: "numeric",
          });

          // Crea elementos HTML para mostrar la información
          const mensajeCiudad = document.createElement("div");
          mensajeCiudad.textContent = ciudad;
          mensajeCiudad.classList.add("ciudad"); // Agrega una clase para el estilo de la ciudad

          const mensajeFecha = document.createElement("div");
          mensajeFecha.textContent = fechaFormateada;
          mensajeFecha.classList.add("fecha"); // Agrega una clase para el estilo de la fecha

          const mensajeTemperatura = document.createElement("div");
          mensajeTemperatura.textContent = `${temperatura}°C`;
          mensajeTemperatura.classList.add("temperatura"); // Agrega una clase para el estilo de la temperatura

          // Agrega la humedad
          const mensajeHumedad = document.createElement("div");
          mensajeHumedad.textContent = `Humedad: ${humedad}%`;
          mensajeHumedad.classList.add("humedad"); // Agrega una clase para el estilo de la humedad

          // Agrega la velocidad del viento en formato km/h
          const mensajeViento = document.createElement("div");
          mensajeViento.textContent = `Viento: ${(
            velocidadViento * 3.6
          ).toFixed(0)} km/h`;
          mensajeViento.classList.add("viento"); // Agrega una clase para el estilo de la velocidad del viento

          // Actualiza la información de ubicación
          infoUbicacion.innerHTML = ""; // Limpia el contenido existente
          infoUbicacion.appendChild(mensajeCiudad);
          infoUbicacion.appendChild(mensajeFecha);
          infoUbicacion.appendChild(mensajeTemperatura);
          infoUbicacion.appendChild(mensajeHumedad);
          infoUbicacion.appendChild(mensajeViento);

          // Llama a la función para obtener el pronóstico de lluvia
          obtenerPronosticoLluvia(latitud, longitud);
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

// Función para obtener el pronóstico de lluvia
function obtenerPronosticoLluvia(latitud, longitud) {
  const apiKey = "113ab78dfa3e32fdc67b5a19d67c0d9f"; // Clave de la API de OpenWeatherMap
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=metric`;

  // Realiza una solicitud para obtener el pronóstico de lluvia
  fetch(url)
    .then((response) => response.json()) // Convierte la respuesta a formato JSON
    .then((data) => {
      // Analiza los datos y verifica el pronóstico de lluvia para las próximas 8 horas
      const pronósticoLluvia = verificarPronósticoLluvia(data);
      mensajeLluvia.textContent = pronósticoLluvia; // Muestra el mensaje en el elemento con id "mensajeLluvia"
    })
    .catch((error) => {
      console.error("Error al obtener datos meteorológicos:", error);
    });
}

// Función para verificar el pronóstico de lluvia
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
