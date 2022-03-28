//javascript.js
//set map options
var myLatLng = { lat: -3.05, lng: -60 };
var mapOptions = {
    center: myLatLng,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false

};

//create map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);


//define calcRoute function
function calcRoute() {

    // Puxa o modo de viagem escolhido no html
    const selectMode = document.getElementById("mode").value

    //Waipoints
    const waypts = [];
    const checkboxArray = document.getElementById("waypoints");

    for (let i = 0; i < checkboxArray.length; i++) {
        if (checkboxArray.options[i].selected) {
        waypts.push({
            location: checkboxArray[i].value,
            stopover: true,
        });
        }
    }


    //create request
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("from").value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode[selectMode], //WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.METRIC
    }

    //pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            //Get distance and time
            /* const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>De: "
                    + document.getElementById("from").value 
                    + ".<br />Para: " + document.getElementById("to").value 
                    + ".<br />Parada: " + document.getElementById("step").value  
                        + ".<br /> Distância de Trajeto <i class='fas fa-road'></i> : " 
                        + result.routes[0].legs[0].distance.text + ".<br />Duração <i class='fas fa-hourglass-start'></i> : " 
                        + result.routes[0].legs[0].duration.text + ".</div>"; */

            console.log({ result })

            //display route
            directionsDisplay.setDirections(result);

            const route = result.routes[0]
            const summaryPanel = document.getElementById("directions-panel")

            summaryPanel.innerHTML = "";

            var totalDistance = 0
            var totalDuration = 0

            for (let i = 0; i < route.legs.length; i++) {
                const routeSegment = i + 1;
                
                totalDistance += route.legs[i].distance.value 
                totalDuration += route.legs[i].duration.value

                summaryPanel.innerHTML += 
                "<b>Segmento de Rota: " + routeSegment + "</b><br>";
                summaryPanel.innerHTML += route.legs[i].start_address + "  para ➡️ ";
                summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
                summaryPanel.innerHTML += route.legs[i].distance.text + "<br>"
                summaryPanel.innerHTML += route.legs[i].duration.text + "<br><br>";
            }

            //regra da duração em min ou horas
            if(Math.round(totalDuration/60) >= 60 ) {
                var tDuration = (totalDuration/3600).toFixed(2) + " horas"
            }else {
                var tDuration = (totalDuration/60).toFixed(2) + " min"
            }

            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>"
                  
                        + "Distância de Trajeto <i class='fas fa-road'></i> : " 
                        + totalDistance/1000 + "km" + ".<br />Duração <i class='fas fa-hourglass-start'></i> : " 
                        + tDuration + ".</div>"; 

        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in Manaus
            map.setCenter(myLatLng);

            //show error message
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });

}



//create autocomplete objects for all inputs
var options = {
    types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);


var input3 = document.getElementById("waypoints");
var autocomplete3 = new google.maps.places.Autocomplete(input3, options);