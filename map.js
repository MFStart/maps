var map = L.map('map', {
  center: [37.35105530964274, -121.95716857910155], // EDIT latitude, longitude to re-center map
  zoom: 12,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
  scrollWheelZoom: true });

var zipcode = L.esri.featureLayer({
  url: 'https://services.arcgis.com/NkcnS0qk4w2wasOJ/ArcGIS/rest/services/COVIDCasesByZipCode/FeatureServer/0',
  simplifyFactor: .5,
  precision: 5,
  style: function (feature){
          var x = feature.properties.Cases;
          if (x > 1000) return {color:'#b10026',};
          if (x > 800)  return {color:'#e31a1c'};
          if (x > 500)  return {color:'#fc4e2a'};
          if (x > 300) return {color:'#fd8d3c'};
          if (x > 100)  return {color:'#feb24c'};
          if (x > 50)   return {color:'#fed976'};
          if (x > 10)   return {color:'#ffffb2'};
          else return {color:'#ffffcc'};}
}).addTo(map);


/* display basemap tiles -- see others at https://leaflet-extras.github.io/leaflet-providers/preview/ */
var popupTemplate = '<h1>{zipcode}</h3> <br>Cases: {Cases}</br><br>Population: {Population}</br>';
/* Display a point marker with pop-up text */
//L.marker([37.35105530964274, -121.95716857910155]).addTo(map).bindPopup('text here'); // EDIT pop-up text messag
zipcode.bindPopup(function (x) {
  return L.Util.template(popupTemplate, x.feature.properties);
});

/*

zipcode.on('mouseover', function (e) {
  document.getElementById('info-pane').innerHTML = e.layer.feature.properties.zipcode;
  var layer = e.target;
  layer.setStyle({
    color: '#9D78D2',
    weight: 5,
    opacity: 1
  });
});
*/

/*function query_zipcode(x) {

    zipcode.query().where(x.).run(function (error, featureCollection, response) {
      if (error) {
        console.log(error);
        return;
      }
      console.log(featureCollection.features[0].properties.zipcode);
    })


}
*/

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
var controlLayers = L.control.layers(based,layers,{collapsed:false}).addTo(map);
