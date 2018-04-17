<template>
	<div class="hour__sunTime"
		:class="'hour__sunTime--'+sunTimeKeyword"
	>
		<span class="hour__sunTime-label">
			{{sunTimeLabel}}
		</span>
		{{niceHours}}:{{niceMinutes}} 
		
	</div>
</template>

<script>

	import Vue from 'vue';
  
	
	export default {
		name: 'sunTime',
		props: {
			time: {
				type: Object // {sunRise: , sunSet: }
			}
		},
		computed: {
			sunTime () {
				if (this.time.sunRise) {
					return this.time.sunRise;
				} else if (this.time.sunSet) {
					return this.time.sunSet;
				}
			},

			sunTimeLabel () {
				if (this.time.sunRise) {
					return 'Sunrise';
				} else if (this.time.sunSet) {
					return 'Sunset';
				}
			},

			sunTimeKeyword () {
				if (this.time.sunRise) {
					return 'sunrise';
				} else if (this.time.sunSet) {
					return 'sunset';
				}
			},

			timeFormat () {
				return this.$store.state.globalApp.settings.timeFormat;
			},

			hours () {
				return (new Date(this.sunTime)).getHours();
			},
			
			niceHours() {
				var sunTimeDate = new Date(this.sunTime); 
				var hours = sunTimeDate.getHours();

				if (this.timeFormat == '24-hours') {
					return hours;
				} 

				if (hours > 12) {
					return hours - 12;
				}

				return hours;
			},
				
			niceMinutes() {
				var sunTimeDate = new Date(this.sunTime); 
				var minutes = sunTimeDate.getMinutes();

				if (minutes < 10) {
					return '0' + minutes;
				} else {
					return minutes;
				}
			},
		},
	 
		methods: {
		


		},
		
		data () {
		  return {
			
		  }
		}

	}



</script>

<style lang="scss">
	@import '~globalVars';
	.hour__sunTime {
		bottom: -0.6rem;
		font-size: 0.5rem;
		position: absolute;
		z-index: 100000;
		left: 0;
		height: 1.2rem;
		line-height: 1.2rem;
		padding: 0 1em;
		border-radius: 0 100px 100px 0;
		
	}

	.hour__sunTime--sunrise {
		background-color: $chart-colour-day;
		box-shadow: 1px 1px 1px 0 rgba(126,107,0,0.23);
	}

	.hour__sunTime--sunset {
		background-color: $chart-colour-night;
		box-shadow: 1px 1px 1px 0 #9FABB5;
	}
</style>