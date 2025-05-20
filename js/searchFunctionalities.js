document.addEventListener('DOMContentLoaded', () => {
    const searchLink = document.querySelector('.side-nav a[href="#search"]');
    const searchContainer = document.querySelector('.search-container');
    const searchButton = document.getElementById('searchButton');
    const loadingScreen = document.getElementById('loadingScreen');
    const weatherInfoSection = document.getElementById('weatherInfoSection');
    const forecastSection = document.getElementById('forecastSection');
    const aiBox = document.getElementById('aiBox');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const weatherDashboard = document.getElementById('weatherDashboard');
    const closeDashboard = document.getElementById('closeDashboard');

    let marker;
    let currentWeatherData = null;
    let forecastData = null;
    let miniMap = null;

    // Toggle search bar visibility
    if (searchLink) {
        searchLink.addEventListener('click', () => {
            if (searchContainer) {
                searchContainer.classList.toggle('show');
                console.log('Toggled search bar visibility');
            } else {
                console.error('Search container element not found');
            }
        });
    } else {
        console.error('Search Location link not found');
    }

    // Dashboard button click event
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            if (currentWeatherData) {
                showDashboard();
            } else {
                alert('Please search for a location first to view the dashboard.');
                if (searchContainer) {
                    searchContainer.classList.add('show');
                }
            }
        });
    }

    // Close dashboard button
    if (closeDashboard) {
        closeDashboard.addEventListener('click', () => {
            const dashboard = document.getElementById('weatherDashboard');
            
            // Start slide-up animation
            dashboard.style.top = '-100%';
            dashboard.style.opacity = '0';
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                dashboard.style.display = 'none';
                // Reset styles to their initial state instead of removing the class
                dashboard.style.top = '-100%';
                dashboard.style.opacity = '0';
                // Don't remove the show class here
            }, 500); // Match this to your transition duration
        });
    }

    // Handle search button click
    if (searchButton) {
        searchButton.addEventListener('click', async () => {
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
                console.log('Toggled loading screen visibility');
            } else {
                console.error('Loading screen element not found');
            }

            const locationInput = document.querySelector('#searchBar input');
            const location = locationInput ? locationInput.value.trim() : '';

            if (!location) {
                alert('Please enter a location.');
                loadingScreen.style.display = 'none';
                return;
            }

            try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
                const geoData = await geoRes.json();

                if (geoData.length === 0) {
                    alert('Location not found.');
                    loadingScreen.style.display = 'none';
                    return;
                }

                const lat = geoData[0].lat;
                const lon = geoData[0].lon;

                map.setView([lat, lon], 12);

                if (marker) {
                    marker.setLatLng([lat, lon]);
                } else {
                    marker = L.marker([lat, lon]).addTo(map);
                }

                const apiKey = '4b841b77585a504a294f9794864a4738';
                const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
                const weatherData = await weatherRes.json();

                if (weatherData.cod !== 200) {
                    const errorHTML = `
                        <div class="error-container">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h3>Weather Data Error</h3>
                            <p>${weatherData.message}</p>
                            <button onclick="retrySearch()">Try Again</button>
                        </div>
                    `;
                    document.getElementById('weatherInfo').innerHTML = errorHTML;
                    loadingScreen.style.display = 'none';
                    return;
                }

                // Store current weather data for dashboard
                currentWeatherData = weatherData;

                // Fetch forecast data for dashboard
                const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
                forecastData = await forecastRes.json();

                const icons = {
                    "01d": "clear-day.gif",
                    "01n": "clear-day.gif",
                    "02d": "broken-clouds.gif",
                    "02n": "broken-clouds.gif",
                    "03d": "broken-clouds.gif",
                    "03n": "broken-clouds.gif",
                    "04d": "broken-clouds.gif",
                    "04n": "broken-clouds.gif",
                    "09d": "heavy-rain.gif",
                    "09n": "heavy-rain.gif",
                    "10d": "rain.gif",
                    "10n": "rain.gif",
                    "11d": "thunderstorm.gif",
                    "11n": "thunderstorm.gif",
                    "13d": "snow.gif",
                    "13n": "snow.gif",
                    "50d": "mist.gif",
                    "50n": "mist.gif",
                    "moderate-rain": "rainy.gif"
                };

                const weatherHTML = `
                    <br>
                    <h2>Weather in ${weatherData.name}, ${weatherData.sys.country}</h2>
                        <div class="local-time">
                            <i class="fas fa-clock"></i>
                            Local Time: ${new Date().toLocaleTimeString()}
                        </div>


                    <hr>

                    <p>

                        <i class="fas fa-cloud-sun"></i> Weather: ${weatherData.weather[0].description}
                        <img src="animation/${icons[weatherData.weather[0].icon] || 'default.gif'}" alt="${weatherData.weather[0].description}" />

                    </p>
                    <p><i class="fas fa-thermometer-half"></i> Temperature: <span class="temp-value" data-unit="celsius">${weatherData.main.temp}</span>°C</p>
                    <p><i class="fas fa-temperature-high"></i> Feels Like: <span class="temp-value" data-unit="celsius">${weatherData.main.feels_like}</span>°C</p>
                    <p><i class="fas fa-tint"></i> Humidity: ${weatherData.main.humidity}%</p>
                    <p><i class="fas fa-wind"></i> Wind Speed: ${weatherData.wind.speed} m/s</p>
                    <p><i class="fas fa-tachometer-alt"></i> Pressure: ${weatherData.main.pressure} hPa</p>
                    <p><i class="fas fa-eye"></i> Visibility: ${weatherData.visibility} meters</p>
                    <p><i class="fas fa-cloud"></i> Cloudiness: ${weatherData.clouds.all}%</p>
                    <p><i class="fas fa-sun"></i> Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                    <p><i class="fas fa-moon"></i> Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                    <p><i class="fas fa-map-marker-alt"></i> Coordinates: Latitude ${weatherData.coord.lat}, Longitude ${weatherData.coord.lon}</p>
                `;

                document.getElementById('weatherInfo').innerHTML = weatherHTML;
                weatherInfoSection.classList.remove('hidden');
                forecastSection.classList.remove('hidden');
                loadingScreen.style.display = 'none';

                const description = weatherData.weather[0].main.toLowerCase();
                const temp = weatherData.main.temp;
                const humidity = weatherData.main.humidity;
                const wind = weatherData.wind.speed;
                const visibility = weatherData.visibility;
                
                let suggestionArray = [];
                
                if (description.includes('rain')) {
                    suggestionArray = [
                        `Raindrops dance across ${weatherData.name} today! 🌧️ With ${temp}°C and ${humidity}% humidity, it's perfect for introspection. The gentle patter creates a soothing soundtrack while visibility stands at ${visibility} meters. Brew a fragrant tea, grab that book you've been meaning to finish, and wrap yourself in something cozy. Rain brings life to the earth and a chance for you to slow down and rejuvenate indoors.`,
                        
                        `A symphony of raindrops performs in ${weatherData.name}! 💦 The ${temp}°C feels refreshing against ${humidity}% humidity. With winds at ${wind} m/s, today invites you to embrace indoor comforts. Try baking something aromatic, catch up on your favorite series, or watch the mesmerizing patterns on your windowpane. Some of life's most beautiful moments happen during rainy days.`,
                        
                        `The skies have opened up over ${weatherData.name}, bringing refreshing rainfall! 🌦️ Currently ${temp}°C with humidity at ${humidity}%. Visibility limited to ${visibility} meters creates that magical misty atmosphere. Consider this nature's invitation to slow down—journal by a window, prepare a hearty soup, or call that friend you've been meaning to catch up with. Every raindrop carries a tiny reflection of the world.`
                    ];
                } else if (description.includes('clear')) {
                    suggestionArray = [
                        `The sky above ${weatherData.name} is a masterpiece of clarity! ☀️ Bask in the ${temp}°C warmth with just ${humidity}% humidity. With visibility stretching ${visibility} meters and breezes at ${wind} m/s, nature beckons you outdoors. Perfect for hiking, picnicking, or finding a sunny spot to read. Your skin will thank you for the sunscreen, and your mind will benefit from the natural light that boosts serotonin levels.`,
                        
                        `${weatherData.name} is radiant under crystal-clear skies! 🌞 The delightful ${temp}°C creates the perfect environment for outdoor adventures. With winds at ${wind} m/s and visibility of ${visibility} meters, you can see for miles. Consider cycling to explore hidden corners of the city, gathering with friends at a park, or simply taking regular activities outside. Fresh air and sunshine enhance mood and creativity!`,
                        
                        `A perfect blue canvas stretches above ${weatherData.name} today! ✨ The temperature sits at ${temp}°C while humidity remains at ${humidity}%. Visibility extends to ${visibility} meters, making distant landmarks appear magically close. The gentle breeze adds just enough movement to keep you cool. Days like this are rare gifts—perfect for photography, outdoor exercise, or simply absorbing natural beauty.`
                    ];
                } else if (description.includes('cloud')) {
                    suggestionArray = [
                        `A tapestry of clouds has gathered over ${weatherData.name}, creating soft, diffused light! 🌥️ The temperature sits at ${temp}°C with humidity at ${humidity}%, creating a comfortable atmosphere. Visibility extends to ${visibility} meters, and the ${wind} m/s breeze shifts cloud patterns above. Ideal for exploring museums, enjoying outdoor cafés, or taking contemplative walks. The clouds provide natural UV protection while still allowing enough light for vitamin D.`,
                        
                        `${weatherData.name} is embraced by a gentle blanket of clouds today. ☁️ With ${temp}°C and a ${wind} m/s breeze, there's a tranquility that invites thoughtful activities. Humidity at ${humidity}% means your skin won't feel parched. This is perfect weather for visiting exhibits, meeting friends at cafés, or exploring botanical gardens. The subtle beauty of cloudy days often goes unappreciated—notice how colors appear richer under this natural filter.`,
                        
                        `The sky above ${weatherData.name} plays with infinite shades of gray as clouds create a dynamic canvas! 🌫️ Currently ${temp}°C with humidity at ${humidity}%. The gentle winds keep cloud formations shifting into new artistic arrangements. With visibility at ${visibility} meters, distant landmarks take on a mysterious quality. Consider exploring cultural venues, discovering a new bookstore, or taking a reflective walk. Cloudy days enhance creative thinking and problem-solving.`
                    ];
                } else if (description.includes('snow')) {
                    suggestionArray = [
                        `${weatherData.name} has transformed into a winter wonderland! ❄️ The temperature of ${temp}°C creates perfect conditions for snow to blanket the landscape. Humidity sits at ${humidity}%, while visibility is reduced to ${visibility} meters, giving everything a dreamy quality. The wind at ${wind} m/s creates mesmerizing swirls of snowflakes. Experience childlike wonder—build a snowperson, try snow photography, or take a quiet walk to hear the special muffled silence that only fresh snow creates.`,
                        
                        `A symphony in white plays across ${weatherData.name} as snowflakes transform the ordinary! ❄️ With ${temp}°C and ${humidity}% humidity, conditions are perfect for snow that sticks and sparkles. Visibility reduced to ${visibility} meters creates that intimate feeling where the world beyond disappears into white mist. Bundle up in layers and experience the unique acoustic properties of snow, observe how light plays through ice crystals, or appreciate how familiar landscapes become mysterious under their white covering.`,
                        
                        `${weatherData.name} experiences the gentle magic of snowfall today! ⛄ The temperature reads ${temp}°C—perfect for snow that maintains its structure. With humidity at ${humidity}% and gentle winds, snowflakes fall in a mesmerizing pattern. This weather creates a special opportunity to observe nature's geometry up close—examine snowflake structures, take artistic photographs, or make the first footprints in pristine snow. The world becomes quieter under snow, offering a rare chance for peaceful reflection.`
                    ];
                } else if (description.includes('storm')) {
                    suggestionArray = [
                        `The elements put on a dramatic performance in ${weatherData.name} today! ⚡ The temperature reads ${temp}°C, but atmospheric dynamics are far more complex. With winds at ${wind} m/s and visibility reduced to ${visibility} meters, nature demonstrates its raw power. The ${humidity}% humidity means the air feels charged with energy. Respect nature's might from a safe distance—ensure devices are charged and keep emergency supplies accessible. There's primal beauty in watching storms from secure shelter.`,
                        
                        `A magnificent atmospheric symphony plays over ${weatherData.name} as storm clouds gather! 🌩️ Currently experiencing turbulent conditions with ${temp}°C and ${humidity}% humidity. The wind makes its presence known at ${wind} m/s while visibility has decreased to ${visibility} meters. This powerful weather system demands respect—secure outdoor items, keep pets indoors, and prepare for possible power fluctuations. While sheltering safely, witness one of nature's most impressive displays.`,
                        
                        `${weatherData.name} experiences the theatrical drama of a storm system today! ⛈️ The temperature registers at ${temp}°C, but the real story is in the dynamic atmospheric conditions. Winds surge at ${wind} m/s, visibility reduced to ${visibility} meters, and humidity stands at ${humidity}%. This weather calls for prudent caution—stay informed through local alerts and avoid unnecessary travel. Consider preparing a cozy storm shelter with emergency supplies and perhaps board games or books that don't require electricity.`
                    ];
                } else {
                    suggestionArray = [
                        `${weatherData.name} is experiencing ${weatherData.weather[0].description} today! 🌤️ The temperature sits at ${temp}°C while humidity hovers at ${humidity}%. Visibility extends to ${visibility} meters, offering a particular perspective on your surroundings. The wind moves at ${wind} m/s, occasionally shifting direction. Observe how this specific weather affects the environment—notice how light filters differently, how plants and animals respond, or how the atmosphere creates particular scents and sounds.`,
                        
                        `The atmosphere in ${weatherData.name} presents a fascinating mix with ${weatherData.weather[0].description}! 🌡️ Currently experiencing ${temp}°C with ${humidity}% humidity and winds at ${wind} m/s. Take a mindful walk to notice how this specific weather affects colors, sounds, and local wildlife. Consider wearing versatile clothing that can adapt to potential changes, and perhaps bring a weather journal to document your observations of this interesting meteorological state.`,
                        
                        `${weatherData.name} is currently under the influence of ${weatherData.weather[0].description}—a weather pattern with its own distinctive energy! 🌈 The temperature registers at ${temp}°C, while humidity sits at ${humidity}% and winds move at ${wind} m/s. This weather creates an opportunity for enthusiasts to observe specific cloud formations, light qualities, and atmospheric effects. Consider how this weather might influence your plans—perhaps certain activities would benefit from these specific conditions.`
                    ];
                }
                
                // Pick a random suggestion
                const suggestion = suggestionArray[Math.floor(Math.random() * suggestionArray.length)] || 
                    `${weatherData.name} is experiencing ${weatherData.weather[0].description} today! 🌤️ The temperature sits at ${temp}°C while humidity hovers at ${humidity}%. Visibility extends to ${visibility} meters, offering a particular perspective on your surroundings.`;
                
                // Get weather-specific icon
                let weatherIcon = 'fa-cloud-sun';
                if (description.includes('rain')) weatherIcon = 'fa-cloud-rain';
                else if (description.includes('clear')) weatherIcon = 'fa-sun';
                else if (description.includes('cloud')) weatherIcon = 'fa-cloud';
                else if (description.includes('snow')) weatherIcon = 'fa-snowflake';
                else if (description.includes('storm')) weatherIcon = 'fa-bolt';
                
                // Show the AI insights box with modern design
                aiBox.innerHTML = `
                    <h3><i class="fas fa-robot"></i> Ai Weather Insights</h3>
                    <div class="ai-content-container">
                        <div class="ai-header">
                            <div class="ai-weather-icon">
                                <i class="fas ${weatherIcon}"></i>
                            </div>
                            <div class="ai-location">${weatherData.name}</div>
                        </div>
                        <div id="aiSuggestionText" class="ai-suggestion">
                            <div class="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div class="ai-icon">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                    </div>`;
                
                // Display the AI box
                aiBox.style.display = 'block';
                
                // After delay, show the suggestion with typewriter effect
                setTimeout(() => {
                    const suggestionText = document.getElementById('aiSuggestionText');
                    suggestionText.innerHTML = ''; // Clear the typing indicator
                    typeWriter(suggestionText, suggestion, 30);
                }, 2000);
                

            } catch (err) {
                console.error('Error:', err);
                document.getElementById('weatherInfo').innerHTML = `<p>Error fetching weather data: ${err.message}</p>`;
                loadingScreen.style.display = 'none';
            }
        });
    } else {
        console.error('Search button not found');
    }



    // Function to show and populate dashboard
    function showDashboard() {
        if (!currentWeatherData) {
            alert('Please search for a location first.');
            return;
        }
    
        // Get the dashboard element
        const dashboard = document.getElementById('weatherDashboard');
        
        // Reset the display property first
        dashboard.style.display = 'block';
        
        // Force a reflow to ensure the transition works
        void dashboard.offsetWidth;
        
        // Set the final position and opacity to trigger the animation
        dashboard.style.top = '0';
        dashboard.style.opacity = '1';
    
        // Initialize mini map if not already done
        if (!miniMap) {
            miniMap = L.map('miniMap').setView([currentWeatherData.coord.lat, currentWeatherData.coord.lon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(miniMap);
            L.marker([currentWeatherData.coord.lat, currentWeatherData.coord.lon]).addTo(miniMap);
        } else {
            miniMap.setView([currentWeatherData.coord.lat, currentWeatherData.coord.lon], 10);
        }
    
        // Update dashboard with current data
        updateDashboard(currentWeatherData, forecastData);
    }

        // Close dashboard button
    if (closeDashboard) {
        dashboard.classList.remove('show');
        dashboard.classList.add('hide');
    
        // Wait for the transition to complete before hiding
        const onTransitionEnd = () => {
            dashboard.style.display = 'none';
            dashboard.removeEventListener('transitionend', onTransitionEnd);
        };
    
        dashboard.addEventListener('transitionend', onTransitionEnd);
    }

    // Function to update dashboard with weather data
    function updateDashboard(weatherData, forecastData) {
        if (!weatherData) return;

        // Update location
        document.getElementById('dashboardLocation').textContent = `${weatherData.name}, ${weatherData.sys.country}`;

        // Update current weather widget
        document.getElementById('dashboardTemp').textContent = `${Math.round(weatherData.main.temp)}°C`;
        document.getElementById('dashboardFeelsLike').textContent = `${Math.round(weatherData.main.feels_like)}°C`;
        document.getElementById('dashboardCondition').textContent = weatherData.weather[0].description;
        document.getElementById('dashboardHumidity').textContent = `${weatherData.main.humidity}%`;
        document.getElementById('dashboardWind').textContent = `${weatherData.wind.speed} m/s`;
        document.getElementById('dashboardPressure').textContent = `${weatherData.main.pressure} hPa`;
        document.getElementById('dashboardVisibility').textContent = `${weatherData.visibility} m`;

        // Update weather icon
        const icons = {
            "01d": "clear-day.gif",
            "01n": "clear-day.gif",
            "02d": "broken-clouds.gif",
            "02n": "broken-clouds.gif",
            "03d": "broken-clouds.gif",
            "03n": "broken-clouds.gif",
            "04d": "broken-clouds.gif",
            "04n": "broken-clouds.gif",
            "09d": "heavy-rain.gif",
            "09n": "heavy-rain.gif",
            "10d": "rain.gif",
            "10n": "rain.gif",
            "11d": "thunderstorm.gif",
            "11n": "thunderstorm.gif",
            "13d": "snow.gif",
            "13n": "snow.gif",
            "50d": "mist.gif",
            "50n": "mist.gif",
            "moderate-rain": "rainy.gif"
        };
        document.getElementById('dashboardWeatherIcon').src = `animation/${icons[weatherData.weather[0].icon] || 'default.gif'}`;

        // Update hourly forecast widget if forecast data is available
        if (forecastData && forecastData.list) {
            const hourlyContainer = document.getElementById('hourlyForecastWidget');
            hourlyContainer.innerHTML = '';

            // Create a responsive grid container
            const hourlyGrid = document.createElement('div');
            hourlyGrid.className = 'hourly-forecast-grid';
            hourlyContainer.appendChild(hourlyGrid);

            // Display next 5 hours (3-hour intervals) to match the image
            const hoursToShow = Math.min(5, forecastData.list.length);
            for (let i = 0; i < hoursToShow; i++) {
                const forecast = forecastData.list[i];
                const date = new Date(forecast.dt * 1000);
                const hour = date.getHours();
                const formattedHour = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
                
                const hourlyItem = document.createElement('div');
                hourlyItem.className = 'hourly-item';
                hourlyItem.innerHTML = `
                    <div class="hour">${formattedHour}</div>
                    <img src="animation/${icons[forecast.weather[0].icon] || 'default.gif'}" alt="${forecast.weather[0].description}">
                    <div class="temp">${Math.round(forecast.main.temp)}°C</div>
                `;
                hourlyGrid.appendChild(hourlyItem);
            }
        }

        // Update daily forecast widget if forecast data is available
        if (forecastData && forecastData.list) {
            const dailyContainer = document.getElementById('dailyForecastWidget');
            dailyContainer.innerHTML = '';

            // Group forecast by day
            const dailyForecasts = {};
            forecastData.list.forEach(forecast => {
                const date = new Date(forecast.dt * 1000);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                if (!dailyForecasts[day]) {
                    dailyForecasts[day] = {
                        temps: [forecast.main.temp],
                        icons: [forecast.weather[0].icon],
                        descriptions: [forecast.weather[0].description]
                    };
                } else {
                    dailyForecasts[day].temps.push(forecast.main.temp);
                    dailyForecasts[day].icons.push(forecast.weather[0].icon);
                    dailyForecasts[day].descriptions.push(forecast.weather[0].description);
                }
            });

            // Create daily forecast items
            Object.keys(dailyForecasts).slice(0, 5).forEach(day => {
                const forecast = dailyForecasts[day];
                const maxTemp = Math.round(Math.max(...forecast.temps));
                const minTemp = Math.round(Math.min(...forecast.temps));
                
                // Get most common icon
                const iconCounts = {};
                forecast.icons.forEach(icon => {
                    iconCounts[icon] = (iconCounts[icon] || 0) + 1;
                });
                let mostCommonIcon = forecast.icons[0];
                let maxCount = 0;
                Object.keys(iconCounts).forEach(icon => {
                    if (iconCounts[icon] > maxCount) {
                        maxCount = iconCounts[icon];
                        mostCommonIcon = icon;
                    }
                });

                // Get most common description
                const descCounts = {};
                forecast.descriptions.forEach(desc => {
                    descCounts[desc] = (descCounts[desc] || 0) + 1;
                });
                let mostCommonDesc = forecast.descriptions[0];
                maxCount = 0;
                Object.keys(descCounts).forEach(desc => {
                    if (descCounts[desc] > maxCount) {
                        maxCount = descCounts[desc];
                        mostCommonDesc = desc;
                    }
                });

                const dailyItem = document.createElement('div');
                dailyItem.className = 'daily-item';
                dailyItem.innerHTML = `
                    <div class="day">${day}</div>
                    <div class="condition">
                        <img src="animation/${icons[mostCommonIcon] || 'default.gif'}" alt="${mostCommonDesc}">
                        <span>${mostCommonDesc}</span>
                    </div>
                    <div class="temp-range">
                        <span class="max">${maxTemp}°</span>
                        <span class="min">${minTemp}°</span>
                    </div>
                `;
                dailyContainer.appendChild(dailyItem);
            });
        }

        // Update AI insights widget
        const description = weatherData.weather[0].main.toLowerCase();
        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const wind = weatherData.wind.speed;
        const visibility = weatherData.visibility;
        
        let suggestionArray = [];
        
        if (description.includes('rain')) {
            suggestionArray = [
                `Raindrops dance across ${weatherData.name} today! 🌧️ With ${temp}°C and ${humidity}% humidity, it's perfect for introspection. The gentle patter creates a soothing soundtrack while visibility stands at ${visibility} meters. Brew a fragrant tea, grab that book you've been meaning to finish, and wrap yourself in something cozy.`,
                
                `A symphony of raindrops performs in ${weatherData.name}! 💦 The ${temp}°C feels refreshing against ${humidity}% humidity. With winds at ${wind} m/s, today invites you to embrace indoor comforts. Try baking something aromatic, catch up on your favorite series, or watch the mesmerizing patterns on your windowpane.`,
                
                `The skies have opened up over ${weatherData.name}, bringing refreshing rainfall! 🌦️ Currently ${temp}°C with humidity at ${humidity}%. Visibility limited to ${visibility} meters creates that magical misty atmosphere. Consider this nature's invitation to slow down—journal by a window, prepare a hearty soup, or call that friend you've been meaning to catch up with.`
            ];
        } else if (description.includes('clear')) {
            suggestionArray = [
                `The sky above ${weatherData.name} is a masterpiece of clarity! ☀️ Bask in the ${temp}°C warmth with just ${humidity}% humidity. With visibility stretching ${visibility} meters and breezes at ${wind} m/s, nature beckons you outdoors. Perfect for hiking, picnicking, or finding a sunny spot to read. Your skin will thank you for the sunscreen, and your mind will benefit from the natural light that boosts serotonin levels.`,
                
                `${weatherData.name} is radiant under crystal-clear skies! 🌞 The delightful ${temp}°C creates the perfect environment for outdoor adventures. With winds at ${wind} m/s and visibility of ${visibility} meters, you can see for miles. Consider cycling to explore hidden corners of the city, gathering with friends at a park, or simply taking regular activities outside. Fresh air and sunshine enhance mood and creativity!`,
                
                `A perfect blue canvas stretches above ${weatherData.name} today! ✨ The temperature sits at ${temp}°C while humidity remains at ${humidity}%. Visibility extends to ${visibility} meters, making distant landmarks appear magically close. The gentle breeze adds just enough movement to keep you cool. Days like this are rare gifts—perfect for photography, outdoor exercise, or simply absorbing natural beauty.`
            ];
        } else if (description.includes('cloud')) {
            suggestionArray = [
                `A tapestry of clouds has gathered over ${weatherData.name}, creating soft, diffused light! 🌥️ The temperature sits at ${temp}°C with humidity at ${humidity}%, creating a comfortable atmosphere. Visibility extends to ${visibility} meters, and the ${wind} m/s breeze shifts cloud patterns above. Ideal for exploring museums, enjoying outdoor cafés, or taking contemplative walks. The clouds provide natural UV protection while still allowing enough light for vitamin D.`,
                
                `${weatherData.name} is embraced by a gentle blanket of clouds today. ☁️ With ${temp}°C and a ${wind} m/s breeze, there's a tranquility that invites thoughtful activities. Humidity at ${humidity}% means your skin won't feel parched. This is perfect weather for visiting exhibits, meeting friends at cafés, or exploring botanical gardens. The subtle beauty of cloudy days often goes unappreciated—notice how colors appear richer under this natural filter.`,
                
                `The sky above ${weatherData.name} plays with infinite shades of gray as clouds create a dynamic canvas! 🌫️ Currently ${temp}°C with humidity at ${humidity}%. The gentle winds keep cloud formations shifting into new artistic arrangements. With visibility at ${visibility} meters, distant landmarks take on a mysterious quality. Consider exploring cultural venues, discovering a new bookstore, or taking a reflective walk. Cloudy days enhance creative thinking and problem-solving.`
            ];
        } else if (description.includes('snow')) {
            suggestionArray = [
                `${weatherData.name} has transformed into a winter wonderland! ❄️ The temperature of ${temp}°C creates perfect conditions for snow to blanket the landscape. Humidity sits at ${humidity}%, while visibility is reduced to ${visibility} meters, giving everything a dreamy quality. The wind at ${wind} m/s creates mesmerizing swirls of snowflakes. Experience childlike wonder—build a snowperson, try snow photography, or take a quiet walk to hear the special muffled silence that only fresh snow creates.`,
                
                `A symphony in white plays across ${weatherData.name} as snowflakes transform the ordinary! ❄️ With ${temp}°C and ${humidity}% humidity, conditions are perfect for snow that sticks and sparkles. Visibility reduced to ${visibility} meters creates that intimate feeling where the world beyond disappears into white mist. Bundle up in layers and experience the unique acoustic properties of snow, observe how light plays through ice crystals, or appreciate how familiar landscapes become mysterious under their white covering.`,
                
                `${weatherData.name} experiences the gentle magic of snowfall today! ⛄ The temperature reads ${temp}°C—perfect for snow that maintains its structure. With humidity at ${humidity}% and gentle winds, snowflakes fall in a mesmerizing pattern. This weather creates a special opportunity to observe nature's geometry up close—examine snowflake structures, take artistic photographs, or make the first footprints in pristine snow.`
            ];
        } else if (description.includes('storm')) {
            suggestionArray = [
                `The elements put on a dramatic performance in ${weatherData.name} today! ⚡ The temperature reads ${temp}°C, but atmospheric dynamics are far more complex. With winds at ${wind} m/s and visibility reduced to ${visibility} meters, nature demonstrates its raw power. The ${humidity}% humidity means the air feels charged with energy. Respect nature's might from a safe distance—ensure devices are charged and keep emergency supplies accessible. There's primal beauty in watching storms from secure shelter.`,
                
                `A magnificent atmospheric symphony plays over ${weatherData.name} as storm clouds gather! 🌩️ Currently experiencing turbulent conditions with ${temp}°C and ${humidity}% humidity. The wind makes its presence known at ${wind} m/s while visibility has decreased to ${visibility} meters. This powerful weather system demands respect—secure outdoor items, keep pets indoors, and prepare for possible power fluctuations. While sheltering safely, witness one of nature's most impressive displays.`,
                
                `${weatherData.name} experiences the theatrical drama of a storm system today! ⛈️ The temperature registers at ${temp}°C, but the real story is in the dynamic atmospheric conditions. Winds surge at ${wind} m/s, visibility reduced to ${visibility} meters, and humidity stands at ${humidity}%. This weather calls for prudent caution—stay informed through local alerts and avoid unnecessary travel. Consider preparing a cozy storm shelter with emergency supplies and perhaps board games or books that don't require electricity.`
            ];
        } else {
            suggestionArray = [
                `${weatherData.name} is experiencing ${weatherData.weather[0].description} today! 🌤️ The temperature sits at ${temp}°C while humidity hovers at ${humidity}%. Visibility extends to ${visibility} meters, offering a particular perspective on your surroundings. The wind moves at ${wind} m/s, occasionally shifting direction. Observe how this specific weather affects the environment—notice how light filters differently, how plants and animals respond, or how the atmosphere creates particular scents and sounds.`,
                
                `The atmosphere in ${weatherData.name} presents a fascinating mix with ${weatherData.weather[0].description}! 🌡️ Currently experiencing ${temp}°C with ${humidity}% humidity and winds at ${wind} m/s. Take a mindful walk to notice how this specific weather affects colors, sounds, and local wildlife. Consider wearing versatile clothing that can adapt to potential changes, and perhaps bring a weather journal to document your observations of this interesting meteorological state.`,
                
                `${weatherData.name} is currently under the influence of ${weatherData.weather[0].description}—a weather pattern with its own distinctive energy! 🌈 The temperature registers at ${temp}°C, while humidity sits at ${humidity}% and winds move at ${wind} m/s. This weather creates an opportunity for enthusiasts to observe specific cloud formations, light qualities, and atmospheric effects. Consider how this weather might influence your plans—perhaps certain activities would benefit from these specific conditions.`
            ];
        }
        
        // Pick a random suggestion
        const suggestion = suggestionArray[Math.floor(Math.random() * suggestionArray.length)];
        
        document.getElementById('aiInsightsWidget').innerHTML = `<p>${suggestion}</p>`;

        // Update temperature chart
        if (forecastData && forecastData.list) {
            const ctx = document.getElementById('dashboardTempChart').getContext('2d');
            
            // Extract data for chart
            const labels = [];
            const tempData = [];
            
            for (let i = 0; i < 8 && i < forecastData.list.length; i++) {
                const forecast = forecastData.list[i];
                const date = new Date(forecast.dt * 1000);
                labels.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                tempData.push(forecast.main.temp);
            }
            
            // Create or update chart
            if (window.dashboardChart) {
                window.dashboardChart.data.labels = labels;
                window.dashboardChart.data.datasets[0].data = tempData;
                window.dashboardChart.update();
            } else {
                window.dashboardChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Temperature (°C)',
                            data: tempData,
                            borderColor: '#6aa4df',
                            backgroundColor: 'rgba(106, 164, 223, 0.2)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            },
                            x: {
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            }
                        }
                    }
                });
            }
        }
    }
});

