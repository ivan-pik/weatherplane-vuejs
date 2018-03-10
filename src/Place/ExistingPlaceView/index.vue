<template>
	<layout-view-wrapper
		:enableScroll="false"
	>
		<span slot="header">{{place ? place.placeName : null}}</span>

		<div slot="content">
			<login-form
				v-if="needToLogin"
				:message="message"
				:fillUsername="placeUserName"
			/>
			
			<ui-transition-fade v-else>
				<div>
					<e-404 v-if="place404">
						<span slot="title">Sorry, this place doesn't exist</span>
						<span slot="note">Check that the page address is correct</span>
					</e-404>
					<load-screen
						v-if="!place"
						text="Loading Place"
					/>
					<place-details v-else  :activeLocation='place' />
				</div>
			</ui-transition-fade>
		</div>
	</layout-view-wrapper>
</template>

<script>
	import Vue from 'vue'
	import {HTTP} from '../../http-common';
	import WPAPI from '../../wpapi/index';
	import E404 from '404/index.vue';
	import loginForm from 'Login/loginForm.vue';
	import placeDetails from '../placeDetails/index.vue';
	import loadScreen from '../../uiComponents/loadScreen.vue';
	import navigationHeader from 'Navigation/navigationHeader.vue'

	export default {
		name: 'ExistingPlaceView',
		components: {
			'load-screen' : loadScreen,
			'e-404' : E404,
			'login-form' : loginForm,
			'place-details': placeDetails,
			'navigation-header' : navigationHeader,
		},
		
		mounted () {
			this.placeLoader();
		},
		computed: {
			authenticated () {
				return this.$store.state.user.authenticated;
			},
			bearing () {
				return this.$store.state.placeSearch.bearing;
			},
			place () {
				return this.$store.state.existingPlaceView.place;
			},
			searchedPlace () {
				return this.$store.state.placeSearch.selectedLocation.coordinates;
			},
			placeUserName () {
				return this.$route.params.username;
			}
		},
		methods: {

			placeLoader () {
				// Get a saved place
				if (this.$route.params.username && this.$route.params.place) {
					this.loadSavedPlace();
					return;
				} else {
					this.loadTemporaryPlace();
				}
			},
			loadTemporaryPlace () {
				let tempPlace;
				// Get a place from a search view
				if (this.searchedPlace && this.searchedPlace.lat) {
					this.$store.commit('PLACE_VIEW_TYPE', 'temporary');
					tempPlace = {
						"placeName": 'Temporary Place',
						"placeLat": this.searchedPlace.lat,
						"placeLng": this.searchedPlace.lng,
						"placeSettings": {
							"runwayOrientation": this.bearing,
							"public": false,
							"maxWindSpeed": 14,
							"maxCrossWindSpeed": 8,
							"minTemperature": 6,
							"maxTemperature": 30,
							"maxPrecipProbability": 10,
							"maxWindBearingToRWY": 70
						}
					}

					if (localStorage) {
						localStorage.setItem('tempPlace', JSON.stringify(tempPlace));
					}
					this.$store.commit('PLACE_SAVE_PLACE_DATA', tempPlace);

					return;
				}

				// Check if there is a temporary place in localStorage

				if (localStorage) {
					tempPlace = localStorage.getItem('tempPlace');
					if (tempPlace) {
						this.$store.commit('PLACE_VIEW_TYPE', 'temporary');
						this.$store.commit('PLACE_SAVE_PLACE_DATA', JSON.parse(tempPlace));
						return;
					} else {
						// No place searched on found in localStorage
						this.$router.push({ path: `/` });
					}
				} 

				
			},
			loadSavedPlace () {
				this.$store.commit('PLACE_VIEW_TYPE', 'saved');

				WPAPI.getPlace({
					user: this.$route.params.username,
					place: this.$route.params.place
				}).then((response) => {
					if (response.data && response.data.success) {
						this.$store.commit('PLACE_SAVE_PLACE_DATA', response.data.data.place)
					} else {
						if(response.response.data.errors) {
							let errors = response.response.data.errors;
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
							if(errorCode("authentication-required", errors)) {
								this.needToLogin = true;
								this.message = "You need to log in to see this place";
								this.$store.commit('USER_AUTHENTICATION_REQUIRED')
							}

							if(errorCode("resource-does-not-exist", errors)) {
								this.place404 = true;
							}

							if(errorCode("authorised-no-rights", errors)) {
								this.needToLogin = true;
								this.message = `You need to log-in as ${this.placeUserName} to see this place`;
								this.$store.commit('USER_AUTHENTICATION_REQUIRED')
							}
						}
					}
				});
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
				if (this.$route.params.place) {
					this.loadSavedPlace();
				}
			},
			'$route': function (route) {
				if (route.name == 'place') {
					this.loadTemporaryPlace();
				}
				
			},
			place (place) {
				this.$store.commit('GLOBAL_SET_TITLE', place.placeName)
			}
		},
		data () {
			return {
				needToLogin: false,
				place404: false,
				message: null,
				loginAsAnotherUser: false
			}
		}

	}



</script>
<style scoped>

</style>
