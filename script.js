const apiKey = "a6dc10082bd7b716e2e43997a72a8d5c"; // Replace with your OpenWeatherMap API key
const locationInput = document.getElementById("locationInput");
const getWeatherButton = document.getElementById("getWeather");
const getLocationButton = document.getElementById("getLocationButton");
const weatherContainer = document.querySelector(".weather-container");
const weatherDisplay = document.getElementById("weatherDisplay");
const forecastContainer = document.getElementById("forecastContainer");
const locationElement = document.getElementById("location");
const localTimeElement = document.getElementById("localTime");

// Default location (New York)
const defaultLocation = { city: "New York", lat: 40.7128, lon: -74.006 };

// Display weather on page load for default location
window.addEventListener("load", () => {
  fetchWeatherByCity(defaultLocation.city);
});

// Get Weather Data by Location Name
getWeatherButton.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeatherByCity(location);
  } else {
    alert("Please enter a valid city name.");
  }
});

// Get Weather Data by Current Location
getLocationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      () => alert("Unable to access location. Please enable location services.")
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// Fetch Weather Data by City
function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url, city);
}

// Fetch Weather Data by Coordinates
function fetchWeatherByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

// Fetch Weather Data
function fetchWeather(url, city = "") {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      updateWeatherDisplay(data);
      if (city) {
        locationElement.innerText = `Location: ${city}`;
      } else {
        locationElement.innerText = `Location: ${data.name}`;
      }
      updateLocalTime(data);
    })
    .catch(() => alert("Error fetching weather data."));
}

// Fetch Hourly Forecast
function fetchHourlyForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => updateHourlyForecast(data.list))
    .catch(() => alert("Error fetching forecast data."));
}

// Update Weather Display
function updateWeatherDisplay(data) {
  const { main, weather, coord } = data;
  const temp = Math.round(main.temp);
  const description = weather[0].description;
  const icon = weather[0].icon;
  const condition = weather[0].main.toLowerCase();

  document.getElementById("temperature").innerText = `${temp}°C`;
  document.getElementById("weatherDescription").innerText = description;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Map weather conditions to background images
  const weatherBackgrounds = {
    clouds: "cloudy",
    rain: "rainy",
    snow: "snowy",
    clear: "sunny"
  };

  const matchedCondition = Object.keys(weatherBackgrounds).find(key => condition.includes(key));
  weatherContainer.className = `weather-container ${weatherBackgrounds[matchedCondition] || "sunny"}`;

  fetchHourlyForecast(coord.lat, coord.lon);
}

// Update Hourly Forecast
function updateHourlyForecast(forecast) {
  forecastContainer.innerHTML = ""; // Clear existing forecast
  forecast.slice(0, 8).forEach((hour) => {
    const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const temp = Math.round(hour.main.temp);
    const icon = hour.weather[0].icon;

    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";
    forecastItem.innerHTML = `
      <h5>${time}</h5>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Icon" />
      <p>${temp}°C</p>
    `;
    forecastContainer.appendChild(forecastItem);
  });
}

// Update Local Time
function updateLocalTime(data) {
  const timezone = data.timezone; // Seconds offset from UTC
  const currentTime = new Date(); 
  const localTime = new Date(currentTime.getTime() + timezone * 1000); 
  const formattedTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
  localTimeElement.innerText = `Local Time: ${formattedTime}`; 
}
 
// Display local time
const currentTime = new Date(); 
const localTime = new Date(currentTime.getTime() + timezone * 1000);
// Add timezone offset 
const formattedTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
localTimeElement.innerText = `Local Time: ${formattedTime}`; 
