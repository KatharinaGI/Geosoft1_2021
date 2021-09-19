"use strict" 

//Functions for creating the homemap on the start page

var homemap = L.map('homemap').setView([51.959010, 7.627881], 12);

//Add an OpenStreetMap tile layer and keep reference in variable.
var osmLayer = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    {attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

    osmLayer.addTo(homemap);

//Marker feature group to control the display of markers on the map
var markers = new L.FeatureGroup();


//Functions to manage Popups

//When the start page is called up: Call up the function to assign a marker to all sights
if (window.location.pathname == '/') {
    addPopups(sights);}

var showOnMapButton = document.getElementById('showOnMap');

//Give the showOnMap button a function: Find out which sight has been selected and call the function to open its popup on the map
showOnMapButton.addEventListener('click', function(){
    var listToShow = [];
    $("input:checkbox").each(function(){
        var $this = $(this);

        if($this.is(":checked")){
            listToShow.push($this.attr("id"));
        }
    })
    //If none or more than one element have been selected: Send message
    if (listToShow.length < 1 || listToShow.length > 1){
        alert("Either no sight or several places of interest were selected. Please choose a single one. If there are no sights: add some. ;) ")}

    else{
        showPopup(listToShow[0]);
    }
})

var wantedSights  = [];

/**
 * Takes each of the desired points of interest transferred, checks which type it is and 
 * accordingly creates a layer with an info-Popup-marker, which is added to the map.
 * @param {JSON} sights 
 */
function addPopups(sights){

    //Remove current markers
    homemap.removeLayer(markers);
    markers = new L.FeatureGroup();

    console.log(sights);
    wantedSights = [];

    //Checks for each element whether it is of the Point or Polygon type and then creates a corresponding layer with a popup
    //that contains information about the point of interest.
    for(let i = 0; i < sights.length; i++){
        if(sights[i].features[0].geometry.type == "Point"){
            //Adjust coordinates
            //Source: https://gis.stackexchange.com/questions/246102/leaflet-reads-geojson-x-y-as-y-x-how-can-i-correct-this
            var sight = L.geoJSON(sights[i], {coordsToLatLng: function (coords) {return new L.LatLng(coords[1], coords[0])}})
            var id = sights[i]._id;
            
            //Create new L.marker
            var newmarker = L.marker([sight._layers[sight._leaflet_id-1]._latlng.lat, sight._layers[sight._leaflet_id-1]._latlng.lng], {ID: id});

            wantedSights.push(newmarker); 
            
            //Create Popup
            newmarker.bindPopup(
                `<h2>    Infobox </h2>
                 <p><b>  Name: </b>              ${sights[i].features[0].properties.Name}           </p>
                 <p><b>  URL:  </b>         <br> ${sights[i].features[0].properties.URL}            </p>
                 <p><b>  Beschreibung: </b> <br> ${sights[i].features[0].properties.Beschreibung}   </p>`)
            
            //Add to markers feature group     
            markers.addLayer(newmarker);
        }
        else{
            if(sights[i].features[0].geometry.type == "Polygon"){
                //Adjust coordinates
                //Source: https://gis.stackexchange.com/questions/246102/leaflet-reads-geojson-x-y-as-y-x-how-can-i-correct-this
                var sight = L.geoJSON(sights[i], {
                                      coordsToLatLng: function (coords) {
                                      return new L.LatLng(coords[1], coords[0])}})                      
                var coordinates = [];
                        for (let i = 0; i < (sight._layers[sight._leaflet_id-1]._latlngs[0]).length; i++) {
                            var nextcoord = [(sight._layers[sight._leaflet_id-1]._latlngs[0])[i].lat, (sight._layers[sight._leaflet_id-1]._latlngs[0])[i].lng];
                            coordinates.push(nextcoord);}
                        coordinates.push([(sight._layers[sight._leaflet_id-1]._latlngs[0])[0].lat, (sight._layers[sight._leaflet_id-1]._latlngs[0])[0].lng])                    
                var id = sights[i]._id;

                //Create polygon layer from the adjusted coordinates
                var newpolygon = L.polygon(coordinates, {ID: id});

                wantedSights.push(newpolygon);
                
                //Create Popup
                newpolygon.bindPopup(
                    `<h2>    Infobox </h2>
                     <p><b>  Name: </b>              ${sights[i].features[0].properties.Name}           </p>
                     <p><b>  URL:  </b>         <br> ${sights[i].features[0].properties.URL}            </p>
                     <p><b>  Beschreibung: </b> <br> ${sights[i].features[0].properties.Beschreibung}   </p>`)
                
                //Add polygon to markers feature group 
                markers.addLayer(newpolygon);
            }}
        console.log(wantedSights);

        //Put markers on the homemap
        homemap.addLayer(markers);
}}

/**
 * Compares the transferred Object-ID with the Object-IDs in wantedSights and opens the corresponding popup on the map
 * @param {ObjectID} id 
 */
function showPopup(id){
    addPopups(sights)
    console.log(id)
    console.log(wantedSights)
    for(let i in wantedSights){
        if(wantedSights[i].options.ID == id){
           wantedSights[i].openPopup();
}}}

        