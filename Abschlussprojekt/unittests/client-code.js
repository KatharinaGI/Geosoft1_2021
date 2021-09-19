// our client code
var url = 'https://de.wikipedia.org/wiki/St.-Paulus-Dom_(M%C3%BCnster)';
var testdatei = 'test.geojson';

function sum (a, b)
{
    return a + b
}

function multiply (a, b)
{
    return a * b
}

function subtract (a,b)
{
    return a - b
}

function getTitle(url)
{
    var split = url.split('/');
    var title = split[4];
    return title;
}

function isGeoJSON(filename)
{
    var ending =  filename.split('.').pop();
    if(ending == "geojson")
    {
        return true
    }
    else
    {
        return false;
    }
}
