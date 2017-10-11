<template>
<div>
	<weather-details
		:windSpeed="windSpeed"
		:windGust="windGust"
		:temperature="temperature"
		:windBearing="windBearing"
		:windDirectionRelToRWY="true"
		:crossWindSpeed="0"
		:precipProbability="precipProbability" 
		:precipIntensity="0"
		:maxSpeedTreshold="settingsMaxWindSpeed"
		:activeSide="activeSide"
	></weather-details>


</div>
</template>
<script>
	import Vue from 'vue';

	import weatherDetails from '../../Weather/weatherDetails/weatherDetails.vue';
	
	export default {
		name: 'WeatherDetailsData',
		components: {
			'weather-details' : weatherDetails
		},
		props: {
			weather: {
				type: Array
			}
		},
		computed: {
			progress () {
				return this.$store.state.existingPlaceView.view.chartCursorPosition.progress;
			},
			index () {
				return this.$store.state.existingPlaceView.view.chartCursorPosition.index;
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
				return this.$store.state.existingPlaceView.weatherThresholds.windSpeed;
			},
			angle () {
				//@todo: offset for runway
				return this.windBearing;
			},
			activeSide () {
				if (0 < this.angle && this.angle < 180) {
					return "right";
				} else if (180 < this.angle && this.angle < 360) {
					return "left";
				} else {
					return "none";
				}
			},
		},
	 
		methods: {
			interpolateLinear(current,next) {
				return parseFloat((current + (next - current) * this.progress).toFixed(1));
			}
		
		},
		
		data () {
		  return {
			leftSide: true,
			rightSide: false
		  }
		}

	}
</script>

