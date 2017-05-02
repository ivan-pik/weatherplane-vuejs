<template>
    <div class="">
      <place-input v-bind:placeInput="place"></place-input>
      <br>
      <br>
      <br>
      <br>
      <location-map
        v-if="showMap"
        :place="place"
      />
    </div>

</template>
<script>
    import Vue from 'vue'
    import placeInput from '../placeInput/index.vue';
    import map from '../map/index.vue';

    export default {
        name: 'MapSearchView',
        components: {
          'place-input' : placeInput,
          'location-map' : map
        },
        created: function () {
          this.$on('placeSelected', selectedPlace => {
            this.$store.commit('PLACE_SEARCH_PLACE_SELECTED', selectedPlace)
           });
        },
        computed: {
            place() {
                return this.$store.state.placeSearch.place;
            },
            showMap () {
              if (this.place.description) {
                return true;
              } else {
                return false;
              }
            }
        }
    }



</script>
<style scoped>

</style>
