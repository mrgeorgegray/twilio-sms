$(function() {

  // Grab URL param to set BG color after post
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
  }
  var urlParam = getURLParameter('status');
  if ( urlParam === "sent" ) {
    $('body').addClass('green');
    $('#response').html('<p>Message sent!</p>');
  } else if ( urlParam === "error" ) {
    $('body').addClass('red');
    $('#response').html('<p>Something went wrong</p>');
  }


  if (navigator.geolocation) {

    //Build a map and center it on some blue stuff
    var mapOptions = {
      center: new google.maps.LatLng(-36.3, -41.1),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    //Prepare an info window
    var infowindow = new google.maps.InfoWindow({
      content: '<p>Your location.</p>'
    });

    //Get the current position
    navigator.geolocation.getCurrentPosition(function(position) {

      //Grab the Lat/Lon coords from geolocation
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      //Create a Lat/Lon Object for Google
      var latLngObject = new google.maps.LatLng(lat,lng);

      //Center the map on position and zoom
      map.setCenter(latLngObject);
      map.setZoom(14);

      //Drop a pin on map location
      var marker = new google.maps.Marker({
        position: latLngObject,
        map: map
      });

      //Reverse GeoCode to get address
      $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=false', function(data) {
        //Grab the first result
        var first_result = data.results[0];
        var address = first_result.formatted_address

        //Attach an info window to the marker
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<div class="info-window"><h2>You are here</h2><p>' + address + '</p>');
          infowindow.open(map,marker);
        });

        //Replace checking with Google maps location link
        var mapLink = '<a class="btn" href="https://maps.google.co.uk/maps?q=' + address + '">Google Maps location</a>'

        //Replace status div with form
        $('#status').html('<form class="send_sms" action ="/sms" method ="post">'+
        '<input class="location" name="location" type="hidden" value="You can find me at ' + address + '" />'+
        '<label for="phone">SMS your location</label>'+
        '<input id="phone" name="phone" type="text" placeholder="Enter number..."/>'+
        '<input type="submit" value="Send"></input>'+
        '</form>');

        //Add a link after map to Google maps
        $('#map-canvas').after(mapLink);
      });
    });
  }
  else {
    // Change checking to not supported
    // error('not supported');
    $('body').addClass('red');
    $('#status').html("<p>Sorry your browser doesn't support Geolocation")
  }




});
