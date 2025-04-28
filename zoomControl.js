// Listen for zoom events to dynamically show or hide layers
window.map.on('zoomend', function () {
  const currentZoom = window.map.getZoom();

  // Show building layers when zoomed in beyond level 12
  if (currentZoom > 12) {
    // Show buildings based on scenario
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

    // Add building layer if not already added
    if (layerToAdd && !window.map.hasLayer(layerToAdd)) {
      loadScenarioLayer(urlToLoad, layerToAdd).then(() => {
        layerToAdd.addTo(window.map);
        if (window.buildingsData) {
          updateLegends(window.buildingsData, window.currentScenario, 'buildings');
        }
      });
    }

    // Remove grid and district layers
    if (window.gridLayer && window.map.hasLayer(window.gridLayer)) {
      window.map.removeLayer(window.gridLayer);
    }
    if (window.districtsLayer && window.map.hasLayer(window.districtsLayer)) {
      window.map.removeLayer(window.districtsLayer);
    }

  } else if (currentZoom > 10) {
    // Show grid layers when zoomed in beyond level 10 but before level 12
    if (window.gridLayer && !window.map.hasLayer(window.gridLayer)) {
      window.gridLayer.addTo(window.map);
      if (window.gridData) {
        updateLegends(window.gridData, window.currentScenario, 'grid');
      }
    }

    // Remove district layer if it's visible
    if (window.districtsLayer && window.map.hasLayer(window.districtsLayer)) {
      window.map.removeLayer(window.districtsLayer);
    }

    // Remove building layers if they exist
    [scenario1Layer, scenario2Layer, scenario3Layer].forEach(layer => {
      if (layer && window.map.hasLayer(layer)) {
        window.map.removeLayer(layer);
      }
    });

  } else {
    // Show district layers when zoomed out beyond level 10
    if (window.districtsLayer && !window.map.hasLayer(window.districtsLayer)) {
      window.districtsLayer.addTo(window.map);
      if (window.districtsData) {
        updateLegends(window.districtsData, window.currentScenario, 'districts');
      }
    }

    // Remove grid and building layers
    if (window.gridLayer && window.map.hasLayer(window.gridLayer)) {
      window.map.removeLayer(window.gridLayer);
    }
    [scenario1Layer, scenario2Layer, scenario3Layer].forEach(layer => {
      if (layer && window.map.hasLayer(layer)) {
        window.map.removeLayer(layer);
      }
    });
  }
});
