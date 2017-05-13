<template>
    <div class="" v-if="placeSelected">
      Location:
      <h6>
      {{activeLocation.coordinates.lat}}<br>
      {{activeLocation.coordinates.lng}}
      </h6>

      <weather />

      <save-location />

    </div>

    <div v-else>
        <router-link  to="/">Select place</router-link>
    </div>

</template>
<script>
    import Vue from 'vue'
    import saveLocation from '../saveLocation/index.vue';
    import weather from '../weather/index.vue';


    export default {
        name: 'PlaceView',
        components: {
          'save-location' : saveLocation,
          'weather' : weather
        },
        computed: {
            activeLocation() {
                return this.$store.state.placeSearch.selectedLocation;
            },
            placeSelected() {
                return this.$store.state.placeSearch.placeSelected;
            }

        },

    }



</script>
<style scoped>

</style>
