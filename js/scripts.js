mapboxgl.accessToken = 'pk.eyJ1IjoibWFyemlwYW45NCIsImEiOiJjanVrOTdwaDQxdG42NDRwNGFmbzY5dWdtIn0.4lVQxPc89QYzHas2IIWmew';


var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [-81.7, 27.99],
  zoom: 6,
});

var years = [
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
];

function filterBy(year) {

  var filters = ['==', 'year', year];
  map.setFilter('guns_cloro', filters);
  map.setFilter('mass_shootings', filters);

  // Set the label to the month
  document.getElementById('year').textContent = years[year];
}



map.on('load', function() {

  map.addSource('guns_by_zip', {
    type: 'geojson',
    data: './data/simple_guns.geojson',
  });


  map.addSource('mass_shootings', {
    type: 'geojson',
    data: './data/mass_shootings.geojson',
  });


  mass_shootings.features = mass_shootings.features.map(function(d) {
    e.properties.year = d;
    return d;
  });


  map.addLayer({
    id: 'guns_cloro',
    type: 'fill',
    source: 'guns_by_zip',
    paint: {
      'fill-color': {
        property: 'n_killed_t',
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


map.on('click', 'guns_cloro', function(e) {
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`${e.n_killed_t} people were killed in ${e.ZCTA5CE10} in ${e.year}`)
    .addTo(map);
});

// Change the cursor to a pointer when the mouse is over the guns_ layer.
map.on('mouseenter', 'guns_cloro', function() {
  map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'guns_cloro', function() {
  map.getCanvas().style.cursor = 'pointer';
});

// Set filter to first month of the year
// 0 = January
filterBy(2013);

document.getElementById('slider').addEventListener('input', function(e) {
  var year = parseInt(e.target.value, 10);
  filterBy(year);
});
