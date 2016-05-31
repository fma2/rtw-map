function createSelector(layer, selector) {
  var sql = new cartodb.SQL({ user: 'fma2' });
  var $options = $(selector);

  // console.log
  $options.click(function(e) {
    // get the area of the selected layer
    var $li = $(e.target);
    var type = $li.data('type');
    var filter = $li.attr('data');
    var type = $li.data('type');
    var param = $li.data('param');
    var id = $($options.parent()).attr("id");
    var href = "a[href=#"+ id + "]"

    // deselect all and select the clicked one
    $options.removeClass('selected');
    $li.toggleClass('selected');

    // set cartoCSS based on data from the layer
    if (type === "cartocss") {

      $options.not($(this)).toggle(function(){
        $(this).css("color", "black")
      });
      condition = $('#'+param).text();
      layer.setCartoCSS(condition);

      $(href).toggle();
      // show layer with new cartoCSS
      layer.toggle();

    // handling back button
    } else { 
      $options.show();
      $(this).hide();
      layer.hide();
      $(href).show();

    }
  });
}

function main() {
  cartodb.createVis('map', 'https://fma2.cartodb.com/api/v2/viz/d1fa6bb6-242d-11e6-a38d-0e5db1731f59/viz.json', 
  {
    // shareable: true,
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

    // create wage gap sublayer
    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/d1fa6bb6-242d-11e6-a38d-0e5db1731f59/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.wage-gap');
    })

    // create minimum wage sublayer
    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/d1fa6bb6-242d-11e6-a38d-0e5db1731f59/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.min-wage');
    }) 

    // create poverty rate sublayer
    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/d1fa6bb6-242d-11e6-a38d-0e5db1731f59/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.poverty-rate');
    })  
    
    // create percent uninsured sublayer
    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/d1fa6bb6-242d-11e6-a38d-0e5db1731f59/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.uninsured-rate');
    })

    // create percent unionized sublayer
    cartodb.createLayer(map,'https://fma2.cartodb.com/api/v2/viz/d1fa6bb6-242d-11e6-a38d-0e5db1731f59/viz.json')
    .addTo(map)
    .done(function(layer){
      var subLayer = layer.getSubLayer(0);

      // hide points in this layer
      subLayer.hide();

      // create selector for this layer
      createSelector(subLayer, '#layer_selector li.unionized-rate');
    })
  })
  .error(function(err) {
    console.log(err);
  });
}

$(document).ready(function() {
  // $('[data-toggle=offcanvas]').click(function() {
  //   $('.row-offcanvas').toggleClass('active');
  // });

  // $("#sidebar").toggleClass("collapsed");
  // $("#content").toggleClass("col-md-12 col-md-9");

  $("#layer_list h5 a").click(function(){
    $("#layer_list h5").not($(this).parent()).toggle();
    $(this).toggleClass('list-group-item-info');
    $(this).children('span.back').toggle();
    $(this).children('span.title').toggle();
  })

  $("span.back").hide();
  $("li.back").hide();

});

window.onload = main;