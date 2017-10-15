<template>
	<svg class="windSpeedChart"
		:style="chartStyle"
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
				<stop stop-color="#3CBB22" offset="70%"></stop>
				<stop stop-color="#ECA079" offset="90%"></stop>
				<stop stop-color="#DF4410" offset="100%"></stop>
			</linearGradient>
			<mask id="pathMask">

				<circle
					class="windSpeedChart_cursorDotMask"
					:cx="positionX" 
					:cy="positionY"
					r="10"
				/>

				<path class="windSpeedChart__windSpeed" 
					
					:d="curvePoints('windSpeed')" stroke="#fff" stroke-width="3" fill="none"
					ref="windSpeedPath"
				>
				</path>

				
				
			</mask>
		</defs>

		<line class="svgBar__threshold" 
			:x1="windSpeedThresholdPixels"
			:x2="windSpeedThresholdPixels" 
			:y2="chartHeight"
			y1="0"
		/>

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
				:y="positionY-1"
				height="2"
			/>
			
			<rect  
				:width="windSpeedThresholdPixels" 
				fill="url(#linearGradient-1)"
				x="0" 
				:y="positionY-1"
				height="2"
			/>

			<circle
				class="windSpeedChart_cursorDot"
				:cx="positionX" 
				:cy="positionY"
				r="5"
			/>

			
		</g>
					

	</svg>
</template>

<script>
	/* @todo: the cursor position is lagging in Y axis when used on 
	a touch device, potentially even on slow computers while scrolling 
	idea: Separate the cursor into it's own SVG which would be positioned or translated via CSS in it's own layer, this should be way faster
	The cursor will need it's own gradient with mask for the dot to change colour
	*/


	import Vue from 'vue';
	import windSpeedBar from './windSpeedBar.vue';
	import * as d3 from 'd3';
	
  
	
	export default {
		name: 'chart',
		props: ['weather','maxSpeedToDisplay','maxSpeedTreshold','cursorY','cursorX','is-touch','chartWidth','chartLeftPos'],
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
			position () {
				return {
					x: this.cursorX,
					y: this.cursorY
				}
			},
			chartStyle () {
				return "width:" + this.chartWidth + "px; left:" + this.chartLeftPos + "px;";
			}
		},

		watch: {
			cursorY (val) {
				this.cursor(this.position);
			},
			cursorX (val) {
				this.cursor(this.position);
			}
		},

		mounted () {
			this.cursor(this.position);
		},
	 
		methods: {
			cursor (position) {

				let y, pos, target;
		
				let pathEl = this.$refs.windSpeedPath;
				let pathLength = pathEl.getTotalLength();
				let end = pathLength;

				

				// Stop at the beginning of the curve path
				if (position.y < 25) {
					y = 25;
				// Stop at the end of the curve path					
				} else if (position.y > pathLength) {
					y = pathLength;
				// Cursor is withing the curve path	
				} else {
					y = position.y;
				}

				if (this.isTouch) {
					if (position.y < 25) {
						y += position.y;	
					} else {
						y += 25;
					}
					
				}

				
				let beginning = y;

				
				while (true) {
					// @todo: Got this calculation from example, don't really understand it yet
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
						
					} else {
						break;
					}
				}

				this.positionX = pos.x;
				this.positionY = y;
				
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
			positionX: 0,
			positionY: 0
		  }
		}

	}



</script>

