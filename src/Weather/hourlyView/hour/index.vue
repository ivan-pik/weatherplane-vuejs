<template>
	<div class="hour">

		<status :status="totalStatus" />

		<hour-time :time="weather.time" />

		<wind-speed 
			:windSpeedStatus="windSpeedStatus"
			:windGustStatus="windGustStatus" 
			:windSpeed="weather.windSpeed" 
			:windGust="weather.windGust"
		/>

		<wind-bearing  :status="windBearingStatus" :windBearing="weather.windBearing" />

		<weather-icon v-if="false" 
			:icon="weather.icon" 
			:precipProbability="weather.precipProbability" 
			:precipIntensity="weather.precipIntensity"
			:maxSpeedTreshold="settingsMaxWindSpeed"
		/>

		<temperature :temperature="weather.temperature" />
	</div>
</template>

<script>
	import Vue from 'vue';
	import Status from '../../components/status.vue';
	import hourTime from '../../components/hourTime.vue';
	import windSpeed from '../../components/windSpeed.vue';
	import windBearing from '../../components/windBearing.vue';
	import weatherIcon from '../../components/weatherIcon.vue';
	import temperature from '../../components/temperature.vue';
	
	export default {
		name: 'hour',
		props: {
			weather: {
				type: Object
			},
			order: {
				type: Number
			}
		},
		components: {
			'status' : Status,
			'hour-time': hourTime,
			
			'wind-speed' : windSpeed,
			'weather-icon' : weatherIcon,
			'wind-bearing' : windBearing,
			'temperature' : temperature
		},
		computed: {
			
			
			totalStatus() {
				if (
					this.windSpeedStatus 
					&& this.windGustStatus 
					&& this.windBearingStatus
					&& this.precipicationStatus
				) {
					return 'yes';
				}
				return 'no';
			},
			settingsMaxWindSpeed () {
				return this.$store.state.existingPlaceView.weatherThresholds.windSpeed;
				
			},
			settingsMaxWindDirectionRelToRWY () {
				return this.$store.state.existingPlaceView.weatherThresholds.windDirectionRelToRWY;
				
			},
			windSpeedStatus() {
				return (this.weather.windSpeed < this.settingsMaxWindSpeed)
			},
			windGustStatus() {
				return (this.weather.windGust < this.settingsMaxWindSpeed)
			},
			windBearingStatus() {
				// @todo: offset wind orientation with runway orientation
				if (this.weather.windBearing > this.settingsMaxWindDirectionRelToRWY) {
					return true;
				}
				return false;
			},
			precipicationStatus() {
				return (this.weather.precipProbability == 0)
			}
		},
		methods: {
		


		},
		data () {
		  return {
			
			

		  }
		}

	}



</script>

