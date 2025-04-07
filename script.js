function getDayName(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  async function getForecast(location) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';
  
    if (!location) {
      location = document.getElementById('locationInput').value.trim();
      if (!location) {
        container.innerHTML = '<p>Please enter a location.</p>';
        return;
      }
    }
  
    const apiKey = '1a2d62d4005c437498e145857250704';
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5`;

  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.error) {
        container.innerHTML = `<p>${data.error.message}</p>`;
        return;
      }
  
      const forecastDays = data.forecast.forecastday;
  
      forecastDays.forEach(day => {
        const date = getDayName(day.date);
        const temp = `${day.day.avgtemp_c}°C`;
        const condition = day.day.condition.text;
        const icon = day.day.condition.icon;
        const humidity = day.day.avghumidity;
        const wind = `${day.day.maxwind_kph} km/h`;
        const sunrise = day.astro.sunrise;
        const sunset = day.astro.sunset;
  
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
          <div class="day">${date}</div>
          <div class="temp">${temp}</div>
          <img src="https:${icon}" alt="icon" />
          <div class="condition">${condition}</div>
          <div class="info">💧 Humidity: ${humidity}%</div>
          <div class="info">🌬 Wind: ${wind}</div>
          <div class="info">🌅 Sunrise: ${sunrise}</div>
          <div class="info">🌇 Sunset: ${sunset}</div>
        `;
        container.appendChild(card);
      });
  
    } catch (err) {
      container.innerHTML = '<p>Error fetching weather data.</p>';
    }
  }
  
  function toggleMode() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  }
  
  // Apply theme and location on load
  window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
          getForecast(coords);
        },
        () => getForecast("London")
      );
    } else {
      getForecast("London");
    }
  };
  
