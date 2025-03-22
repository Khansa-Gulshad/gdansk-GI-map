// Initialize the map
var map = L.map('map').setView([54.3520, 18.6466], 12); // Center on Gdańsk

// Add Mapbox black theme as the base layer
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw', {
    attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

// Function to get color based on suitable_area_percentage_1
function getColor(percentage) {
    return percentage > 15 ? '#00441b' :
           percentage > 10 ? '#238b45' :
           percentage > 5 ? '#41ab5d' :
           percentage > 0 ? '#74c476' :
                             '#d9f0a3';
}

// Load districts GeoJSON data
fetch('https://raw.githubusercontent.com/Khansa-Gulshad/gdansk-green-roofs/main/combined_gdansk_districts_roof.geojson')
    .then(response => response.json())
    .then(data => {
        // Add districts layer to the map
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    fillColor: getColor(feature.properties.suitable_area_percentage_1),
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function(feature, layer) {
                // Add popup with district name and suitable area percentage
                layer.bindPopup(`
                    <b>District:</b> ${feature.properties.District}<br>
                    <b>Suitable Area (%):</b> ${feature.properties.suitable_area_percentage_1}%
                `);
            }
        }).addTo(map);
    });

// Add a legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
        <h4>Suitable Area (%)</h4>
        <div><span style="background:#00441b"></span> > 15%</div>
        <div><span style="background:#238b45"></span> 10-15%</div>
        <div><span style="background:#41ab5d"></span> 5-10%</div>
        <div><span style="background:#74c476"></span> 2-5%</div>
        <div><span style="background:#d9f0a3"></span> < 2%</div>
    `;
    return div;
};

legend.addTo(map);


