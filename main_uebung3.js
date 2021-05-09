//Javascript for Uebung_3
//authors: Thomas Kujava, Katharina Kaufmann

"use strict"

// 1. Functions to find the users location.

//Variables

let positionButton = document.getElementById("positionButton");
let transferCoordinatesButton = document.getElementById("transferCoordinatesButton");
let showLocation = document.getElementById("showLocation");
let showWeather = document.getElementById("showWeather");
let forecast = document.getElementById("forecast");


//Functions

/**
 * Implements the use of the button "Show my location".
 * If the user has allowed the location to be determined, the location is determined, otherwise an error is reported.
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 **/
positionButton.addEventListener('click', function(){
    navigator.geolocation.getCurrentPosition(success, error);
})

/**
 * Implements the use of the button "Transfer manuel coordinates".
 * If coordinates have been entered, they are accepted and the following functions are carried out. Otherwise there is an error message.
 **/
transferCoordinatesButton.addEventListener('click', function(){

    if (document.getElementById("latitude").value == "" || document.getElementById("longitude").value == "" ){
        alert("Please enter coordinates. If you have already given coordinates, please check your entry.")
    }
    else{
    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;

    askWeather(latitude, longitude);
    }
})

/**
 * Separates the coordinates according to longitude and latitude
 * @param position the coordinates to be assigned. 
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */
function success(givenposition){
    const latitude  = givenposition.coords.latitude;
    const longitude = givenposition.coords.longitude;

    showLocation.style.display = "block";
    document.getElementById("position").innerHTML = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

    askWeather(latitude, longitude);
}

/** 
 * Reports an error if the user refuses to determine the location.
 */
function error(){
    alert("Unable to retrieve your location. If you want to continue, change the access rules in your settings.");
}


// 2. Functions to determine the local weather.

/**
 * Requests the weather data via the API address and calls the function "showWeatherData" to display the data on the website.
 * Sources for the openweathermap-data: https://openweathermap.org/api/one-call-api ; https://openweathermap.org/weather-conditions#How-to-get-icon-URL
 * @param {float} latitude of the current position
 * @param {float} longitude of the current position
 */
function askWeather(latitude, longitude){

    var x = new XMLHttpRequest();

    x.onreadystatechange = function statechangecallback(){
        if (x.status == "200" && x.readyState == 4){
            let response = JSON.parse(x.responseText);
    
            showWeatherData(response);
            showWeather.style.display = "block";
        }
    }
    x.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=APIKEY`, true);
    x.send();
}

/**
 * Assigns the weather data to the corresponding paragraphs.
 * Sources for the openweathermap-data: https://openweathermap.org/api/one-call-api ; https://openweathermap.org/weather-conditions#How-to-get-icon-URL
 * @param {object} response 
 * @param {image} icon 
 */
function showWeatherData(response){
 
    document.getElementById("description").innerHTML = response.current.weather[0].description;
    
    document.getElementById("timezone").innerHTML = "Timezone: " + response.timezone;
    document.getElementById("temp").innerHTML = "Temperature (degrees celcius): " + response.current.temp;
    document.getElementById("feelsLike").innerHTML = "Feels like temperature (degrees celcius): " + response.current.feels_like;
    document.getElementById("humidity").innerHTML = "Humidity (%): " + response.current.humidity;
    document.getElementById("clouds").innerHTML = "Cloudiness (%): " + response.current.clouds;
    document.getElementById("windSpeed").innerHTML = "Wind speed (metre/sec): " + response.current.wind_speed;
    document.getElementById("visibility").innerHTML = "Average visibility (metres): " + response.current.visibility;

    document.getElementById("weatherIcon").innerHTML = "weather icon";
    let iconCurrentWeather = new Image();
    iconCurrentWeather.src = `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`;
    document.getElementById("weather").appendChild(iconCurrentWeather);

    forecast.style.display = "block"; // 7 day weather

    let i1 = new Image(); //day 1
    i1.src = `http://openweathermap.org/img/wn/${response.daily[0].weather[0].icon}@2x.png`;
    document.getElementById("day1").appendChild(i1);

    let i2 = new Image(); //day 2
    i2.src = `http://openweathermap.org/img/wn/${response.daily[1].weather[0].icon}@2x.png`;
    document.getElementById("day2").appendChild(i2);

    let i3 = new Image(); //...
    i3.src = `http://openweathermap.org/img/wn/${response.daily[2].weather[0].icon}@2x.png`;
    document.getElementById("day3").appendChild(i3);

    let i4 = new Image();
    i4.src = `http://openweathermap.org/img/wn/${response.daily[3].weather[0].icon}@2x.png`;
    document.getElementById("day4").appendChild(i4);

    let i5 = new Image();
    i5.src = `http://openweathermap.org/img/wn/${response.daily[4].weather[0].icon}@2x.png`;
    document.getElementById("day5").appendChild(i5);

    let i6 = new Image();
    i6.src = `http://openweathermap.org/img/wn/${response.daily[5].weather[0].icon}@2x.png`;
    document.getElementById("day6").appendChild(i6);

    let i7 = new Image();
    i7.src = `http://openweathermap.org/img/wn/${response.daily[6].weather[0].icon}@2x.png`;
    document.getElementById("day7").appendChild(i7);

}


