<template>
	<div class="hourWindSpeed">
		<div :class="windSpeedStatus" class="hourWindSpeed__display hourWindSpeed__display--speed">{{windSpeedDisplay}}</div>
		<div :class="windGustStatus" v-if="displayGust" class="hourWindSpeed__display hourWindSpeed__display--gust">{{windGustDisplay}}</div>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'windSpeed',
		props: ['windSpeed','windGust','windSpeedStatus','windGustStatus'],
		computed: {
			displayGust () {
				return ( this.windSpeed.toFixed() != this.windGust.toFixed() );
			},
			windUnit () {
				return this.$store.state.globalApp.settings.windUnit;
			},
			windSpeedDisplay () {
				return Math.round(this.convertWindSpeedUnit(this.windSpeed));
			},
			windGustDisplay () {
				return Math.round(this.convertWindSpeedUnit(this.windGust));
			},
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
			
		  }
		}

	}



</script>

<style>
   
</style>
