<template>
	<div class="placeInput">
		<form class="placeInput__form" v-on:submit.prevent="onSubmit">
			<ui-text-input
				name="username"
				placeholder="Search for near a city or landmark"
				autofocus="autofocus"
				autocomplete="off"
				v-model="place"
				:help="validationErrors.first('username')"
				@input="autocompleteRequest(place)"
			/>
		</form>

		<suggestions-list
				:suggestions="suggestionsList"
				v-on:suggestionHighlighted="suggestionHighlighted"
			/>
			<ui-group
				:border="false"
			>
				<ui-message
					v-if="noResults"
					type="error"
				>
					No results found
				</ui-message>
			</ui-group>
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
<style lang="scss">

@import '~globalVars';

.placeInput {
	
}

.placeInput__form {
	margin: 0 $widthGridLargerSpace;
}



</style>
