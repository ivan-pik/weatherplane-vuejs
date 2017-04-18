<template>
    <div class="">
        <input
          @keyup.down="selectFirstSuggestion"
          id="placeSearch"
          type="text"
          v-model="place"
          placeholder="Search for a place"
        >
        <ul class="suggestions" v-bind:class="{ 'active' : suggestionDropdown.isActive }">
          <li  v-for="(suggestion, key) in suggestions" v-bind:key="key">
            <a>{{key}} {{suggestion.description}}</a>
          </li>
        </ul>
    </div>

</template>
<script>
    import Vue from 'vue'
    import loadGoogleMapsAPI from 'load-google-maps-api';

    export default {
        name: 'SettingsView',
        created: function () {
          loadGoogleMapsAPI(
            {
              key: 'AIzaSyBTL50DdKgmlhWvZ7b-kbCFt4N1hdZ7EvY',
              libraries: 'places'
            }
          ).then((googleMaps) => {
            console.log("Google Maps API loaded")
            this.service = new google.maps.places.AutocompleteService();
          }).catch((err) => {
            console.error(err);
          });
        },

        watch: {
          place: function (newPlace) {
            this.autocompleteRequest(newPlace);
          }
        },
        methods: {
          autocompleteRequest(place) {
            if (place == "") {
              this.suggestions = [];
              return;
            }

            let request = {
              input: place
            }

            this.service.getPlacePredictions(request, this.displaySuggestions)
          },
          displaySuggestions(predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
              alert(status);
              return;
            }
            this.suggestions = predictions;
          },
          selectFirstSuggestion(event) {
            if (!this.suggestions) {
              return;
            }
            this.suggestionDropdown.isActive = true;
            let firstSuggestion = document.querySelector(".suggestions li a");
            firstSuggestion.focus();
            console.log(firstSuggestion);
          }
        },
        data() {
            return {
                place: "",
                suggestions: [],
                suggestionDropdown: {
                  isActive : false
                }
            }
        }
    }


    // @todo: next implement some kind of Autocomplete UI https://github.com/BosNaufal/vue-autocomplete/blob/master/vue-autocomplete.vue

</script>
<style scoped>
.suggestions.active {
  background-color: red;
}
</style>
