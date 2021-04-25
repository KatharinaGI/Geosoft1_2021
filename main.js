/**
 * Javascript for Uebung_1
 * author: Katharina Kaufmann
 */

"use strict"

//Variables

const lowerLeftCorner = polygon[4] //reference points of the given polygon for comparison with the longitude and latitude of the route points.
const upperRightCorner = polygon[2]

let positionToPolygon = [] //Array that stores a boolean for each point of the route. True = point is inside the polygon. False = point is outside the polygon.
let intersections = [] //Array that stores the intersections of route and polygon.
let allPointToPointDistances = [] //Array that stores the distances between all successive points of the route.
let lengthsOfSections = [] //Array that stores the lengths of the sections that were created by the intersection points with the polygon
let table = []  //Array that stores all the calculated values to be displayed: route section, length of the the section in meters, 
                //coordinates of the starting point and ending point of the section


//Functions

//Finding out, which points of the route are located inside/outside the polygon

/**
 * Determines whether the current point is inside or outside the given rectangluar polygon.
 * @param {[float,float]} coordinates of the current point (lng/lat)
 * @param {[float,float]} coordinates of the lower left corner of the given polygon ("lowerLeftCorner") (lng/lat)
 * @param {[float,float]} coordinates of the upper right corner of the given polygon ("upperRightCorner") (lng/lat)
 * @return boolean: True = point is inside the polygon. False = point is outside the polygon.
*/
function singlePositionToPolygon(coordinatesOfCurrentPoint, lowerLeftCorner, upperRightCorner){
    if(coordinatesOfCurrentPoint[0] >= lowerLeftCorner[0] && coordinatesOfCurrentPoint[0] <= upperRightCorner[0] && coordinatesOfCurrentPoint[1] <= upperRightCorner[1] && coordinatesOfCurrentPoint[1] >= lowerLeftCorner[1]){
        return true
    }
    else {return false}
    }

/**
 * Determines the position to polygon for each point of the route and combines the booleans into an array.
 */
function positionsToPolygon(){
    for (let i = 0; i < route.length; i++){
        positionToPolygon[i] = singlePositionToPolygon(route[i], lowerLeftCorner, upperRightCorner) //checks for each point whether it lies in the polygon.
}

//Determining the intersections

/**
 * Determines the indices of the intersections (where the route enters or leaves the polygon) and combines them into an array.
 */
function intersectionsWithPolygon(){
    for (let i = 0; i < positionToPolygon.length; i++){
        if (i == 0 || i == positionToPolygon.length-1 || !positionToPolygon[i] && positionToPolygon[i+1] || positionToPolygon[i] && !positionToPolygon[i+1]){
            intersections.push(i) //the first and the last index of the route must be contained in the array in order to be able to calculate the lengths of the sections. 
        }
    }
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
    var dLat = deg2rad(pt2[1]- pt1[1])  // deg2rad below
    var dLon = deg2rad(pt2[0]- pt1[0]) 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(pt1[1])) * Math.cos(deg2rad(pt2[1])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    var d = R * c //Distance in km
    var m = d * 1000 //Distance in m
    return m
  }
  
/**
 * Converts coordinates in degrees into coordinates of radiants.
 * Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula (24.04.2021)
 * @param {float} deg coordinates (deg)
 * @returns converted coordinates (rad)
 */
function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

/**
 * Determines the distances between all successive points of the route and combines them into an array.
 */
function getDistanceBetweenAllPoints(){
  for (let i = 0; i < route.length-1; i++) {
      allPointToPointDistances[i] = getDistanceBetweenTwoPoints(route[i], route[i+1])
  }
}

/**
 * Calculates the the lengths of the sections that were created by the intersection points with the polygon and combines them into an array.
 */
function getLengthsOfSections(){
    for (let i = 0; i < intersections.length-1; i++){
        var sectionLength = 0

        for (let i = intersections[i]; i < intersections[i+1]; i++){
            sectionLength += allPointToPointDistances[i] //add up all the distances that lie in the current section.
        }
    lengthsOfSections.push(sectionLength)
}


/**
 * Calculates the total length of the route by adding up the distances between all successive points of the route (in meters).
 * @returns total distance (in m)
 */
 function totalDistance(){
    var totaldistance = 0
    for (let i = 0; i < allPointToPointDistances.length; i++) {
        totaldistance += allPointToPointDistances[i] //Iterates and adds up all successive point distances.
    }
    return totaldistance; //returns total length of the route (in m).
}


//Creating the table

/**
 * Fills the table fields with the calculated values ​​to be displayed.
 */
function writeTable(){
  for (i = 0;  i < lengthsOfSections.length; i++)
    
        var row = []

        row[0] = i + 1
        row[1] = lengthsOfSections[i]
        row[2] = route[intersectIndexArray[i]]
        row[3] = route[intersectIndexArray[i + 1]]

        table.push(row)
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
}

//Execution commands

positionToPolygon()
intersectionsWithPolygon()
getDistanceBetweenAllPoints()
getLengthsOfSections
writeTable()
table.sort((a,b) => a - b)

console.table(positionToPolygon); //Display the arrays in console
console.table(intersections);
console.table(allPointToPointDistances);
console.table(lengthsOfSections);
console.log(totalDistance()); //Display total length
console.table(table); //Display sorted and converted result table

document.getElementById("tcontent").innerHTML = makeTableHTML(table)
document.getElementById("totallength").innerHTML = "The total length of the route is " + Math.round(totalDistance()) + "meters."
}