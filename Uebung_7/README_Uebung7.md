# Geosoft1_2021

Das Starten der Anwendung für die Übung 7 kann mit "docker-compose up" erfolgen. Hierdurch werden alle nötigen Images (katharinagi/appservice, mongo, mongo-express) heruntergeladen, die node modules (npm install) installiert und anschließend die Anwendung gestartet. Die Hauptseite zur Übung ist über localhost:4000 zu erreichen, die Datenbank über localhost:8081.

Link zum DockerHub-Repository: https://hub.docker.com/r/katharinagi/appservice 

Zum Ausführen der Abgabe für die Übung 7 wird für die Javascript-Datei "global.js" ein API-Key für die openweathermap-Anfrage benötigt, dieser muss individuell (der eigene openweathermap-API-key) an der folgenden Stelle im Script (global.js) manuell eingefügt werden:

Suche Function "weatherRequest(lat, lng, popup){}"

Gehe zu Zeile:

   var apiUrl ='https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=APIKEY';

An der Stelle "APIKEY" im Link muss stattdessen der eigene API-Key eingefügt werden. Beispiel:

   var apiUrl ='https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=A1B2C3D4E5F6G7';

Nach Einfügen des API-Keys kann die Anwendung wie oben beschrieben gestartet werden.


!HINWEIS!: Die Abgabeversion des global.js - Skriptes ist wie auch in den vorherigen Abgaben auf den Browser "Mozilla Firefox" ausgelegt. 
