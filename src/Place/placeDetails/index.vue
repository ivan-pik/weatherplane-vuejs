<template>
<div class="">
	<div v-if="weatherData">
		<div class="" class="mainNav mainNav--weatherDetail">
			<h1 class="mainNav__title">Woodspring Wings</h1>
			<button class="mainNav__contextMenu">...</button>
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
		import hourlyView from '../../Weather/hourlyView/index.vue';
		import {HTTP} from '../../http-common';
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
					let oid = this.activeLocation.weather[0].oid;

			
					HTTP.get('weather/' + oid)
							.then(response => {
									if (response.data.success) {

											this.$store.commit('PLACE_SAVE_WEATHER_DATA', response.data.data);
											


										}
								}).catch(err => {
						});
					
					},
					onSubmit(event) {
						this.$validator.validateAll().then(() => {

						let newPlace = {
							placeName : this.placeName,
							placeSlug : this.placeNameURL,
							userID : this.userName,
							placeLat : this.activeLocation.coordinates.lat,
							placeLng : this.activeLocation.coordinates.lng,
							placeSettings : {
								public : this.placeIsPublic
							}
						}

						HTTP.post('places', newPlace)
								.then(response => {
										if (response.data.success) {
												this.$router.push(this.userName + "/" + newPlace.placeSlug);
										}
								}).catch(err => {
								if(err.response) {
										this.onFailedPlaceSave();
								}
						});
						}).catch(() => {
								// when form is invalid
						});
					},
					onFailedPlaceSave() {
						 Vue.set(this.errors, 'placeNotSaved', true)
					}
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
