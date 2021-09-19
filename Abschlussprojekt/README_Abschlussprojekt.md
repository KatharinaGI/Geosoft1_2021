# Geosoft1_2021

Das Starten der Anwendung für die Abschlussabgabe kann mit "docker-compose up" erfolgen. Hierdurch werden alle nötigen Images (katharinagi/finalproject, mongo, mongo-express) heruntergeladen, die node modules (npm install) installiert und anschließend die Anwendung gestartet. Die Hauptseite zur Übung ist über localhost:4000 zu erreichen, die Datenbank über localhost:8081.
Link zum DockerHub-Repository: https://hub.docker.com/r/katharinagi/finalproject .
Zum Ausführen der Abgabe wird für die Javascript-Datei "oepnv.js" ein API-Key für die openweathermap-Anfrage benötigt, dieser muss individuell (der eigene openweathermap-API-key) an der folgenden Stelle im Script (oepnv.js) manuell eingefügt werden:

Suche Function "weatherRequest(lat, lng, popup){}"

Gehe zu Zeile:

   var APIKEY = '';

Hier muss der eigene "APIKEY" eingefügt werden. Beispiel:

   var APIKEY ='A1B2C3D4E5F6G7';

Nach Einfügen des API-Keys kann die Anwendung wie oben beschrieben gestartet werden.


