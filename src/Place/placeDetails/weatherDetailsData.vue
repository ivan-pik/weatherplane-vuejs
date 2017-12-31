<template>
	<div>
		<weather-details
			:windSpeed="windSpeed"
			:windGust="windGust"
			:temperature="temperature"
			:windBearing="windBearing"
			:windBearingRelToRWY="windBearingRelToRWY"
			:windDirectionRelToRWY="true"
			:precipProbability="precipProbability" 
			:precipIntensity="0"
			:maxSpeedTreshold="settingsMaxWindSpeed"
			:activeSide="activeSide"
			:runwayDirection="settingsRunwayOrientation"
			:cursorHours="cursorHours"
			:cursorMinutes="cursorMinutes"
			:cursorDate="cursorDate"
			:settingsMaxCrossWindSpeed="settingsMaxCrossWindSpeed"
			:maxWindSpeedToDisplay="maxWindSpeedToDisplay"
			:crossWindComponent="crossWindComponent"
			:statusWindSpeed="statusWindSpeed"
			:statusGustSpeed="statusGustSpeed"
			:statusTemperature="statusTemperature"
			:statusWindDirection="statusWindDirection"
			:statusCrossWindComponent="statusCrossWindComponent"
			:statusPrecipProbability="statusPrecipProbability"
			:totalStatus="totalStatus"
			:settingsMaxWindBearingToRWY="settingsMaxWindBearingToRWY"
			:settingMode="limitsSettingsPanelOpen"
		></weather-details>

		<weather-settings-overview
			v-on:buttonClicked="openWeatherLimitsSettings"
		/>

		<weather-limit-settings
			:controls="limitSettingsControls"
			v-if="limitsSettingsPanelOpen"
			v-on:closePanel="openWeatherLimitsSettings"
			v-on:saveSettings="saveSettings"
			:settings="limitSettingsControls"
		/>
	</div>
