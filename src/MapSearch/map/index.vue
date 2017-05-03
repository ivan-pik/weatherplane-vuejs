<template>
  <div>
    {{place}}
    <div id="map">
      Map
    </div>
  </div>
</template>
<script>
// @todo: @next https://developers.google.com/places/place-id
    import Vue from 'vue'
    import {loadGoogleApi} from '../../libs/googleApi.js';

    export default {
      name: 'mapWidget',
      props: {
        place: {
          type: Object
        }
      },
      created () {
        loadGoogleApi().then(function(googleApi) {
          // @todo: Use $ref instead of getting the ID
          this.googleApi = googleApi;
          this.mapWidget = new googleApi.Map(document.getElementById('map'), {
            center: {lat: -12.1430911, lng: -77.0227697},
            zoom: 12
          });
        }.bind(this), function(error) {
          console.error("Failed!", error);
        });
      },
      methods: {
        //@todo @next: this does not work, learn more about THIS binding :)
        updateMap (place) {
          console.log("redraw")
          

          var geocoder = new this.googleApi.Geocoder;
          var infowindow = new this.googleApi.InfoWindow;

          function geocodePlaceId(geocoder, map, infowindow) {
              console.log(this);
              var placeId = this.place.place_id;
              
              geocoder.geocode({'placeId': placeId}, function(results, status) {
                  if (status === 'OK') {
                  if (results[0]) {
                      map.setZoom(11);
                      map.setCenter(results[0].geometry.location);
                      var marker = new google.maps.Marker({
                      map: map,
                      position: results[0].geometry.location
                      });
                      infowindow.setContent(results[0].formatted_address);
                      infowindow.open(map, marker);
                  } else {
                      window.alert('No results found');
                  }
                  } else {
                  window.alert('Geocoder failed due to: ' + status);
                  }
              });
          }
          
          geocodePlaceId(geocoder, this.mapWidget, infowindow).bind(this);
        }
      },
      watch: {
        place () {
          this.updateMap(this.place);
        }
      }
    }



</script>
<style scoped>
  #map {
    width: 100%;
    height: 500px;
  }
</style>
