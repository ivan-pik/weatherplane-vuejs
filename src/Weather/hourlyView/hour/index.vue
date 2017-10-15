<template>
	<div class="hour">

		<status :status="totalStatus" />

		<hour-time :time="weather.time" />

		<div v-if="order==0" class="hour__spaceDummy" ref="hourSpaceDummy"></div>

		<wind-speed 
			:windSpeedStatus="windSpeedStatus"
			:windGustStatus="windGustStatus" 
			:windSpeed="weather.windSpeed" 
			:windGust="weather.windGust"
		/>

		<wind-bearing
			:status="windBearingStatus"
			:windBearing="weather.windBearing"
			:runwayDirection="settingsRunwayOrientation"
			:settingsMaxWindBearing="settingsMaxWindBearing"
			:settingsMaxCrossWindSpeed="settingsMaxCrossWindSpeed"
			:windSpeed="weather.windSpeed"
			:bearingRelToRWY="bearingRelToRWY"
			:statusWindDirection="statusWindDirection"
			:activeSide="activeSide"
			:statusCrossWindComponent="statusCrossWindComponent"
		/>

		<weather-icon
			:icon="weather.icon" 
			:precipProbability="weather.precipProbability" 
			:precipIntensity="weather.precipIntensity"
			:settingsMaxPrecipProbability="settingsMaxPrecipProbability"
			:status="statusPrecipProbability"
		/>

		<temperature
			:temperature="weather.temperature"
			:status="temperatureStatus"
		/>
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
		mounted () {
			if(this.order === 0) {
				this.checkWidthForChart();
				window.addEventListener('resize', this.resizeHandler);
			}
		},
		beforeDestroy () {
			window.removeEventListener('resize', this.resizeHandler);
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

			settingsRunwayOrientation () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.runwayOrientation);
			},

			crossWindComponent () {
				let speed = this.weather.windSpeed;
				let angleInRadians = this.toRadians(Math.abs(this.bearingRelToRWY));
				return speed * Math.sin(angleInRadians);
			},

			settingsMaxWindBearing () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxWindBearingToRWY);

			},

			settingsMaxPrecipProbability () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxPrecipProbability;
			},
			totalStatus () {
				let params = [
					this.windSpeedStatus,
					this.windGustStatus,
					this.temperatureStatus,
					this.statusWindDirection,
					this.statusCrossWindComponent,
					this.statusPrecipProbability
				];

				console.log(this.statusCrossWindComponent);

				let isNo = function (element, index, array) {
					return element == "no";
				}

				if(params.some(isNo)) {
					return "no"
				} 
				return "yes"
			},
			settingsMaxWindSpeed () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxWindSpeed;
			},
			settingsMaxWindDirectionRelToRWY () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxWindBearingToRWY;
			},
			settingsMinTemperature () {
				return this.$store.state.existingPlaceView.place.placeSettings.minTemperature;
			},
			settingsMaxTemperature () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxTemperature;
			},
			temperatureStatus () {
				if (this.settingsMinTemperature < this.weather.temperature || this.weather.temperature < this.settingsMaxTemperature) {
					return "yes";
				}
				return "no";
			},
			statusPrecipProbability () {
				if (this.weather.precipProbability <= this.settingsMaxPrecipProbability) {
					return "yes";
				}
				return "no";
			},
			statusCrossWindComponent () {
				return this.toStatus(this.crossWindComponent >= this.settingsMaxCrossWindSpeed);
			},
			windSpeedStatus() {
				return this.toStatus(this.weather.windSpeed >= this.settingsMaxWindSpeed);
			},
			windGustStatus() {
				return this.toStatus(this.weather.windGust >= this.settingsMaxWindSpeed);
			},
			settingsMaxCrossWindSpeed () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxCrossWindSpeed);
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
			},
			statusWindDirection () {
				return this.toStatus(Math.abs(this.bearingRelToRWY) > this.settingsMaxWindBearingToRWY);
			},
			settingsMaxWindBearingToRWY () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxWindBearingToRWY);
			},
			bearingRelToRWY () {
				
				let activeSide;
				let relBearing;
				let runway = this.settingsRunwayOrientation;
				let windBearing = this.weather.windBearing;

				
				// @todo: DRY DRY DRY!!!! all those calculations are copied from windInstrument...bleugh...!!! CBA right now :)

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
				//@todo: refactor this dirty side effect
				this.activeSide = activeSide;
				return relBearing;

				
			},
		},

		methods: {
			toRadians (angle) {
				return angle * (Math.PI / 180);
			},
			toStatus (val) {
				if (val == true) {
					return "no";
				} else {
					return "yes";
				}
			},
			resizeHandler () {
				// @todo: this could potentially be slow
				// @todo: Hide the chart during resizing?
				this.checkWidthForChart();
			},
			checkWidthForChart () {
				let dummyWidth = this.$refs.hourSpaceDummy.clientWidth;
				let dummyLeftPos = (this.$refs.hourSpaceDummy.getBoundingClientRect()).left;
				console.log('emitting event');
				let chartSizeInfo = {
					width: dummyWidth,
					left: dummyLeftPos
				}

				this.$emit('chartSpaceDummyUpdated', chartSizeInfo);
			}
		},
		data () {
		  return {
			
			

		  }
		}

	}



</script>

