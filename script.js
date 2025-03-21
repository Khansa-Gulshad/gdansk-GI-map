let map = L.map('map').setView([54.3520, 18.6466], 13); // Gdańsk coordinates
let geojsonLayer;

// Use Mapbox dark theme base layer
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

// Color scale based on Greening Potential Score
function getColor(score) {
    return score > 0.8 ? '#d73027' :  // Red
           score > 0.6 ? '#fc8d59' :  // Orange
           score > 0.4 ? '#fee08b' :  // Yellow
           score > 0.2 ? '#d9ef8b' :  // Light Green
                         '#1a9850';    // Dark Green
}

// Load and filter data
function loadData() {
    let scenario = document.getElementById('scenarioSelect').value;
    
    // Map the selected scenario to the correct GeoJSON file
    let filePath = `${scenario}`;

    fetch(filePath)
        .then(res => res.json())
        .then(data => {
            if (geojsonLayer) map.removeLayer(geojsonLayer);

            let maxSlope = parseFloat(document.getElementById('slopeRange').value);
            let maxHeight = parseFloat(document.getElementById('heightRange').value);
            let maxArea = parseFloat(document.getElementById('areaRange').value);
            let maxShape = parseFloat(document.getElementById('shapeRange').value);

            geojsonLayer = L.geoJSON(data, {
                filter: feature =>
                    feature.properties.Slope <= maxSlope &&
                    feature.properties.Height <= maxHeight &&
                    feature.properties.Area1 <= maxArea &&  // 'area1' from your code
                    feature.properties.shape_ratio <= maxShape, // 'shape_ratio' from your code

                style: feature => ({
                    color: getColor(feature.properties.GPS_roof), // 'GPS_roof' from your code
                    weight: 2, fillOpacity: 0.7
                }),

                onEachFeature: (feature, layer) => {
                    layer.bindPopup(`
                        <strong>Greening Potential Score:</strong> ${feature.properties.GPS_roof}<br> 
                        <strong>Height:</strong> ${feature.properties.Height} m<br> 
                        <strong>Slope:</strong> ${feature.properties.Slope}°<br> 
                        <strong>Area:</strong> ${feature.properties.Area1} m²<br> 
                        <strong>Shape Ratio:</strong> ${feature.properties.shape_ratio}
                    `);
                }
            }).addTo(map);
        });
}

// Event listeners for controls
document.querySelectorAll('#controls input, #scenarioSelect').forEach(input => {
    input.addEventListener('input', () => {
        document.getElementById(`${input.id.replace('Range', '')}Val`).innerText = 
            `0-${input.value}`;
        loadData();
    });
});

// Initial load of map data
loadData();

// Add interactive legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let scores = [0, 0.2, 0.4, 0.6, 0.8];
    let labels = [];

    for (let i = 0; i < scores.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(scores[i] + 1) + '"></i> ' +
            scores[i] + (scores[i + 1] ? '&ndash;' + scores[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
