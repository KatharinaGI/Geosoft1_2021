# Geosoft1_2021

Zum Ausführen der Abgabe für die Übung 5 werden die folgenden 9 Dateien benötigt: geosoft1_5.html , geosoft1_2_5.html , geosoft1_4_5.html , main_uebung2_5.js , main_uebung4_5.js , polygon.js , route.js , Route_Uebung4.js , style_uebung5.css .
-> Aufgerufen wird die Seite dabei über geosoft1_5.html!

Da zum Ausführen des Javascripts für die "Uebung 4"-Seite ein API-Key für die openweathermap-Anfrage benötigt wird, muss dieser individuell (der eigene openweathermap-API-key) an der folgenden Stelle im Script (main_uebung4_5.js) manuell eingefügt werden:

1. Suche Function "weatherRequest(lat, lng, popup){}"

2. Gehe zu Zeile:

var apiUrl ='https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=APIKEY';

An der Stelle "APIKEY" im Link muss stattdessen der eigene API-Key eingefügt werden. Beispiel:

var apiUrl ='https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=A1B2C3D4E5F6G7';

Anschließend kann die Html-Datei ausgeführt werden.

!HINWEIS!: Die Abgabeversion des main_uebung4_5.js - Skriptes ist auf den Browser "Mozilla Firefox" ausgelegt. Bei Nutzung dieses Browsers kann, neben den Markern des gezeichneten Polygons, auch jeder andere Punkt auf der Karte für eine Wetterabfrage ausgewählt werden. Sollte die Abgabe in einem anderen Browser (Edge, Opera) ausgeführt werden, muss die folgendende map.on(...)-Funktion des main_uebung4_5.js-Skriptes entfernt/auskommentiert werden:

                     /**
                     //Allows data to be displayed without drawing a rectangle.
                      map.on('click', function(event){
                          drawnItems.clearLayers(); //Removes all markers and layers when the map is clicked.
                          clearMarkers();
                          var coordinates = [event.latlng.lng, event.latlng.lat];
                          addMarkerToPosition(coordinates); //Then calls other functions to add new markers and load weather data
                     });
                     */

Wieso genau Edge an dieser Stelle ein Problem mit dem Zeichnen des Polygons hat und Firefox nicht, weiß ich leider nicht. Ich wollte die Funktion jedoch ungerne streichen, da sie ja in Firefox problemlos läuft! :)
