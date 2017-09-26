<template>
	
	
	<svg class="windSpeedChart"> 

		<defs>
			<linearGradient x1="3.061617e-15%" y1="50%" x2="97.9532047%" y2="50%" id="linearGradient-1">
				<stop stop-color="#3CBB22" offset="0%"></stop>
				<stop stop-color="#ECA079" offset="80%"></stop>
				<stop stop-color="#DF4410" offset="100%"></stop>
			</linearGradient>
		</defs>

		<line class="svgBar__threshold" stroke-dasharray="2, 3" :x1="windSpeedThresholdPixels" :x2="windSpeedThresholdPixels" y1="0" :y2="nOfItems * 50" />

		<wind-speed-bar v-for="(hourWeather, index) in weather"
			:uid="uid(hourWeather.time)" 
			:windSpeed="hourWeather.windSpeed" 
			:windGust="hourWeather.windGust"
			:maxSpeedToDisplay="maxSpeedToDisplay"
			:maxSpeedTreshold="maxSpeedTreshold"
			:key="uid(hourWeather.time)"
			:order="index"
			:chartWidth="chartWidth"
		/>

		<path :d="generatePath(windSpeedPoints)" stroke="#444" stroke-width="3" fill="none"></path>
		<path :d="generatePath(windGustPoints)" stroke="#444" stroke-width="1" fill="none"></path>

		
		

		

	</svg>
</template>

<script>
	import Vue from 'vue';
	import windSpeedBar from './windSpeedBar.vue';
  
	
	export default {
		name: 'chart',
		props: ['weather','maxSpeedToDisplay','maxSpeedTreshold'],
		components: {
			'wind-speed-bar' : windSpeedBar
		},
		computed: {
			windSpeedPoints () {
				let i = 0;
				let points = [];
				this.weather.forEach((hour) => {
					points.push([
						parseFloat(this.speedToPixels(hour.windSpeed)),
						50*i+25
					]);
					i++;
				});
				return points;
			},
			windGustPoints () {
				let i = 0;
				let points = [];
				this.weather.forEach((hour) => {
					points.push([
						parseFloat(this.speedToPixels(hour.windGust)),
						50*i+25
					]);
					i++;
				});
				return points;
			},
			nOfItems () {
				return this.weather.length;
			},

			windSpeedThresholdPixels () {
				return this.speedToPixels(this.maxSpeedTreshold);
			},
		},
		
		
	 
		methods: {
			uid(time) {
				let parsed = Date.parse(time);
				return parsed;
			},
			speedToPixels(speed) {
				return ((this.chartWidth/this.maxSpeedToDisplay) * speed).toFixed(1);
			},
			

			generatePath (points) {
				let path = "";
				let i = 0;
				
				points.forEach((point) => {
					let x = point[0];
					let y = point[1];
					if (i==0){
						path += `M${x},${y}`;
					} else {
						let sx = x;
						let sy = y;
						path += `S${sx},${sy} ${x},${y} `;
					}
					i++;
				});
				
				return path;
			}
		},
		
		data () {
		  return {
			  // @todo: find a way how to get this value dynamically - available space for the chart
			chartWidth: 400
		  }
		}

	}



</script>

