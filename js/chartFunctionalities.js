// Chart objects
let temperatureChart;
let humidityChart;
let windChart;
let pressureChart;
let precipitationChart;
let weatherDistributionChart;
let temperatureRangeChart;
let uvIndexChart;

// Function to toggle chart visibility
function toggleCharts() {
    const chartSection = document.getElementById('weatherChartSection');
    if (chartSection.classList.contains('hidden')) {
        chartSection.classList.remove('hidden');
        // Update charts if they haven't been created yet
        if (!temperatureChart || !humidityChart || !windChart || !pressureChart || 
            !precipitationChart || !weatherDistributionChart || !temperatureRangeChart || !uvIndexChart) {
            updateChartsFromForecast();
        }
    } else {
        chartSection.classList.add('hidden');
    }
}

// Function to switch between chart pages
// Function to switch between chart pages
function showChartPage(pageNumber) {
    console.log(`Switching to chart page ${pageNumber}`);
    
    // Get all chart pages
    const chartPage1 = document.getElementById('chartPage1');
    const chartPage2 = document.getElementById('chartPage2');
    
    // Get all navigation buttons
    const buttons = document.querySelectorAll('.chart-nav button');
    
    if (pageNumber === 1) {
        // Show page 1, hide page 2
        chartPage1.style.display = 'grid';
        chartPage2.style.display = 'none';
        
        // Update button styles
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else if (pageNumber === 2) {
        // Show page 2, hide page 1
        chartPage1.style.display = 'none';
        chartPage2.style.display = 'grid';
        
        // Update button styles
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }
    
    console.log(`Chart page ${pageNumber} should now be visible`);
}

// Function to create temperature chart
function createTemperatureChart(labels, temperatures) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (temperatureChart) {
        temperatureChart.destroy();
    }
    
    // Create new chart
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Temperature Forecast',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Function to create humidity chart
function createHumidityChart(labels, humidity) {
    const ctx = document.getElementById('humidityChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (humidityChart) {
        humidityChart.destroy();
    }
    
    // Create new chart
    humidityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidity,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Humidity Forecast',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Function to create wind speed chart
function createWindChart(labels, windSpeeds) {
    const ctx = document.getElementById('windChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (windChart) {
        windChart.destroy();
    }
    
    // Create new chart
    windChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wind Speed (m/s)',
                data: windSpeeds,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Wind Speed Forecast',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Function to create atmospheric pressure chart
function createPressureChart(labels, pressureValues) {
    const ctx = document.getElementById('pressureChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (pressureChart) {
        pressureChart.destroy();
    }
    
    // Create new chart
    pressureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pressure (hPa)',
                data: pressureValues,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Atmospheric Pressure Forecast',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Function to create precipitation probability chart
function createPrecipitationChart(labels, precipitationValues) {
    const ctx = document.getElementById('precipitationChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (precipitationChart) {
        precipitationChart.destroy();
    }
    
    // Create new chart
    precipitationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Precipitation Probability (%)',
                data: precipitationValues,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Precipitation Forecast',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Function to create weather condition distribution chart (pie chart)
function createWeatherDistributionChart(weatherTypes) {
    const ctx = document.getElementById('weatherDistributionChart').getContext('2d');
    
    // Count occurrences of each weather type
    const weatherCounts = {};
    weatherTypes.forEach(type => {
        if (weatherCounts[type]) {
            weatherCounts[type]++;
        } else {
            weatherCounts[type] = 1;
        }
    });
    
    // Prepare data for chart
    const labels = Object.keys(weatherCounts);
    const data = Object.values(weatherCounts);
    
    // Define colors for different weather types
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)'
    ];
    
    // Create new chart
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Weather Condition Distribution',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        color: 'white',
                        padding: 15
                    }
                }
            }
        }
    });
}

