//Javascript for Uebung_2
//author: Katharina Kaufmann

"use strict"

//1. Functions for calculating and creating the table (Adapted from Uebung_1)

//Variables

//boundaries
let  southernborder = polygon[0][1]; //reference points of the given polygon for comparison with the longitude and latitude of the route points.
let  northernborder = polygon [2][1];
let  westernborder = polygon[0][0];
let  easternborder = polygon[2][0];

let positionToPolygon = []; //Array that stores a boolean for each point of the route. True = point is inside the polygon. False = point is outside the polygon.
let intersections = []; //Array that stores the intersections of route and polygon.
let allPointToPointDistances = []; //Array that stores the distances between all successive points of the route.
let lengthsOfSections = []; //Array that stores the lengths of the sections that were created by the intersection points with the polygon
let table = [];  //Array that stores all the calculated values to be displayed: route section, length of the the section in meters, 
                //coordinates of the starting point and ending point of the section

//Functions

//Finding out, which points of the route are located inside/outside the polygon

/**
 * Determines whether the current point is inside or outside the given rectangluar polygon.
 * @param {[float,float]} coordinates of the current point (lng,lat)
 * @returns boolean: True = point is inside the polygon. False = point is outside the polygon.
*/
function singlePositionToPolygon(coordinatesOfCurrentPoint){
    if(coordinatesOfCurrentPoint[1] >= southernborder && coordinatesOfCurrentPoint[1] <= northernborder && coordinatesOfCurrentPoint[0] >= westernborder && coordinatesOfCurrentPoint[0] <= easternborder){
        return true;
    }
    else{ return false;}
    }

/**
 * Determines the position to polygon for each point of the route and combines the booleans into an array.
 * @returns array: positionToPolygon 
 */
function positionsToPolygon(usedroute){
    for (let i = 0; i < usedroute.length; i++){
        positionToPolygon[i] = singlePositionToPolygon(usedroute[i]); //checks for each point whether it lies in the polygon.
}
return positionToPolygon;
}

//Determining the intersections

/**
 * Determines the indices of the intersections (where the route enters or leaves the polygon) and combines them into an array.
 * @returns array: intersections
 */
function intersectionsWithPolygon(usedroute){
    intersections.push(0) //the first and the last index of the route must be contained in the array in order to be able to calculate the lengths of the sections. 
    for (let i = 0; i < positionToPolygon.length; i++){
        if (!positionToPolygon[i] && positionToPolygon[i+1] || positionToPolygon[i] && !positionToPolygon[i+1]){
        intersections.push(i); 
    }
}
    intersections.push(usedroute.length-1);
    return intersections;
}

//Calculating the distances 

/**
 * Calculates the great-circle distances between two points given by coordinates with the help of the haversine formula (in meters).
 * Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula (24.04.2021)
 * @param {[float,float]} pt1 (lng/lat)
 * @param {[float,float]} pt2 (lng/lat)
 * @returns the distance between two points in meters.
 */
 function getDistanceBetweenTwoPoints(pt1,pt2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(pt2[1]- pt1[1]);  // deg2rad below
    var dLon = deg2rad(pt2[0]- pt1[0]); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(pt1[1])) * Math.cos(deg2rad(pt2[1])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; //Distance in km
    var m = d * 1000; //Distance in m
    return m;
  }
  
/**
 * Converts coordinates in degrees into coordinates of radiants.
 * Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula (24.04.2021)
 * @param {float} deg coordinates (deg)
 * @returns converted coordinates (rad)
 */
function deg2rad(deg) {
    return deg * (Math.PI/180);
  }

/**
 * Determines the distances between all successive points of the route and combines them into an array.
 * @returns array: allPointToPointDistances
 */
function getDistanceBetweenAllPoints(usedroute){
  for (let i = 0; i < usedroute.length-1; i++) {
      allPointToPointDistances[i] = getDistanceBetweenTwoPoints(usedroute[i], usedroute[i+1]);
  }
  return allPointToPointDistances;
}

/**
 * Calculates the lengths of the sections that were created by the intersection points with the polygon and combines them into an array.
 * @returns array: lengthsOfSections
 */
function getLengthsOfSections(){
    for (let i = 0; i < intersections.length-1; i++){
        var sectionLength = 0;

        for (let j = intersections[i]; j < intersections[i+1]; j++){
            sectionLength += allPointToPointDistances[j]; //add up all the distances that lie in the current section.
        }
    lengthsOfSections.push(sectionLength);
    }
    return lengthsOfSections;
}

/**
 * Calculates the total length of the route by adding up the distances between all successive points of the route (in meters).
 * @returns total distance (in m)
 */
 function totalDistance(){
    var totaldistance = 0;
    for (let i = 0; i < allPointToPointDistances.length-1; i++) {
        totaldistance += allPointToPointDistances[i]; //Iterates and adds up all successive point distances.
    }
    return "The total length of the route is "+ Math.round(totaldistance*100)/100 + " meters."; //returns total length of the route (in m).
}

//Creating the table

/**
 * Fills the table fields with the calculated values ​​to be displayed.
 * @returns table
 */
function writeTable(usedroute){

    //calls the necessary functions
    positionsToPolygon(usedroute); 
    intersectionsWithPolygon(usedroute);
    getDistanceBetweenAllPoints(usedroute);
    getLengthsOfSections();

    //creates table
  for (let i = 0;  i < lengthsOfSections.length; i++){
    
        var row = []; 

        row[0] = i + 1;
        row[1] = Math.round(lengthsOfSections[i]*100)/100;
        row[2] = usedroute[intersections[i]];
        row[3] = usedroute[intersections[i] + 1];
        table.push(row);
  }
  table.sort((a,b) => a[1] - b[1])

    //displays a message if the route does not intersect the polygon
  if (intersections.length < 3){alert("The selected route is outside the polygon. The displayed route section describes the entire route.")}
  return table;
}

