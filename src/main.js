// Weather API Global //

const APIKEY = "9e0fb79c2f66d0cd0dcf06710976a873";
const APIURL = "https://api.openweathermap.org/data/2.5/"

// Display Current Day & Time //

function displayDate(){
    let date = new Date();
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
    
    let dateLine = document.querySelector("h1");
    dateLine.innerHTML = `Today is ${weekName}, ${monthName} ${dayNumber} ${year} - ${militaryTo12HClock(timeHour, timeMinutes)}`;
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
    let weatherDescription = (response.data.weather[0].description);
    cityName.innerHTML = `${searchedCityName}`;

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

    getWeekForecast(response.data.coord);
}

function showCityName(event) {
    event.preventDefault();
    let citySearch = document.querySelector(".search-bar");
    let city = citySearch.value;
    let apiUrlCity = `${APIURL}weather?q=${city}&units=metric&appid=${APIKEY}`;
    
    axios.get(apiUrlCity).then(setWeather);
}


// Geolocation //

function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    
    let apiUrlGeo = `${APIURL}weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKEY}`;
    
    axios.get(apiUrlGeo).then(setWeather);
}

function setGeoLocation() {
    navigator.geolocation.getCurrentPosition(getPosition);
}

// 6-day Weather Forecast //

function formatWeekDays(timeStamp) {
    let date = new Date(timeStamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
}

function setSixDayWeatherDisplay(response) {
    let forecast = response.data.daily;
    let weatherElement = document.querySelector(".six-day-forecast");
    let forecastHTML = `<div class="row week-forecast">`;
    forecast.forEach(function(forecastDay, index) {
        if (index < 6) {
        forecastHTML = forecastHTML +
        `<div class="col-2">
        <div class="week-forecast-day">${formatWeekDays(forecastDay.dt)}</div>
        <div> 
        <i class="fa-solid fa-snowflake weather-icon-small"></i>
        </div>
        <div class="week-forecast-temp">
        <span class="temperature-cf-week max-temperature">
        <span class="value">${Math.round(forecastDay.temp.max)}</span><span class="unit">°</span>
        </span>
        <span class="temperature-cf-week min-temperature">
        <span class="value">${Math.round(forecastDay.temp.min)}</span><span class="unit">°</span>
        </span>
        </div>
        </div>`;
        }
    });
    
    forecastHTML = forecastHTML + `</div>`;
    weatherElement.innerHTML = forecastHTML;
}

function getWeekForecast(coordinates) {
    let apiUrlWeekForecast = `${APIURL}onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${APIKEY}`;
    
    axios.get(apiUrlWeekForecast).then(setSixDayWeatherDisplay);
}

// Celsius to Fahrenheit Convertion //

function replaceTemperatureUnit(elementList, displayUnit) {
    for (let i = 0; i < elementList.length; i++) {
        let temperature = Number(elementList[i].querySelector(".value").innerHTML);
        let unit = "°";
        if (!elementList[i].classList.contains("fahrenheit")) {
            if (displayUnit === true) {
                unit = "°F";
            }
            elementList[i].classList.add("fahrenheit");
            elementList[i].innerHTML = `<span class="value">${Math.round((temperature * 1.8) + 32)}</span><span class="unit">${unit}</span>`;
        } else {
            if (displayUnit === true) {
                unit = "°C";
            }
            elementList[i].classList.remove("fahrenheit");
            elementList[i].innerHTML = `<span class="value">${Math.round((temperature - 32) / 1.8)}</span><span class="unit">${unit}</span>`;
        }
    }
}

function convertTemperature() {
    let temperatureList = document.querySelectorAll(".temperature-cf");
    let temperatureListWeek = document.querySelectorAll(".temperature-cf-week");

    replaceTemperatureUnit(temperatureList, true);
    replaceTemperatureUnit(temperatureListWeek, false);


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

    setInterval(displayDate, 1000);

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