<template>
	<div class="hour__sunTime"
		:class="'hour__sunTime'+sunTimeKeyword"
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

<style>
	.hour__sunTime {
		bottom: 0;
		font-size: 9px;
		position: absolute;
		z-index: 1000;
		left: 10px;
	}
</style>