</template>
<script>
	import Vue from 'vue';

	import weatherDetails from '../../Weather/weatherDetails/weatherDetails.vue';
	import limitSettingsOverview from '../../Weather/weatherDetails/limitSettingsOverview.vue';
	import limitSettings from '../../Weather/weatherDetails/limitSettings.vue';

	import {HTTP} from '../../http-common';
	
	export default {
		name: 'WeatherDetailsData',
		components: {
			'weather-details' : weatherDetails,
			'weather-settings-overview' : limitSettingsOverview,
			'weather-limit-settings' : limitSettings
		},
		props: {
			weather: {
				type: Array
			}
		},
		computed: {
			limitSettingsControls () {
				let controls = {
					windSpeed: {
						name: 'windSpeed',
						label: 'Max wind speed',
						maxValue: 50,
						currentValue: this.settingsMaxWindSpeed
					},
					crossWindSpeed: {
						name: 'crossWindSpeed',
						label: 'Max cross wind speed',
						maxValue: this.settingsMaxWindSpeed,
						currentValue: this.settingsMaxCrossWindSpeed
					},
					bearing: {
						name: 'bearing',
						label: 'Max crosswind bearing',
						minValue: 0,
						maxValue: 90,
						currentValue: this.settingsMaxWindBearingToRWY
					},
					minTemperature: {
						name: 'minTemperature',
						label: 'Minimal Temperature',
						minValue: -40,
						maxValue: this.settingsMaxTemperature,
						currentValue: this.settingsMinTemperature
					},
					maxTemperature: {
						name: 'maxTemperature',
						label: 'Maximal Temperature',
						minValue: this.settingsMinTemperature,
						maxValue: 50,
						currentValue: this.settingsMaxTemperature
					},
					precipitation: {
						name: 'precipitation',
						label: 'Chance of Rain',
						minValue: 0,
						maxValue: 100,
						currentValue: this.settingsMaxPrecipProbability
					},
				};
				return controls;
			},
			limitsSettingsPanelOpen () {
				return this.$store.state.existingPlaceView.view.limitsSettings.panelOpen;
			},
			statusWindSpeed () {
				return this.toStatus(this.windSpeed > this.settingsMaxWindSpeed);
			},
			statusGustSpeed () {
				return this.toStatus(this.windGust > this.settingsMaxWindSpeed);
			},
			statusTemperature () {
				return this.toStatus(this.temperature > this.settingsMaxTemperature || this.temperature < this.settingsMinTemperature);
			},
			statusWindDirection () {
				return this.toStatus(Math.abs(this.windBearingRelToRWY) > this.settingsMaxWindBearingToRWY);
			},
			statusCrossWindComponent () {
				return this.toStatus(this.crossWindComponent > this.settingsMaxCrossWindSpeed);
			},
			statusPrecipProbability () {
				return this.toStatus(this.precipProbability >= this.settingsMaxPrecipProbability);
			},

			totalStatus () {
				let params = [
					this.statusWindSpeed,
					this.statusGustSpeed,
					this.statusTemperature,
					this.statusWindDirection,
					this.statusCrossWindComponent,
					this.statusPrecipProbability
				]

				let isNo = function (element, index, array) {
					return element == "no";
				}

				if(params.some(isNo)) {
					return "no"
				} 
				return "yes"
			},

			crossWindComponent () {
				let speed = this.windSpeed;
				let angleInRadians = this.toRadians(Math.abs(this.windBearingRelToRWY));
				return speed * Math.sin(angleInRadians);
			},
			maxWindSpeedToDisplay () {
				return this.$store.getters.maxWindSpeed;
			},
			progress () {
				return this.$store.state.existingPlaceView.view.chartCursorPosition.progress;
			},
			index () {
				return this.$store.state.existingPlaceView.view.chartCursorPosition.index;
			},
			cursorHours () {
				var awesomeDate = new Date(this.weather[this.index].time);   
				return awesomeDate.toLocaleTimeString(navigator.language, {hour: 'numeric'});
			},
			cursorMinutes () {
				let minutes = (this.interpolateLinear(0,60)).toFixed(0);
				if (minutes < 10) {
					minutes = "0" + minutes;
				}
				return minutes;
			},
			cursorDate () {
				var awesomeDate = new Date(this.weather[this.index].time);
				return awesomeDate.toLocaleDateString(navigator.language, { weekday: 'long', day: 'numeric', month: 'long' });
			},
			windSpeed () {
				return this.interpolateLinear(
					this.weather[this.index].windSpeed, 
					this.weather[this.index+1].windSpeed
				);
			},
			windGust () {
				return this.interpolateLinear(
					this.weather[this.index].windGust, 
					this.weather[this.index+1].windGust
				);
			},
			temperature () {
				return this.interpolateLinear(
					this.weather[this.index].temperature, 
					this.weather[this.index+1].temperature
				);
			},
			windBearing () {
				return this.interpolateLinear(
					this.weather[this.index].windBearing, 
					this.weather[this.index+1].windBearing
				);
			},
			precipProbability () {
				return this.interpolateLinear(
					this.weather[this.index].precipProbability, 
					this.weather[this.index+1].precipProbability
				);
			},
			settingsMaxWindSpeed () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxWindSpeed);
			},
			settingsMaxCrossWindSpeed () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxCrossWindSpeed);
			},
			settingsMaxWindBearingToRWY () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxWindBearingToRWY);
			},
			settingsRunwayOrientation () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.runwayOrientation);
			},
			settingsMinTemperature () {
				return this.$store.state.existingPlaceView.place.placeSettings.minTemperature;
			},
			settingsMaxTemperature () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxTemperature;
			},
			settingsMaxPrecipProbability () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxPrecipProbability;
			},
			windBearingRelToRWY () {

				let activeSide;
				let relBearing;
				let runway = this.settingsRunwayOrientation;
				let windBearing = this.windBearing;

				
	

				// offset values for the runway orientation

				let offset = runway - 90;
				windBearing = windBearing - offset;
				// windBearing must not be negative
				if (windBearing < 0) {
					windBearing = 360 - windBearing;
				}
				// windBearing must not be larger or equal to 360
				if (windBearing >= 360) {
					windBearing = windBearing - 360;
				}

				// now pretend runway at 90deg

				if (windBearing == 0 || windBearing == 180) {
					activeSide = "none";
					relBearing = windBearing - 90;
				}  else if (windBearing <= 90 || (windBearing > 90 && windBearing < 180)) {
					activeSide = "left";
					relBearing = (windBearing -90);
				} else if (
					(windBearing > 180 && windBearing <= 270) || windBearing > 270) {
					activeSide = "right"
					relBearing = 270 - windBearing;
				} 

				this.activeSide = activeSide;
				return relBearing;
			},
		},
	 
		methods: {
			saveSettings (value) {

				let newSettings = {
					maxCrossWindSpeed: value.crossWindSpeed.currentValue,
					maxPrecipProbability: value.precipitation.currentValue,
					maxWindBearingToRWY: value.bearing.currentValue,
					maxWindSpeed: value.windSpeed.currentValue,
					minTemperature: value.minTemperature.currentValue,
					maxTemperature: value.maxTemperature.currentValue
				};

				// @todo move this to some API module

				HTTP.post('places/'+this.$route.params.username + "/" + this.$route.params.place + '/update-limits', newSettings)
					.then(response => {
						if (response.data.success) {

							this.$store.commit('GLOBAL_ADD_MESSAGE', {
								text: 'Settings updated',
								type: 'success',
								dismiss: 'auto'
							});

						}
					}).catch(err => {
						if(err.response) {
							this.onFailedPlaceSave();
						}
					});
				

				this.$store.dispatch('PLACE_UPDATE_LIMITS_SETTINGS', newSettings);
			},
			openWeatherLimitsSettings (val) {
				let toggle;
				if (val !== undefined) {
					toggle = val;
				} else if (this.limitsSettingsPanelOpen) {
					toggle = false;
				} else {
					toggle = true;
				}
				this.$store.commit('PLACE_VIEW_LIMITS_SETTINGS', toggle);
			},
			toStatus (val) {
				if (val == true) {
					return "no";
				} else {
					return "yes";
				}
			},
			interpolateLinear(current,next) {
				return parseFloat(current + (next - current) * this.progress);
			},
			toRadians (angle) {
				return angle * (Math.PI / 180);
			},
		
		},
		
		data () {
		  return {
			leftSide: true,
			rightSide: false,
			activeSide : "none"
		  }
		}

	}
</script>

