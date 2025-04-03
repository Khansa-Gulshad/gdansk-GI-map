// GeoJSON URLs
const districtsUrl = 'combined_gdansk_districts_roof.geojson'; // Replace with your districts GeoJSON URL
const scenario1Url = 'filtered_buildings_scenario1.geojson';
const scenario2Url = 'filtered_buildings_scenario2.geojson';
const scenario3Url = 'filtered_buildings_scenario3.geojson';

// Create Layer Group for Districts
const districtsLayer = L.layerGroup();

// Load Districts GeoJSON layer
fetch(districtsUrl)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: styleDistricts,
      onEachFeature: onEachDistrict
    }).addTo(districtsLayer);
  })
  .catch(err => console.error('Error loading Districts GeoJSON:', err));

// Add Districts Layer to the map by default
districtsLayer.addTo(map);

// Building style
function style(feature) {
  const score = parseFloat(feature.properties.GPS_roof);
  return {
    fillColor: getColor(score),
    weight: 0,
    color: 'transparent',
    fillOpacity: 0.9
  };
}
