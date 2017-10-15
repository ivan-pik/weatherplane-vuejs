<template>
	<div class="hourWindSpeed">
		<div :class="windSpeedStatus" class="hourWindSpeed__display hourWindSpeed__display--speed">{{windSpeedRounded}}</div>
		<div :class="windGustStatus" v-if="displayGust" class="hourWindSpeed__display hourWindSpeed__display--gust">{{windGustRounded}}</div>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'windSpeed',
		props: ['windSpeed','windGust','windSpeedStatus','windGustStatus'],
		computed: {
			windSpeedRounded () {
				return this.roundNumber(this.windSpeed,0);
			},
			windGustRounded () {
				return this.roundNumber(this.windGust,0);
			},
			displayGust () {
				return (this.roundNumber(this.windSpeed,0) != this.roundNumber(this.windGust,0));
			},
		},
	 
		methods: {
			roundNumber (value, length) {
				return value.toFixed(length);
			},

		},
		data () {
		  return {
			
		  }
		}

	}



</script>

<style>
   
</style>
