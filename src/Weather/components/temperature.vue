<template>
	<div
		class="hourTemperature"
		:class="status"
	>
		{{temperature.toFixed(0)}}&deg;
	</div>
</template>

<script>
	import Vue from 'vue';

	// @todo: convert C to F depending on locale or user's settings
  
	
	export default {
		name: 'temperature',
		props: {
			temperature : {
				type : Number
			},
			status : {
				type : String
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

<style>
   
</style>
