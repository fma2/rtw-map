function createSelector(layer, selector) {
  var sql = new cartodb.SQL({ user: 'fma2' });
  var $options = $(selector);

  $options.click(function(e) {
    // get the area of the selected layer
    var $li = $(e.target);
    var type = $li.data('type');
    var filter = $li.attr('data');
    var type = $li.data('type');
    var param = $li.data('param');
    var id = $($options.parent()).attr("id");
    var href;
    if ($(this).parents(".page-content-nav").length){
      href = "a[href=#"+ id + "-2]";
    }
    else {
      href = "a[href=#"+ id + "]";
    }

    // deselect all and select the clicked one
    $options.removeClass('selected');
    $li.toggleClass('selected');

    // set cartoCSS based on data from the layer
    if (type === "cartocss") {
      $(href).toggle(function(){});
      $options.not($(this)).toggle(function(){
        $(this).css("color", "black")
      });
      condition = $('#'+param).text();
      layer.setCartoCSS(condition);

      // show layer with new cartoCSS
      layer.toggle();
    } 
    // handling back button
    else { 
      $options.show();
      $(this).toggle(function(){});
      $(href).toggle(function(){});      
      layer.hide();
    }
  });
}

function main() {
  var mapbreakwidth = 720;
  var embedbreakwidth = 549;
  var mobilebreakwidth = 420;
  var highzoom = 6;
  var lowzoom = 5.5;
  var mobilezoom = 5;
  var defaultlat = 40.697299008636755;
  var defaultlong = -96.87744140625;
  var highLatLng = new L.LatLng(defaultlat, defaultlong);
  var lowLatLng = new L.LatLng(43.54854811091286,  -95.69091796875);
  var mobileLatLng = new L.LatLng(45.5679096098613, -96.2841796875);
  var hideMenuLatLng = new L.LatLng(38.90813299596705, -94.921875);
  var initzoom;
  var condition;
  var vizjson = 'https://fma2.cartodb.com/api/v2/viz/d1fa6bb6-242d-11e6-a38d-0e5db1731f59/viz.json'

  //Set initial mapheight, based on the calculated width of the map container
  if ($("#map").width() > mapbreakwidth) {
    initzoom = highzoom;
  }
  else if ($("#map").width() < mobilebreakwidth)  {
    initzoom = mobilezoom;
  }
  else {
    initzoom = lowzoom;
  };

  cartodb.createVis('map', vizjson, 
  {
    tiles_loader: true,
    loaderControl: true,
    zoom: initzoom,
    center_lat: defaultlat,
    center_long: defaultlong,
  })
  .done(function(vis, layers) {
    layers[1].setInteraction(true);

    // you can get the native map to work with it
    var map = vis.getNativeMap();
    var layer = layers[1].getSubLayer(0)
    var infowindow;

    createIndicatorLayers(map,vizjson);
    

    layer.on("featureClick", function(){
      $(".page-content-nav").fadeOut();
      if ($(".page-content-nav").css("visibility") == "visible") {
        $("#show-menu").fadeIn();      
      }
      map.panTo(hideMenuLatLng)
    });

    $("#hide-menu").click(function(){
      $(".page-content-nav").fadeOut();
      $("#show-menu").fadeIn();
      map.panTo(hideMenuLatLng);
      return false;
    })

    $("#show-menu").click(function(){
      $(".cartodb-infowindow").hide();
      $(".page-content-nav").fadeIn();
      $("#show-menu").hide();
      map.panTo(lowLatLng);
      return false;
    })

    //Set initial mapheight, based on the calculated width of the map container
    if ($("#map").width() >= mapbreakwidth) {
      condition = $('#highzoom').text();
      layers[1].getSubLayer(0).setCartoCSS(condition)
    }
    else if ($("#map").width() < embedbreakwidth && $("#map").width() > mobilebreakwidth) {
      condition = $('#lowzoom').text();
      layers[1].getSubLayer(0).setCartoCSS(condition)
      map.panTo(lowLatLng);
    }
    else if ($("#map").width() <= mobilebreakwidth) {
      condition = $('#lowzoom').text();
      layers[1].getSubLayer(0).setCartoCSS(condition)
      map.panTo(mobileLatLng);
    }
    else {
      condition = $('#lowzoom').text();
      layers[1].getSubLayer(0).setCartoCSS(condition)
    }

    //Use Leaflets resize event to set new map height and zoom level
    map.on('resize', function(e) {
      if (e.newSize.x < mapbreakwidth) {
        condition = $('#lowzoom').text();
        layers[1].getSubLayer(0).setCartoCSS(condition)
        map.setZoom(lowzoom);
        map.panTo(highLatLng);
      };

      if (e.newSize.x < mobilebreakwidth){
        condition = $('#lowzoom').text();
        layers[1].getSubLayer(0).setCartoCSS(condition)
        map.setZoom(mobilezoom);
        map.panTo(mobileLatLng);
      }

      if (e.newSize.x > mapbreakwidth) {
        condition = $('#highzoom').text();
        layers[1].getSubLayer(0).setCartoCSS(condition)
        map.setZoom(highzoom);
        map.panTo(highLatLng);
      };
    });
  })
  .error(function(err) {
    console.log(err);
  });
}

function createIndicatorLayers(map, vizjson) {
  
  // create percent uninsured sublayer
  cartodb.createLayer(map,vizjson)
  .addTo(map)
  .done(function(layer){
    var subLayer = layer.getSubLayer(0);

    // hide points in this layer
    subLayer.hide();

    // create selector for this layer
    createSelector(subLayer, '#layer_selector li.uninsured-rate');
  })

  // create percent unionized sublayer
  cartodb.createLayer(map,vizjson)
  .addTo(map)
  .done(function(layer){
    var subLayer = layer.getSubLayer(0);

    // hide points in this layer
    subLayer.hide();

    // create selector for this layer
    createSelector(subLayer, '#layer_selector li.unionized-rate');
  })

  // create wage gap sublayer
  cartodb.createLayer(map,vizjson)
  .addTo(map)
  .done(function(layer){
    var subLayer = layer.getSubLayer(0);

    // hide points in this layer
    subLayer.hide();

    // create selector for this layer
    createSelector(subLayer, '#layer_selector li.wage-gap');
  })

  // create minimum wage sublayer
  cartodb.createLayer(map,vizjson)
  .addTo(map)
  .done(function(layer){
    var subLayer = layer.getSubLayer(0);

    // hide points in this layer
    subLayer.hide();

    // create selector for this layer
    createSelector(subLayer, '#layer_selector li.min-wage');
  }) 

  // create poverty rate sublayer
  cartodb.createLayer(map,vizjson)
  .addTo(map)
  .done(function(layer){
    var subLayer = layer.getSubLayer(0);

    // hide points in this layer
    subLayer.hide();

    // create selector for this layer
    createSelector(subLayer, '#layer_selector li.poverty-rate');
  }) 
}

$(document).ready(function() {

    // initial hiding of back buttons in map selectors
    $("span.back").hide();
    $("li.back").hide();
    $("#show-menu").hide();


    // toggling for map selectors
    $("#layer_list h5 a").click(function(){
      $("#layer_list h5").not($(this).parent()).toggle();
      $("#menu-options a:first-child").toggle();
      $(this).toggleClass('list-group-item-info');
      $(this).children('span.back').toggle();
      $(this).children('span.title').toggle();

      if ($(this).parents(".sidebar-nav").length == 0) {
        $(this).parents(".page-content-nav").find("#layer_selector").prev("h5").toggle();
      }
    })

    // hide sidebar toggle button - not active currently
    $("#sidebar-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  });

window.onload = main;