var map = L.map('map', {
center: [37.35105530964274,-121.95716857910155], // EDIT latitude, longitude to re-center map
zoom: 12,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
scrollWheelZoom: true
});
var zipcode = L.esri.featureLayer({ url: 'https://services.arcgis.com/NkcnS0qk4w2wasOJ/ArcGIS/rest/services/COVIDCasesByZipCode/FeatureServer/0' });

/* display basemap tiles -- see others at https://leaflet-extras.github.io/leaflet-providers/preview/ */
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);
var popupTemplate = "<h3>{zipcode}</h3><br>Population: {Population}</br>";
/* Display a point marker with pop-up text */
L.marker([37.35105530964274,-121.95716857910155]).addTo(map).bindPopup("text here"); // EDIT pop-up text messag
var coviddata = d3.csv("covidbyzip.csv");
zipcode.bindPopup(function (x){
return L.Util.template(popupTemplate, x.feature.properties)});

/* Control panel to display map layers */


/* Carto light-gray basemap tiles with labels */
var light = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
//  controlLayers.addBaseLayer(light, 'Carto Light basemap');
/* Stamen colored terrain basemap tiles with labels */
var terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
 attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
}).addTo(map); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
//  controlLayers.addBaseLayer(terrain, 'Stamen Terrain basemap');

//define based map
var based= {
"Light": light,
"Terrain": terrain
//define feature layers
};
var layers={
"zipcode": zipcode
};
//controller for layers
var controlLayers = L.control.layers( based,layers, {
position: "topright",
collapsed: false
}).addTo(map);
