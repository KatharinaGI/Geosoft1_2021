"use strict" 

//Icon-source: Icons erstellt von "https://www.freepik.com" Freepik from Flaticon www.flaticon.com
//code source:https://leafletjs.com/examples/custom-icons/
var icon = L.icon({
    iconSize: [25, 25],
    iconUrl: '/stylesheets/bushalte.png'
});

//Functions 

var busbutton = document.getElementById("busses");

//Add click event listener to busbutton. When clicked, function "busStops()" is called.
busbutton.addEventListener('click', function(){
    busStops();
})

/** 
 * Sends API request to Busradar and calls the "displayBusStops(givenstops)" function to display all the given bus stops on the map.
 */
function busStops() {
  jQuery.ajax({
      url: "https://rest.busradar.conterra.de/prod/haltestellen",
      method: "GET",
  })
  .done(function (response) {
      console.dir(response)
      displayBusStops(response) 
  })
  .fail(function (xhr, status, errorThrown) {
      alert( "error" )
      console.dir(xhr)
      console.log(status)
      console.log(errorThrown)        
  })
  .always(function(xhr, status){
    console.log(xhr, status);
})}

/** 
 * Adds an icon marker to the bus stops using the given coordinates and the leaflet function "pointToLayer" and adds them to the map.
 * Source: https://leafletjs.com/examples/geojson/
 * @param givenstops The returned bus stops of the API query
 * @return markers at the locations of the bus stops
 */
function displayBusStops(givenstops){    
    var busstops = L.geoJson(givenstops, {
        pointToLayer: function(feature, latlng) {            
            return L.marker(latlng, {icon: icon})}})
        busstops.addTo(homemap)
        markers = busstops;
        console.log(busstops)
}

var busmarker;
var nearestBus = document.getElementById("showNearestBus");

//Add click event listener to busbutton. When clicked, other bus markers may be removed and a check is made as to which sight the next 
//stop should be displayed for. Then, if it is of the polygon type, the coordinates of the polygon-center are calculated and transferred 
//to nearestBusStop(coordinates). If point coordinates were already available, these are transmitted directly to nearestBusStop(coordinates).
nearestBus.addEventListener('click', function(){
    if (busmarker != undefined) {
        homemap.removeLayer(busmarker);}
        var checkedSights = {};
        checkedSights.sights = [];
        var coordinates;
        var polygon;
        var middle;
        
        $("input:checkbox").each(function(){
            var $this = $(this);
    
            if($this.is(":checked")){
                checkedSights.sights.push($this.attr("id"));
            }
        })
        console.dir(checkedSights);
    
        if (checkedSights.sights.length > 1 || checkedSights.sights.length < 1){
            alert("Either no sight or several places of interest were selected. Please choose a single one.")}
    
        else{
            for (let i = 0; i < sights.length; i++) {
                if (sights[i]._id == checkedSights.sights[0]){
                    if (sights[i].features[0].geometry.type == "Point"){
                        console.log(sights[i].features[0].geometry.type);
                        coordinates = sights[i].features[0].geometry.coordinates;
                        console.log(coordinates)
                        nearestBusStop(coordinates);
                    }
                    else{
                        if(sights[i].features[0].geometry.type == "Polygon"){
                            console.log(sights[i].features[0].geometry.type);
                            polygon = turf.polygon(sights[i].features[0].geometry.coordinates);
                            middle = turf.centroid(polygon)
                            console.log(middle.geometry.coordinates);
                            console.log("Stop");
                            nearestBusStop(middle.geometry.coordinates)
                            }
                        }}}
}});       

/** 
 * Sends API request to Busradar and calls the "displayNearestBusStop(coordinates, givenstops)" function 
 * to display the nearest bus stop on the map.
 */
function nearestBusStop(coordinates){
    var coordinates = coordinates;
    console.log(coordinates)
        jQuery.ajax({
            url: "https://rest.busradar.conterra.de/prod/haltestellen",
            method: "GET",
        })
        .done(function (response) {
            console.dir(response)
            displayNearestBusStop(coordinates, response) 
        })
        .fail(function (xhr, status, errorThrown) {
            alert( "error" )
            console.dir(xhr)
            console.log(status)
            console.log(errorThrown)        
        })
        .always(function(xhr, status){
          console.log(xhr, status);
      })};

/**
 * Checks whether the starting coordinates are valid. 
 * Using turf, calculates the distances between the starting point and the stops and finds the stop with the shortest distance. 
 * There a marker is linked to the stop and a weather query is sent via "weatherRequest (...)"
 * @param {*} coordinates
 * @param {*} givenstops 
 */      
function displayNearestBusStop(coordinates, givenstops){
    var coordinates = coordinates;
    var stopdistances = [];
    console.log(coordinates);
    
    if (coordinates.length = 2){
        for(var i=0; i< givenstops.features.length; i++){
            var coords = [coordinates[1], coordinates[0]];
            var buscoords = [givenstops.features[i].geometry.coordinates[1], givenstops.features[i].geometry.coordinates[0]]
            var distance = turf.distance(coords, buscoords);
            stopdistances[i] = [distance, buscoords[0], buscoords[1]];
            var sorteddistances = stopdistances.sort(function([a,b,c],[d,e,f]){ return a-d });
            var shortestdistance = [sorteddistances [0][1], sorteddistances[0][2]];
    }       busmarker = L.marker([shortestdistance[0], shortestdistance[1]], {icon: icon}).addTo(homemap)
            var popup = L.popup()
            weatherRequest(shortestdistance[0], shortestdistance[1], popup)
            busmarker.bindPopup(popup)}
    else {
        alert("Invalid coordinates were passed");
    }
}

/**
  * Calls up the weather data for the given location and, if successful, adds it to the popup marker.
  * @param {float} lat 
  * @param {float} lng 
  * @param {L.popup} popup 
  */
function weatherRequest(lat, lng, popup){

    var APIKEY = '';
    var apiUrl ='https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=' + APIKEY + '';

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
        console.log(errorThrown);
    })
    .always(function(xhr, status){
        console.log(xhr, status);
})};


    