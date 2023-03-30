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

function getWeatherIcons(icon, iconSize) {
    let iconMap = {
        "01d":`<i class="${iconSize} fa-solid fa-sun"></i>`,
        "01n":`<i class="${iconSize} fa-solid fa-moon"></i>`,
        "02d":`<i class="${iconSize} fa-solid fa-cloud-sun"></i>`,
        "02n":`<i class="${iconSize} fa-solid fa-cloud-moon"></i>`,
        "03d":`<i class="${iconSize} fa-solid fa-cloud"></i>`,
        "03n":`<i class="${iconSize} fa-solid fa-cloud"></i>`,
        "04d":`<i class="${iconSize} fa-solid fa-cloud"></i>`,
        "04n":`<i class="${iconSize} fa-solid fa-cloud"></i>`,
        "09d":`<i class="${iconSize} fa-solid fa-cloud-showers-heavy"></i>`,
        "09n":`<i class="${iconSize} fa-solid fa-cloud-showers-heavy"></i>`,
        "10d":`<i class="${iconSize} fa-solid fa-cloud-sun-rain"></i>`,
        "10n":`<i class="${iconSize} fa-solid fa-cloud-moon-rain"></i>`,
        "11d":`<i class="${iconSize} fa-solid fa-cloud-bolt"></i>`,
        "11n":`<i class="${iconSize} fa-solid fa-cloud-bolt"></i>`,
        "13d":`<i class="${iconSize} fa-solid fa-snowflake"></i>`,
        "13n":`<i class="${iconSize} fa-solid fa-snowflake"></i>`,
        "50d":`<i class="${iconSize} fa-solid fa-smog"></i>`,
        "50n":`<i class="${iconSize} fa-solid fa-smog"></i>`,
    };

    if (iconMap[icon] === undefined) {
        return `<i class="fa-solid fa-sun"></i>`;
    } else { 
        return iconMap[icon];
    }
}

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

    let mainIcon = document.querySelector(".weather-icon-big");
    mainIcon.innerHTML = getWeatherIcons(response.data.weather[0].icon,"weather-icon-big");

}

function showCityName(event) {
    event.preventDefault();
    let citySearch = document.querySelector(".search-bar");
    let city = citySearch.value;

    let apiUrlCity = `${APIURL}weather?q=${city}&units=${getTemperatureUnit()}&appid=${APIKEY}`;
    
    axios.get(apiUrlCity).then(setWeather);
}


// Geolocation //

function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    
    let apiUrlGeo = `${APIURL}weather?lat=${lat}&lon=${lon}&units=${getTemperatureUnit()}&appid=${APIKEY}`;
    
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
    let unitComplement = "";

    if (getTemperatureUnit() === "imperial")
        unitComplement = "fahrenheit";

    forecast.forEach(function(forecastDay, index) {
        if (index < 6) {
            forecastHTML = forecastHTML +
                `<div class="col-2">
                    <div class="week-forecast-day">${formatWeekDays(forecastDay.dt)}</div>
                    <div class="week-forecast-icon">${getWeatherIcons(forecastDay.weather[0].icon, "weather-icon-small")}</div>
                    <div class="week-forecast-temp">
                        <span class="temperature-cf-week max-temperature ${unitComplement}">
                            <span class="value">${Math.round(forecastDay.temp.max)}</span><sup class="unit">°</sup>
                        </span>
                        <span class="temperature-cf-week min-temperature ${unitComplement}">
                            <span class="value">${Math.round(forecastDay.temp.min)}</span><sup class="unit">°</sup>
                        </span>
                    </div>
                </div>`;
        };
    });
    
    forecastHTML = forecastHTML + `</div>`;
    weatherElement.innerHTML = forecastHTML;
}

function getWeekForecast(coordinates) {
    let apiUrlWeekForecast = `${APIURL}onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${getTemperatureUnit()}&appid=${APIKEY}`;
    
    axios.get(apiUrlWeekForecast).then(setSixDayWeatherDisplay);
}

// Celsius to Fahrenheit Convertion //

function getTemperatureUnit() {
    let isFahrenheit = document.querySelector(".temperature-unit-icon").classList.contains("fahrenheit");

    return isFahrenheit ? "imperial" : "metric";
}

function replaceTemperatureUnit(elementList, displayUnit) {
    for (let i = 0; i < elementList.length; i++) {
        let temperature = Number(elementList[i].querySelector(".value").innerHTML);
        let unit = "°";
        if (!elementList[i].classList.contains("fahrenheit")) {
            if (displayUnit === true) {
                unit = "°F";
            }
            elementList[i].classList.add("fahrenheit");
            elementList[i].innerHTML = 
            `<span class="value">${Math.round((temperature * 1.8) + 32)}</span>
            <sup class="unit">${unit}</sup>`;
        } else {
            if (displayUnit === true) {
                unit = "°C";
            }
            elementList[i].classList.remove("fahrenheit");
            elementList[i].innerHTML = 
            `<span class="value">${Math.round((temperature - 32) / 1.8)}</span>
            <sup class="unit">${unit}</sup>`;
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