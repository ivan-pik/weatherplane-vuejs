<template>
<div class="">
	<div v-if="weatherData">
		<weather-details-data :weather="weatherData.hourly" />
		<hourly-view :weather="weatherData" />
	</div>

	<div v-else>
		<load-screen text="Loading Weather" />
	</div>
</div>

</template>
<script>
		import Vue from 'vue';
		import WPAPI from '../../wpapi/index';
		import hourlyView from '../../Weather/hourlyView/index.vue';
		import weatherDetailsData from './weatherDetailsData.vue';
		import loadScreen from '../../uiComponents/loadScreen.vue';
	

		export default {
				name: 'placeDetails',
				created: function () {
					
				},
				components: {
					'weather-details-data' : weatherDetailsData,
					'hourly-view' : hourlyView,
					'load-screen' : loadScreen
					
				},

			props: {
				activeLocation: {
					type: Object
				}
			},
		 
			computed: {
				weatherData() {
					return this.$store.state.existingPlaceView.weatherData;
				},
				
			},
			created: function () {
				this.fetchWeather();
			},
			methods: {
				saveThisPlace () {
					if (this.loggedIn) {
						this.openSaveOptions = true;
					}
				},
		
				fetchWeather () {
					// Get saved place weather
					if (this.activeLocation.weather) {
						let oid = this.activeLocation.weather[0].oid;

						// @todo: save to LocalStorage for 30 mins, only then load new weather ?

						WPAPI.getPlaceWeather(oid).then((weather) => {
							this.$store.commit('PLACE_SAVE_WEATHER_DATA', weather);
						});

					// Get temporary place weather
					} else {
						let coordinates = {
							lat: this.activeLocation.placeLat,
							lng: this.activeLocation.placeLng
						};

						// Only load new weather if it's not in localStorage and older than 30 mins

						
						if (localStorage) {
							let localWeather = localStorage.getItem('temporaryWeather');
							if (localWeather) {
								localWeather = JSON.parse(localWeather);

								if (localWeather.location.latitude == coordinates.lat && localWeather.location.longitude == coordinates.lng) {
									var time = new Date(localWeather.updated);
									var timeout = 30 * 60000;
									var diff = Date.now() - time;
									if (diff < timeout) {
										this.$store.commit('PLACE_SAVE_WEATHER_DATA', localWeather);
										return;
									}
								}
							}
						}

						WPAPI.getTempPlaceWeather(coordinates).then((weather) => {
							this.$store.commit('PLACE_SAVE_WEATHER_DATA', weather);

							localStorage.setItem('temporaryWeather', JSON.stringify(weather));

						}).catch((error) => {
							// @todo: Handle error
							console.log('omg',error);
						});
					}
				},
				
			},
			data () {
				return {
					openSaveOptions: false,
					errors: null,
					placeName: '',
					placeIsPublic: false
				}
			}
		}


</script>
<style scoped>

</style>
