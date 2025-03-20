let map = L.map('map').setView([54.3520, 18.6466], 13); // Gdańsk coordinates
let geojsonLayer;

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Color scale based on Greening Potential
function getColor(score) {
    return score > 80 ? '#006837' :
           score > 60 ? '#31a354' :
           score > 40 ? '#78c679' :
           score > 20 ? '#c2e699' :
                        '#ffffcc';
}

// Load and filter data
function loadData() {
    let scenario = document.getElementById('scenarioSelect').value;
    fetch(`data/${scenario}`)
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
                    feature.properties.Area1 <= maxArea &&
                    feature.properties.shape_ratio <= maxShape,

                style: feature => ({
                    color: getColor(feature.properties.GPS_roof), // GPS score used for color
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
    let scores = [0, 20, 40, 60, 80];
    let labels = [];

    for (let i = 0; i < scores.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(scores[i] + 1) + '"></i> ' +
            scores[i] + (scores[i + 1] ? '&ndash;' + scores[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
