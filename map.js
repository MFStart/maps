 function getcolor(x) {
    return x > 1000 ? '#b10026':
    (x > 800 && x < 1000) ? '#e31a1c':
    (x > 500 && x < 800) ?'#fc4e2a':
    (x > 300 && x < 500) ? '#fd8d3c':
    (x > 50 && x < 300) ? '#fed976':
    (x > 10 && x < 50) ? '#ffffb2':
                    '#ffffcc';
}
/* click on table zoom to map
function zoomto(zip) {
  var zipcode = zip;
  var map = document.querySelector('#map')._leaflet_map;
  alert(map.zipshape);
  //map.panTo(d.target.getBounds().getCenter());
}
*/

function style(c) {
  return {
    fillColor: getcolor(c),
    weight: 2
  };
}

let hoverstyle = {
  color: 'yellow',
  weight: 3
  };
function highlightfeature(d) {
  d.target.setStyle(hoverstyle);
  d.target.bringtoFront();
}

function callmap(d) {
    zip.eachLayer(()=> {
    //if (layer.feature.properties.ZCTA == d) {
    //map.eachLayer(function (layer){
    alert(zip)


    })
    //  map.panTo(lyr.target.getBounds().getCenter());

  //});
}




//stored stuff in json
var table = [];
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

//gets table
$.getJSON('https://data.sccgov.org/resource/j2gj-bg6c.json',function(result){
 for(key in result) {
   if (result.hasOwnProperty(key)) {
      table.push({key:result[key], value:result[key]["zipcode"]});
      }
    }
    /*
      //for pointing to the data
    for (x in table){
    document.write('\n'+table[x]['key']['zipcode']);}*/
  });



$.when(zip).done( ()=> {
  // var expression = ['match', ['get', 'STATE_ID']]; // for color input
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
  var cases;
  var zipshape = L.geoJSON(zip.responseJSON,
  {
    //style: style(cases),
    onEachFeature: function (feature, layer) {
    //cases variable into a temp variable for display
    table.forEach(function(row) {
      if (feature.properties.ZCTA == row['key']['zipcode'])
        cases = row['key']['cases'];
    });
    layer.bindPopup('<h3>'+feature.properties.ZCTA+'</h3><p>Population: '+feature.properties.POPCOUNT+'</p>'+'<p>Cases: '+cases+'</p>');
    //set hover color
    var color = getcolor(cases);
    layer.setStyle(style(cases));
  //layer.addEventListener('mouseover', highlightfeature);
  //reset the style hover feature
  //layer.addEventListener('mouseout', function(){layer.setStyle(style(cases))});
  //center to the clicked feature
  layer.addEventListener('click',function (d){
    map.panTo(d.target.getBounds().getCenter());})
  }}).addTo(map);


  //join the zipshape table with covid json as a table by zipcode
  /*zipshape.eachLayer(function (lyr) {

    //featureJoinByProperty(lyr.feature.properties,table, 'ZCATA','zipcode')

  });*/

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
