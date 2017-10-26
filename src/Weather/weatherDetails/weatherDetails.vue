<template>
	<div class="weatherDetails">
		<h3 class="weatherDetails__cursorAt">
			<status :status="totalStatus" />
			<span class="weatherDetails__cursorTime">
				<span class="weatherDetails__hour">{{cursorHours}}</span>:<span class="weatherDetails__minutes">{{cursorMinutes}}</span>
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
					{{windSpeed.toFixed(1)}} ms
				</p>
				<status :status="statusWindSpeed" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Gusting To
				</h3>
				<p class="weatherDetails__value">
					{{windGust.toFixed(1)}} ms
				</p>
				<status :status="statusGustSpeed" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Temperature
				</h3>
				<p class="weatherDetails__value">
					{{temperature.toFixed(0)}} &deg;C
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
					{{windBearingRelToRWY.toFixed(0)}} &deg;
				</p>
				<status :status="statusWindDirection" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Crosswing Speed
				</h3>
				<p class="weatherDetails__value">
					{{crossWindComponentRounded}} ms
				</p>
				<status :status="statusCrossWindComponent" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Chance of rain
				</h3>
				<p class="weatherDetails__value">
					{{(precipProbability*100).toFixed(0)}} %
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
		name: 'day',
		
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
			crossWindComponentRounded () {
				return (this.crossWindComponent).toFixed(1);
			},
			crabAngle () {
				return this.windBearingRelToRWY * 0.5;
			}
			
		},
		methods: {
			

		},
		data () {
		  return {
			tempStatus: 'yes'
		  }
		}

	}



</script>