/**
 * Creates a html-code for generating a table out of a two-dimensional array (here: "table").
 * Source: https://stackoverflow.com/questions/15164655/generate-html-table-from-2d-javascript-array (24.04.2021)
 * @param myArray the array to be converted into a table.
 * @return hmtl-code for generating a table out of the given array.
 */
function makeTableHTML(myArray) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
    }



//2. Functions for managing the uploading of a route (.geojson file) and implementing the use of the buttons (added for Uebung_2)

//Variables

let uploaddiv = document.getElementById("uploaddiv");
let uploadfield = document.getElementById("uploadfield");
let uploadButton = document.getElementById("uploadButton");
let defaultButton = document.getElementById("defaultButton");
let resultTable = document.getElementById("resultTable");
let showRouteAsStringButton = document.getElementById("showRouteAsStringButton");
let routeAsStringInfo = document.getElementById("routeAsStringInfo");
let showPolygonAsStringButton = document.getElementById("showPolygonAsStringButton");
let polygonAsStringInfo = document.getElementById("polygonAsStringInfo");
let showGeojson = document.getElementById("showGeojson");

//Functions

/** 
 * Implements the use of the button "Use uploaded file".
 * Determines the necessary parameters for the "showOutput"-function (from the uploaded .geojson file (route) and the given polygon) and then calls the "showOutput"-function. 
 * @param {string} type - the type of event listened to
 * @param {EventListener} listener - the function to call when the event is triggered
 */
 uploadButton.addEventListener('click', function(){
    if (uploadfield.files.length > 0){ //checks whether a file has been selected
     var reader = new FileReader(); //File reader to read the selected file
        reader.readAsText(uploadfield.files[0]); //reads the file
        reader.addEventListener('load', function(){
            let routeAsGeojson = JSON.parse(reader.result); //parses the result into a JSON object
            let routeAsString = JSON.stringify(routeAsGeojson); 
            let polygonAsGeojson = toGeojsonPolygon(polygon); //converts the polygon to geojson format
            let polygonAsString = JSON.stringify(polygonAsGeojson);

        showOutput(routeAsGeojson, routeAsString, polygonAsString);
        })
    }
    else 
        alert("No file has been uploaded") //message if no file was selected
})

/**
 * Implements the use of the button "Use uploaded file".
 * Determines the necessary parameters for the "showOutput"-function (from the given default route and the given polygon) and then calls the "showOutput"-function. 
 * @param {string} type - the type of event listened to
 * @param {EventListener} listener - the function to call when the event is triggered
 */
defaultButton.addEventListener("click", function(){
    let routeAsGeojson = toGeojsonLineString(route); //converts the route to geojson format
    let routeAsString = JSON.stringify(routeAsGeojson);
    let polygonAsGeojson = toGeojsonPolygon(polygon); //converts the polygon to geojson format
    let polygonAsString = JSON.stringify(polygonAsGeojson);

    showOutput(routeAsGeojson, routeAsString, polygonAsString);
})

/**
 * Merges the output: creates the table and assigns the texts of the resulting .geojson files to the corresponding paragraphs.
 * @param {Object} route as LineString object
 * @param {string} routeAsString the .geojson file of the route as a string
 * @param {string} polygonAsString the .geojson file of the polygon as a string
  */
 function showOutput(usedroute, routeAsString, polygonAsString){
    resultTable.style.display = "block";
    document.getElementById("tbody").innerHTML = makeTableHTML(writeTable(usedroute.coordinates));
    document.getElementById("lengthinfo").innerHTML = totalDistance();
    document.getElementById("routeAsStringInfo").innerHTML = routeAsString;
    document.getElementById("polygonAsStringInfo").innerHTML = polygonAsString;
    showGeojson.style.display = "block";
 }


 /**
 * Implements the use of the button "Show selected route as a .geojson file".
 * Displays the string of the .geojson file of the selected route. If you click again, the display field disappears.
 */
  let visibleRouteAsString = false;

  showRouteAsStringButton.addEventListener('click', function(){
     if (visibleRouteAsString == false){
        routeAsStringInfo.style.display = "block";
        visibleRouteAsString = true;
      }
      else { 
        routeAsStringInfo.style.display = "none";
        visibleRouteAsString = false;
      }
  })

  /**
 * Implements the use of the button "Show used polygon as a .geojson file".
 * Displays the string of the .geojson file of the used polygon. If you click again, the display field disappears.
 */
    let visiblePolygonAsString = false;

    showPolygonAsStringButton.addEventListener('click', function(){
     if (visiblePolygonAsString == false){
        polygonAsStringInfo.style.display = "block";
        visiblePolygonAsString = true;
    }
    else {
        polygonAsStringInfo.style.display = "none";
        visiblePolygonAsString = false;
    }
 })

 /** 
  * Converts a given two dimensional array into a .geojson file of the type "LineString".
  * @param {array} array two dimensional array to be converted
  * @returns converted array into a .geojson file of the type "LineString"
  */
 function toGeojsonLineString(array){
     let linestring = {
         "type": "LineString",
         "coordinates": array,
     }
     return linestring;
 }

 /** 
  * Converts a given two dimensional array into a .geojson file of the type "Polygon".
  * @param {array} array two dimensional array to be converted
  * @returns converted array into a .geojson file of the type "Polygon"
  */
 function toGeojsonPolygon(array){
     let geojsonpolygon = {
         "type": "Polygon",
         "coordinates": array,
     }
     return geojsonpolygon;
 }

