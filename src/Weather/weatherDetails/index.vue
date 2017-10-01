<template>
	<div class="weatherDetails">
		<h3 class="weatherDetails__cursorAt">
			<svg class="weatherDetails__globalIndicator"></svg>
			<span class="weatherDetails__cursorTime">15:00</span> Friday 19 August 
		</h3>
		<div class="weatherDetails__col weatherDetails__col--1">
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Wind Speed
				</h3>
				<p class="weatherDetails__value">
					13 ms
				</p>
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Gusting To
				</h3>
				<p class="weatherDetails__value">
					16 ms
				</p>
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Temperature
				</h3>
				<p class="weatherDetails__value">
					16 &deg;
				</p>
			</div>
		</div>
		<div class="weatherDetails__col weatherDetails__col--2">
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Wind Direction
				</h3>
				<p class="weatherDetails__value">
					<span class="weatherDetails__valueNote">Rel To RWY</span>
					45 &deg;
				</p>
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Crosswing Speed
				</h3>
				<p class="weatherDetails__value">
					7 ms
				</p>
			</div>
			<div class="weatherDetails__display">
				<h3 class="weatherDetails__label">
					Chance of rain
				</h3>
				<p class="weatherDetails__value">
					0 %
				</p>
			</div>
		</div>
		<div class="limitSettingsOverview">
			<button class="limitSettingsOverview__button">
				Max Limits
			</button>
			<div class="limitSettingsOverview__param">
				<svg class="limitSettingsOverview__icon limitSettingsOverview__icon--windSpeed"></svg>
				<h3 class="limitSettingsOverview__label">Wind Speed</h3>
				<p class="limitSettingsOverview__value">20 ms</p>
			</div>
			<div class="limitSettingsOverview__param">
				<svg class="limitSettingsOverview__icon limitSettingsOverview__icon--crossWind"></svg>
				<h3 class="limitSettingsOverview__label">Cross Wind</h3>
				<p class="limitSettingsOverview__value">10 ms</p>
			</div>
			<div class="limitSettingsOverview__param">
				<svg class="limitSettingsOverview__icon limitSettingsOverview__icon--windDirection"></svg>
				<h3 class="limitSettingsOverview__label">Wind Direction</h3>
				<p class="limitSettingsOverview__value">± 70&deg;</p>
			</div>
		</div>

		<runway-indicator />

		<wind-instrument />

	</div>
	
</template>

<script>
	import Vue from 'vue';
	import runwayIndicator from './runwayIndicator.vue';
	import windInstrument from './windInstrument.vue';

	export default {
		name: 'day',
		
		components: {
			'runway-indicator' : runwayIndicator,
			'wind-instrument' : windInstrument
			
		},
		computed: {
			
			
		},
		methods: {
			

		},
		data () {
		  return {
			
		  }
		}

	}



</script>
