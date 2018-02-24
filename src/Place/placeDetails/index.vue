<template>
	<transition name="fade">
		<div v-if="weatherData && !weatherIsLoading">
			<div class="placeContextMenu">
				<button
					class="uiLink placeContextMenu__toggler"
					v-if="placeViewType=='saved'" 
					@click="placeSettingsModal=true"
				>
					Settings
				</button>
				<button
					class="uiLink uiLink--primary" v-if="placeViewType=='temporary'"
					@click="saveLocationModal=true"
					>Save location
				</button>
			</div>

			<ui-modal
				v-if="placeViewType=='saved'"
				:show="placeSettingsModal"
				:closeButton="true"
				
				@close-button-clicked="placeSettingsModal=false"
			>
				<place-settings-controls slot="content" />
			</ui-modal>

			<ui-modal
				v-if="placeViewType=='temporary'"
				:show="saveLocationModal"
				:closeButton="true"
				:popup="true"
				@close-button-clicked="saveLocationModal=false"
			>
				<save-place
					slot="content"
					@place-saved="placeSavedHandler"
				/>
			</ui-modal>
			
			<weather-details-data :weather="weatherData.hourly" />
			<hourly-view :weather="weatherData" />
		</div>
		<load-screen
			v-else
			text="Loading Weather"
		/>

	</transition>


</template>
<script>
		import Vue from 'vue';
		import WPAPI from '../../wpapi/index';
		import hourlyView from '../../Weather/hourlyView/index.vue';
		import weatherDetailsData from './weatherDetailsData.vue';
		import loadScreen from '../../uiComponents/loadScreen.vue';
		import savePlace from 'Place/saveLocation.vue'
		import PlaceSettingsControls from 'Place/PlaceSettingsView/placeSettingsControls.vue'
	

		export default {
			name: 'placeDetails',
			components: {
				'weather-details-data' : weatherDetailsData,
				'hourly-view' : hourlyView,
				'load-screen' : loadScreen,
				'save-place' : savePlace,
				'place-settings-controls' : PlaceSettingsControls
				
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
			

				placeSavedHandler (url) {
					this.saveLocationModal = false;
					setTimeout(() => {
						this.$router.push(url);
					}, this.MODEL_OFF_TIMEOUT);
					
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
					saveLocationModal: false,
					placeSettingsModal: false,
					MODEL_OFF_TIMEOUT: 800
				}
			}
		}


</script>
<style lang="scss">

	@import '~globalVars';

	.placeContextMenu {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 1;
		padding: 0 0.5em;
	}

</style>
