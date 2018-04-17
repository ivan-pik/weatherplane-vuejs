<template>
	<div class="hour__time"
		:class="{
			'hour__time--24h' : (this.timeFormat == '24-hours'),
			'hour__time--12h' : (this.timeFormat != '24-hours'),
		}"
	>
	   {{niceHour}} 
	   <span class="hour__time__sup">
	   	{{sup}}
	   </span>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'hourTime',
		props: ['time'],
		computed: {

			timeFormat () {
				return this.$store.state.globalApp.settings.timeFormat;
			},

			sup () {
				if (this.timeFormat == '24-hours') {
					return '00';
				} else if (this.hours > 12) {
					return 'PM'
				} else {
					return 'AM'
				}
			},

			// @todo: if 12h format is used, display AM/PM in separate node for styling
			// @todo: read time format from user settings

			hours () {
				return (new Date(this.time)).getHours();
			},
			
			niceHour() {
				var awesomeDate = new Date(this.time); 
				var hours = awesomeDate.getHours();

				if (this.timeFormat == '24-hours') {
					return hours;
				} 

				if (hours > 12) {
					return hours - 12;
				}

				return hours;
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
.hour__time {
	font-size: 1rem;
	padding: 0 0.3rem 0 0;
	width: var(--layout-chart-time-width);
	z-index: 1;
	text-align: right;
}

.hour__time__sup {
	vertical-align: top;
	font-size: 8px;
	position: relative;
	left: -0.3em;
	top: 0.15em;
}

.hour__spaceDummy {
	flex: 1 1 auto;
	margin-left: $widthStatusBar;
}
</style>
