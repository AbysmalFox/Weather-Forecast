// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const dashboard = document.getElementById('weatherDashboard');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('weatherDashboardTheme');
    if (savedTheme === 'dark') {
        dashboard.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        dashboard.classList.toggle('dark-theme');
        
        // Save theme preference
        if (dashboard.classList.contains('dark-theme')) {
            localStorage.setItem('weatherDashboardTheme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('weatherDashboardTheme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
});