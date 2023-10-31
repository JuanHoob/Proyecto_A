"use strict";
const API_KEY = "113ab78dfa3e32fdc67b5a19d67c0d9f";
const getLocationButton = document.getElementById("getLocation");
const locationInfo = document.getElementById("result");

getLocationButton.addEventListener("click", obtenerUbicacionYTemperatura);

function obtenerUbicacionYTemperatura() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const openWeatherMapUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

      fetch(openWeatherMapUrl)
        .then((response) => response.json())
        .then((data) => {
          const city = data.name;
          const temperature = (data.main.temp - 273.15).toFixed(2); // Convertir a grados Celsius

          // Mostrar la ubicación y temperatura actual
          let infoText = `Estás en ${city}, la temperatura actual es ${temperature}°C.`;

          // Agregar la fecha actual
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          infoText += ` ${formattedDate}`;

          // Verificar si el pronóstico incluye lluvia
          // (el código restante permanece sin cambios)

          // Crear una lista ordenada para mostrar el pronóstico
          // (el código restante permanece sin cambios)

          // Agregar la lista al mensaje
          locationInfo.textContent = infoText;
          // (el código restante para la lista permanece sin cambios)
        })
        .catch((error) => {
          locationInfo.textContent = `Error al obtener la ubicación o la temperatura: ${error.message}`;
        });
    });
  } else {
    locationInfo.textContent =
      "La geolocalización no está disponible en este navegador.";
  }
}
