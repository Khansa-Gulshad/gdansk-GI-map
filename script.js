// 1) Initialize Leaflet map & set initial view on Gdańsk
var map = L.map('map').setView([54.347629, 18.646638], 10);

// 2) Add a Mapbox Dark base layer
//    Replace "YOUR_MAPBOX_ACCESS_TOKEN" with your actual token
var mapboxDark = L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw',
  {
    attribution: 'Map data &copy; OpenStreetMap contributors, Imagery © Mapbox',
    tileSize: 512,
    zoomOffset: -1
  }
).addTo(map);

// -------------------------------------
// (If you prefer OSM tiles as a fallback or alternative, 
//  comment out Mapbox and uncomment the next part)
//
// var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: 'Map data © OpenStreetMap contributors'
// }).addTo(map);
// -------------------------------------

// 3) Define a color scale function for suitable_area_percentage1
function getColor(value) {
  // Adjust thresholds & colors as desired
  return value >= 20 ? '#006837' :
         value >= 15  ? '#31a354' :
         value >= 10  ? '#78c679' :
         value >= 5  ? '#c2e699' :
         value >= 0  ? '#ffffcc';
}

// 4) Style function that returns Leaflet path options
function style(feature) {
  var val = feature.properties.suitable_area_percentage1;
  return {
    fillColor: getColor(val),
    fillOpacity: 0.7,
    color: '#333',    // outline color
    weight: 1,
    opacity: 1
  };
}

// 5) onEachFeature callback: bind a popup with District + suitable area
function onEachFeature(feature, layer) {
  var districtName = feature.properties.District;
  var areaValue = feature.properties.suitable_area_percentage1;
  layer.bindPopup(
    '<b>District:</b> ' + districtName + '<br>' +
    'Green Roof Potential: ' + areaValue + '%'
  );
}

// 6) Load and add your local GeoJSON (adjust path/filename if needed)
fetch('combined_gdansk_districts_roof.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  })
  .catch(err => console.error('Error loading GeoJSON:', err));

