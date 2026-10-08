let shareLocation = confirm ('Allow this website to have access to your location?')

const search = document.getElementById('search')

if (shareLocation) {
    search.style.display = 'none'

    navigator.geolocation.getCurrentPosition(async (position) => {
        let lat = position.coords.latitude
        let lon = position.coords.longitude

// reverse geocoding

        let geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        let geoData = await geoResponse.json()

// get weather data

        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
        let data = await response.json()

        const tempElement = document.getElementById('temperature')
        tempElement.innerText = `${data.current_weather.temperature} °C`

        const cityElement = document.getElementById('cityName')
        cityElement.innerText = geoData.city || geoData.locality || "My Location"

        const countryElement = document.getElementById('country')
        countryElement.innerText = geoData.countryName

        weatherDisplay(data.current_weather.weathercode, data.current_weather.is_day)
    })

} else {
    search.style.display = 'block'
}

//Searching Manually

async function searchWeather() {
    let inputElement = document.getElementById('city')
    let cityName = inputElement.value

    if (!cityName) return

    let geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`)
    let geoData = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
        alert("City not found!")
        return
    }


    let lat = geoData.results[0].latitude
    let lon = geoData.results[0].longitude
    let realCityName = geoData.results[0].name
    let realCountryName = geoData.results[0].country

    let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
    let data = await response.json()

    document.getElementById('temperature').innerText = `${data.current_weather.temperature} °C`
    document.getElementById('cityName').innerText = realCityName
    document.getElementById('country').innerText = realCountryName

    weatherDisplay(data.current_weather.weathercode, data.current_weather.is_day)
}

// weather description and icons

function weatherDisplay(code, isDay){

    let weatherDescription = ""
    let iconClass = ""

    switch (code) {
        case 0:
            weatherDescription = "Clear Sky"
            iconClass = (isDay === 1) ? "fa-solid fa-sun" : "fa-solid fa-moon"
            break

        case 1:
            weatherDescription = "Mostly Clear"
            iconClass = (isDay === 1) ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon"
            break

        case 2:
            weatherDescription = "Partly Cloudy"
            iconClass = (isDay === 1) ? "fa-solid fa-cloud-sun" : "fa-solid fa-cloud-moon"
            break

        case 3:
            weatherDescription = "Cloudy"
            iconClass = "fa-solid fa-cloud"
            break 

        case 45:
            weatherDescription = "Foggy"
            iconClass = "fa-solid fa-smog"
            break

        case 48:
            weatherDescription = "Freezing Fog"
            iconClass = "fa-solid fa-smog"
            break

        case 51:
            weatherDescription = "Light Drizzle"
            iconClass = "fa-solid fa-cloud-rain"
            break
    
        case 53:
            weatherDescription = "Drizzle"
            iconClass = "fa-solid fa-cloud-rain"
            break

        case 55:
            weatherDescription = "Heavy Drizzle"
            iconClass = "fa-solid fa-cloud-rain"
            break
        
        case 61:
            weatherDescription = "Light Rain"
            iconClass = "fa-solid fa-cloud-showers-heavy"
            break
        
        case 63:
            weatherDescription = "Rain"
            iconClass = "fa-solid fa-cloud-showers-heavy"
            break

        case 65:
            weatherDescription = "Heavy Rain"
            iconClass = "fa-solid fa-cloud-showers-heavy"
            break

        case 71:
            weatherDescription = "Light Snow"
            iconClass = "fa-regular fa-snowflake"
            break

        case 73:
            weatherDescription = "Snow"
            iconClass = "fa-regular fa-snowflake"
            break

        case 75:
            weatherDescription = "Heavy Snow"
            iconClass = "fa-regular fa-snowflake"
            break

        case 95:
            weatherDescription = "Thunderstorm"
            iconClass = "fa-regular fa-cloud-bolt"
            break

        case 96:
            weatherDescription = "Thunderstorm with Light Hail"
            iconClass = "fa-regular fa-cloud-bolt"
            break

        case 99:
            weatherDescription = "Thunderstorm with Heavy Hail"
            iconClass = "fa-regular fa-cloud-bolt"
            break
    }

    document.getElementById('weatherText').innerText = weatherDescription
    document.getElementById('weatherIcon').className = iconClass
}