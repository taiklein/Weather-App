let shareLocation = confirm('Allow this website to access your location?');

let search = document.getElementById('search');

    if (shareLocation) {
        search.style.display = 'none';

        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log(latitude);
            console.log(longitude);

//get weather data

        const response = await fetch (
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,is_day&daily=sunrise,sunset`);
                
        const data = await response.json();

//get the current weather info

        const weatherCode = data.current.weather_code;
        const isDay = data.current.is_day;

        console.log(weatherCode);
        console.log(isDay)

// weather codes into weather names

        let weather;

        if (weatherCode === 0) {
            weather = 'sunny';
        } else if (weatherCode >= 1 && weatherCode <= 3) {
            weather = 'cloudy'
        } else if (weatherCode === 45 || weatherCode === 48) {
            weather = 'foggy'
        } else if (weatherCode >= 51 && weatherCode <= 57) {
            weather = 'drizzle'
        } else if ((weatherCode >= 61 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
            weather = 'rainy'    
        } else if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode === 85 || weatherCode === 86)) {
            weather = 'snowy'
        } else if (weatherCode >= 95) {
            weather = 'stormy'
        }

// time of the day
        const now = new Date();

        const sunrise = new Date(data.daily.sunrise[0]);
        const sunset = new Date(data.daily.sunset[0]);

        const sunriseStart = new Date(
            sunrise.getTime() - 60 * 60 * 1000
        );
        const sunriseEnd = new Date(
            sunrise.getTime() + 60 * 60 * 1000
        );
        const sunsetStart = new Date(
            sunset.getTime() - 60 * 60 * 1000
        );
        const sunsetEnd = new Date(
            sunset.getTime() + 60 * 60 * 1000
        );

        let timeOfDay;

        if (now < sunriseStart) {
            timeOfDay = 'predawn';
        } else if (now >= sunriseStart && now < sunriseEnd) {
            timeOfDay = 'sunrise';
        } else if (now >= sunriseEnd && now < sunsetStart) {
            timeOfDay = 'day';
        } else if (now >= sunsetStart && now < sunsetEnd) {
            timeOfDay = 'sunset';
        } else {
            timeOfDay = 'night';
        }

// body class
        const backgroundClass = `${weather}-${timeOfDay}`;
        
        document.body.className = backgroundClass;

        console.log('Weather:', weather);
        console.log('Time:', timeOfDay);
        console.log('Body class:', backgroundClass);

    }, (error) => {
        console.log('Location error:', error);

        search.style.display = 'block';
    });

    } else {
        search.style.display = 'block';
    }
