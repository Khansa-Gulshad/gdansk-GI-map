// mapInitialization.js
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the map
  window.map = L.map('map').setView([54.352, 18.6466], 13);
  
  // Add tile layer
  const mapboxLayer = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw',
    {
      tileSize: 512,
      zoomOffset: -1,
      attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>'
    }
  );
  mapboxLayer.addTo(window.map);

  // Add scale control
  L.control.scale({
    imperial: false,
    metric: true,
    position: 'bottomright'
  }).addTo(window.map);

  // Add scenario control buttons
  const scenarioControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.innerHTML = `
        <button class="scenario-btn" id="scenario1-btn">Scenario 1</button>
        <button class="scenario-btn" id="scenario2-btn">Scenario 2</button>
        <button class="scenario-btn" id="scenario3-btn">Scenario 3</button>
      `;
      return container;
    }
  });
  window.map.addControl(new scenarioControl());

  // Handle info panel close button
  const closeBtn = document.getElementById('close-btn');
  const infoPanel = document.getElementById('info-panel');
  
  closeBtn.addEventListener('click', function() {
    infoPanel.classList.add('hidden');
    
    // Ensure districts layer is loaded and visible
    if (window.geojsonLoader && window.geojsonLoader.loadInitialLayers) {
      window.geojsonLoader.loadInitialLayers()
        .then(() => {
          // Reset view to show districts
          window.map.setView([54.352, 18.6466], 13);
          window.map.invalidateSize();
        });
    } else {
      // Fallback if loader isn't available
      window.map.setView([54.352, 18.6466], 13);
      window.map.invalidateSize();
    }
  });
  
  // Initial map resize
  setTimeout(function() {
    window.map.invalidateSize();
  }, 300);
});

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
    container.innerHTML = `
      <button class="scenario-btn" id="scenario1-btn">Scenario 1</button>
      <button class="scenario-btn" id="scenario2-btn">Scenario 2</button>
      <button class="scenario-btn" id="scenario3-btn">Scenario 3</button>
    `;
    return container;
  }
});
map.addControl(new scenarioControl());
