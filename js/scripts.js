mapboxgl.accessToken = 'pk.eyJ1IjoibWFyemlwYW45NCIsImEiOiJjanVrOTdwaDQxdG42NDRwNGFmbzY5dWdtIn0.4lVQxPc89QYzHas2IIWmew';

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
//slider.oninput = function() {
//output.innerHTML = this.value;
//};

var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [-81.7, 27.99],
  zoom: 6,
});

map.on('load', function() {

  map.addSource('guns_by_zip', {
    type: 'geojson',
    data: './data/simple_guns.geojson',
  });


  map.addSource('mass_shootings', {
    type: 'geojson',
    data: './data/mass_shootings.geojson',
  });

  map.addLayer({
    id: 'guns_by_zip',
    type: 'fill',
    source: 'guns',
    paint: {
      'fill-color': {
        property: 'n_killed',
        stops: [
          [0, '#f7cdcd'],
          [5, '#ee9f9f'],
          [10, '#ea8888'],
          [20, '#e15e5e'],
          [30, '#dd4a4a'],
          [40, '#cc0000'],
        ]
      }
    }
  });
});



map.on('click', 'guns_by_zip', function(e) {
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(e.features[0].properties.n_killed_t)
    .addTo(map);
});

// Change the cursor to a pointer when the mouse is over the guns_ layer.
map.on('mouseenter', 'guns_by_zip', function() {
  map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'guns_by_zip', function() {
  map.getCanvas().style.cursor = 'pointer';
});

new mapboxgl.Marker({
    color: 'blue',
  })
  .setLngLat([mass_shootings.longitude, mass_shootings.latitude])
  .setPopup(new mapboxgl.Popup({
      offset: 10
    })
    .setText(`${mass_shootings.address} year ${mass_shootings.year}`))
  .addTo(map);

  });
});
