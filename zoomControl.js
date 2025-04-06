// Zoom-based layer control: dynamically show layers based on zoom level
window.map.on('zoomend', function () {
  const currentZoom = window.map.getZoom();

  if (currentZoom > 12) {
    // Zoomed in — show building layers
    let layerToAdd = null;
    let urlToLoad = null;

    if (window.currentScenario === 1) {
      layerToAdd = scenario1Layer;
      urlToLoad = scenario1Url;
    } else if (window.currentScenario === 2) {
      layerToAdd = scenario2Layer;
      urlToLoad = scenario2Url;
    } else if (window.currentScenario === 3) {
      layerToAdd = scenario3Layer;
      urlToLoad = scenario3Url;
    }

    if (layerToAdd && !window.map.hasLayer(layerToAdd)) {
      loadScenarioLayer(urlToLoad, layerToAdd).then(() => {
        layerToAdd.addTo(window.map);
        if (window.buildingsData) {
          updateLegends(window.buildingsData, window.currentScenario, 'buildings');
        }
      });
    }

    // Remove district and grid layers if they are present
    if (window.districtsLayer && window.map.hasLayer(window.districtsLayer)) {
      window.map.removeLayer(window.districtsLayer);
    }
    if (window.gridLayer && window.map.hasLayer(window.gridLayer)) {
      window.map.removeLayer(window.gridLayer);
    }

  } else {
    // Zoomed out — show grid or districts
    const showGrid = currentZoom > 10;

    // Show grid layer if zoomed out enough
    if (showGrid) {
      if (window.gridLayer && !window.map.hasLayer(window.gridLayer)) {
        window.gridLayer.addTo(window.map);
        if (window.gridData) {
          updateLegends(window.gridData, window.currentScenario, 'grid');
        }
      }
      if (window.districtsLayer && window.map.hasLayer(window.districtsLayer)) {
        window.map.removeLayer(window.districtsLayer);
      }
    } else {
      if (window.districtsLayer && !window.map.hasLayer(window.districtsLayer)) {
        window.districtsLayer.addTo(window.map);
        if (window.districtsData) {
          updateLegends(window.districtsData, window.currentScenario, 'districts');
        }
      }
      if (window.gridLayer && window.map.hasLayer(window.gridLayer)) {
        window.map.removeLayer(window.gridLayer);
      }
    }

    // Remove all building layers safely when zoomed out
    [scenario1Layer, scenario2Layer, scenario3Layer].forEach(layer => {
      if (layer && window.map.hasLayer(layer)) {
        window.map.removeLayer(layer);
      }
    });
  }
});
