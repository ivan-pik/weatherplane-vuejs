<template>
	<div class="">
		<place-not-found v-if="place404" />

		<login-view :message="message" @loggedIn="loggedIn" v-if="needToLogin" />


		<div v-else-if="place" class="">
			<div class="" class="mainNav mainNav--weatherDetail">
				<h1 class="mainNav__title">{{place.placeName}}</h1>
				<button class="mainNav__contextMenu">...</button>
			</div>
			<place-details :activeLocation='place' />
		</div>

		<div v-else>
			<load-screen text="Loading place" />
		</div>


	</div>
</template>
<script>
	import Vue from 'vue'
	import saveLocation from '../saveLocation/index.vue';
	import {HTTP} from '../../http-common';
	import WPAPI from '../../wpapi/index';
	import placeNotFound from '../placeNotFound/index.vue';
	import loginView from '../../Login/LoginView/index.vue';
	import placeDetails from '../placeDetails/index.vue';
	import loadScreen from '../../uiComponents/loadScreen.vue';

	export default {
		name: 'ExistingPlaceView',
		components: {
			'load-screen' : loadScreen,
			'place-not-found' : placeNotFound,
			'login-view' : loginView,
			'place-details': placeDetails
		},
		
		mounted () {
			// @todo @next This doesn;t happen when searching for a new place, component is reused

			// Get a saved place
			if (this.$route.params.username && this.$route.params.place) {
				this.$store.commit('PLACE_VIEW_TYPE', 'saved');
				this.loadSavedPlace();
				return;
			}

			let tempPlace;

			// Get a place from a search view
			if (this.searchedPlace && this.searchedPlace.active) {
				this.$store.commit('PLACE_VIEW_TYPE', 'temporary');

				tempPlace = {
					"placeName": this.searchedPlace.structured_formatting.main_text,
					"placeLat": this.selectedLocation.lat,
					"placeLng": this.selectedLocation.lng,
					"placeSettings": {
						"runwayOrientation": "45",
						"public": false,
						"maxWindSpeed": 30,
						"maxCrossWindSpeed": 19,
						"minTemperature": "0",
						"maxTemperature": 45,
						"maxPrecipProbability": 10,
						"maxWindBearingToRWY": 60
					}
				}

				if (localStorage) {
					localStorage.setItem('tempPlace', JSON.stringify(tempPlace));
				}
				this.loadTemporaryPlace(tempPlace);

				return;
			}

			// Check if there is a temporary place in localStorage

			if (localStorage) {
				tempPlace = localStorage.getItem('tempPlace');
				if (tempPlace) {
					this.$store.commit('PLACE_VIEW_TYPE', 'temporary');
					this.loadTemporaryPlace(JSON.parse(tempPlace));
					return;
				}
			} 

			// No place searched on found in localStorage
			this.$router.push({ path: `/` });
		},
		methods: {
			loadTemporaryPlace (tempPlace) {
				
				this.$store.commit('PLACE_SAVE_PLACE_DATA', tempPlace);

			},
			loadSavedPlace () {

				WPAPI.getPlace({
					user: this.$route.params.username,
					place: this.$route.params.place
				}).then((response) => {
					if (response.data.success) {
						this.$store.commit('PLACE_SAVE_PLACE_DATA', response.data.data.place)
					} else {
						if(response.data.data.errors) {
							// @todo: DRY!!!
							let errorCode = function(code, errors) {
								let check = errors.filter(function( obj ) {
									return obj.code == code;
								});
								if (check.length > 0) {
									return true;
								}
								return false;
							}

							if(errorCode("authentication-required", response.data.errors)) {
								this.needToLogin = true;
								this.$store.commit('USER_AUTHENTICATION_REQUIRED')
							}

							if(errorCode("resource-does-not-exist", response.data.errors)) {
								// @todo: Place pseudo 404
								this.place404 = true;
							}
						}
					}
				});
			}
		},
		computed: {
			authenticated () {
				return this.$store.state.user.authenticated;
			},
			place () {
				return this.$store.state.existingPlaceView.place;
			},
			searchedPlace () {
				return this.$store.state.placeSearch.place;
			},
			selectedLocation () {
				return this.$store.state.placeSearch.selectedLocation.coordinates;
			}
		},
		watch: {
			authenticated (authenticated) {
				if(authenticated) {
					this.needToLogin = false;
					this.loadSavedPlace();
				}
			},
			'$route.params.place': function (place) {
				this.loadSavedPlace();
			}
		},
		data () {
			return {
				needToLogin: false,
				place404: false,
				message: null
				
			}
		}

	}



</script>
<style scoped>

</style>
