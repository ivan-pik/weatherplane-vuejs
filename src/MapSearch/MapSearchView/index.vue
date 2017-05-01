<template>
    <div class="">
      <place-input v-bind:placeInput="place"></place-input>
      <location-map></location-map>
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
            }
        }
    }



</script>
<style scoped>

</style>
