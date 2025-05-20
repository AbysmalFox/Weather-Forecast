// Initialize the map
const map = L.map('map').setView([20, 0], 2);
let marker;

// Load the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Weather icons mapping
const weatherIcons = {
    "01d": "clear-day.gif",
    "01n": "clear-day.gif",
    
    "02d": "broken-clouds.gif",
    "02n": "broken-clouds.gif",
    "03d": "broken-clouds.gif",
    "03n": "broken-clouds.gif",
    "04d": "broken-clouds.gif",
    "04n": "broken-clouds.gif",
    "09d": "rain-showers-day.gif",
    "09n": "rain-showers-night.gif",
    "10d": "rain.gif",
    "10n": "rain.gif",
    "11d": "thunderstorm-day.gif",
    "11n": "thunderstorm-night.gif",
    "13d": "snow.gif",
    "13n": "snow.gif",
    "50d": "mist.gif",
    "50n": "mist.gif",
    clear: "sunny.gif",
    haze: "haze.gif",
    dust: "dust.gif",
    sand: "sandstorm.gif",
    ash: "volcanic-ash.gif",
    squall: "squall.gif",
    tornado: "tornado.gif",
    "moderate-rain": "moderate-rain.gif"
};

// Function to update marker position
function updateMarker(lat, lng) {
    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }
}

// Function to display weather information
function displayWeather(data) {
    const icon = weatherIcons[data.weather[0].icon] || weatherIcons[data.weather[0].main.toLowerCase()] || 'default.gif';
    document.getElementById('weatherInfo').innerHTML = `
                    <h2>Weather in ${data.name}, ${data.sys.country}</h2>  
                    <hr>

                    <p>
                        <i class="fas fa-cloud-sun"> </i> Weather: ${data.weather[0].description} 
                        <img 
                            src="animation/${weatherIcons[data.weather[0].icon] || 'default.gif'}" 
                            alt="${data.weather[0].description}" />

                    </p>

                    <p><i class="fas fa-thermometer-half"></i> Temperature: ${data.main.temp}°C</p>
                    <p><i class="fas fa-temperature-high"></i> Feels Like: ${data.main.feels_like}°C</p>
                    <p><i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%</p>
                    <p><i class="fas fa-wind"></i> Wind Speed: ${data.wind.speed} m/s</p>
                    <p><i class="fas fa-tachometer-alt"></i> Pressure: ${data.main.pressure} hPa</p>
                    <p><i class="fas fa-eye"></i> Visibility: ${data.visibility} meters</p>
                    <p><i class="fas fa-cloud"></i> Cloudiness: ${data.clouds.all}%</p>
                    <p><i class="fas fa-sun"></i> Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
                    <p><i class="fas fa-moon"></i> Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
                    <p><i class="fas fa-map-marker-alt"></i> Coordinates: Latitude ${data.coord.lat}, Longitude ${data.coord.lon}</p>
                `;

    // Save coordinates to localStorage
    localStorage.setItem('weatherLat', data.coord.lat);
    localStorage.setItem('weatherLon', data.coord.lon);
    
    // Dispatch event for other components to know location has been updated
    const event = new CustomEvent('weatherLocationUpdated', {
        detail: {
            lat: data.coord.lat,
            lon: data.coord.lon,
            location: `${data.name}, ${data.sys.country}`
        }
    });
    window.dispatchEvent(event);
}

// Function to fetch weather data
async function fetchWeather(lat, lon) {
    try {
        const apiKey = '4b841b77585a504a294f9794864a4738';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherInfo').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Handle map clicks
map.on('click', (event) => {
    const { lat, lng } = event.latlng;
    updateMarker(lat, lng);
    fetchWeather(lat, lng);
});

// Handle location search
document.getElementById('searchButton').addEventListener('click', async () => {
    const location = document.querySelector('#searchBar input').value.trim();
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    document.getElementById('loadingScreen').classList.remove('hidden'); // Show loading

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
        const data = await response.json();

        if (data.length === 0) {
            throw new Error('Location not found.');
        }

        const { lat, lon } = data[0];
        map.setView([lat, lon], 12);
        updateMarker(lat, lon);
        fetchWeather(lat, lon);
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        document.getElementById('loadingScreen').classList.add('hidden'); // Hide loading
    }
});

// Function to fetch 5-day forecast and display it
async function fetchAndDisplayForecast(lat, lon) {
    try {
        await fetch5DayForecast(lat, lon);
    } catch (error) {
        document.getElementById('forecastCards').innerHTML = `<p>Error fetching 5-day forecast. Please try again later.</p>`;
    }
}

// Function to fetch weather data
async function fetchWeather(lat, lon) {
    try {
        const apiKey = '4b841b77585a504a294f9794864a4738';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        displayWeather(data);

        // Fetch and display 5-day forecast
        fetchAndDisplayForecast(lat, lon);
    } catch (error) {
        document.getElementById('weatherInfo').innerHTML = `<p>Error: ${error.message}</p>`;
        document.getElementById('forecastCards').innerHTML = '';
    }
}

// Handle map clicks
map.on('click', (event) => {
    const { lat, lng } = event.latlng;
    updateMarker(lat, lng);
    fetchWeather(lat, lng);
});

// Handle location search
document.getElementById('searchButton').addEventListener('click', async () => {
    const location = document.querySelector('#searchBar input').value.trim();
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    document.getElementById('loadingScreen').classList.remove('hidden'); // Show loading

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
        const data = await response.json();

        if (data.length === 0) {
            throw new Error('Location not found.');
        }

        const { lat, lon } = data[0];
        map.setView([lat, lon], 12);
        updateMarker(lat, lon);
        fetchWeather(lat, lon);
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        document.getElementById('loadingScreen').classList.add('hidden'); // Hide loading
    }
});


// Function to get user's current location
function findMe() {
    if (navigator.geolocation) {
        document.getElementById('loadingScreen').classList.remove('hidden');
        document.getElementById('loadingScreen').style.display = 'flex';
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                // Update map view and marker
                map.setView([latitude, longitude], 12);
                updateMarker(latitude, longitude);
                
                // Fetch weather data for the location
                fetchWeather(latitude, longitude);
                
                // Hide loading screen
                document.getElementById('loadingScreen').classList.add('hidden');
                document.getElementById('loadingScreen').style.display = 'none';
                
                // Show weather info section
                document.getElementById('weatherInfoSection').classList.remove('hidden');
                
                // Perform reverse geocoding to get location name
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log("Your location:", data.display_name);
                    })
                    .catch(error => {
                        console.error("Error getting location name:", error);
                    });
            },
            (error) => {
                // Hide loading screen
                document.getElementById('loadingScreen').classList.add('hidden');
                document.getElementById('loadingScreen').style.display = 'none';
                
                // Show error message
                let errorMessage;
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied. Please enable location services in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out.";
                        break;
                    default:
                        errorMessage = "An unknown error occurred while getting your location.";
                }
                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Add event listener for the Find Me button
document.addEventListener('DOMContentLoaded', () => {
    const findMeButton = document.getElementById('findMeButton');
    if (findMeButton) {
        findMeButton.addEventListener('click', findMe);
    }
});
