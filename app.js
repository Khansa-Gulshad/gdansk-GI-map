mapboxgl.accessToken = 'pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [18.6466, 54.352], // Gdańsk
  zoom: 12
});

map.on('load', () => {
  let currentLayerId = null;

  const loadScenario = (url) => {
    // Remove old source/layers
    if (map.getLayer('buildings-layer')) map.removeLayer('buildings-layer');
    if (map.getLayer('borders')) map.removeLayer('borders');
    if (map.getSource('buildings')) map.removeSource('buildings');

    map.addSource('buildings', {
      type: 'geojson',
      data: url
    });

    map.addLayer({
      id: 'buildings-layer',
      type: 'fill',
      source: 'buildings',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'GPS_roof'],
          0, '#d7191c',
          0.2, '#fdae61',
          0.4, '#ffffbf',
          0.6, '#a6d96a',
          0.8, '#1a9641'
        ],
        'fill-opacity': 0.8
      }
    });

    map.addLayer({
      id: 'borders',
      type: 'line',
      source: 'buildings',
      paint: {
        'line-color': '#111',
        'line-width': 0.5
      }
    });
  };

  // Load initial scenario
  loadScenario('filtered_buildings_scenario1.geojson');

  // Add dropdown
  const select = document.createElement('select');
  select.style.position = 'absolute';
  select.style.top = '10px';
  select.style.right = '10px';
  select.style.zIndex = 1;

  const scenarios = {
    'Scenario 1: All Buildings': 'filtered_buildings_scenario1.geojson',
    'Scenario 2: Slope Categorized': 'filtered_buildings_scenario2.geojson',
    'Scenario 3: Excluding Industrial': 'filtered_buildings_scenario3.geojson'
  };

  for (let label in scenarios) {
    const option = document.createElement('option');
    option.value = scenarios[label];
    option.text = label;
    select.appendChild(option);
  }

  select.onchange = () => {
    loadScenario(select.value);
  };

  document.body.appendChild(select);
});
