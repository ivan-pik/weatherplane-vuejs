<template>
    <div class="">
      <form v-on:submit.prevent="onSubmit">


        <input
          @keyup.down="nextSuggestion"
          @keyup.up="prevSuggestion"
          @input="resetSuggestions"
          id="placeSearch"
          type="text"
          v-model="place"
          placeholder="Search for a place"
          autocomplete="off"
        >
        <suggestion-dropdown v-if="displaySuggestionsList" v-bind:suggestions="suggestions" v-bind:newList="suggestionDropdown.newList" v-bind:keyEvent="suggestionDropdown.keyEvent"></suggestion-dropdown>
        <div class="error" v-if="noResults">No results found</div>
      </form>
    </div>

</template>
<script>
    import Vue from 'vue'
    import loadGoogleMapsAPI from 'load-google-maps-api';
    import suggestionsDropdown from '../suggestionsDropdown/index.vue';

    export default {
        name: 'SettingsView',
        components: {
          'suggestion-dropdown' : suggestionsDropdown
        },
        created: function () {
          this.$on('activeSuggestion', activeSuggestion => {
            let resetActiveClass = function (element, index, array) {
              if (element.active) {
                element.active = false;
              }
            }
            this.suggestions.forEach(resetActiveClass);
            Vue.set(this.suggestions[activeSuggestion], 'active', true)

            this.place = this.suggestions[activeSuggestion].description;
            this.activeSuggestion = true;


           });

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
            if (!this.activeSuggestion) {
              this.autocompleteRequest(newPlace);
            }
          }
        },
        methods: {
          onSubmit (ev) {
            this.displaySuggestionsList = false;
          },
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
              if (status == 'ZERO_RESULTS') {
                this.suggestions = [];
                this.noResults = true;
                this.resetSuggestions();
              }
              return;
            }
            this.suggestions = predictions;
            this.suggestionDropdown.newList = true;
            this.displaySuggestionsList = true;
            this.noResults = false;
            this.$nextTick(function () {
              this.suggestionDropdown.newList = false;
            })
          },
          nextSuggestion(event) {
            this.suggestionDropdown.keyEvent = 'down';
            this.$nextTick(function () {
              this.suggestionDropdown.keyEvent = null;
            })
          },
          prevSuggestion(event) {
            this.suggestionDropdown.keyEvent = 'up';
            this.$nextTick(function () {
              this.suggestionDropdown.keyEvent = null;
            })
          },
          resetSuggestions() {
            this.activeSuggestion = false;

          }
        },
        data() {
            return {
                place: "",
                displaySuggestionsList: true,
                suggestions: [],
                activeSuggestion: null,
                noResults : false,
                suggestionDropdown: {
                  isActive : false,
                  keyEvent: null,
                  newList: false
                }
            }
        }
    }



</script>
<style scoped>
.suggestions.active {
  background-color: red;
}
</style>
