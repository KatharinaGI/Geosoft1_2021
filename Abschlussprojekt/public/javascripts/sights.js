"use strict" 

var deleteSightButton = document.getElementById('deleteSightButton');

//Add click event listener to deleteSightButton. When clicked, find out which sights should be deleted. 
//Then check whether the selection is correct before sending the data to the server.
deleteSightButton.addEventListener('click', function(){
    var listToDelete = {};
    listToDelete.sights=[];
    
    $("input:checkbox").each(function(){
        var $this = $(this);

        if($this.is(":checked")){
            listToDelete.sights.push($this.attr("id"));
        }
    });
    if (listToDelete.sights.length < 1){
        alert("No sights were selected to be deleted. If there are no sights, add some. ;)")
    }
    else {
        if (listToDelete.sights.length != 0){

            var confirmation = confirm('Are you sure you want to delete the selected sights?');

            //Make sure you want to delete the sights
            if (confirmation === true) {

            var sightsToDelete = JSON.stringify(listToDelete);
            // Ajax request that sends information about the sights that should be deleted from the database to the server.
            $.ajax({
                async: false,
                type: "post",
                url: "/edit/deleteSight",
                data: {
                    sightstodelete: sightsToDelete
                },
                success: function(){
                    window.location.href = '/edit'
                },
                error: function(){
                    alert('An error has occurred');
                }
            })
            .done()
            }}
        else {
        // If they said no to the confirm, do nothing
        return false;
        }
}})

//Functions for creating the editing map

var map = L.map('map').setView([51.959010, 7.627881], 12);

//Add an OpenStreetMap tile layer and keep reference in variable.
var osmLayer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    {attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

    osmLayer.addTo(map);

//Add leaflet-draw
//Source: https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-edit-marker-removehooks
var drawnItems = new L.FeatureGroup();

map.addControl(new L.Control.Draw({
    draw: {
        circle: false, 
        circlemarker: false,
        path: false,
        polyline: false,
        rectangle: false,
    },
}));

map.addLayer(drawnItems);

//Implement what happens when a marker or polygon has been drawn
map.on('draw:created', function(event) {

    //if drawn: add a marker/polygon to the map
    var drawnMarker = event.layer.addTo(map);
    
    //Generate a popup for entering the point of interest data (Name, URL, Beschreibung)
    //Source: https://www.w3schools.com/howto/howto_js_popup_form.asp
    var popupContent =  '<form>\
                            <p class = "popup-headline"> Please complete information! </p>\
                            <p>\
                                <div>\
                                    <label for="name"> Name: </label>\
                                    <input id="name" class="popup-input" type="text" name="name"\
                                </div>\
                            </p>\
                            <p>\
                                <div>\
                                    <label for="url"> URL: </label>\
                                    <input id="url" class="popup-input" type="text" name="url"\
                                </div>\
                            </p>\
                            <p>\
                                <div>\
                                    <label for="description"> Beschreibung: </label>\
                                    <input id="description" class="popup-input" type="text" name="description"\
                                </div>\
                            </p>\
                            <p>\
                                <div>\
                                    <button id="btnConfirmD" type="button"> Confirm </button>\
                                </div>\
                            </p>\
                        </form>';
 
    // binds a popup to every drawn marker or polygon         
   drawnMarker.bindPopup(popupContent, {}).openPopup();

   //declare confirm button
   var confirmbutton = document.getElementById("btnConfirmD");

   //Add click event listener to confirmbutton. When clicked, the entered data is read out and checked for completeness.
   //Then the information for the sight is completed, converted into geoJSON format and forwarded via Ajax to be saved in the database.
   confirmbutton.addEventListener('click', function(){
        var name = document.getElementById("name").value;
        var url = document.getElementById("url").value;
        let description = document.getElementById("description").value;
        var layertype = event.layerType;
        
       if (name == ""){
           alert ("Please give your attraction a name!")}
           else{
            if (url == ""){
                alert("Please enter a URL. If you don't want to add a URL, please write - None - or something similar in the field.")}
            else{
            //If the URL contains "wikipedia.org", the description will be filled with a requested Wikipedia description.
            if(url.includes("wikipedia.org")){
                var sightsName = getTitle(url);
                $.ajax({
                    async: false,
                    type: "GET", 
                    url: 'http://de.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=true&exsentences=3&explaintext=true&titles=' + sightsName + '&origin=*',
                   
                    success: function(data){
                        console.log(data);
                        var key = Object.keys(data.query.pages)[0];
                        var article = data.query.pages[key].extract;
                        console.log(article);
                        description = article;
                    },
                    error: function () {
                        alert('An error occurred when querying Wikipedia.')
                    }
                })
                .done()}
                //If the URL does not include "wikipedia.org", the description will be set to "Keine Informationen vorhanden."
                else{
                    if(description == ""){
                        description = "Keine Informationen vorhanden."
                     }}
        //Declare coordinates           
        if(event.layerType == "marker"){
                    var coordinates = event.layer._latlng;}
                    else{
                        var coordinates = event.layer._latlngs[0];
                        console.log(coordinates);
                        }

        //Call function to transfer entered data in JSON format
        var sightsdataToJSON = generateJSONString(name, url, description, layertype, coordinates);
        console.log(sightsdataToJSON);
        
        // Ajax request that sends information about the sight that should be added to the database to the server.
        $.ajax({
            type: 'POST',
            url: '/edit/addsight/',
            data: {
             sight: sightsdataToJSON
            },
            success: function(){
                window.location.href = '/edit'
            },
            error: function(){
                alert('error')
            }
          }).done()

   }
//Remove generated marker from the map
drawnMarker.remove();

//Auxiliary functions

/**
 * Separates the passed Url after the 4th "/" and returns the separated end as the title
 * Source: https://www.w3schools.com/jsref/jsref_split.asp
 * @param {string} url 
 * @returns title
 */
function getTitle(url){
    var split = url.split('/');
    var title = split[4];
    return title;
}

/**
 * Receives the property values, checks which layer type it is and then inserts the data in the intended places in the template.
 * @param {string} name 
 * @param {string} url 
 * @param {string} description 
 * @param {string} layertype 
 * @param {Object} coordinates 
 * @returns 
 */
function generateJSONString(name, url, description, layertype, coordinates){
    if (layertype == "marker") {
        var newGeoJSON =`{
            "type": "FeatureCollection",
            "features": [
            {
                "type": "Feature", 
                "properties": {
                    "Name": "${name}",
                    "URL": "${url}",
                    "Beschreibung": "${description}"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [${coordinates.lng}, ${coordinates.lat}]
                }
            }]
        }`
        return newGeoJSON;
    }
    else{
        //Reverses the transferred coordinates
        var switchedcoordinates = `[[`;
        for (let i = 0; i < coordinates.length; i++) {
            switchedcoordinates += `[${coordinates[i].lng}, ${coordinates[i].lat}],`;}
        switchedcoordinates +=  `[${coordinates[0].lng}, ${coordinates[0].lat}]]]`;

        var newGeoJSON = `{
            "type": "FeatureCollection",
            "features": [
            {
                "type": "Feature", 
                "properties": {
                    "Name": "${name}",
                    "URL": "${url}",
                    "Beschreibung": "${description}"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": ${switchedcoordinates}
                }
            }]
        }`
        return newGeoJSON;
    }}
}})})

