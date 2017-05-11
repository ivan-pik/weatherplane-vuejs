<template>
  <div id="map" ref="mapWraper">
    Map
  </div>
</template>

<script>
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

          this.googleApi = googleApi;

          this.mapWidget = new googleApi.Map(this.$refs.mapWraper, {
            center: {lat: -12.1430911, lng: -77.0227697},
            zoom: 16,
            mapTypeId: 'satellite'
          });

          let mapWidget = this.mapWidget;

          // place marker
          google.maps.event.addListener(mapWidget, 'click', (event) => {
             this.placeMarker(event.latLng);
           });

           this.updateMap();

        }.bind(this), function(error) {
          console.error("Failed!", error);
        });
      },

      methods: {

        placeMarker (location) {
          this.clearOverlays();
          var marker = new google.maps.Marker({
              position: location,
              map: this.mapWidget,
              draggable: true
          });

          this.markersArray.push(marker);

          this.mapWidget.setCenter(location);
        },

        clearOverlays () {
          for (var i = 0; i < this.markersArray.length; i++ ) {
            this.markersArray[i].setMap(null);
          }
          this.markersArray.length = 0;
        },

        updateMap () {
          var geocoder = new this.googleApi.Geocoder;
          geocoder.geocode({'placeId': this.place.place_id}, (results, status) => {
              if (status === 'OK') {
                if (results[0]) {
                    this.mapWidget.setZoom(16);
                    this.mapWidget.setCenter(results[0].geometry.location);
                    var marker = new this.googleApi.Marker({
                      map: this.mapWidget,
                      position: results[0].geometry.location,
                      draggable: true
                    });
                    this.markersArray.push(marker);
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
      },
      data() {
        return {
          markersArray: []
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