// Function to extract data from forecast cards and update charts
function updateChartsFromForecast() {
    const forecastCards = document.querySelectorAll('.forecast-card');
    if (forecastCards.length === 0) {
        console.log('No forecast data available for charts');
        return;
    }
    
    const labels = [];
    const temperatures = [];
    const humidity = [];
    const windSpeeds = [];
    const pressureValues = [];
    const precipitationValues = [];
    const weatherTypes = [];
    const minTemps = [];
    const maxTemps = [];
    const uvValues = [];
    
    forecastCards.forEach(card => {
        // Extract date
        const dateElement = card.querySelector('h2');
        if (dateElement) {
            labels.push(dateElement.textContent.split(',')[0]); // Just get the day name
        }
        
        // Extract temperature
        const tempElement = card.querySelector('p:nth-child(5)');
        if (tempElement) {
            const tempText = tempElement.textContent;
            const tempValue = parseFloat(tempText.match(/\d+(\.\d+)?/)[0]);
            temperatures.push(tempValue);
            
            // Generate random humidity for demonstration
            humidity.push(Math.floor(Math.random() * 30) + 50); // Random humidity between 50-80%
            
            // Generate min/max temperatures
            const minTemp = tempValue - Math.floor(Math.random() * 5) - 2; // 2-7 degrees lower
            const maxTemp = tempValue + Math.floor(Math.random() * 5) + 2; // 2-7 degrees higher
            minTemps.push(minTemp);
            maxTemps.push(maxTemp);
        }
        
        // Extract or generate other weather data
        // Wind speed (random for demonstration)
        windSpeeds.push(Math.floor(Math.random() * 10) + 1); // Random wind speed between 1-10 m/s
        
        // Pressure (random for demonstration)
        pressureValues.push(Math.floor(Math.random() * 20) + 1000); // Random pressure between 1000-1020 hPa
        
        // Precipitation probability (random for demonstration)
        precipitationValues.push(Math.floor(Math.random() * 100)); // Random probability between 0-100%
        
        // UV Index (random for demonstration)
        uvValues.push(Math.floor(Math.random() * 11) + 1); // Random UV index between 1-11
        
        // Weather type (extract from card or generate random)
        const descElement = card.querySelector('p:nth-child(3)');
        if (descElement) {
            const descText = descElement.textContent;
            // Extract weather type or use a default
            const weatherType = descText.includes(':') ? descText.split(':')[1].trim() : 'Unknown';
            weatherTypes.push(weatherType);
        } else {
            // Random weather types for demonstration
            const types = ['Clear', 'Cloudy', 'Rain', 'Snow', 'Thunderstorm'];
            weatherTypes.push(types[Math.floor(Math.random() * types.length)]);
        }
    });
    
    // Create charts with the extracted data
    createTemperatureChart(labels, temperatures);
    createHumidityChart(labels, humidity);
    createWindChart(labels, windSpeeds);
    createPressureChart(labels, pressureValues);
    createPrecipitationChart(labels, precipitationValues);
    createWeatherDistributionChart(weatherTypes);
    createTemperatureRangeChart(labels, minTemps, maxTemps);
    createUVIndexChart(labels, uvValues);
}

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for chart page navigation
    const chartNavButtons = document.querySelectorAll('.chart-nav button');
    chartNavButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            showChartPage(index + 1);
        });
    });
    
    // Add event listener for forecast updates
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.target.id === 'forecastCards') {
                // Forecast has been updated, update charts
                if (!document.getElementById('weatherChartSection').classList.contains('hidden')) {
                    updateChartsFromForecast();
                }
            }
        });
    });
    
    // Start observing the forecast container for changes
    const forecastContainer = document.getElementById('forecastCards');
    if (forecastContainer) {
        observer.observe(forecastContainer, { childList: true });
    }
});

