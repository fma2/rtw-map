function createSelector(layer, selector, dataset, col) {
  var sql = new cartodb.SQL({ user: 'fma2' });
  var $options = $(selector);
  $options.click(function(e) {
    // get the area of the selected layer
    var $li = $(e.target);
    var filter = $li.attr('data');
    var type = $li.data('type');
    var param = $li.data('param');

    // deselect all and select the clicked one
    $options.removeClass('selected');
    $li.addClass('selected');
    // create query based on data from the layer
    var query = "select * from " + dataset;


    // if(filter !== 'all') {
    //   query = "select * from " + dataset + " where " + col + filter;
    // }

    if (type === "cartocss") {
      condition = $('#'+param).text();
      layer.setCartoCSS(condition);
    } else {

    }

    // change the query in the layer to update the map // THIS MIGHT BE ABLE TO BE REFACTORED WITH ABOVE
    layer.setSQL(query);
    layer.show();
  });
}

function main() {
  cartodb.createVis('map', 'https://fma2.cartodb.com/api/v2/viz/a2d6d490-0282-11e6-9390-0e31c9be1b51/viz.json', 
  {
    shareable: true,
    tiles_loader: true,
    zoom: 6
    // center_lat: 0,
    // center_lon: 0,
    // title: true,
    // description: true,
    // search: true,
  })
  .done(function(vis, layers) {
    // layer 0 is the base layer, layer 1 is cartodb layer
    // setInteraction is disabled by default
    layers[1].setInteraction(true);
    // layers[1].on('featureOver', function(e, latlng, pos, data) {
    //  cartodb.log.log(e, latlng, pos, data);
    // });
    
    // you can get the native map to work with it
    var map = vis.getNativeMap();
    
    // create a layer with 1 sublayer
    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/cddae736-fa98-11e5-8fa8-0e5db1731f59/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.uninsured-rate', 'us_states_with_ak_hi_carto_db_rtw_assets_opp_with_geo', 'uninsured_rate_percent');
    })

    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/159ae39a-fa9a-11e5-88b6-0e674067d321/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.unionized-rate', 'us_states_with_ak_hi_carto_db_rtw_assets_opp_with_geo', 'percent_union');
    })
    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/5d6fb644-fa9c-11e5-8b1d-0e3ff518bd15/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.poverty-rate', 'us_states_with_ak_hi_carto_db_rtw_assets_opp_with_geo', 'income_povery_rate_percent');
    }) 
    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/cfefc586-0318-11e6-9de5-0ea31932ec1d/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.min-wage', 'state_squares_rtw_states_data', 'min_wage');
    })  
  })
  .error(function(err) {
    console.log(err);
  });
}

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});

window.onload = main;