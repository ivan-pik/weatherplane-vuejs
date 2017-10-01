<template>
	<svg class="windSpeedChart"
		v-on:mousemove="cursor"
	> 
		<defs>
			<linearGradient 
				x1="3.061617e-15%" 
				y1="50%" 
				x2="97.9532047%" 
				y2="50%" 
				id="linearGradient-1"
			>
				<stop stop-color="#3CBB22" offset="0%"></stop>
				<stop stop-color="#ECA079" offset="80%"></stop>
				<stop stop-color="#DF4410" offset="100%"></stop>
			</linearGradient>
			<mask id="pathMask">

				

				<circle
					class="windSpeedChart_cursorDotMask"
					:cx="cursorX" 
					:cy="cursorY"
					r="10"
				/>


				
				<path class="windSpeedChart__windSpeed" 
					:d="curvePoints('windSpeed')" stroke="#fff" stroke-width="3" fill="none"
					ref="windSpeedPath"
				>
				</path>

				
				
			</mask>
		</defs>

		<line class="svgBar__threshold" stroke-dasharray="2, 3" :x1="windSpeedThresholdPixels" :x2="windSpeedThresholdPixels" y1="0" :y2="chartHeight" />

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

		<g mask="url(#pathMask)">
			<rect  
				width="100%" 
				class="svgBar__overThreshold" x="0" y="0" :height="chartHeight"
			/>
			<rect  
				:width="windSpeedThresholdPixels" 
				class="svgBar__windSpeed" fill="url(#linearGradient-1)" x="0" y="0" :height="chartHeight"
			/>
		</g>

		<g class="windSpeedChart_cursor">
			
			<rect  
				width="100%" 
				fill="#DF4410"
				x="0" 
				:y="cursorY-1"
				height="2"
			/>
			
			<rect  
				:width="windSpeedThresholdPixels" 
				fill="url(#linearGradient-1)"
				x="0" 
				:y="cursorY-1"
				height="2"
			/>

			<circle
				class="windSpeedChart_cursorDot"
				:cx="cursorX" 
				:cy="cursorY"
				r="5"
			/>

			
		</g>
					

		
		

	</svg>
</template>

<script>
	import Vue from 'vue';
	import windSpeedBar from './windSpeedBar.vue';
	import * as d3 from 'd3';
	
  
	
	export default {
		name: 'chart',
		props: ['weather','maxSpeedToDisplay','maxSpeedTreshold'],
		components: {
			'wind-speed-bar' : windSpeedBar
		},
	
		computed: {
			pathMaskId () {
				return "mask"+this.uid(this.weather[0].time);
			},
			chartHeight () {
				return (this.weather.length) * 50;
			},
			windSpeedThresholdPixels () {
				return this.speedToPixels(this.maxSpeedTreshold);
			},
		},
		
		
	 
		methods: {
			cursor (e) {
				let pathEl = this.$refs.windSpeedPath;
				let pathLength = pathEl.getTotalLength();
				
				let y = e.pageY;
				let pos;
				let beginning = y, end = pathLength, target;
				while (true) {
					target = Math.floor((beginning + end) / 2);
					pos = pathEl.getPointAtLength(target);
					if ((target === end || target === beginning) && pos.y !== y) {
						break;
					}
					if (pos.y > y) {
						end = target;
					}
					else if (pos.y < y) {
						beginning = target;
					}
					else break; //position found
				}
				this.cursorX = pos.x;
				this.cursorY = y;
				
			},
			pathMaskIdUrl () {
				return ('url(#' + this.pathMaskId + ')');
			},
		
			curvePoints (type) {
				let i = 0;
				let points = [];
				let speed;
				this.weather.forEach((hour) => {
					if(type == "windSpeed") {
						speed = hour.windSpeed;
					} else if (type="windGust") {
						speed = hour.windGust;
					} else {
						return false;
					}
					points.push([
						parseFloat(this.speedToPixels(speed)),
						50*i+25
					]);
					i++;
				});

				let path = d3.line().curve(d3.curveMonotoneY);
				return path(points);
			},

			uid(time) {
				let parsed = Date.parse(time);
				return parsed;
			},
			speedToPixels(speed) {
				return ((this.chartWidth/this.maxSpeedToDisplay) * speed).toFixed(1);
			}
			

		},
		
		data () {
		  return {
			  // @todo: find a way how to get this value dynamically - available space for the chart
			chartWidth: 400,
			cursorX: 0,
			cursorY: 0
		  }
		}

	}



</script>

