<template>
	<div class="weatherDetails">
		<h3 class="weatherDetails__cursorAt">
			<status :status="totalStatus" />
			<span class="weatherDetails__cursorTime">
				<span class="weatherDetails__hour">{{displayHour}}</span>:<span class="weatherDetails__minutes">{{cursorMinutes}}</span>
				<span class="weatherDetails__am-pm" v-if="ampm">{{ampm}}</span>
			</span> 
			<span class="weatherDetails__cursorDate">
				{{cursorDate}}
			</span>
		</h3>
		<div class="weatherDetails__col weatherDetails__col--1">
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Wind Speed
				</h3>
				<p class="weatherDetails__value">
					<span class="weatherDetails__valueAmount">
						{{windSpeedDisplay}} 
					</span>
					<span class="weatherDetails__valueUnit">
						{{windSpeedUnitDisplay}}
					</span>
				</p>
				<status :status="statusWindSpeed" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Gusting To
				</h3>
				<p class="weatherDetails__value">
					<span class="weatherDetails__valueAmount">
						{{windGustDisplay}}
					</span>
					<span class="weatherDetails__valueUnit">
						{{windSpeedUnitDisplay}}
					</span>
				</p>
				<status :status="statusGustSpeed" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Temperature
				</h3>
				<p class="weatherDetails__value">
					<span class="weatherDetails__valueAmount">
						{{temperatureDisplay}}
					</span>
					<span class="weatherDetails__valueUnit">
						&deg;{{temperatureUnitDisplay}}
					</span>
				</p>
				<status :status="statusTemperature" />
			</div>
		</div>
		<div class="weatherDetails__col weatherDetails__col--2">
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Wind Direction
				</h3>
				<p class="weatherDetails__value">
					<span class="weatherDetails__valueNote">Rel To RWY</span>
					<span class="weatherDetails__valueAmount">
						{{windBearingRelToRWY.toFixed(0)}}
					</span>
					<span class="weatherDetails__valueUnit">
						&deg;
					</span>
				</p>
				<status :status="statusWindDirection" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Crosswind Speed
				</h3>
				<p class="weatherDetails__value">
					<span class="weatherDetails__valueAmount">
						{{crossWindComponentDisplay}}
					</span>
					<span class="weatherDetails__valueUnit">
						{{windSpeedUnitDisplay}}
					</span>
				</p>
				<status :status="statusCrossWindComponent" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Chance of rain
				</h3>
				<p class="weatherDetails__value">
					<span class="weatherDetails__valueAmount">
						{{(precipProbability*100).toFixed(0)}}
					</span>
					<span class="weatherDetails__valueUnit">
						%
					</span>
				</p>
				<status :status="statusPrecipProbability" />
			</div>
		</div>
		

		<runway-indicator
			:activeSide="activeSide"
			:crabAngle="crabAngle"
		/>

		<wind-instrument 
			:windBearing="windBearing"
			:windDirectionRelToRWY="windDirectionRelToRWY"
			:runwayDirection="runwayDirection"
			:windSpeed="windSpeed"
			:windGust="windGust"
			:maxSpeedTreshold="maxSpeedTreshold"
			:activeSide="activeSide"
			:windBearingRelToRWY="windBearingRelToRWY"
			:settingsMaxCrossWindSpeed="settingsMaxCrossWindSpeed"
			:maxWindSpeedToDisplay="maxWindSpeedToDisplay"
			:crossWindComponent="crossWindComponent"
			:settingsMaxWindBearingToRWY="settingsMaxWindBearingToRWY"
			:statusWindDirection="statusWindDirection"
			:settingMode="settingMode"
		/>

	</div>
	
</template>

