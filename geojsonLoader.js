// GeoJSON URLs
const districtsUrl = 'combined_gdansk_districts_roof.geojson'; // Replace with your districts GeoJSON URL
const scenario1Url = 'filtered_buildings_scenario1.geojson';
const scenario2Url = 'filtered_buildings_scenario2.geojson';
const scenario3Url = 'filtered_buildings_scenario3.geojson';

// Create Layer Group for Districts and Buildings
const districtsLayer = L.layerGroup();
let scenario1Layer = L.layerGroup();
let scenario2Layer = L.layerGroup();
let scenario3Layer = L.layerGroup();

// Load Districts GeoJSON layer
fetch(districtsUrl)
  .then(response => response.json())
  .then(data => {
    updateColorScale(data); // Update color scale with loaded data
    L.geoJSON(data, {
      style: styleDistricts, // Apply updated style
      onEachFeature: onEachDistrictFeature
    }).addTo(districtsLayer);
    updateLegends(data); // Update the legends based on the data
  })
  .catch(err => console.error('Error loading Districts GeoJSON:', err));

// Add Districts Layer to the map by default
districtsLayer.addTo(map);

// Load Building Scenario Layers (will be added on zoom in)
function loadScenarioLayer(url, layerGroup) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateColorScale(data); // Update color scale with loaded building data
      L.geoJSON(data, {
        style: styleBuildings, // Apply updated style
        onEachFeature: onEachBuildingFeature
      }).addTo(layerGroup);
      updateLegends(data); // Update the legends based on the data
    })
    .catch(err => console.error(`Error loading GeoJSON for scenario: ${url}`, err));
}

// Helper function to calculate the min and max scores for a layer
function calculateMinMax(data) {
  const allScores = data.features.map(f => parseFloat(f.properties.GPS_roof)); // Assuming 'GPS_roof' is the relevant property
  const currentMin = Math.min(...allScores);
  const currentMax = Math.max(...allScores);
  return { currentMin, currentMax };
}

// Update the color scale and legends dynamically
function updateLegends(data) {
  const { currentMin, currentMax } = calculateMinMax(data);

  // Remove existing legends before adding new ones
  if (map.hasControl(districtLegend)) {
    map.removeControl(districtLegend);
  }
  if (map.hasControl(buildingLegend)) {
    map.removeControl(buildingLegend);
  }

  // Update the district legend
  districtLegend = L.control({ position: 'bottomleft' });
  districtLegend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const steps = 5;
    const stepSize = (currentMax - currentMin) / steps;

    div.innerHTML += '<b>Greening Score (Districts)</b><br>';
    for (let i = 0; i < steps; i++) {
      const from = (currentMin + i * stepSize).toFixed(2);
      const to = (currentMin + (i + 1) * stepSize).toFixed(2);
      const color = getColor((+from + +to) / 2);
      div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}<br>`;
    }
    return div;
  };

  // Add district legend to the map
  districtLegend.addTo(map);

  // Update the building legend similarly
  buildingLegend = L.control({ position: 'bottomleft' });
  buildingLegend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    const steps = 5;
    const stepSize = (currentMax - currentMin) / steps;

    div.innerHTML += '<b>Greening Score (Buildings)</b><br>';
    for (let i = 0; i < steps; i++) {
      const from = (currentMin + i * stepSize).toFixed(2);
      const to = (currentMin + (i + 1) * stepSize).toFixed(2);
      const color = getColor((+from + +to) / 2);
      div.innerHTML += `<i style="background:${color}"></i> ${from} – ${to}<br>`;
    }
    return div;
  };

  // Add building legend to the map
  buildingLegend.addTo(map);
}
