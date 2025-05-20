document.getElementById('sideNav').addEventListener('click', (e) => {
    // Check if the clicked element is the Weather Info link
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#weather') {
        e.preventDefault(); // Prevent default anchor behavior

        // Toggle both weatherInfoSection and forecastSection
        const weatherInfoSection = document.getElementById('weatherInfoSection');
        const forecastSection = document.getElementById('forecastSection');
        const aiBox = document.getElementById('aiBox');
        

        const isVisible = weatherInfoSection.style.display === 'none'; // Check visibility

        // Toggle visibility
        if (isVisible) {
            weatherInfoSection.style.display = 'block';
            forecastSection.style.display = 'block';
            aiBox.style.display = 'block';
        } else {
            weatherInfoSection.style.display = 'none';
            forecastSection.style.display = 'none';
            aiBox.style.display = 'none';
        }   
    }
});


// Function to toggle weather layers panel
function toggleWeatherLayers() {
    const layerControls = document.querySelector('.layer-controls');
    if (layerControls) {
        layerControls.classList.toggle('visible');
    }
}
