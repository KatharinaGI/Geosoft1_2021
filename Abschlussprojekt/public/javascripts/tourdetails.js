"use strict"

var showDetailsButton = document.getElementById('showMore');
var detailtable = document.getElementById("detailtable");
var showTourDetails = document.getElementById("showTourDetails");

//Add click event listener to showDetailsButton. When clicked, check for which tour the details are to be displayed and then 
//search for it in all tours. Then create an HTML table with the help of for-loops, which contains the information about the sights. 
//If you click on the table, the corresponding sight will be highlighted in a popup on the map.
showDetailsButton.addEventListener('click', function(){
    var listToShowDetails = [];
    $("input:checkbox").each(function(){
        var $this = $(this);
        
        if($this.is(":checked")){
            listToShowDetails.push($this.attr("id"));
        }
    })
    //Has a tour been selected?
    if (listToShowDetails.length < 1 || listToShowDetails.length > 1){
        alert("Either no tour or several tours were selected. Please choose a single one. If there are no tours: add some. ;) ")}

    else{
        //Source: https://www.it-swarm.com.de/de/javascript/finden-sie-ein-objekt-anhand-der-id-einem-array-von-javascript-objekten/939972278/
        var tourtoshow = tours.find(x => x._id === listToShowDetails[0]);
        var tourdetails = [];

        //Generate table content for each sight
        for (let i = 0; i < tourtoshow.items.length; i++) {
            var row = [];
            row[0] = i + 1;
            row[1] = tourtoshow.items[i].features[0].properties.Name;
            row[2] = tourtoshow.items[i]._id;
            tourdetails.push(row);}
        console.log(tourdetails)

        //Show the sights that are included in the tour on the map
        addPopups(tourtoshow.items);

        //Fill the table with content and implement the onclick function
        var table = "<table> <th> Order of visit </th> <th> Sight <br> (click for Infos) </th></th>";
            for(let i = 0; i < tourdetails.length; i++) {
                table += `<tr id= ${tourdetails[i][2]} onclick=showPopup(this.id)>`;
                for(let j = 0; j < tourdetails[i].length-1; j++){
                    table += "<td>"+ tourdetails[i][j] + "</td>";
                }
                table += "</tr>";
            }
            table += "</table>";
        detailtable.innerHTML = table;
        
        //Switch table to visible
        showTourDetails.style.display = 'block';
}})




        





