if (zip) {
  // if there's a zip under the mouse, do stuff
    map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

    if (feature.layer.id === 'massshootings') {
      {
        // set this lot's polygon feature as the data for the highlight source
        map.getSource('highlight-feature').setData(zip.geometry);

        // reset the highlight source to an empty featurecollection
        // clear the text for the zipcode area
        map.getSource('highlight-feature').setData({
            type: 'FeatureCollection',
            features: []
    })
            // update the text for the mass shootings area
            $('#n_killed_s').text(`${zip.properties.n_killed} people were killed in this mass shooting`);
            $('#year_s').text(`on ${zip.properties.date}`);
            $('#address_s').text(`at ${zip.properties.address}`);
          }
    }
        else {
            //properties for zipcode layer
            $('#n_killed').text(`${zip.properties.n_killed_t} people were killed by guns`);
            $('#year').text(`in ${zip.properties.year}`);
            $('#zipcode').text(`in zipcode ${zip.properties.ZCTA5CE10}`);
          }
        }
  else {
    map.getCanvas().style.cursor = 'default'; // make the cursor default

    // reset the highlight source to an empty featurecollection
    map.getSource('highlight-feature').setData({
      type: 'FeatureCollection',
      features: []
 })
}
