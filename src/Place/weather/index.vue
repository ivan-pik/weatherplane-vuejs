<template>
  <p>Weather here</p>

</template>
<script>
    import Vue from 'vue'


    export default {
        name: 'weather',
        computed: {
            activeLocation() {
                return this.$store.state.placeSearch.selectedLocation;
            }

        },

    }



</script>
<style scoped>

</style>
