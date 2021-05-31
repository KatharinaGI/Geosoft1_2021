//Javascript for Uebung_4
//author: Katharina Kaufmann

"use strict"

//Variables

var markerArray = new Array(); //Array that contains the markers.
let positionButton = document.getElementById("positionButton");
let transferCoordinatesButton = document.getElementById("transferCoordinatesButton");

//Functions for creating the map

var map = L.map('map').setView([51.339339, 10.385300], 6);

//Add an OpenStreetMap tile layer and keep reference in variable.
var osmLayer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    {attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

    osmLayer.addTo(map);

//Add an geojson-FeatureCollection with the given route to the map.
L.geoJSON(route.features[0].geometry).addTo(map);

//Add leaflet-draw
//Source: https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-edit-marker-removehooks
var drawnItems = new L.FeatureGroup();

map.addControl(new L.Control.Draw({
    draw: {
        circle: false, //Make sure that only rectangles (polygons) can be drawn
        circlemarker: false,
        marker: false,
        path: false,
        polygon: false,
        polyline: false,
    },
    edit: {
        featureGroup: drawnItems
    }
}));

//Waits for a rectangle to be drawn
map.on(L.Draw.Event.CREATED, function (event) {
   addMarkersToIntersections(event); //Calls the intersection function when a rectangle has been drawn
   map.addLayer(drawnItems);
});

/**
 * When a new rectangle has been drawn, the old values ​​are deleted. 
 * Then further functions are called to determine the intersection points of the rectangle with the route and to add markers with the weather data there.
 * @param {*} event (draw event)
 */
function addMarkersToIntersections(event) {
    drawnItems.clearLayers();
    clearMarkers();
    var intersections = determineIntersections(event);
    for (let i = 0; i < intersections.features.length; i++) {
        addMarker(intersections, i);
    }
}

/**
 * Removes the markers on the map.
 * Source: https://stackoverflow.com/questions/9912145/leaflet-how-to-find-existing-markers-and-delete-markers
 */
function clearMarkers(){
    for(let i=0; i< markerArray.length; i++) {
        map.removeLayer(markerArray[i]);
    }}

/**
 * Determines the intersections of the rectangle with the route with the help of turf.js.
 * Source: https://turfjs.org/docs/#lineIntersect
 * @param {*} event 
 * @returns {FeatureCollection} GeoJSON Object with the intersections.
 */
function determineIntersections(event) {
    drawnItems.addLayer(event.layer);
    var items = drawnItems.toGeoJSON();
    return turf.lineIntersect(route.features[0].geometry, items);
};

/**
 * Calls a function for each intersection to add markers.
 * @param {FeatureCollection} intersections 
 * @param {index} i 
 */
function addMarker(intersections, i) {
    var coordinates = intersections.features[i].geometry.coordinates;
    addMarkerToPosition(coordinates);
}

/**
 * Adds a marker with a popup to the given point and then calls other functions to add weather data.
 * @param {Array} coordinates 
 */
function addMarkerToPosition(coordinates) {
    var marker = new L.marker([coordinates[1], coordinates[0]]);
    markerArray.push(marker);
    var lat = coordinates[1];
    var lng = coordinates[0];
    var popup = L.popup();
    weatherRequest(lat, lng, popup);
    marker.bindPopup(popup);
    map.addLayer(markerArray[markerArray.length-1]);
 };

 /**
  * Calls up the weather data for the given location and, if successful, adds it to the popup marker.
  * @param {float} lat 
  * @param {float} lng 
  * @param {L.popup} popup 
  */
function weatherRequest(lat, lng, popup){

    var apiUrl ='https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=APIKEY';

	jQuery.ajax ({ 
        url: apiUrl, 
        method: 'GET',
        dataType: 'jsonp'})

    .done(function(response){

        console.log(response)
        var name = response.name; //Assign result values ​​to the variables.
        var country = response.sys.country;
        var date = (new Date()).toISOString().split('T')[0]; //Current date. (Source: https://qastack.com.de/programming/8398897/how-to-get-current-date-in-jquery)
        var coordlat = response.coord.lat;
        var coordlng = response.coord.lon;
        var description = response.weather[0].description;
        var temp = response.main.temp;
        var feels_like = response.main.feels_like;
        var clouds = response.clouds.all;
        var visibility = response.visibility;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;
        var icon = `<a href="${description}"><img src="${`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`}"></a>`

        popup.setContent("" + "<b>" + name + "</b>" + " (" + country + ")" + " [" + coordlat + ", " + coordlng + "]" + "<br>" + //Add and format data to the popup.
                        "Date: " + date + "</br>" + "<br>" +
                        "The current weather: " + "<b>" + description + "</b>" + "<br>" + 
                        icon + "<br>" +
                        "Temperature: " + temp + " °C" + "<br>" + 
                        "Feels like: " + feels_like + " °C" + "<br>" + 
                        "Clouds: " + clouds + " % " + "<br>" + 
                        "Visibility: " + visibility + " m" + "<br>" + 
                        "Humidity: " + humidity + " %" + "<br>" + 
                        "Wind speed: "  + wind + " m/s" + "<br>")
    })

    .fail(function(xhr, status, errorThrown){
        alert ("error");
        console.dir(xhr);
        console.log(status)
        consolge.log(errorThrown);
    })
    .always(function(xhr, status){
        console.log(xhr, status)
})};

//Allows data to be displayed without drawing a rectangle.
map.on('click', function(event){
    drawnItems.clearLayers(); //Removes all markers and layers when the map is clicked.
    clearMarkers();
    var coordinates = [event.latlng.lng, event.latlng.lat];
    addMarkerToPosition(coordinates); //Then calls other functions to add new markers and load weather data
});     

/**
 * Implements the use of the button "Show my location".
 * If the user has allowed the location to be determined, the location is determined, otherwise an error is reported.
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 **/
positionButton.addEventListener('click', function(){
    navigator.geolocation.getCurrentPosition(success, error);
})

/**
Calls the marker function when the location determination was successful
*/
function success(position) {
	
    drawnItems.clearLayers(); //Removes all markers and layers when the map is clicked.
    clearMarkers();
    var coordinates = [position.coords.longitude, position.coords.latitude];
    addMarkerToPosition(coordinates);
}

/** 
 * Reports an error if the user refuses to determine the location.
 */
function error() {
	alert("Unable to retrieve your location. If you want to continue, change the access rules in your settings.");
}
 
/**
 * Implements the use of the button "Transfer manuel coordinates".
 * If coordinates have been entered, they are accepted and the following functions are carried out. Otherwise there is an error message.
 **/
 transferCoordinatesButton.addEventListener('click', function(){

    if (document.getElementById("latitude").value == "" || document.getElementById("longitude").value == "" ){
        alert("Please enter coordinates. If you have already given coordinates, please check your entry.")
    }
    else{
    drawnItems.clearLayers(); //Removes all markers and layers when the map is clicked.
    clearMarkers();
    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;
    let coordinates = [longitude, latitude];
    addMarkerToPosition(coordinates);
    }
})

//Functions to control the menu bar

 /**
  * Function for showing and hiding the Hamburger Menu
  */
 function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
    x.style.display = "none";
    } else {
    x.style.display = "block";
    }
} 