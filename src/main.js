// Weather API Global //

const APIKEY = "6d399f2ce89230f16b8c841e6b0a89f7";
const APIURL = "https://api.openweathermap.org/data/2.5/weather?"

// Display Current Day & Time //

function displayDate (date){
    let dayNumber = date.getDate();
    let year = date.getFullYear();
    
    let months = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    let monthName = months[date.getMonth()];
    
    let weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let weekName = weekDays[date.getDay()];

    let timeHour = date.getHours(); 
    let timeMinutes = date.getMinutes();
    
    return (`Today is ${weekName}, ${monthName} ${dayNumber} ${year} - ${militaryTo12HClock(timeHour, timeMinutes)}`);
}

function militaryTo12HClock(hour, minute) {
    if (hour >= 0 && hour <= 11) {
        return `${hour}:${minutesAdjust(minute)} am`;
    } else if (hour === 12) {
        return `${hour}:${minutesAdjust(minute)} pm`; 
    } else {
        return `${hour - 12}:${minutesAdjust(minute)} pm`;
    }
}

function minutesAdjust(minute) {
    if (minute < 10) {
        return "0" + minute;
    } else {
        return minute;
    }
}

// Search Engine + Weather API//

function setWeather(response) {
    let cityName = document.querySelector(".city-name");
    let searchedCityName = (response.data.name);
    let cityCountry = (response.data.sys.country);
    let weatherDescription = (response.data.weather[0].description);
    cityName.innerHTML = `${searchedCityName} - ${cityCountry}`;

    let temperature = document.querySelector(".main-temperature .value");
    temperature.innerHTML = Math.round(response.data.main.temp);
    
    let setDescription = document.querySelector(".weather-description");
    setDescription.innerHTML = weatherDescription;
    
    let mainMaxTemperature = document.querySelector(".main-max-temperature .value");
    mainMaxTemperature.innerHTML = Math.round(response.data.main.temp_max);
    
    let mainMinTemperature = document.querySelector(".main-min-temperature .value");
    mainMinTemperature.innerHTML = Math.round(response.data.main.temp_min);
    
    let feelsLikeTemperature = document.querySelector(".feels-like .value");
    feelsLikeTemperature.innerHTML = Math.round(response.data.main.feels_like);
    
    let wind = document.querySelector(".wind .value");
    wind.innerHTML = Math.round(response.data.wind.speed);
    
    let humidity = document.querySelector(".humidity .value");
    humidity.innerHTML = Math.round(response.data.main.humidity);
}

function showCityName(event) {
    event.preventDefault();
    let citySearch = document.querySelector(".search-bar");
    let city = citySearch.value;
    let apiUrlCity = `${APIURL}q=${city}&units=metric&appid=${APIKEY}`;
    
    axios.get(apiUrlCity).then(setWeather);
}

// Geolocation //

function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    
    let apiUrlGeo = `${APIURL}lat=${lat}&lon=${lon}&units=metric&appid=${APIKEY}`;
    
    axios.get(apiUrlGeo).then(setWeather);
}

function setGeoLocation() {
    navigator.geolocation.getCurrentPosition(getPosition);
}

// Celsius to Fahrenheit Convertion //

function convertTemperature() {
    let temperatureList = document.querySelectorAll(".temperature-cf");
    for (let i = 0; i < temperatureList.length; i++) {
        let temperature = Number(temperatureList[i].querySelector(".value").innerHTML);
        
        console.log(temperatureList[i]);

        if (!temperatureList[i].classList.contains("fahrenheit")) {
            temperatureList[i].classList.add("fahrenheit");
            temperatureList[i].innerHTML = `<span class="value">${Math.round((temperature * 1.8) + 32)}</span><span class="unit">°F</span>`;
        } else {
            temperatureList[i].classList.remove("fahrenheit");
            temperatureList[i].innerHTML = `<span class="value">${Math.round((temperature - 32) / 1.8)}</span><span class="unit">°C</span>`;
        }
    }

    let convertButton = document.querySelector(".temperature-unit-icon");
    if (!convertButton.classList.contains("fahrenheit")) {
        convertButton.classList.add("fahrenheit");
        convertButton.innerHTML = "°C";
    } else {
        convertButton.classList.remove("fahrenheit");
        convertButton.innerHTML = "°F";
    }
}

// Dark Mode & Background Function //

function darkMode() {
    let body = document.querySelector("body");
    body.classList.toggle("dark");
}

// Main Function //

function main() {
    let swapTheme = document.querySelector(".swap");
    swapTheme.addEventListener("click", darkMode);

    let lightVideo = document.querySelector(".light-video");
    lightVideo.playbackRate = 0.8;

    let darkVideo = document.querySelector(".dark-video");
    darkVideo.playbackRate = 0.7;

    let dateLine = document.querySelector("h1");
    dateLine.innerHTML = displayDate(new Date());

    let searchCity = document.querySelector(".search-icon");
    searchCity.addEventListener("click", showCityName);

    let searchCityEnter = document.querySelector(".search-icon");
    searchCityEnter.addEventListener("submit", showCityName);

    let convertion = document.querySelector(".temperature-unit-icon");
    convertion.addEventListener("click", convertTemperature);

    let geoLocation = document.querySelector(".location-icon");
    geoLocation.addEventListener("click", setGeoLocation);

    setGeoLocation();
}

main();