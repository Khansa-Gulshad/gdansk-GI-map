// mapInitialization.js
document.addEventListener('DOMContentLoaded', function() {
  // Initialize map first
  window.map = L.map('map', {
    preferCanvas: true // Better for large datasets
  }).setView([54.352, 18.6466], 13);

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

  // Add controls ONLY after map is ready
  setTimeout(() => {
    // Scale control
    L.control.scale({
      imperial: false,
      metric: true,
      position: 'bottomright'
    }).addTo(window.map);

    // Scenario controls
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
  }, 50); // Short delay to ensure map initialization

  // Info panel handling
  const closeBtn = document.getElementById('close-btn');
  const infoPanel = document.getElementById('info-panel');
  
  closeBtn.addEventListener('click', function() {
    infoPanel.classList.add('hidden');
    setTimeout(() => window.map.invalidateSize(), 300);
  });

  // Initial resize
  setTimeout(() => window.map.invalidateSize(), 500);
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
