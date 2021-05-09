# Geosoft1_2021

Zum Ausführen der Html-Datei für die Übung 3 werden die folgenden 3 Dateien benötigt: geosoft1_3.html , main_uebung3.js , style_uebung3.css .

Da zum Ausführen des Javascripts ein API-Key für die openweathermap-Anfrage benötigt wird, muss dieser individuell (der eigene openweathermap-API-key) 
an der folgenden Stelle im Script (main_uebung3.js) manuell eingefügt werden: 

1. Suche Function "askWeather(latitude, longitude)":
   
   function askWeather(latitude, longitude){

    var x = new XMLHttpRequest(); 

    x.onreadystatechange = function statechangecallback(){
        if (x.status == "200" && x.readyState == 4){
            let response = JSON.parse(x.responseText);
            showWeatherData(response);
            showWeather.style.display = "block";
        }
    }
    x.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=APIKEY`, true);
    x.send();

2. Gehe zu Zeile: x.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=APIKEY`, true);

3. An der Stelle "APIKEY" im Link muss stattdessen der eigene API-Key eingefügt werden. Beispiel:
   x.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=a1b2c3d4e5f6g7h8i9j`, true);
   
4. Im Falle des oben beispielhaft gewählten API-Keys sähe die Funktion im Script also anschließend so aus:

   function askWeather(latitude, longitude){

    var x = new XMLHttpRequest(); 

    x.onreadystatechange = function statechangecallback(){
        if (x.status == "200" && x.readyState == 4){
            let response = JSON.parse(x.responseText);
            showWeatherData(response);
            showWeather.style.display = "block";
        }
    }
    x.open("GET", `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=a1b2c3d4e5f6g7h8i9j`, true);
    x.send();
    
5. Anschließend kann die Html-Datei ausgeführt werden, woraufhin auf der Html-Page die angeforderten Wetterdaten zum gewählten Standort erscheinen.
