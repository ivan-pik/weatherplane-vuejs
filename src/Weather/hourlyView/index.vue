<template>
	<div class="weather-hourly">
		<day :weather="weather.hourly"  />
	</div>
</template>

<script>
	import Vue from 'vue';
	import Day from './day/index.vue';
	
	export default {
		name: 'hourlyView',
		components: {
			'day' : Day
		},
		created: function () {

		},
		props: {
			weather: {
				type: Object
			}
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

<style>

</style>