//personal access token, do not steal
mapboxgl.accessToken = 'pk.eyJ1IjoibWFyemlwYW45NCIsImEiOiJjanVrOTdwaDQxdG42NDRwNGFmbzY5dWdtIn0.4lVQxPc89QYzHas2IIWmew';

//create mapboxgl map, in the map container specified in css
var map = new mapboxgl.Map({
  container: 'mapContainer',
  style: 'mapbox://styles/mapbox/dark-v10',
  //florida center
  center: [-81.7, 27.99],
  scrollWheelZoom: false,
  scrollZoom: false,
  zoom: 5.5,
});


//the relevant years
//data for 2018 is incomplete
//data for 2013 is so patchy it is left out
//the original data also has 1970 but all gun death counts seem to be 0
var years = [
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
];


function filterBy(year) {
  //filtering our 2 layers by the year chosen by user through the slider
  var filters = ['==', 'year', year];
  map.setFilter('guns_cloro', filters);
  map.setFilter('mass_shootings-circles', filters);

  // Set the label to the year
  document.getElementById('year').textContent = years[year];

}

map.on('load', function() {
  //adding source for cloropleth. gun deaths data by zipcode by year
  map.addSource('guns_by_zip', {
    type: 'geojson',
    data: './data/simple_guns.geojson',
  });

  //adding source for mass shooting points. individual gun incident data, filtered to where n_killed is greater than 4
  map.addSource('mass_shootings', {
    type: 'geojson',
    data: './data/mass_shootings.geojson',
  });

  //creating cloropleth
  map.addLayer({
    id: 'guns_cloro',
    type: 'fill',
    source: 'guns_by_zip',
    paint: {
      'fill-color': {
        property: 'n_killed_t',
        //color gets more red as number killed increases
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

  //creating points for mass shootings to overlay on map
  map.addLayer({
    'id': 'mass_shootings-circles',
    'type': 'circle',
    'source': 'mass_shootings',
    'paint': {
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'n_killed'],
        //dots get slightly darker as number killed increases
        1, '#1400BA',
        30, '#050201'
      ],
      'circle-opacity': 0.75,
      'circle-radius': 4
    }
  });

  // Set filter to first year
  filterBy(2014);

  //getting year from slider
  document.getElementById('slider').addEventListener('input', function(e) {
    var year = parseInt(e.target.value, 10);
    //filtering by year
    filterBy(year);

  });

  // add an empty data source, which we will use to highlight the zipcode the user is hovering over

  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // add a layer for the highlighted zipcode
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



  //when the mouse moves, do stuff!
  map.on('mousemove', function(e) {
    // query for the features under the mouse, on both layers
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['guns_cloro', 'mass_shootings-circles'],
    });

    // get the first feature from the array of returned features.
    var zip = features[0];
    console.log(zip);


    if (zip) {
      // if there's a zip under the mouse, do stuff
      map.getCanvas().style.cursor = 'pointer'; // make the cursor a pointer
      //if mass_shootings-circles
      if (zip.layer.id === 'mass_shootings-circles') {
        {

          // update the text for the mass shootings area
          $('#n_killed_s').text(`${zip.properties.n_killed} people were killed in this mass shooting`);
          $('#year_s').text(`on ${zip.properties.date}`);
          $('#address_s').text(`at ${zip.properties.address}`);

          // clear the text for the zipcode area
          $('#n_killed').text(``);
          $('#year').text(``);
          $('#zipcode').text(``);
        }

        // set this lot's polygon feature as the data for the highlight source
        map.getSource('highlight-feature').setData(zip.geometry);

        // reset the highlight source to an empty featurecollection

        map.getSource('highlight-feature').setData({
          type: 'FeatureCollection',
          features: []
        })
      }
      //else, zipcode layer
      else {
        //properties for zipcode layer
        $('#n_killed').text(`${zip.properties.n_killed_t} people were killed by guns`);
        $('#year').text(`in ${zip.properties.year}`);
        $('#zipcode').text(`in zipcode ${zip.properties.ZCTA5CE10}`);

        //clear the text for mass_shootings
        $('#n_killed_s').text(``);
        $('#year_s').text(``);
        $('#address_s').text(``);
      }

    } else {
      map.getCanvas().style.cursor = 'default'; // make the cursor default

      // reset the highlight source to an empty featurecollection
      map.getSource('highlight-feature').setData({
        type: 'FeatureCollection',
        features: []
      })
    }
  });
});
