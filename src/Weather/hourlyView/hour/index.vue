<template>
	<div class="hour"
		v-bind:class="'hour--'+progressKeyWord"
		v-bind:style="style"
	>
		<date-label 
			 v-if="displayLabel"
			 :date="dateDisplay"
			 :scrollPosition="scrollPosition"
		/>

		<status :status="totalStatus" />

		<hour-time :time="weather.time" />

		<sun-time
			v-if="displaySunTime"
			:time="sunTime"
		 />

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

		<rain-icon
			:precipProbability="weather.precipProbability" 
			:precipIntensity="weather.precipIntensity"
			:settingsMaxPrecipProbability="settingsMaxPrecipProbability"
			:status="statusPrecipProbability"
		/>

		<temperature
			:temperature="weather.temperature"
			:status="temperatureStatus"
		/>

		<div class="sunTimeIndicator"
			v-bind:class="'sunTimeIndicator--'+progressKeyWord"
		>
			<div class="sunTimeIndicator__progress"
				:style="heightStyle"
			>

			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import dateLabel from '../../components/dateLabel.vue';
	import Status from '../../components/status.vue';
	import hourTime from '../../components/hourTime.vue';
	import sunTime from '../../components/sunTime.vue';
	import windSpeed from '../../components/windSpeed.vue';
	import windBearing from '../../components/windBearing.vue';
	import rainIcon from '../../components/rainIcon.vue';
	import temperature from '../../components/temperature.vue';
	
	export default {
		name: 'hour',
		props: {
			weather: {
				type: Object
			},
			order: {
				type: Number
			},
			scrollPosition: {
				type: Number
			},
			sunTimes: {
				type: Object
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
			'date-label' : dateLabel,
			'status' : Status,
			'hour-time': hourTime,
			'sun-time': sunTime,
			'wind-speed' : windSpeed,
			'rain-icon' : rainIcon,
			'wind-bearing' : windBearing,
			'temperature' : temperature
		},
		watch: {
			sunTimes () {
				this.computeSunTimes();
			},
			
		},
		computed: {
			rowHeight () {
				return this.$store.state.existingPlaceView.view.chart.row.height;
			},
			style () {
				return {
					height: this.rowHeight + 'px'
				}
			},
			displaySunTime () {
				if (this.progressKeyWord == 'sunRising' || this.progressKeyWord == 'sunSetting') {
					return true;
				} else {
					return false;
				}
			},
			progressKeyWord () {
				if (this.sunProgress == -1) return 'night';
				if (this.sunProgress > -1 && this.sunProgress < 0) return 'sunRising';
				if (this.sunProgress == 0) return 'day';
				if (this.sunProgress > 0 && this.sunProgress < 1) return 'sunSetting';
			},
			sunTime () {
				if (this.progressKeyWord == 'sunRising') {
					return {
						sunRise: this.sunTimes.sunriseTime,
						sunSet: ''
					};
				} else if (this.progressKeyWord == 'sunSetting') {
					return {
						sunRise: '',
						sunSet: this.sunTimes.sunsetTime
					};
				} else {
					return {};
				}
			},
			displayLabel () {
				if (this.order === 0) {
					return false;
				} else {
					var hour = (new Date(this.weather.time)).getHours();
					if (hour === 0) {
						return true;
					} else {
						return false;
					}

				}
			},
			dateDisplay () {
				var awesomeDate = new Date(this.weather.time);
				return awesomeDate.toLocaleDateString(navigator.language, { weekday: 'long', day: 'numeric', month: 'long' });
			},

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
				if (this.settingsMinTemperature <= Math.round(this.weather.temperature) && Math.round(this.weather.temperature) <= this.settingsMaxTemperature) {
					return "yes";
				}
				return "no";
			},
			statusPrecipProbability () {
				if ((this.weather.precipProbability * 100) <= this.settingsMaxPrecipProbability) {
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
			computeSunTimes () {
				
				let currentHour = (new Date(this.weather.time)).getHours();
				let sunsetHour = (new Date(this.sunTimes.sunsetTime)).getHours();
				let sunriseHour = (new Date(this.sunTimes.sunriseTime)).getHours();
				if (currentHour < sunriseHour) {
					this.sunProgress = -1; // night
				} else if (currentHour == sunriseHour) {
					let sunriseMinutes = (new Date(this.sunTimes.sunriseTime)).getMinutes();
					let progress = (sunriseMinutes / 60).toFixed(2);
					this.sunProgress = -progress; // Sun rising
				} else if (currentHour > sunriseHour && currentHour < sunsetHour) {
					this.sunProgress = 0; // Day
				}
				else if (currentHour == sunsetHour) {
					let sunsetMinutes = (new Date(this.sunTimes.sunsetTime)).getMinutes();
					let progress = (1 - sunsetMinutes / 60).toFixed(2);
					this.sunProgress = progress; // Sun setting
				} else if (currentHour > sunsetHour) {
					this.sunProgress = -1; // Night
				}

				this.calcHeightStyle(this.sunProgress);
				
			
			},

			calcHeightStyle (progress) {
				if (progress == -1 || progress == 0) {
					this.heightStyle = '';
					return;
				} 
				let height = Math.round(Math.max(Math.abs(progress) * this.rowHeight - 16, 0)); // - 16 for fade
				this.heightStyle = `height: ${height}px;`;
			},
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
				let chartSizeInfo = {
					width: dummyWidth,
					left: dummyLeftPos
				}

				this.$emit('chartSpaceDummyUpdated', chartSizeInfo);
			}
		},
		data () {
		  return {
			sunProgress: 1, // -1 night, -1 0 sunrise, 0 day, 0-1 sunset
			heightStyle: ''

		  }
		}
	}
</script>

<style lang="scss">
@import '~globalVars';

.hour {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid $colorBorder;
	padding: 0 0 0 $widthStatusBar;
	&:last-child {
		border-bottom: none;
	}

	.status {
		position: absolute;
		left: 0;
		top: -1px;
		bottom: 0px;
		min-height: 20px;
	}
	.wind-speed-bar {
		flex: 0 1 40%;
		margin-right: $widthGridSpace;

	}
	.hourWindSpeed {
		margin: 0 0 0 auto;
		padding-left: $widthGridSpace;
	}
}


// --------------------------------
.sunTimeIndicator {
	position: absolute;
	top: 0;
	left: $widthStatusBar;
	display: block;
	width: 9vw;
	min-width: 2.5rem;
	height: 100%;
	z-index: 0;
	pointer-events: none;
	
}

.sunTimeIndicator__progress {
	position: absolute;
	width: 100%;
	&:after {
		content: '';
		display: block;
		position: absolute;
		width: 100%;
		height: 16px;
	}
}

.sunTimeIndicator--night {
	background-color: rgb(229, 228, 241);
	
	.sunTimeIndicator__progress {
		display: none;
	}
}
.sunTimeIndicator--sunRising {
	background: rgb(253, 253, 216);
	.sunTimeIndicator__progress {
		top: 0;
		background-color: rgb(229, 228, 241);
		&:after {
			top: 100%;
			background: linear-gradient(to bottom, rgb(229, 228, 241) 0%,rgb(253, 253, 216) 100%); 
		}
		
	}
}
.sunTimeIndicator--day {
	background: rgb(253, 253, 216);
}
.sunTimeIndicator--sunSetting {
	background: rgb(253, 253, 216);
	.sunTimeIndicator__progress {
		bottom: 0;
		background-color: rgb(229, 228, 241);
		&:after {
			bottom: 100%;
			background: linear-gradient(to bottom, rgb(255,255,255) 0%,rgb(229, 228, 241) 100%); 
		}
	}
}
</style>
