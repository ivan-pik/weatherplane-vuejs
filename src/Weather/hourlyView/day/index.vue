<template>
	<div v-if="weather" class="day-list">
		
		<hour v-for="(hour, key) in weather" :weather="hour" />

		<chart v-if="displayChart" 
			:weather="weather"
			:maxSpeedToDisplay="maxWindSpeed"
			:maxSpeedTreshold="settingsMaxWindSpeed"
		/>
	</div>	
</template>

<script>
	import Vue from 'vue';
	import Hour from '../hour/index.vue';
	import Date from './date/index.vue';
	import Chart from '../../components/chart.vue';
	
	export default {
		name: 'day',
		props: {
			weather: {
				type: Array
			}
			
			
		},
		components: {
			'hour' : Hour,
			'date' : Date,
			'chart' : Chart
		},
		computed: {
			
			settingsMaxWindSpeed () {
				return this.$store.state.existingPlaceView.weatherThresholds.windSpeed;
			},
			maxWindSpeed () {
				return this.$store.getters.maxWindSpeed;
			},
			displayChart () {
				let i = 0;
				this.weather.forEach(function(hour) {
					i++;
				});
				return (i>1);
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
