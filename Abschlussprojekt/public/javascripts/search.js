"use strict"

//Variable that contains the names of all sights.
var sightsnames = sights.map(function (el) {
    return el.features[0].properties.Name
})
console.log(sightsnames);

//Implementation of the auto-complete for the search bar
$("#sights").autocomplete({
        minLength: 1, // start after 1 character
        source: sightsnames, // take the sightsnames as source
        select: function (event, ui) {
            this.value = ui.item.value // update the value of the current field with the value of the selected element
            
            return false // see https://css-tricks.com/return-false-and-prevent-default/
        }
    })

var searchSightButton = document.getElementById('btnSearchSight');

//Add click event listener to searchSightButton. When clicked, function "searchSight()" is called.
searchSightButton.addEventListener('click', function(){
    searchSight();
})

/**
 * Takes the value from the search bar, filters all sights according to the searched value and then calls showPopup (id) 
 * with the ID of the desired sight in order to show it on the map. Then the value of the search bar is set back to zero.
 */
function searchSight(){
    var searched = document.getElementById('sights').value;
    console.log(searched);

    let details = sights.filter(function(el){   // return the only object for which sights matches the searched sight.
        return el.features[0].properties.Name === searched;
    })
    showPopup(details[0]._id);
    document.getElementById('sights').value = "";
}

//Variable that contains the names of all tours.
var toursnames = tours.map(function (el) {
    return el.name
})
console.log(toursnames);

//Implementation of the auto-complete for the search bar
$("#tours").autocomplete({
        minLength: 1, // start after 1 character
        source: toursnames, // take the toursnames as source
        select: function (event, ui) {
            this.value = ui.item.value // update the value of the current field with the value of the selected element
            
            return false // see https://css-tricks.com/return-false-and-prevent-default/
        }
    })


var searchTourButton = document.getElementById('btnSearchTour');

//Add click event listener to searchTourButton. When clicked, function "searchTour()" is called.
searchTourButton.addEventListener('click', function(){
    searchTour();
})

/**
 * Takes the value from the search bar, filters all tours according to the searched value and then follows the functionality 
 * of the showDetailsButton (see tourdetails.js). Then the value of the search bar is set back to zero.
 */
function searchTour(){
    var searched = document.getElementById('tours').value;
    console.log(searched);

    let details = tours.filter(function(el){ // return the only object for which tours matches the searched tour
        return el.name === searched; 
    })

    var tourtoshow = tours.find(x => x._id === details[0]._id);
        var tourdetails = [];
        for (let i = 0; i < tourtoshow.items.length; i++) {
            var row = [];
            row[0] = i + 1;
            row[1] = tourtoshow.items[i].features[0].properties.Name;
            row[2] = tourtoshow.items[i]._id;
            tourdetails.push(row);}
        console.log(tourdetails)
        addPopups(tourtoshow.items);
        var table = "<table> <th> Order of visit </th> <th> Sight <br> (click for Infos) </th>";
            for(let i = 0; i < tourdetails.length; i++) {
                table += `<tr id= ${tourdetails[i][2]} onclick=showPopup(this.id)>`;
                for(let j = 0; j < tourdetails[i].length-1; j++){
                    table += "<td>"+ tourdetails[i][j] + "</td>";
                }
                table += "</tr>";
            }
            table += "</table>";
        detailtable.innerHTML = table;
        showTourDetails.style.display = 'block';
        
    document.getElementById('tours').value = "";
}
