"use strict"

var addTourButton = document.getElementById('addTourButton');

//Add click event listener to addTourButton. When clicked, find out which sights to add to the tour and make sure the tour has a name.
//Then create a JSON from the entered name and the selected sights before sending the data to the server.
addTourButton.addEventListener('click', function(){
    var listToAdd = [];
    var tourName = document.getElementById('tourname').value;
    
    $("input:checkbox").each(function(){
        var $this = $(this);

        if($this.is(":checked")){
            listToAdd.push($this.attr("id"));
        }})

    if(listToAdd.length < 1){
        alert("No sights were selected for the tour.")
    }
    else{
        if(tourName == undefined || tourName == null || tourName == ""){
            alert("Please give your tour a name.")
        }
        else {
            var tourCreate = {};
            tourCreate.name = tourName;
            tourCreate.items = listToAdd;
            console.log(tourCreate);

            var tourToAdd = JSON.stringify(tourCreate);

            $.ajax({
                async: "true",
                type: "POST",
                url: "/edit/addTour",
                data: {
                    tourtoadd: tourToAdd
                },
                success: function(){
                    window.location.href = '/edit'
                },
                error: function () {
                    alert('An error has occurred')
                }
            })
            .done()
        }}})

var deleteTourButton = document.getElementById('deleteTourButton');

//Add click event listener to deleteTourButton. When clicked, find out which tours should be deleted. 
//Then check whether the selection is correct before sending the data to the server.
deleteTourButton.addEventListener('click', function(){
    var listToDelete = {};
    listToDelete.tours=[];
    
    $("input:checkbox").each(function(){
        var $this = $(this);

        if($this.is(":checked")){
            listToDelete.tours.push($this.attr("id"));
        }
    });
    if (listToDelete.tours.length < 1){
        alert("No tours were selected to be deleted. If there are no tours, add some. ;)")
    }
    else {
        if (listToDelete.tours.length != 0){

            var confirmation = confirm('Are you sure you want to delete the selected tours?');

            //Make sure you want to delete the tours
            if (confirmation === true) {

            var toursToDelete = JSON.stringify(listToDelete);
            // Ajax request that sends information about the tours that should be deleted from the database to the server.
            $.ajax({
                async: false,
                type: "post",
                url: "/edit/deleteTour",
                data: {
                   tourstodelete: toursToDelete
                },
                success: function () {
                    window.location.href = '/edit'
                },
                error: function () {
                    alert('An error has occurred')
                }
            })
            .done()
            }}
        else {
        // If they said no to the confirm, do nothing
        return false;
        }
}})




        





