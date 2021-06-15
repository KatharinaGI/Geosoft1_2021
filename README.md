# Geosoft1_2021
Zum Ausführen der Abgabe für die Übung 6 wird für die Javascript-Datei "global.js" ein API-Key für die openweathermap-Anfrage benötigt, dieser muss individuell (der eigene openweathermap-API-key) an der folgenden Stelle im Script (global.js) manuell eingefügt werden:

1. Suche Function "weatherRequest(lat, lng, popup){}"

2. Gehe zu Zeile:

var apiUrl ='https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=APIKEY';

An der Stelle "APIKEY" im Link muss stattdessen der eigene API-Key eingefügt werden. Beispiel:

var apiUrl ='https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=A1B2C3D4E5F6G7';

Zudem muss je nachdem die localhost-Adresse (voreingestellt: localhost:27017/routes) für die MongoDB an der folgenden Stelle angepasst werden:

1. app.js
2. Zeile: var db = monk('localhost:27017/routes');

Danach sollte (nach npm install) das starten mit "npm start" funktionieren.

PS: Das Implementieren einer "Umbennen"-Funktion haben wir leider nicht mehr geschaftt!


!HINWEIS!: Die Abgabeversion des main_uebung4.js - Skriptes ist auf den Browser "Mozilla Firefox" ausgelegt. Bei Nutzung dieses Browsers kann, neben den Markern des gezeichneten Polygons, auch jeder andere Punkt auf der Karte für eine Wetterabfrage ausgewählt werden. Sollte die Abgabe in einem anderen Browser (Edge, Opera) ausgeführt werden, muss die map.on(...)-Funktion am Ende des main_uebung4.js-Skriptes entfernt/auskommentiert werden:

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
