
 function getcolor(x) {
   //returns symbology by color breaks
   var breaks = [-Infinity , 10,50,300,500,800,1000, Infinity];
   var color = ['#ffffcc','#ffffb2','#fed976','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];
   for (var y = 0; y< breaks.length; y++){
     if(x > breaks[y] && x<= breaks[y+1])
      return color[y];
     }
    return '#606160';

   }

function style(c) {
  return {
    fillColor: getcolor(c),
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: .45
  };
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
var city_table=[];
var table2 = new Map(); //for storing the covid zipcode and center coordinates
var city_coords = new Map(); //for storing the covid city and center coordinates
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
  });

//city shapefile
var city = $.ajax({
  url:"https://opendata.arcgis.com/datasets/b1fa77f6e79f4ccbbc34e737e1bc113d_2.geojson",
  dataType: "json",
  success: console.log("data successfully loaded."),
      error: function(xhr) {
      alert(xhr.statusText)
    }
  });


//gets covid table
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

//gets covid by city
$.getJSON('https://data.sccgov.org/resource/59wk-iusg.json',function(result){
 for(key in result) {
  if (result.hasOwnProperty(key)) {
      city_table.push({key:result[key], value:result[key]["city"]});
      }
  }
});


$.when(zip,city).done(()=> {
  // var expression = ['match', ['get', 'STATE_ID']]; // for color input
  map = L.map('map', {
    center: [37.35105530964274, -121.95716857910155], // EDIT latitude, longitude to re-center map
    zoom: 12,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    scrollWheelZoom: true });


  var cityshape= new L.geoJSON(city.responseJSON,{
        onEachFeature: (feature, layer)=> {
          city_table.forEach((row)=> {
            if (feature.properties.NAME == row['key']['city']){
              cases = row['key']['cases'];
              pop = row['key']['population']
              }
              var coords = layer.getBounds().getCenter().toString(); // center for each geoJson feature
              city_coords.set(feature.properties.ZCTA,coords);//another dictionary for storing key: zipcode value: coordinates
          });
          layer.bindPopup('<h3>'+feature.properties.NAME+'</h3>');
          layer.addEventListener(('click'),(d) => {
            map.panTo(d.target.getBounds().getCenter());
          });
          /*layer.addEventListener('click',(d)=>{
           setTimeout(()=>{
            layer.setStyle({
              color: "#fdff00",
              weight: 5,
              fillOpacity: .5
            },200);});
            map.panTo(d.target.getBounds().getCenter());
          });
          layer.on('popupclose',()=>{
            layer.resetstyle();
          });*/
        }
      });

  //zipcode layer + covid table data
  var zipshape = new L.geoJSON(zip.responseJSON,{
    //style: style(cases),
    onEachFeature: (feature, layer)=> {
    var cases; //place holder for cases from covid table
    var pop; //place holder for population from covid table
    //loaded the json table into separate dictioanry -> temp variables
    // for data where the the ZCTA(geoJson) = zipcode (json table) display
      table.forEach((row)=> {
        if (feature.properties.ZCTA == row['key']['zipcode']){
          cases = row['key']['cases'];
          pop = row['key']['population']
          }
          var coords = layer.getBounds().getCenter().toString(); // center for each geoJson feature
          table2.set(feature.properties.ZCTA,coords);//another dictionary for storing key: zipcode value: coordinates
      });

    //var dis = table2.get(feature.properties.ZCTA); // this is to get the coordinates value by ZCTA as key
      layer.bindPopup('<h3>'+feature.properties.ZCTA+'</h3>'+'<p>'+'Population: '+pop+'<br>'+'Cases: '+cases+'</p>');
    //set hover color
      layer.setStyle(style(cases));
    //layer.addEventListener('mouseover', highlightfeature);
    //reset the style hover feature
    //layer.addEventListener('mouseout', function(){layer.setStyle(style(cases))});

    //center to the clicked feature
      layer.addEventListener('click',(d)=>{
       setTimeout(()=>{
        layer.setStyle({
          color: "#fdff00",
          weight: 5,
          fillOpacity: .5
        },200);});
        map.panTo(d.target.getBounds().getCenter());
      });
      layer.on('popupclose',()=>{
        layer.setStyle(style(cases));
      });
    /*,
    onclicked:(feature,layer)=>{
    setTimeout(()=>{
      zipshape.setStyle({
        color: "#41E500",
        weight: 10
        },200);
      });*/
    }
  });

  /* Carto light-gray basemap tiles with labels */
  var light = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
  }).addTo(map);
  var terrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  });
  let based= {
      "Light": light,
      "Terrain": terrain
      //define feature layers
  };
  let layers={
    "By Zipcode": zipshape.addTo(map),
    "By City": cityshape
  };
  //controller for layers
  //define based map
  var controlLayers = L.control.layers(based,layers, {position:'topleft', collapsed:false}).addTo(map);
  //creates dom object legend to be defined by css
  let ziplegend =L.control({position: "bottomright"});
    ziplegend.onAdd = function(){
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
         '<i style="background-color: #ffffec"></i>0 - 10<br>';
     return div;
   }
   ziplegend.addTo(map);
   map.on('overlayadd',function(lyr){
     if(lyr.name === 'By Zipcode'){
       //remove other legend if applicable
       ziplegend.addTo(this);
     }
   });
   map.on('overlayremove',function(lyr){
     if(lyr.name === 'By Zipcode'){
       //remove other legend if applicable
       ziplegend.remove(this);}
   });

});
