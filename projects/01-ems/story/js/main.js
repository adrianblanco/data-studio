/** map tile **/
/** https://stackoverflow.com/questions/37166172/mapbox-tiles-and-leafletjs **/

////////////////////// Leaflet Map Projection

var map = L.map('map', {zoomControl: false}).setView([40.838389, -73.940975], 14.5);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVmZmV2ZXJoYXJ0MzgzIiwiYSI6IjIwNzVlOTA3ODI2MTY0MjM3OTgxMTJlODgzNjg5MzM4In0.QA1GsfWZccIB8u0FbhJmRg', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  opacity: 0.7,
  accessToken: 'pk.eyJ1IjoiamVmZmV2ZXJoYXJ0MzgzIiwiYSI6ImNqOXI2aDg5ejZhYncyd3M0bHd6cWYxc2oifQ.fzcb7maGkQhAxRZTotB4tg'
  }).addTo(map);

function fadeMap(){
  $(".leaflet-tile-pane").css("opacity",.1);
}

////////////////////// The journey begins here!
////////// Location, title and id of each step

var warblerWaypoints = [{
  title: "First",
  id: 1,
  location: {
    lat: 40.838389,
    lng: -73.940975
  }
},
  {
  title: "Second",
  id: 2,
  location: {
    lat: 40.816682,
    lng: -73.956529
  }
},
  {
  title: "Third",
  id: 3,
  location: {
    lat: 40.779224,
    lng: -73.9769575,
  }
},
  {
  title: "Fourth",
  id: 4,
  location:  {
    lat: 40.763841,
    lng: -73.929133
  }
},
]

////////// Disable zoom, fixes the map

map.scrollWheelZoom.disable()

//////////

warblerWaypoints.forEach(waypoint => {
  //let marker = L.marker([waypoint.location.lat, waypoint.location.lng ]).addTo(mymap)
})

//////////

let latlngs = warblerWaypoints.map(waypoint => [waypoint.location.lat, waypoint.location.lng]);

/** var polyline = L.polyline(latlngs, {smoothFactor: 10, color: 'orange', weight: 120, opacity: .5}).addTo(mymap);
var polyline = L.polyline(latlngs, {color: 'red', dashArray: '12 12',}).addTo(mymap); **/

// instantiate the scrollama
const scroller = scrollama();
// setup the instance, pass callback functions
scroller
  .setup({
  step: '.step' // required - class name of trigger steps
  })
  .onStepEnter(handleStepEnter)
  .onStepExit(handleStepExit);

function handleFlyTo(value){
  map.panTo(warblerWaypoints[value - 1].location, {animate:true, duration: 2})
}



function handleStepEnter(e){
  console.log('enter')
  let value = e.element.attributes['data-step'].value
  handleFlyTo(value)
}

function handleStepExit(e){
    console.log('exit')
    console.log(e)
}


////////////////////// zipcodes map

// https://stackoverflow.com/questions/35420915/topojson-in-leaflet-via-omnivore-reading-properties

////////// color palette

function styleBuilder (d) {
  console.log(d)
  return d < 8.5 ? 'red' :
         d > 10.5 ? 'black' :
         d > 10.5 ? 'black' :
         d > 10.5 ? 'black' :
         d > 9.5 ? 'yellow' : 'blue';
}

function getStyle (feature) {
  return {
    color: styleBuilder(feature.properties.respir_incident_response_min_qy)
  };
}

/////////// infowindow

function neighborhoodPopup (layer) {
  return 'quartier ' + layer.feature.properties.STATE
}

// This is where we design our neighborhoods
// layer. Usually you do L.geoJSON(data), but
// because we're using an external file we don't
// get to do that. This just designs the style
// and the tooltip/popups, we hook in the data
// later using omnivore (see below)


// different getStyles
// load a different one when you click
//

var customLayer = L.geoJSON(null, {
// http://leafletjs.com/reference.html#geojson-style
  'style': getStyle
}).bindTooltip(neighborhoodPopup)

// This is where we create a layer using topojson!
// If we didn't want to customize the color or have a
// tooltip/popup or anything, we could just use
//   omnivore.topojson('ny_final.json').addTo(map)
// but because we have opinions, we're going to use
// customLayer (see above) where we designed it
//omnivore.topojson('../data/zipcodes_respir.geojson', null, customLayer).addTo(map);


// EPSG:4326 problem with NY state projection, map shaper, leaflet did not recognize it
var dt = omnivore.topojson('https://github.com/adrianblanco/data-studio/blob/master/projects/01-ems/story/data/zipcodes_2.json', null, customLayer).addTo(map);
console.log(dt)
//var dt = omnivore.topojson('../data/zipcodes_2.json').addTo(map);

//function popupContent(layer) {
//  console.log(layer)
//   console.log(feature)
//   console.log(properties)
//
//  return layer.feature.properties.respir_incident_response_min_qy
//}
