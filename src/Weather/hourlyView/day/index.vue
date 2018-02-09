<template>
	<div v-if="weather" class="day-list">


		<hour v-for="(hour, key) in weather"
			:key="key"
			:order="key"
			:sunTimes="sunTimes[key]" 
			:weather="hour"
			:scrollPosition="scrollPosition"
			v-on:chartSpaceDummyUpdated="chartWidthHandler"
		/>

		<chart-cursor
			:width="Math.max(chartWidth - CHART_OFFSET_X, 0)"
			:left="chartLeftPos + CHART_OFFSET_X"
			:top="cursorScreenY"
			:chartX="chartX"
			:viewportHeight="viewPortHeight"
			:cursorPositionEdges="cursorPositionEdges"
			:chartHeight="chartHeight"
			:pixelTreshold="pixelTreshold"
		/>

		<chart v-if="displayChart" 
			:weather="weather"
			:maxSpeedToDisplay="maxWindSpeed"
			:maxSpeedTreshold="settingsMaxWindSpeed"
			:cursorY="cursorY"
			:chartWidth="chartWidth"
			:chartLeftPos="chartLeftPos"
			v-on:chart-x-update="setChartX"
			v-on:treshold-pixel-change="setPixelTreshold"
		/>
		
	</div>	
</template>

<script>
	import Vue from 'vue';
	import Hour from '../hour/index.vue';
	import Date from './date/index.vue';
	import Chart from '../../components/chart.vue';
	import ChartCursor from '../../components/chartCursor.vue';

	// @todo: Floating date labels in the hour chart
	
	export default {
		name: 'day',
		props: {
			weather: {
				type: Array
			},
			sunTimes: {
				type: Array
			},
			cursorY: {
				type: Number
			},
			cursorScreenY: {
				type: Number
			},
			
		
			scrollPosition: {
				type: Number
			},
			chartHeight: {
				type: Number
			}
			
			
		},
		components: {
			'hour' : Hour,
			'date' : Date,
			'chart' : Chart,
			'chart-cursor' : ChartCursor
		},
		mounted () {
			this.viewPortHeight = window.innerHeight;
			window.addEventListener('resize', this.resizeHandler);
		},
		beforeDestroy () {
			window.removeEventListener('resize', this.resizeHandler);
		},
		computed: {
			settingsMaxWindSpeed () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxWindSpeed;
			},
			maxWindSpeed () {
				return this.$store.getters.maxWindSpeed;
			},
			displayChart () {
				if (this.weather.length > 0) {
					return true;
				}
			}
		},
		methods: {
		
			resizeHandler (ev) {
				// @todo: debounce
				this.viewPortHeight = window.innerHeight;
			},
			chartWidthHandler (val) {
				this.chartWidth = val.width;
				this.chartLeftPos = val.left;
			},
			setChartX (val) {
				this.chartX = val.x;
				this.cursorPositionEdges = val.endPoint;
			},
			setPixelTreshold (val) {
				this.pixelTreshold = parseFloat(val);
			}
		},
		data () {
		  return {
			  chartWidth: 0,
			  chartLeftPos: 10,
			  CHART_OFFSET_X: 10,
			  chartX: 0,
			  viewPortHeight: 0,
			  cursorPositionEdges: '',
			  pixelTreshold: 0,
			  
		  }
		}

	}



</script>

