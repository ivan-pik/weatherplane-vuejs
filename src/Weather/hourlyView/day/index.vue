<template>
	<div v-if="weather" class="day-list">


		<hour v-for="(hour, key) in weather"
			:key="key"
			:order="key" 
			:weather="hour"
			:scrollPosition="scrollPosition"
			v-on:chartSpaceDummyUpdated="chartWidthHandler"
		/>

		<chart v-if="displayChart" 
			:weather="weather"
			:maxSpeedToDisplay="maxWindSpeed"
			:maxSpeedTreshold="settingsMaxWindSpeed"
			:cursorY="cursorY"
			:cursorX="cursorX"
			:isTouch="isTouch"
			:chartWidth="chartWidth"
			:chartLeftPos="chartLeftPos"
		/>
		
	</div>	
</template>

<script>
	import Vue from 'vue';
	import Hour from '../hour/index.vue';
	import Date from './date/index.vue';
	import Chart from '../../components/chart.vue';

	// @todo: Floating date labels in the hour chart
	
	export default {
		name: 'day',
		props: {
			weather: {
				type: Array
			},
			cursorY: {
				type: Number
			},
			cursorX: {
				type: Number
			},
			isTouch: {
				type: Boolean
			},
			scrollPosition: {
				type: Number
			}
			
			
		},
		components: {
			'hour' : Hour,
			'date' : Date,
			'chart' : Chart
		},

		
		computed: {
			
			
			settingsMaxWindSpeed () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxWindSpeed;
			},
			maxWindSpeed () {
				return this.$store.getters.maxWindSpeed;
			},
			displayChart () {
				// @todo: I forgot WTF is this for?
				let i = 0;
				this.weather.forEach(function(hour) {
					i++;
				});

				if (i>1 && this.chartWidth !== false)

				return (i>1);
			}
		},
		methods: {
			chartWidthHandler (val) {
				this.chartWidth = val.width;
				this.chartLeftPos = val.left;
			},
		},
		data () {
		  return {
			  chartWidth: false,
			  chartLeftPos: 0,
		  }
		}

	}



</script>

