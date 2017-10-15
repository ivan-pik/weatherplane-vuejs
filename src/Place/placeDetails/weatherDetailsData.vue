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

	></weather-details>

	


</div>
</template>
<script>
	import Vue from 'vue';

	import weatherDetails from '../../Weather/weatherDetails/weatherDetails.vue';
	
	
	export default {
		name: 'WeatherDetailsData',
		components: {
			'weather-details' : weatherDetails,
			
		},
		props: {
			weather: {
				type: Array
			}
		},
		computed: {
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

