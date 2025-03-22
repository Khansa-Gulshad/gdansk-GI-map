// map.js

// Initialize the map
const map = L.map('map'); // Don’t set view yet — we’ll fit it dynamically

// Add OSM base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Define the URLs for the GeoJSON files
//  Correct repo URL
var scenario1Url = 'filtered_buildings_scenario1.geojson';
var scenario2Url = 'filtered_buildings_scenario2.geojson';
var scenario3Url = 'filtered_buildings_scenario3.geojson';

// Define a function to get color based on GPS_roof value
function getColor(d) {
    return d > 0.8 ? '#1a9641' :   // very high (dark green)
           d > 0.6 ? '#a6d96a' :   // high (light green)
           d > 0.4 ? '#ffffbf' :   // medium (yellow)
           d > 0.2 ? '#fdae61' :   // low (orange)
                      '#d7191c';   // very low (red)
}

// Define a function to style each feature
function style(feature) {
    const score = feature.properties.GPS_roof;
    console.log("GPS_roof:", score); // ← keep this for debug

    return {
        fillColor: getColor(score),
        weight: 0,
        color: 'transparent',
        fillOpacity: 0.9
    };
}
// Define a function to bind popups to each feature
function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(
            '<b>Building ID:</b> ' + feature.properties.id + '<br>' +
            '<b>Greening Potential Score:</b> ' + feature.properties.GPS_roof + '<br>' +
            '<b>Slope:</b> ' + feature.properties.Slope + '<br>' +
            '<b>Height:</b> ' + feature.properties.Height + '<br>' +
            '<b>Area:</b> ' + feature.properties.Area1 + '<br>' +
            '<b>Shape Ratio:</b> ' + feature.properties.shape_ratio + '<br>' +
            (feature.properties.slope_category ? '<b>Slope Category:</b> ' + feature.properties.slope_category + '<br>' : '') +
            (feature.properties.slope_score ? '<b>Slope Score:</b> ' + feature.properties.slope_score + '<br>' : '')
        );
    }
}

// Function to load GeoJSON data and add to the map
function loadGeoJSON(url, layerGroup) {
    console.log("Fetching:", url); // Add this log!

    fetch(url)
        .then(response => {
            console.log("Response:", response); // See if it’s OK
            return response.json();
        })
        .then(data => {
            console.log("Loaded GeoJSON:", data); //  Confirm it loaded

            const layer = L.geoJSON(data, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(layerGroup);

            map.fitBounds(layer.getBounds());
        })
        .catch(err => console.error('Error loading GeoJSON data:', err));
}

// Create layer groups for each scenario
var scenario1Layer = L.layerGroup();
var scenario2Layer = L.layerGroup();
var scenario3Layer = L.layerGroup();

// Load GeoJSON data into respective layer groups
loadGeoJSON(scenario1Url, scenario1Layer);
loadGeoJSON(scenario2Url, scenario2Layer);
loadGeoJSON(scenario3Url, scenario3Layer);

// Add scenario 1 layer to the map by default
scenario1Layer.addTo(map);

// Add layer control to switch between scenarios
var baseMaps = {
    'Scenario 1: All Buildings': scenario1Layer,
    'Scenario 2: Slope Categorized': scenario2Layer,
    'Scenario 3: Excluding Industrial': scenario3Layer
};

L.control.layers(baseMaps).addTo(map);
