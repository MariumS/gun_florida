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
  map.setFilter('mass_shootings-circles', filters);

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

    map.addLayer({
      'id': 'mass_shootings-circles',
      'type': 'circle',
      'source': 'mass_shootings',
      'paint': {
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'n_killed'],
          1, '#1400BA',
          30, '#050201'
        ],
        'circle-opacity': 0.75,
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'n_killed'],
          6, 4,
          30, 4,
        ]
      }
    });

  // Set filter to first year
  filterBy(2014);


  document.getElementById('slider').addEventListener('input', function(e) {
  var year = parseInt(e.target.value, 10);
  filterBy(year);

});

// add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // add a layer for the highlighted lot
  map.addLayer({
    id: 'highlight-line',
    type: 'line',
    source: 'highlight-feature',
    paint: {
      'line-width': 3,
      'line-opacity': 0.9,
      'line-color': 'black',
    }
  });

// when the mouse moves, do stuff!
 map.on('mousemove', function (e) {
   // query for the features under the mouse, but only in the lots layer
   var features = map.queryRenderedFeatures(e.point, {
       layers: ['guns_cloro','mass_shootings-circles'],
   });

   // get the first feature from the array of returned features.
   var zip = features[0];

   if (zip) {  // if there's a zip under the mouse, do stuff
     map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

     // use jquery to display the properties to the sidebar
     $('#n_killed').text(zip.properties.n_killed_t);
     $('#year').text(zip.properties.year);
     $('#zipcode').text(zip.properties.ZCTA5CE10);

     // set this lot's polygon feature as the data for the highlight source
     map.getSource('highlight-feature').setData(zip.geometry);
   }
   else {
     map.getCanvas().style.cursor = 'default'; // make the cursor default

     // reset the highlight source to an empty featurecollection
     map.getSource('highlight-feature').setData({
       type: 'FeatureCollection',
       features: []
  })
  }

      });
    });
