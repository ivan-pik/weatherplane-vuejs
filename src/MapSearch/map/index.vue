<template>
  <div id="map">
    Map
  </div>
</template>
<script>
// @todo: @next https://developers.google.com/places/place-id
    import Vue from 'vue'

    export default {
      name: 'mapWidget',
      props: {
        place: {
          type: Object
        }
      },
      created () {
        setTimeout(function() {
          this.mapWidget = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -12.1430911, lng: -77.0227697},
            zoom: 12
          });

        }, 1000)

      }
    }



</script>
<style scoped>
  #map {
    width: 100%;
    height: 500px;
  }
</style>
