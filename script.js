// Initialize the map
const map = L.map('map').setView([54.352, 18.646], 12); // Centering on Gdańsk

// Add base tile layer (Mapbox)
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw'
}).addTo(map);

// Placeholder variables for layers
let districtLayer, gridLayer, geojsonLayer;

// Define your GeoJSON data for districts, grids, buildings (adjust file paths)
const gdanskBoundaryGeoJSON = 'path_to_your_gdansk_boundary.geojson'; // Replace with actual file
const districtsGeoJSON = 'path_to_your_districts.geojson'; // Replace with actual file
const gridGeoJSON = 'path_to_your_grid.geojson'; // Replace with actual file

// Style function to apply color gradients based on green roof score
function getColor(score) {
    return score > 0.75 ? 'green' :
           score > 0.5  ? 'yellow' :
           score > 0.25 ? 'orange' :
                          'red';
}

// District Layer Styling
function styleDistricts(feature) {
    const score = feature.properties.green_roof_score; // Replace with actual property name
    return {
        fillColor: getColor(score),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

// Grid Layer Styling
function styleGrids(feature) {
    const score = feature.properties.green_roof_score; // Replace with actual property name
    return {
        fillColor: getColor(score),
        weight: 1,
        opacity: 0.7,
        color: 'black',
        fillOpacity: 0.6
    };
}

// Building Layer Styling (Scenario-based)
function styleBuildings(feature, scenario) {
    let score = 0;
    if (scenario === 1) {
        score = feature.properties.slope_height_area_ratio; // Example for scenario 1
    } else if (scenario === 2) {
        score = feature.properties.slope_category_score; // Example for scenario 2
    } else if (scenario === 3) {
        score = feature.properties.slope_height_area_no_industrial; // Example for scenario 3
    }

    return {
        fillColor: getColor(score),
        weight: 1,
        opacity: 0.8,
        color: 'black',
        fillOpacity: 0.6
    };
}

// Add District Layer
districtLayer = L.geoJSON(districtsGeoJSON, { style: styleDistricts }).addTo(map);

// Add Grid Layer
gridLayer = L.geoJSON(gridGeoJSON, { style: styleGrids }).addTo(map);

// Fetch and Filter GeoJSON based on selected scenario and control parameters
function fetchAndUpdateMap(filePath) {
    fetch(filePath)
        .then(res => res.json())
        .then(data => {
            if (geojsonLayer) {
                map.removeLayer(geojsonLayer);
            }

            let maxSlope = parseFloat(document.getElementById('slopeRange').value);
            let maxHeight = parseFloat(document.getElementById('heightRange').value);
            let maxArea = parseFloat(document.getElementById('areaRange').value);
            let maxShape = parseFloat(document.getElementById('shapeRange').value);

            geojsonLayer = L.geoJSON(data, {
                filter: feature => {
                    return feature.properties.Slope <= maxSlope &&
                        feature.properties.Height <= maxHeight &&
                        feature.properties.Area1 <= maxArea && 
                        feature.properties.shape_ratio <= maxShape;
                },
                style: feature => styleBuildings(feature, 1), // Default to scenario 1
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
        })
        .catch(error => console.error("Error fetching data: ", error));
}

// Initialize with the default scenario
fetchAndUpdateMap('filtered_buildings_scenario1.geojson');

// Scenario Change (dropdown)
document.getElementById('scenarioSelect').addEventListener('change', function() {
    const selectedScenario = this.value;
    fetchAndUpdateMap(selectedScenario);
});

// Controls for Slope, Height, Area, Shape Ratio
['slopeRange', 'heightRange', 'areaRange', 'shapeRange'].forEach(control => {
    document.getElementById(control).addEventListener('input', function() {
        document.getElementById(`${control}Val`).textContent = `${this.value}`;
        const selectedScenario = document.getElementById('scenarioSelect').value;
        fetchAndUpdateMap(selectedScenario);
    });
});


