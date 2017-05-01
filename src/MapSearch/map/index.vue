<template>
  <div id="map">
    Map
  </div>
</template>
<script>
    import Vue from 'vue'

    export default {
      name: 'mapWidget',
      created () {
        this.mapWidget = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -12.1430911, lng: -77.0227697},
          zoom: 12
        });
      }
    }



</script>
<style scoped>

</style>
