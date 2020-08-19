 /*function getcolor(f) {
  var x = f.properties.Cases;
  switch (x){
    case (x > 1000): c = '#b10026'; break;
    case (x > 800 && x < 1000): c = '#e31a1c'; break;
    case (x > 500 && x < 800): c = '#fc4e2a'; break;
    case (x > 300 && x < 500): c = '#fd8d3c'; break;
    case (x > 50 && x < 300): c = '#fed976'; break;
    case (x > 10 && x < 50): c = '#ffffb2'; break;
    case (x < 10): c = '#ffffcc'; break;
  }
  return { fillcolor: c };
}
*/
/* // function to join features by attribute
function featureJoinByProperty(fProps, dTable, joinKey) {
  var keyVal = fProps[joinKey];
  var match = {};
  for (var i = 0; i < dTable.length; i++) {
    if (dTable[i][joinKey] === keyVal) {
      match = dTable[i];
      for (key in match) {
        if (!(key in fProps)) {
          fProps[key] = match[key];
        }
      }
    }
  }
}
*/
/*
//gets all the individual zipcode
zipcode.eachFeature(function (lyr) {
  return (layer.feature.properties.ZIPCODE);
});
*/
/*
var zipcode = $.ajax({
  url:'https://opendata.arcgis.com/datasets/cb9923f1ff0941d2b613ba75e40a4440_0.geojson',
  dataType: 'json'
  }
);
*/


//L.geoJson(zipcode).addto(map);
var zip = $.ajax({
  url:"https://opendata.arcgis.com/datasets/cb9923f1ff0941d2b613ba75e40a4440_0.geojson",
  dataType: "json",
  success: console.log("data successfully loaded."),
      error: function(xhr) {
      alert(xhr.statusText)
    }
  })

$.when(zip).done(function(){s
  var map = L.map('map', {
    center: [37.35105530964274, -121.95716857910155], // EDIT latitude, longitude to re-center map
    zoom: 12,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    scrollWheelZoom: true });
    /* Carto light-gray basemap tiles with labels */
  var light = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
    }).addTo(map); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
    //  controlLayers.addBaseLayer(light, 'Carto Light basemap');
    /* Stamen colored terrain basemap tiles with labels */
  var terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
    //  controlLayers.addBaseLayer(terrain, 'Stamen Terrain basemap');

    //define based map
  var based= {
    "Light": light,
    "Terrain": terrain
    //define feature layers
    };

  //controller for layers
  var controlLayers = L.control.layers(based).addTo(map);
  var zipshape = L.geoJSON(zip.responseJSON,{
  onEachFeature: function (feature, layer) {
    layer.bindPopup('<h3>'+feature.properties.ZCTA+'</h3><p>Population: '+feature.properties.POPCOUNT+'</p>')
  }
  ,

}).addTo(map);
});






/*
/* display basemap tiles -- see others at https://leaflet-extras.github.io/leaflet-providers/preview/ */
//var popupTemplate = '<h1>{zipcode}</h3> <br>Cases: {Cases}</br><br>Population: {Population}</br>';
/* Display a point marker with pop-up text */
//L.marker([37.35105530964274, -121.95716857910155]).addTo(map).bindPopup('text here'); // EDIT pop-up text messag
/*
zipcode.bindPopup(function (x) {
  return L.Util.template(popupTemplate, x.feature.properties);
});

zipcode.on('click', function (e) {
  map.fitbound(e.getBounds());
});

zipcode.on('mouseover', function (e) {
  document.getElementById('info-pane').innerHTML = e.layer.feature.properties.zipcode;
  var layer = e.target;
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