// Typewriter effect
function typeWriter(element, text, speed, index = 0) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        setTimeout(() => typeWriter(element, text, speed, index + 1), speed);
    }
}

async function fetch5DayForecast(lat, lon) {
    const apiKey = "4b841b77585a504a294f9794864a4738"; // Replace with your OpenWeatherMap API key
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

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
    

    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        // ... existing code ...

        // Process the data to get one forecast per day
        const forecasts = [];
        const daysSeen = new Set(); // To track unique days

        data.list.forEach((entry) => {
            const forecastDate = new Date(entry.dt * 1000);
            const day = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });

            // Only add the first forecast for each unique day
            if (!daysSeen.has(day)) {
                daysSeen.add(day);

                const iconCode = entry.weather[0].icon;
                const gifIcon = weatherIcons[iconCode] || "default-icon.gif";
                
                // Get min and max temps if available
                const minTemp = entry.main.temp_min ? Math.round(entry.main.temp_min) : Math.round(entry.main.temp - 2);
                const maxTemp = entry.main.temp_max ? Math.round(entry.main.temp_max) : Math.round(entry.main.temp + 2);

                forecasts.push({
                    date: forecastDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    time: forecastDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    icon: gifIcon,
                    description: entry.weather[0].description,
                    temp: Math.round(entry.main.temp),
                    minTemp: minTemp,
                    maxTemp: maxTemp,
                    humidity: entry.main.humidity
                });
            }

            // Stop once we have 5 days of forecasts
            if (forecasts.length === 5) return;
        });

        // Generate HTML for the forecast cards
        let forecastHTML = '';
        forecasts.forEach((forecast) => {
            forecastHTML += `
                <div class="forecast-card">
                    <div class="date">${forecast.date}</div>
                    <img src="animation/${forecast.icon}" alt="${forecast.description}" />
                    <h2>${forecast.description}</h2>
                    <p><span class="temp-high">${forecast.maxTemp}°</span> / <span class="temp-low">${forecast.minTemp}°</span></p>
                    <p><i class="fas fa-tint"></i> ${forecast.humidity}%</p>
                </div>
            `;
        });

        document.getElementById('forecastCards').innerHTML = forecastHTML;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        document.getElementById('forecastCards').innerHTML = `<p>Error fetching forecast: ${error.message}</p>`;
    }
}

