<template>
		<div class="">
		
			<form v-on:submit.prevent="onSubmit">
				<input
					id="placeSearch"
					type="text"
					v-model="place"
					@input="autocompleteRequest(place)"
					placeholder="Search for a place"
					autocomplete="off"
				>
				

				<suggestions-list
					:suggestions="suggestionsList"
					v-on:suggestionHighlighted="suggestionHighlighted"
				/>

				<div class="error" v-if="noResults">No results found</div>
			</form>
		</div>

</template>
<script>
		import Vue from 'vue'
		import suggestionsList from '../../uiComponents/suggestionsList.vue';
		
		import {loadGoogleApi} from '../../libs/googleApi.js';

		export default {
				name: 'placeInput',
				components: {
					'suggestions-list' : suggestionsList
				},
				props: ['placeInput'],
				created: function () {
						loadGoogleApi().then(function(googleApi) {
							this.service = new googleApi.places.AutocompleteService();
						}.bind(this), function(error) {
							console.error("Failed!", error);
						}
					);
				},
				computed: {
					suggestionsList () {
						return this.suggestions.map(suggestion => {
							return suggestion.description;
						});
						
					}
				},
			
				methods: {
					suggestionHighlighted (key) {
						this.place = this.suggestions[key].description;
						this.$emit('suggestionHighlighted', this.suggestions[key]);
					},
					onSubmit () {
						this.suggestions = [];
					},
					autocompleteRequest(place) {
						if (place == "") {
							this.suggestions = [];
							this.noResults = false;
							return;
						}

						// (query, callback)
						this.service.getPlacePredictions({input: place}, this.displaySuggestions)
					},
					displaySuggestions(predictions, status) {
						if (status != google.maps.places.PlacesServiceStatus.OK) {
							if (status == 'ZERO_RESULTS') {
								this.suggestions = [];
								this.noResults = true;
							}
							return;
						}
						this.suggestions = predictions;
						this.noResults = false;
					},
				},
				data() {
						return {
								place: "",
								suggestions: [],
								noResults : false,
						}
				}
		}



</script>
<style scoped>
#placeSearch {
	display: block;
}
.suggestions.active {
	background-color: red;
}
</style>
