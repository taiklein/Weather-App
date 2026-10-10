let shareLocation = confirm ('Allow this website to have access to your location?')

const search = document.getElementById('search')

async function getWeather(lat, lon) {
    search.style.display = 'none'    

// reverse geocoding

        const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        const geoData = await geoResponse.json()

// get weather data

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset,weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weathercode,is_day&timezone=auto`)
        const data = await response.json()

        const tempElement = document.getElementById('temperature')
        tempElement.innerText = `${data.current_weather.temperature} °C`

        const cityElement = document.getElementById('cityName')
        cityElement.innerText = geoData.city || geoData.locality || "My Location"

        const countryElement = document.getElementById('country')
        countryElement.innerText = geoData.countryName

        weatherDisplay(data.current_weather.weathercode, data.current_weather.is_day, data.current_weather.time, data.daily)

        hourly(data.hourly, data.current_weather.time)

        daily(data.daily)
        }

        if (shareLocation) {
            search.style.display = 'none'

            navigator.geolocation.getCurrentPosition((position) => {
                getWeather(position.coords.latitude, position.coords.longitude)
            }, (error) => {
                console.warn(`Geolocation error (${error.code}): ${error.message}`)
                search.style.display = 'block'
            }, {
                timeout: 10000,
                maximumAge: Infinity
            })
        } else {
            search.style.display = 'block'
        }

//searching manually

async function searchWeather() {
    const inputElement = document.getElementById('city')
    const cityName = inputElement.value

    if (!cityName) return

    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`)
    const geoData = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
        alert("City not found!")
        return
    }

    const lat = geoData.results[0].latitude
    const lon = geoData.results[0].longitude
    const realCityName = geoData.results[0].name
    const realCountryName = geoData.results[0].country

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset,weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weathercode,is_day&timezone=auto`)
    const data = await response.json()

    document.getElementById('temperature').innerText = `${data.current_weather.temperature} °C`
    document.getElementById('cityName').innerText = realCityName
    document.getElementById('country').innerText = realCountryName

    weatherDisplay(data.current_weather.weathercode, data.current_weather.is_day, data.current_weather.time, data.daily,)

    hourly(data.hourly, data.current_weather.time)

    daily(data.daily)
}

function capitalizeWords(str) {
    const words = str.split("")
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
    }
    return words.join("")
}

// weather description and icons

function weatherDisplay(code, isDay, timeString, dailyData,){

    let weatherDescription = ""
    let iconClass = ""

    switch (code) {
        case 0:
            weatherDescription = "Clear Sky"
            iconClass = (isDay === 1) ? "fa-solid fa-sun" : "fa-solid fa-moon"
            weatherPrefix = "sunny"
            break

        case 1:
            weatherDescription = "Mostly Clear"
            iconClass = (isDay === 1) ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon"
            weatherPrefix = "sunny"
            break

        case 2:
            weatherDescription = "Partly Cloudy"
            iconClass = (isDay === 1) ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon"
            weatherPrefix = "cloudy"
            break

        case 3:
            weatherDescription = "Cloudy"
            iconClass = "fa-solid fa-cloud"
            weatherPrefix = "cloudy"
            break 

        case 45:
            weatherDescription = "Foggy"
            iconClass = "fa-solid fa-smog"
            weatherPrefix = "foggy"
            break

        case 48:
            weatherDescription = "Freezing Fog"
            iconClass = "fa-solid fa-smog"
            weatherPrefix = "foggy"
            break

        case 51:
            weatherDescription = "Light Drizzle"
            iconClass = "fa-solid fa-cloud-rain"
            weatherPrefix = "drizzle"
            break
    
        case 53:
            weatherDescription = "Drizzle"
            iconClass = "fa-solid fa-cloud-rain"
            weatherPrefix = "drizzle"
            break

        case 55:
            weatherDescription = "Heavy Drizzle"
            iconClass = "fa-solid fa-cloud-rain"
            weatherPrefix = "drizzle"
            break
        
        case 61:
            weatherDescription = "Light Rain"
            iconClass = "fa-solid fa-cloud-showers-heavy"
            weatherPrefix = "rainy"
            break
        
        case 63:
            weatherDescription = "Rain"
            iconClass = "fa-solid fa-cloud-showers-heavy"
            weatherPrefix = "rainy"
            break

        case 65:
            weatherDescription = "Heavy Rain"
            iconClass = "fa-solid fa-cloud-showers-heavy"
            weatherPrefix = "rainy"
            break

        case 71:
            weatherDescription = "Light Snow"
            iconClass = "fa-regular fa-snowflake"
            weatherPrefix = "snowy"
            break

        case 73:
            weatherDescription = "Snow"
            iconClass = "fa-regular fa-snowflake"
            weatherPrefix = "snowy"
            break

        case 75:
            weatherDescription = "Heavy Snow"
            iconClass = "fa-regular fa-snowflake"
            weatherPrefix = "snowy"
            break

        case 95:
            weatherDescription = "Thunderstorm"
            iconClass = "fa-regular fa-cloud-bolt"
            weatherPrefix = "stormy"
            break

        case 96:
            weatherDescription = "Thunderstorm with Light Hail"
            iconClass = "fa-regular fa-cloud-bolt"
            weatherPrefix = "stormy"
            break

        case 99:
            weatherDescription = "Thunderstorm with Heavy Hail"
            iconClass = "fa-regular fa-cloud-bolt"
            weatherPrefix = "stormy"
            break
    }

    weatherDescription = capitalizeWords(weatherDescription)

    const timePeriod = getTime(timeString, dailyData)

    document.body.className = `${weatherPrefix}-${timePeriod}`
    document.getElementById('weatherText').innerText = weatherDescription
    document.getElementById('weatherIcon').className = iconClass
}

//backgrounds

function getTime(timeString, dailyData) {

    const sunriseString = dailyData.sunrise[0]
    const sunsetString = dailyData.sunset[0]

    const currentTime = new Date(timeString).getTime()
    const sunriseTime = new Date(sunriseString).getTime()
    const sunsetTime = new Date(sunsetString).getTime()

    const oneHour = 60 * 60 * 1000

    if (currentTime >= (sunriseTime - oneHour) && currentTime < sunriseTime) {
        return "predawn"
    } else if (currentTime >= sunriseTime && currentTime < (sunriseTime + (oneHour * 2))) {
        return "sunrise"
    } else if (currentTime >= (sunriseTime + (oneHour * 2)) && currentTime < (sunsetTime - oneHour )) {
        return "day"
    } else if (currentTime >= (sunsetTime - oneHour) && currentTime <= (sunsetTime + oneHour)) {
        return "sunset"
    } else {
        return "night"
    }
}

//hourly weather

function hourly(hourlyData, currentWeatherTimne) {

    const hourlyCountainer = document.querySelector('.hourly')
    hourlyCountainer.innerHTML = ""

    const startIndex = hourlyData.time.findIndex (time => time.slice(0, 13) === currentWeatherTimne.slice(0,13))

    if (startIndex === -1) {
        startIndex = hourlyData.time.findIndex(time => time >= currentWeatherTime)
    }

    if (startIndex === -1) return

    for (let i = startIndex; i < Math.min(startIndex + 5, hourlyData.time.length); i++) {
        
        const timeFull = hourlyData.time[i]
        const hour = timeFull.slice(11, 16)
        const temp = hourlyData.temperature_2m[i]
        const code = hourlyData.weathercode[i]
        const isDay = hourlyData.is_day[i]
        
        const iconClass = getHourlyIcon(code, isDay)

        const displayTime = (i === startIndex) ? "Now" : hour

        const hourlyItem = `<div>
            <p>${displayTime}</p>
            <p><i class="${iconClass}"></i></p>
            <p>${temp}°C </p>
            </div>`

        hourlyCountainer.innerHTML += hourlyItem
    }
}

// hourly weather icons

function getHourlyIcon(code, isDay) {
    switch (code) {
        case 0:
            return (isDay === 1) ? "fa-solid fa-sun" : "fa-solid fa-moon"
            break
        case 1:
        case 2:
            return (isDay === 1) ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon"
            break
        case 3:
            return "fa-solid fa-cloud"
            break
        case 45:
        case 48:
            return "fa-solid fa-smog"
            break
        case 51:
        case 53:
        case 55:
            return "fa-solid fa-cloud-rain"
            break
        case 61:
        case 63:
        case 65:
            return "fa-solid fa-cloud-showers-heavy"
            break
        case 71:
        case 73:
        case 75:
            return "fa-regular fa-snowflake"
            break
        case 95:
        case 96:
        case 99:
            return "fa-regular fa-cloud-bolt"
            break
        default:
            return "fa-soid fa-cloud"
            break
    }
}

// daily weather

function daily(dailyData) {

    const dailyContainer = document.querySelector('.daily')
    dailyContainer.innerHTML = ""

    for (let i = 0; i < dailyData.time.length; i++) {
        const date = dailyData.time[i]
        const maxTemp = Math.round(dailyData.temperature_2m_max[i])
        const minTemp = Math.round(dailyData.temperature_2m_min[i])
        const code = dailyData.weathercode[i]

        let dateObj = new Date(date + "T00:00:00")
        weekday = dateObj.toLocaleDateString(undefined, { weekday : 'short'})

        weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)

        const iconClass = getHourlyIcon(code, 1)

        const dailyItem = `<div class = "daily-item">
            <p>${weekday}</p>
            <p><i class="${iconClass}"></i></p>
            <p>${minTemp} °C / ${maxTemp} °C </p>
            </div>
        `

        dailyContainer.innerHTML += dailyItem
    }
}
