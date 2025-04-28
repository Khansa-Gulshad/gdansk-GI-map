// mapInitialization.js

window.map = L.map('map').setView([54.352, 18.6466], 10);

// Rest of your map initialization code...
const mapboxLayer = L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw',
  {
    tileSize: 512,
    zoomOffset: -1,
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
  }
);
mapboxLayer.addTo(window.map);

  // Handle info panel close button
const closeBtn = document.getElementById('close-btn');
const infoPanel = document.getElementById('info-panel');
  
closeBtn.addEventListener('click', function() {
  infoPanel.classList.add('hidden');
  
  // Trigger map resize and set a zoom level after closing info panel
  setTimeout(function() {
    // Re-center map to Gdańsk with a zoom level that shows the whole city
    window.map.setView([54.352, 18.6466], 10); // Adjust this zoom level as needed
    window.map.invalidateSize();
  }, 100); // Adjust the delay if needed
});
  
  // Initial map resize
  setTimeout(function() {
    window.map.invalidateSize();
  }, 100);



// Add scale control with custom options (Only once, removed duplicate)
L.control.scale({
  imperial: false,  // Disable feet
  metric: true,     // Use metric system (kilometers, meters)
  position: 'bottomright' // Change position to bottom-right
}).addTo(map);

// Add scenario control buttons to switch between scenarios
const scenarioControl = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.innerHTML = 
      container.innerHTML = `
      <button class="scenario-btn" id="scenario1-btn">Scenario 1</button>
      <button class="scenario-btn" id="scenario2-btn">Scenario 2</button>
      <button class="scenario-btn" id="scenario3-btn">Scenario 3</button>
      `;
    return container;
  }
});
map.addControl(new scenarioControl());
