


mapboxgl.accessToken = 'pk.eyJ1IjoibWFyemlwYW45NCIsImEiOiJjanVrOTdwaDQxdG42NDRwNGFmbzY5dWdtIn0.4lVQxPc89QYzHas2IIWmew';

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
};

var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [-73.985130, 40.758896],
  zoom: 6.5
});

map.addSource('guns_by_zip', {
  type: 'geojson',
  data: './data/cl.geojson',
});


map.addSource('mass_shootings', {
  type: 'geojson',
  data: './data/mass_shootings.geojson',
});

map.on('load', function(){

  new mapboxgl.Marker({
    color: 'blue',
  })
    .setLngLat([mass_shootings.longitude, mass_shootings.latitude])
    .setPopup(new mapboxgl.Popup({ offset: 10 })
    .setText(`In ${mass_shootings.address} year ${mass_shootings.year}`))
    .addTo(map);
  });


      map.addLayer({
        id: 'guns_',
        type: 'fill',
        source: 'guns_by_zip',
        paint: {
          'fill-color': [
            // use a curve (http://bl.ocks.org/anandthakker/raw/6d0269825a7e0381cdcde13f84a0b6b0/#types-expression-curve)
            // of type "step," which will step through each break instead of interpolating between them.
            // Then, get the density value and use a `number` expression to return it as a number instead of a string.
            // Each step is then a pair [{color code}, {max value for break}]
            // Finally, add a default color code for any features that fall outside of the steps you've defined.
            "curve",
              ["step"], ["number", ["get", "n_killed_t"], 1], "#FFEDA0", 10, "#FED976", 20, "#FEB24C", 50, "#FD8D3C", 100, "#FC4E2A", 200, "#E31A1C", 500, "#BD0026", 2000, "#000000"
          ],
          'fill-opacity': 0.6
        },
        layout: {}
  
      });
