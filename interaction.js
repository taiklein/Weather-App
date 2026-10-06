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

        console.log("Geo Data:", geoData)
// get weather data
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        let data = await response.json()

        const tempElement = document.getElementById('temperature')
        tempElement.innerText = `${data.current_weather.temperature} °C`

        const cityElement = document.getElementById('cityName')
        cityElement.innerText = geoData.city || geoData.locality || "My Location"
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

    let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    let data = await response.json()

    document.getElementById('cityName').innerText = realCityName
    document.getElementById('temperature').innerText = `${data.current_weather.temperature} °C`
}