<script>
	import Vue from 'vue';
	import runwayIndicator from './runwayIndicator.vue';
	import windInstrument from './windInstrument.vue';
	import status from '../components/status.vue';

	export default {
		name: 'weatherDetails',
		
		components: {
			'runway-indicator' : runwayIndicator,
			'wind-instrument' : windInstrument,
			'status' : status
		},
		props: {
			windSpeed: {
				type: Number
			},
			windGust: {
				type: Number
			},
			temperature: {
				type: Number
			},
			windBearing: {
				type: Number
			},
			windDirectionRelToRWY: {
				type: Boolean
			},
			runwayDirection: {
				type: Number
			},
		
			precipProbability: {
				type: Number
			},
			precipIntensity: {
				type: Number
			},
			maxSpeedTreshold: {
				type: Number
			},
			activeSide: {
				type: String
			},
			windBearingRelToRWY: {
				type: Number
			},
			cursorHours: {
				type: String
			},
			cursorMinutes: {
				type: String
			},
			cursorDate: {
				type: String
			},
			settingsMaxCrossWindSpeed: {
				type: Number
			},
			maxWindSpeedToDisplay: {
				type: Number
			},
			crossWindComponent: {
				type: Number
			},
			statusWindSpeed: {
				type: String
			},
			statusGustSpeed: {
				type: String
			},
			statusTemperature: {
				type: String
			},
			statusWindDirection: {
				type: String
			},
			statusCrossWindComponent: {
				type: String
			},
			statusPrecipProbability: {
				type: String
			},
			totalStatus: {
				type: String
			},
			settingsMaxWindBearingToRWY: {
				type: Number
			},
			settingMode: {
				type: Boolean
			}
		},
		computed: {
			crabAngle () {
				return this.windBearingRelToRWY * 0.5;
			},
			timeFormat () {
				return this.$store.state.globalApp.settings.timeFormat;
			},
			displayHour () {
				if (this.timeFormat == '24-hours') {
					this.ampm = false;
					return this.cursorHours;
				} else if (this.cursorHours > 12) {
					this.ampm = 'PM';
					var time = this.cursorHours - 12;
					if (time < 10) {
						return '0' + time;
					}

				} else {
					this.ampm = 'AM';
					return this.cursorHours;
				}
			},
			temperatureUnit () {
				return this.$store.state.globalApp.settings.temperatureUnit;
			},
			windUnit () {
				return this.$store.state.globalApp.settings.windUnit;
			},
			windSpeedUnitDisplay () {
				if (this.windUnit == 'meters-per-second') {
					return 'ms';
				} else if (this.windUnit == 'kilometers-per-hour') {
					return 'kph';
				} else if (this.windUnit == 'miles-per-hour') {
					return 'mph';
				}
			},
			temperatureDisplay () {
				if (this.temperatureUnit == 'c') {
					return Math.round(this.temperature);
				} else {
					// @todo: check this is the correct mathgic
					return Math.round(this.temperature * 9 / 5 + 32);
				}
			},
			temperatureUnitDisplay () {
				return this.temperatureUnit.toUpperCase();
			},
			windSpeedDisplay () {
				return this.convertWindSpeedUnit(this.windSpeed);
			},
			windGustDisplay () {
				return this.convertWindSpeedUnit(this.windGust);
			},
			crossWindComponentDisplay () {
				return this.convertWindSpeedUnit(this.crossWindComponent);
			}
		
			
		},
		methods: {
			convertWindSpeedUnit (ms) {
				if (this.windUnit == 'meters-per-second') {
					return ms.toFixed(1);
				} else if (this.windUnit == 'kilometers-per-hour') {
					return (ms * 3.6).toFixed(1);
				} else if (this.windUnit == 'miles-per-hour') {
					return (ms * 2.2369).toFixed(1);
				}
			}
		},
		data () {
		  return {
			tempStatus: 'yes',
			ampm: false
		  }
		}

	}



</script>

<style lang="scss">

@import '~globalVars';

.weatherDetails {
	position: relative;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: 195px;
	border-color: $colorPanel;
	border-style: solid;
	border-width: 0 $widthStatusBar;
	margin-top: 5px;
}


.weatherDetails__cursorAt {
	position: absolute;
	top: -2px;
	left: 0;
	width: 100%;
	text-align: center;
	font-size: 12px;

	.status {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		top: -1px;
		margin-right: 0.2em;
		
	}
}

.weatherDetails__cursorTime {
	display: inline-block;
	min-width: 3em;
}

.weatherDetails__hour,
.weatherDetails__minutes {
	display: inline-block;
	min-width: 1.3em;
}

.weatherDetails__cursorDate {
	display: inline-block;
	min-width: 11em;
}

.weatherDetails__col {
	display: flex;
	flex-direction: column;
}

.weatherDetails__col--1 {
	grid-row: 1 / 2;
	grid-column: 1 / 2;
}

.weatherDetails__col--2 {
	grid-row: 1 / 2;
	grid-column: 2 / 3;
	text-align: right;
}

.weatherDetails__display {
	margin: 0 0 18px 0;
	position: relative;
	&:nth-child(3) {
		margin-top: auto;
		margin-bottom: 32px;
	}
	.weatherDetails__col--1 & {
		padding-left: $widthGridSpace;
	}
	.weatherDetails__col--2 & {
		padding-right: $widthGridSpace;
	}
	.status {
		position: absolute;
		top: 0;
		height: 100%;
		
		.weatherDetails__col--1 & {
			left: -$widthStatusBar;
		}
		.weatherDetails__col--2 & {
			right: -$widthStatusBar;
		}
	}
}

.weatherDetails__label {
	font-size: 9px;
	text-transform: uppercase;
	display: block;
	margin: 0 0 0.2em 0;
}

.weatherDetails__value {
	font-size: 15px;
	display: block;
}

.weatherDetails__valueUnit {
	font-size: 11px;
	color: $textLabelColour;

}

.weatherDetails__valueNote {
	font-size: 7px;
	text-transform: uppercase;
	position: absolute;
	right: 6em;
	bottom: 0.2em;
	color: $textLabelColour;
}
</style>
