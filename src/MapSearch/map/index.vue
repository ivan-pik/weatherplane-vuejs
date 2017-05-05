<template>
  <div>
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
        updateMap () {
          var geocoder = new this.googleApi.Geocoder;
          geocoder.geocode({'placeId': this.place.place_id}, (results, status) => {
              if (status === 'OK') {
                if (results[0]) {
                    this.mapWidget.setZoom(11);
                    this.mapWidget.setCenter(results[0].geometry.location);
                    var marker = new this.googleApi.Marker({
                    map: this.mapWidget,
                    position: results[0].geometry.location
                    });
                } else {
                    // @todo: No results found
                }
              } else {
                console.error('Geocoder failed due to: ' + status);
              }
          });

        }
      },
      watch: {
        place () {
          this.updateMap();
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
