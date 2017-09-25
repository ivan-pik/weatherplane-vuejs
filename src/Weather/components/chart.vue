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

		<path :d="generatePath('windSpeed')" stroke="#444" stroke-width="3" fill="none"></path>

		<path :d="generatePath('windGust')" stroke="orange" stroke-width="1" fill="none"></path>
		

		

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

			nOfItems () {
				return this.weather.length;
			},

			windSpeedThresholdPixels () {
				return this.speedToPixels(this.maxSpeedTreshold);
			},
			
			// @todo: this needs to relate to the width of wind bar, make windBar send back it's width in pixels to store?
			// @todo: finish this :) https://css-tricks.com/svg-path-syntax-illustrated-guide/

			
			
		
		},
		
		
	 
		methods: {
			uid(time) {
				let parsed = Date.parse(time);
				return parsed;
			},
			speedToPixels(speed) {
				return ((this.chartWidth/this.maxSpeedToDisplay) * speed).toFixed(1);
			},
			generatePath (attribute) {
				let path = "";
				let i = 0;
				this.weather.forEach((hour) => {
					
					var value = 0;
					
					if (attribute == "windSpeed") {
						 value = hour.windSpeed;
					} else if (attribute=="windGust") {
						 value = hour.windGust;
					}


					if (i==0){
						path += "M " + this.speedToPixels(value) + ",25";
						
					} else {
						let coordinates = (25 + (i * 50));
						let speed = this.speedToPixels(value);

						path += " L " + speed + ", " + coordinates; // @todo: build the bezier path string
					}
					i++;
				});
				
				return path;
			}
		},
		
		data () {
		  return {
			  // @todo: find a way how to get this value dynamically - available space for the chart
			chartWidth: 300
		  }
		}

	}



</script>

