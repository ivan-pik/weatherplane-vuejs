<template>
	<div class="weatherDetails">
		<h3 class="weatherDetails__cursorAt">
			<status :status="tempStatus" />
			<span class="weatherDetails__cursorTime">15:00</span> Friday 19 August 
		</h3>
		<div class="weatherDetails__col weatherDetails__col--1">
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Wind Speed
				</h3>
				<p class="weatherDetails__value">
					{{windSpeed}} ms
				</p>
				<status :status="tempStatus" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Gusting To
				</h3>
				<p class="weatherDetails__value">
					{{windGust}} ms
				</p>
				<status :status="tempStatus" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Temperature
				</h3>
				<p class="weatherDetails__value">
					{{temperature}} &deg;
				</p>
				<status :status="tempStatus" />
			</div>
		</div>
		<div class="weatherDetails__col weatherDetails__col--2">
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Wind Direction
				</h3>
				<p class="weatherDetails__value">
					<span class="weatherDetails__valueNote">Rel To RWY</span>
					{{windBearing}} &deg;
				</p>
				<status :status="tempStatus" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Crosswing Speed
				</h3>
				<p class="weatherDetails__value">
					{{crossWindSpeed}} ms
				</p>
				<status :status="tempStatus" />
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Chance of rain
				</h3>
				<p class="weatherDetails__value">
					{{precipProbability}} %
				</p>
				<status :status="tempStatus" />
			</div>
		</div>
		

		<runway-indicator
			:activeSide="activeSide"
		/>

		<wind-instrument 
			:windBearing="windBearing"
			:windDirectionRelToRWY="windDirectionRelToRWY"
			:windSpeed="windSpeed"
			:windGust="windGust"
			:maxSpeedTreshold="maxSpeedTreshold"
			:activeSide="activeSide"
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
			crossWindSpeed: {
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
			}
		},
		computed: {
			
			
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
