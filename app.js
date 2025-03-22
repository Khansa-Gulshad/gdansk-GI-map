mapboxgl.accessToken = 'pk.eyJ1Ijoia2hhbnNhZ3VsIiwiYSI6ImNtOGhqcWdqMDAyb2kybHI1Mnl2MHhwYjgifQ.9Je73sehr801s1_IynnRgw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [18.6466, 54.352], // Gdańsk
  zoom: 12
});

map.on('load', () => {
  map.addSource('buildings', {
    type: 'geojson',
    data: 'filtered_buildings_scenario1.geojson'
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

  map.on('click', 'buildings-layer', (e) => {
    const props = e.features[0].properties;
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<b>ID:</b> ${props.id}<br><b>GPS:</b> ${props.GPS_roof}`)
      .addTo(map);
  });

  map.on('mouseenter', 'buildings-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'buildings-layer', () => {
    map.getCanvas().style.cursor = '';
  });
});
