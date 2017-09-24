<template>
	<div v-if="weather" class="day-list">
		<date :time="day.time" />
		<hour v-for="(hour, key) in weather" :weather="hour" />
		<chart v-if="displayChart" :weather="weather" />
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
			},
			day: {
				type: Object
			},
			
		},
		components: {
			'hour' : Hour,
			'date' : Date,
			'chart' : Chart
		},
		computed: {
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
