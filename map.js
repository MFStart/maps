
 function getcolor(x) {
   //returns symbology by color breaks
   var breaks = [-Infinity , 10,50,300,500,800,1000, Infinity];
   var color = ['#ffffcc','#ffffb2','#fed976','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];
   for (var y = 0; y< breaks.length; y++){
     if(x > breaks[y] && x<= breaks[y+1]){
      return color[y];
     }
   }
}



function style(c) {
  return {
    fillColor: getcolor(c),
    weight: .5,
    opacity: 1,
    fillOpacity: .6
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
  var filter = /\(([^)]+)\)/;
  var t_coords = table2.get(d); //gets the dictioanry value based on ZIPCODE
  var zoomto = filter.exec(t_coords)[1]; //fitler out the latLng substrings
  var lat = zoomto.split(',')[0]; //split into lat by comma
  var lon = zoomto.split(',')[1]; //split into lon by comma
  map.panTo(L.latLng(lat, lon));
}
    //  map.panTo(lyr.target.getBounds().getCenter());

  //});





//stored stuff in json
var table = [];
var table2 = new Map(); //for storing the covid zipcode and center coordinates
var map = null; //gloabl variable to be able to interact by panTo
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
  //for (key2 in result){
  //    if (result.hasOwnProperty(key)){table2.put(key, result[key]["zipcode"]);}
  //}
    /*
      //for pointing to the data
    for (x in table){
    document.write('\n'+table[x]['key']['zipcode']);}*/
});



$.when(zip).done(()=> {
  // var expression = ['match', ['get', 'STATE_ID']]; // for color input
  map = L.map('map', {
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
  let based= {
    "Light": light,
    "Terrain": terrain
    //define feature layers
    };
  let legend =L.control({position: "bottomright"});
  //controller for layers
  var controlLayers = L.control.layers(based).addTo(map);
  var cases;
  legend.onAdd = function(){
      let div = L.DomUtil.create("div", "legend");
      div.innerHTML =
       '<b>Covid Cases by Zipcode</b><br>' +
       '<small>Cases</small><br>' +
       '<i style="background-color: #b10026"></i>1000+<br>' +
       '<i style="background-color: #e31a1c"></i>800 - 1000<br>' +
       '<i style="background-color: #fc4e2a"></i>500 - 800<br>' +
       '<i style="background-color: #fd8d3c"></i>300 - 500<br>' +
       '<i style="background-color: #fed976"></i>50 - 300<br>' +
       '<i style="background-color: #ffffb2"></i>10 - 50<br>' +
       '<i style="background-color: #ffffcc"></i>0 - 10<br>';
   return div;
  };

  legend.addTo(map);
  var zipshape = L.geoJSON(zip.responseJSON,
  {
    //style: style(cases),
    onEachFeature: (feature, layer)=> {
    //cases variable into a temp variable for display
    table.forEach((row)=> {
      if (feature.properties.ZCTA == row['key']['zipcode'])
        cases = row['key']['cases'];
        coords = layer.getBounds().getCenter().toString();
        table2.set(feature.properties.ZCTA,coords);
        //dis = getPropertyrow['key']
      });

    //table2.forEach((feature,layer) => {
    //  if (feature.properties.ZCTA == row['key']['zipcode'])
    //    cases2 =layer.get('key');
    //})
    var dis = table2.get(feature.properties.ZCTA);
    layer.bindPopup('<h3>'+feature.properties.ZCTA+'</h3><p>Population: '+feature.properties.POPCOUNT+'</p>'+'<p>Cases: '+cases+'</p>');
    //set hover color
    var color = getcolor(cases);
    layer.setStyle(style(cases));


  //layer.addEventListener('mouseover', highlightfeature);
  //reset the style hover feature
  //layer.addEventListener('mouseout', function(){layer.setStyle(style(cases))});
  //center to the clicked feature
  layer.addEventListener('click',(d)=>{
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
      console.log(featureCollection.featur
      es[0].properties.zipcode);
    })


}
*/
