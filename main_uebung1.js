//Javascript for Uebung_1
//author: Katharina Kaufmann

"use strict"

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
 * @param {[float,float]} coordinates of the current point (lat,lng)
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
function positionsToPolygon(){
    for (let i = 0; i < route.length; i++){
        positionToPolygon[i] = singlePositionToPolygon(route[i]); //checks for each point whether it lies in the polygon.
}
return positionToPolygon;
}

//Determining the intersections

/**
 * Determines the indices of the intersections (where the route enters or leaves the polygon) and combines them into an array.
 * @returns array: intersections
 */
function intersectionsWithPolygon(){
    intersections.push(0) //the first and the last index of the route must be contained in the array in order to be able to calculate the lengths of the sections. 
    for (let i = 0; i < positionToPolygon.length; i++){
        if (!positionToPolygon[i] && positionToPolygon[i+1] || positionToPolygon[i] && !positionToPolygon[i+1]){
        intersections.push(i); 
    }
}
    intersections.push(route.length-1);
    return intersections;
}

//Calculating the distances 

/**
 * Calculates the great-circle distances between two points given by coordinates with the help of the haversine formula (in meters).
 * Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula (24.04.2021)
 * @param {[float,float]} pt1 (lat/lng)
 * @param {[float,float]} pt2 (lat/lng)
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
function getDistanceBetweenAllPoints(){
  for (let i = 0; i < route.length-1; i++) {
      allPointToPointDistances[i] = getDistanceBetweenTwoPoints(route[i], route[i+1]);
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
function writeTable(){
  for (let i = 0;  i < lengthsOfSections.length; i++){
    
        var row = [];

        row[0] = i + 1;
        row[1] = Math.round(lengthsOfSections[i]*100)/100;
        row[2] = route[intersections[i]];
        row[3] = route[intersections[i] + 1];
        table.push(row);
  }
  table.sort((a,b) => a[1] - b[1])
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

//Execution commands
positionsToPolygon();
intersectionsWithPolygon();
getDistanceBetweenAllPoints();
getLengthsOfSections();
writeTable();

//Commands for console
console.table(positionsToPolygon());
console.table(intersectionsWithPolygon());
console.table(getDistanceBetweenAllPoints());
console.table(getLengthsOfSections());
console.log(totalDistance());
console.table(table);

document.getElementById("tbody").innerHTML = makeTableHTML(table);
document.getElementById("lengthinfo").innerHTML = totalDistance();