// Function to create temperature range chart (min/max)
function createTemperatureRangeChart(labels, minTemps, maxTemps) {
    const ctx = document.getElementById('temperatureRangeChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (temperatureRangeChart) {
        temperatureRangeChart.destroy();
    }
    
    // Create new chart
    temperatureRangeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Min Temperature',
                    data: minTemps,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Max Temperature',
                    data: maxTemps,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature Range Forecast',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Function to create UV Index chart
function createUVIndexChart(labels, uvValues) {
    const ctx = document.getElementById('uvIndexChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (uvIndexChart) {
        uvIndexChart.destroy();
    }
    
    // Define colors for different UV levels
    const getUVColor = (value) => {
        if (value <= 2) return 'rgba(0, 128, 0, 0.7)'; // Green - Low
        if (value <= 5) return 'rgba(255, 255, 0, 0.7)'; // Yellow - Moderate
        if (value <= 7) return 'rgba(255, 165, 0, 0.7)'; // Orange - High
        if (value <= 10) return 'rgba(255, 0, 0, 0.7)'; // Red - Very High
        return 'rgba(128, 0, 128, 0.7)'; // Purple - Extreme
    };
    
    // Get colors based on UV values
    const backgroundColors = uvValues.map(value => getUVColor(value));
    
    // Create new chart
    uvIndexChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'UV Index',
                data: uvValues,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'UV Index Forecast',
                    color: 'white',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            let risk = '';
                            if (value <= 2) risk = 'Low';
                            else if (value <= 5) risk = 'Moderate';
                            else if (value <= 7) risk = 'High';
                            else if (value <= 10) risk = 'Very High';
                            else risk = 'Extreme';
                            return `UV Index: ${value} (${risk})`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 12,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            if (value === 0) return '0';
                            if (value === 3) return '3 - Moderate';
                            if (value === 6) return '6 - High';
                            if (value === 8) return '8 - Very High';
                            if (value === 11) return '11+ Extreme';
                            return value;
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Update the updateChartsFromForecast function to include the new charts
function updateChartsFromForecast() {
    const forecastCards = document.querySelectorAll('.forecast-card');
    if (forecastCards.length === 0) {
        console.log('No forecast data available for charts');
        return;
    }
    
    const labels = [];
    const temperatures = [];
    const humidity = [];
    const windSpeeds = [];
    const pressureValues = [];
    const precipitationValues = [];
    const weatherTypes = [];
    const minTemps = [];
    const maxTemps = [];
    const uvValues = [];
    
    forecastCards.forEach(card => {
        // Extract date
        const dateElement = card.querySelector('h2');
        if (dateElement) {
            labels.push(dateElement.textContent.split(',')[0]); // Just get the day name
        }
        
        // Extract temperature
        const tempElement = card.querySelector('p:nth-child(5)');
        if (tempElement) {
            const tempText = tempElement.textContent;
            const tempValue = parseFloat(tempText.match(/\d+(\.\d+)?/)[0]);
            temperatures.push(tempValue);
            
            // Generate random humidity for demonstration
            humidity.push(Math.floor(Math.random() * 30) + 50); // Random humidity between 50-80%
            
            // Generate min/max temperatures
            const minTemp = tempValue - Math.floor(Math.random() * 5) - 2; // 2-7 degrees lower
            const maxTemp = tempValue + Math.floor(Math.random() * 5) + 2; // 2-7 degrees higher
            minTemps.push(minTemp);
            maxTemps.push(maxTemp);
        }
        
        // Extract or generate other weather data
        // Wind speed (random for demonstration)
        windSpeeds.push(Math.floor(Math.random() * 10) + 1); // Random wind speed between 1-10 m/s
        
        // Pressure (random for demonstration)
        pressureValues.push(Math.floor(Math.random() * 20) + 1000); // Random pressure between 1000-1020 hPa
        
        // Precipitation probability (random for demonstration)
        precipitationValues.push(Math.floor(Math.random() * 100)); // Random probability between 0-100%
        
        // UV Index (random for demonstration)
        uvValues.push(Math.floor(Math.random() * 11) + 1); // Random UV index between 1-11
        
        // Weather type (extract from card or generate random)
        const descElement = card.querySelector('p:nth-child(3)');
        if (descElement) {
            const descText = descElement.textContent;
            // Extract weather type or use a default
            const weatherType = descText.includes(':') ? descText.split(':')[1].trim() : 'Unknown';
            weatherTypes.push(weatherType);
        } else {
            // Random weather types for demonstration
            const types = ['Clear', 'Cloudy', 'Rain', 'Snow', 'Thunderstorm'];
            weatherTypes.push(types[Math.floor(Math.random() * types.length)]);
        }
    });
    
    // Create charts with the extracted data
    createTemperatureChart(labels, temperatures);
    createHumidityChart(labels, humidity);
    createWindChart(labels, windSpeeds);
    createPressureChart(labels, pressureValues);
    createPrecipitationChart(labels, precipitationValues);
    createWeatherDistributionChart(weatherTypes);
    createTemperatureRangeChart(labels, minTemps, maxTemps);
    createUVIndexChart(labels, uvValues);
}

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for chart page navigation
    const chartNavButtons = document.querySelectorAll('.chart-nav button');
    chartNavButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            showChartPage(index + 1);
        });
    });
    
    // Add event listener for forecast updates
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.target.id === 'forecastCards') {
                // Forecast has been updated, update charts
                if (!document.getElementById('weatherChartSection').classList.contains('hidden')) {
                    updateChartsFromForecast();
                }
            }
        });
    });
    
    // Start observing the forecast container for changes
    const forecastContainer = document.getElementById('forecastCards');
    if (forecastContainer) {
        observer.observe(forecastContainer, { childList: true });
    }
});