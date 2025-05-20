// Weather Alerts functionality
document.addEventListener('DOMContentLoaded', function() {
    // Reference to the alerts container
    const alertsContainer = document.getElementById('alertsContainer');
    
    // Function to fetch weather alerts for a location
    function fetchWeatherAlerts(lat, lon) {
        // Clear previous alerts
        alertsContainer.innerHTML = '';
        
        // OpenWeatherMap doesn't provide alerts in the free tier
        // We'll use the OneCall API which includes alerts (requires paid subscription)
        // For demonstration, we'll simulate some alerts based on current weather conditions
        
        // First, get the current weather to determine if we should show simulated alerts
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4b841b77585a504a294f9794864a4738&units=metric`)
            .then(response => response.json())
            .then(data => {
                // Generate simulated alerts based on weather conditions
                const alerts = generateSimulatedAlerts(data);
                
                if (alerts.length > 0) {
                    // Display the alerts
                    alerts.forEach(alert => {
                        const alertElement = createAlertElement(alert);
                        alertsContainer.appendChild(alertElement);
                    });
                } else {
                    // No alerts to display
                    alertsContainer.innerHTML = '<div class="no-alerts-message">No active weather alerts</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching weather data for alerts:', error);
                alertsContainer.innerHTML = '<div class="no-alerts-message">Unable to fetch weather alerts</div>';
            });
    }
    
    // Function to generate simulated alerts based on current weather
    function generateSimulatedAlerts(weatherData) {
        const alerts = [];
        
        if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
            return alerts;
        }
        
        const weatherId = weatherData.weather[0].id;
        const temp = weatherData.main?.temp;
        const windSpeed = weatherData.wind?.speed;
        
        // Thunderstorm alerts (200-299)
        if (weatherId >= 200 && weatherId < 300) {
            alerts.push({
                title: 'Thunderstorm Warning',
                message: 'Thunderstorms detected in your area. Take necessary precautions.',
                severity: 'high'
            });
        }
        
        // Rain alerts (500-599) - Lowered threshold to include light rain
        if (weatherId >= 500 && weatherId < 600) {
            alerts.push({
                title: 'Rain Alert',
                message: 'Rainfall expected. Consider bringing an umbrella.',
                severity: 'low'
            });
        }
        
        // Snow alerts (600-699)
        if (weatherId >= 600 && weatherId < 700) {
            alerts.push({
                title: 'Snow Advisory',
                message: 'Snowfall expected. Roads may be slippery.',
                severity: 'medium'
            });
        }
        
        // Temperature alerts - Lowered thresholds
        if (temp && temp > 25) {
            alerts.push({
                title: 'Heat Advisory',
                message: 'Warm temperatures detected. Stay hydrated and use sun protection.',
                severity: 'low'
            });
        } else if (temp && temp < 10) {
            alerts.push({
                title: 'Cool Temperature Alert',
                message: 'Cool temperatures expected. Consider wearing warmer clothing.',
                severity: 'low'
            });
        }
        
        // Wind alerts - Lowered threshold
        if (windSpeed && windSpeed > 5) {
            alerts.push({
                title: 'Wind Advisory',
                message: 'Breezy conditions detected. Light objects may be affected.',
                severity: 'low'
            });
        }
        
        return alerts;
    }
    
    // Function to create an alert element
    function createAlertElement(alert) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item alert-${alert.severity}`;
        
        alertDiv.innerHTML = `
            <div class="alert-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message">${alert.message}</div>
            </div>
        `;
        
        return alertDiv;
    }
    
    // Listen for location updates to refresh alerts
    window.addEventListener('weatherLocationUpdated', function(e) {
        if (e.detail && e.detail.lat && e.detail.lon) {
            fetchWeatherAlerts(e.detail.lat, e.detail.lon);
        }
    });
    
    // Initial fetch if coordinates are available in localStorage
    const savedLat = localStorage.getItem('weatherLat');
    const savedLon = localStorage.getItem('weatherLon');
    
    if (savedLat && savedLon) {
        fetchWeatherAlerts(savedLat, savedLon);
    }
});
function saveAlertHistory(location, alerts) {
    const alertHistory = JSON.parse(localStorage.getItem('weatherAlertHistory') || '{}');
    
    if (!alertHistory[location]) {
        alertHistory[location] = [];
    }
    
    // Add current alerts with timestamp
    alertHistory[location].unshift({
        timestamp: new Date().toISOString(),
        alerts: alerts
    });
    
    // Keep only last 10 entries
    if (alertHistory[location].length > 10) {
        alertHistory[location] = alertHistory[location].slice(0, 10);
    }
    
    localStorage.setItem('weatherAlertHistory', JSON.stringify(alertHistory));
}
function showAlertNotification(alert) {
    const notification = document.createElement('div');
    notification.className = 'alert-notification alert-' + alert.severity;
    
    notification.innerHTML = `
        <div class="notification-header">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${alert.type}</span>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        </div>
        <div class="notification-body">
            ${alert.message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation class after a small delay (for transition effect)
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}