function createSelector(layer, selector) {
  var sql = new cartodb.SQL({ user: 'fma2' });
  var $options = $(selector);

  $options.click(function(e) {
    // get the area of the selected layer
    var $li = $(e.target);
    var selector = "." + $li[0].classList[0];
    var type = $li.data('type');
    var filter = $li.attr('data');
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
  var vizjson = 'https://fma2.cartodb.com/api/v2/viz/d1fa6bb6-242d-11e6-a38d-0e5db1731f59/viz.json';

  var menubreakwidth = 720; // when the sidebar turns into a topbar
  var isTopbarVisible = $(window).width() < menubreakwidth; //check if topbar is visible

  //sidebar embed breakwidth/s
  var sidebarembedbreakwidth = 640;

  // topbar breakwidths/s
  var topbarbreakwidth = 720;

  var highzoom = 6,
  lowzoom = 5;

  var highLat = 40.697299008636755,
  highLong = -96.87744140625;
  highLatLng = new L.LatLng(highLat,highLong);

  var lowLat = 44.26093725039923,
  lowLong =  -94.94384765625;
  lowLatLng = new L.LatLng(lowLat, lowLong);

  var hiddenMenuLat = 38.90813299596705,
  hiddenMenuLong= -94.921875,
  hiddenMenuLatLong = new L.LatLng(hiddenMenuLat, hiddenMenuLong);

  var initLat,
  initLong,
  initzoom,
  condition;

  //set initial zoom and lat and long
  if (isTopbarVisible) {
    initzoom = lowzoom;
    initLat = lowLat;
    initLong = lowLong;
  } else {
    initLat = highLat;
    initLong = highLong;
    if ($("#map").width() > sidebarembedbreakwidth) {
      initzoom = highzoom;     
    }
    else {
      initzoom = lowzoom;
    }
  }

  cartodb.createVis('map', vizjson, 
  {
    tiles_loader: true,
    loaderControl: true,
    infowindow: true,
    zoom: initzoom,
    scrollwheel: false,
    center_lat: initLat,
    center_lon: initLong,
  })
  .done(function(vis, layers) {
    var infowindow,
    layer;

    layers[1].setInteraction(true);

    // you can get the native map to work with it
    var map = vis.getNativeMap();

    // set sublayer interaction to true
    layer = layers[1].getSubLayer(0)
    layer.setInteraction(true);
    
    layer.on("featureClick", function(){
      $(".page-content-nav").fadeOut();
      if ($(".page-content-nav").css("visibility") == "visible") {
        $("#show-menu").fadeIn();      
      }
      map.panTo(hiddenMenuLatLong)
      return false;
    });

    $("#hide-menu").click(function(){
      $(".page-content-nav").fadeOut();
      $("#show-menu").fadeIn();
      map.panTo(hiddenMenuLatLong);
      return false;
    })

    $("#show-menu").click(function(){
      $(".cartodb-infowindow").hide();
      $(".page-content-nav").fadeIn();
      $("#show-menu").hide();
      map.panTo(lowLatLng);
      return false;
    })

    //Set initial map css, based on the calculated width of the map container
    if (isTopbarVisible) {
      condition = $('#lowzoom').text();
      layer.setCartoCSS(condition)
    } else {
      if ($("#map").width() <= sidebarembedbreakwidth) {
        condition = $('#lowzoom').text();
        layer.setCartoCSS(condition)
      }
      else {
        condition = $('#highzoom').text();
        layer.setCartoCSS(condition)
      }
    }

    layer.on("featureOver",function(e, latlng, pos, data, layer){
      console.log(map.getCenter());
    })

    //Use Leaflets resize event to set new map height and zoom level
    map.on('resize', function(e) {

      isTopbarVisible = $(window).width() < menubreakwidth; 

      if (isTopbarVisible && e.newSize.x < menubreakwidth) {
        condition = $('#lowzoom').text();
        layer.setCartoCSS(condition);
        map.setView(lowLatLng, lowzoom)
      }
      else {
        if (e.newSize.x <= sidebarembedbreakwidth) {
          condition = $('#lowzoom').text();
          layer.setCartoCSS(condition);
          map.setView(highLatLng,lowzoom)
        }
        else {
          condition = $('#highzoom').text();
          layer.setCartoCSS(condition);
          map.setView(highLatLng,highzoom);
        }
      }
    });

    setTimeout(function() {
      createIndicatorLayers(map,vizjson);  
    }, 2000)

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
    subLayer.setInteraction(true);

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
    subLayer.setInteraction(true);

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
    subLayer.setInteraction(true);

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
    subLayer.setInteraction(true);

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
    subLayer.setInteraction(true);

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
      else {

        $(this).parents("#layer_selector").prev().children("h5").toggle();
      }
    })

    // hide sidebar toggle button - not active currently
    $("#sidebar-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  });

window.onload = main;