function toggleUnits() {
    const tempElements = document.querySelectorAll('.temp-value');
    tempElements.forEach(el => {
        if (el.dataset.unit === 'celsius') {
            // Convert to fahrenheit
            el.textContent = Math.round((parseFloat(el.textContent) * 9/5) + 32);
            el.dataset.unit = 'fahrenheit';
        } else {
            // Convert back to celsius
            el.textContent = Math.round((parseFloat(el.textContent) - 32) * 5/9);
            el.dataset.unit = 'celsius';
        }
    });
}

function displayLocalTime() {
    const localTime = new Date();
    const timeHTML = `
        <div class="local-time">
            <i class="fas fa-clock"></i>
            Local Time: ${localTime.toLocaleTimeString()}
        </div>
    `;
    document.getElementById('weatherInfo').insertAdjacentHTML('afterbegin', timeHTML);
}

// Call displayLocalTime when updating weather info
displayLocalTime();

// Make sure this function is called after a successful search
async function fetchLocationNews() {
    const newsContent = document.getElementById('newsContent');
    
    // Get the current location from the weather info
    const weatherTitle = document.querySelector('#weatherInfo h2');
    if (!weatherTitle) {
        newsContent.innerHTML = `
            <p>Please search for a location first to see related news.</p>`;
        return;
    }
    
    // Extract location name from the weather title
    const locationText = weatherTitle.textContent;
    const locationName = locationText.split(',')[0].replace('Weather in ', '');
    
    // Show loading state
    newsContent.innerHTML = `
        <p><i class="fas fa-spinner fa-spin"></i> Loading news for ${locationName}...</p>`;
    
    try {
        // Use NewsAPI to fetch news about the location
        const apiKey = '36577ee6934e4b75ae6152b1d37e0787'; // Your NewsAPI key
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(locationName)}&apiKey=${apiKey}&pageSize=5&language=en`);
        const data = await response.json();
        
        console.log('News API response:', data); // Add this for debugging
        
        if (data.status === 'ok' && data.articles && data.articles.length > 0) {
            let newsHTML = `<div class="news-container">`;
            
            data.articles.forEach(article => {
                const publishedDate = new Date(article.publishedAt).toLocaleDateString();
                newsHTML += `
                    <div class="news-item">
                        <h4>${article.title}</h4>
                        <p class="news-source">${article.source.name} • ${publishedDate}</p>
                        <p>${article.description || 'No description available'}</p>
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read more</a>
                    </div>`;
            });
            
            newsHTML += `</div>`;
            newsContent.innerHTML = newsHTML;
        } else {
            newsContent.innerHTML = `
                <p>No news found for ${locationName}. Try another location.</p>`;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContent.innerHTML = `
            <p>Error loading news. Please try again later.</p>
            <p class="error-details">${error.message}</p>`;
    }
}

// Function to toggle news visibility
function toggleNews() {
    const newsBox = document.getElementById('locationNewsBox');
    if (newsBox.classList.contains('hidden')) {
        fetchLocationNews(); // Fetch fresh news when toggling
        newsBox.classList.remove('hidden');
    } else {
        newsBox.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', async () => {
            // ... existing search code ...
            
            // After the weather data is successfully fetched and displayed
            // Add this line to update the news
            await fetchLocationNews();
            
        });
    }
});

// Add event listener for the Enter key on the search input
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    // Check if the key pressed was Enter (key code 13)
    if (event.key === 'Enter') {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Trigger the search button click
        document.getElementById('searchButton').click();
    }
})

// Weather Layers functionality
let cloudsLayer, precipLayer, tempLayer, windLayer;
const weatherApiKey = '4b841b77585a504a294f9794864a4738'; // Your OpenWeatherMap API key

// Initialize weather layers
function initWeatherLayers() {
    // Make sure map is defined and available
    if (typeof map === 'undefined') {
        console.error('Map not available for weather layers initialization');
        return;
    }
    
    console.log('Initializing weather layers...');
    
    try {
        // Create the layers
        cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
            maxZoom: 19,
            attribution: '&copy; OpenWeatherMap',
            opacity: 0.5
        });
        
        precipLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
            maxZoom: 19,
            attribution: '&copy; OpenWeatherMap',
            opacity: 0.5
        });
        
        tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
            maxZoom: 19,
            attribution: '&copy; OpenWeatherMap',
            opacity: 0.5
        });
        
        windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
            maxZoom: 19,
            attribution: '&copy; OpenWeatherMap',
            opacity: 0.5
        });
        
        // Set up event listeners for checkboxes
        const cloudsCheckbox = document.getElementById('cloudsLayer');
        const precipCheckbox = document.getElementById('precipLayer');
        const tempCheckbox = document.getElementById('tempLayer');
        const windCheckbox = document.getElementById('windLayer');
        
        if (cloudsCheckbox) {
            cloudsCheckbox.addEventListener('change', function() {
                toggleLayer(this.checked, cloudsLayer);
            });
        } else {
            console.error('Clouds layer checkbox not found');
        }
        
        if (precipCheckbox) {
            precipCheckbox.addEventListener('change', function() {
                toggleLayer(this.checked, precipLayer);
            });
        } else {
            console.error('Precipitation layer checkbox not found');
        }
        
        if (tempCheckbox) {
            tempCheckbox.addEventListener('change', function() {
                toggleLayer(this.checked, tempLayer);
            });
        } else {
            console.error('Temperature layer checkbox not found');
        }
        
        if (windCheckbox) {
            windCheckbox.addEventListener('change', function() {
                toggleLayer(this.checked, windLayer);
            });
        } else {
            console.error('Wind layer checkbox not found');
        }
        
        console.log('Weather layers initialized successfully');
    } catch (error) {
        console.error('Error initializing weather layers:', error);
    }
}

// Toggle layer visibility
function toggleLayer(isChecked, layer) {
    try {
        if (isChecked) {
            console.log('Adding layer to map');
            map.addLayer(layer);
        } else {
            console.log('Removing layer from map');
            map.removeLayer(layer);
        }
    } catch (error) {
        console.error('Error toggling layer:', error);
    }
}

// Add event listener for Enter key on search input
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    // Check if the key pressed was Enter (key code 13)
    if (event.key === 'Enter') {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Trigger the search button click
        document.getElementById('searchButton').click();
    }
});

// Initialize weather layers when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure map is initialized
    setTimeout(initWeatherLayers, 1000);
});

// Function to update temperature timeline
function updateTemperatureTimeline(forecastData) {
    if (!forecastData || !forecastData.list || forecastData.list.length < 4) {
        return;
    }
    
    // Get forecast data for different times of day
    const morning = forecastData.list.find(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 6 && hour <= 9;
    }) || forecastData.list[0];
    
    const afternoon = forecastData.list.find(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 12 && hour <= 15;
    }) || forecastData.list[1];
    
    const evening = forecastData.list.find(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 18 && hour <= 21;
    }) || forecastData.list[2];
    
    const night = forecastData.list.find(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 0 && hour <= 3;
    }) || forecastData.list[3];
    
    // Update temperature values
    document.getElementById('morningTemp').textContent = `${Math.round(morning.main.temp)}°`;
    document.getElementById('afternoonTemp').textContent = `${Math.round(afternoon.main.temp)}°`;
    document.getElementById('eveningTemp').textContent = `${Math.round(evening.main.temp)}°`;
    document.getElementById('nightTemp').textContent = `${Math.round(night.main.temp)}°`;
}

// Add this to your updateDashboard function
function updateDashboard(weatherData, forecastData) {
    // ... existing code ...
    
    // Update temperature timeline
    updateTemperatureTimeline(forecastData);
    
    // Add event listener for Get Started button
    document.getElementById('getStartedBtn').addEventListener('click', function() {
        // You can implement functionality to show global map here
        alert('Global map feature coming soon!');
    });
}

