<template>
<div class="">
	<div v-if="weatherData && !weatherIsLoading">
		<div class="viewTitle viewTitle--placeDetails">
			<h1 class="viewTitle__text">{{activeLocation.placeName}}</h1>
		</div>

		<div class="placeContextMenu">
			<button class="placeContextMenu__toggler"
			@click="contextMenuOpen=!contextMenuOpen">
			C
			</button>
			<ul class="placeContextMenu__list" v-if="contextMenuOpen">
				<li class="placeContextMenu__list-item" v-if="placeViewType=='temporary'"
				@click="goToSaveRoute"
				>Save location</li>
				<li class="placeContextMenu__list-item" v-if="placeViewType=='saved'" 
				@click="openPlaceSettings">Place Settings</li>
				<li class="placeContextMenu__list-item" v-if="placeViewType=='saved'" 
				@click="openLimitsSettings">Weather Limits Settings</li>
			</ul>
		</div>
		
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
			components: {
				'weather-details-data' : weatherDetailsData,
				'hourly-view' : hourlyView,
				'load-screen' : loadScreen,
				
			},
			mounted () {
				this.fetchWeather();
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
				placeViewType() {
					return this.$store.state.existingPlaceView.view.placeType;
				},
				settingWeatherRange() {
					return this.$store.state.globalApp.settings.weatherRange;
				},
				
			},
			watch: {
				activeLocation () {
					this.fetchWeather();
				},
				settingWeatherRange (val) {
					if (val) {
						this.fetchWeather();
					}
				}
			},
			created: function () {
				
			},
			methods: {
				goToSaveRoute () {
					this.contextMenuOpen = false;
					this.$router.push('save-place');
				},

				openLimitsSettings () {

				},

				openPlaceSettings () {
					this.$router.push({ path: `/${this.activeLocation._userID}/${this.activeLocation.placeSlug}/settings` });
				},
		
				fetchWeather () {
					this.weatherIsLoading = true;
					if (this.placeViewType === 'saved') {
						let oid = this.activeLocation.weather[0].oid;

						// @todo: save to LocalStorage for 30 mins, only then load new weather ?
						let savedWeather = localStorage.getItem(oid);
						if (savedWeather) {
							savedWeather = JSON.parse(savedWeather);

							if (savedWeather._id == oid) {
								var time = new Date(savedWeather.updated);
								var timeout = 30 * 60000;
								var diff = Date.now() - time;
								if (diff < timeout) {
									this.$store.commit('PLACE_SAVE_WEATHER_DATA', savedWeather);
									this.weatherIsLoading = false;
									return;
								}
							}
						}
						WPAPI.getPlaceWeather(oid, this.settingWeatherRange).then((weather) => {
							this.$store.commit('PLACE_SAVE_WEATHER_DATA', weather);
							if (localStorage) {
								localStorage.setItem(oid, JSON.stringify(weather));
							}

							this.weatherIsLoading = false;
						});

						return;
					}

					if (this.placeViewType === 'temporary') {
						
						let coordinates = {
							lat: this.activeLocation.placeLat,
							lng: this.activeLocation.placeLng
						};

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
										this.weatherIsLoading = false;
										return;
									}
								}
							}
						}
						
						WPAPI.getTempPlaceWeather(coordinates, this.settingWeatherRange).then((weather) => {
							this.$store.commit('PLACE_SAVE_WEATHER_DATA', weather);
							this.weatherIsLoading = false;

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
					placeIsPublic: false,
					weatherIsLoading: true,
					contextMenuOpen: false
				}
			}
		}


</script>
<style scoped>

</style>
