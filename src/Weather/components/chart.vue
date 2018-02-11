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
				<path class="windSpeedChart__windSpeed" 
					:d="curvePoints('windSpeed')"
					stroke="#fff"
					stroke-width="3"
					fill="none"
					ref="windSpeedPath"
					v-bind:style="style"
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
				class="svgBar__overThreshold" x="10" y="0" :height="chartHeight"
			/>
			<rect  
				:width="windSpeedThresholdPixels" 
				class="svgBar__windSpeed"
				fill="url(#linearGradient-1)" 
				:x="0"
				y="0"
				:height="chartHeight"
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
		props: ['weather','maxSpeedToDisplay','maxSpeedTreshold','cursorY','chartWidth','chartLeftPos'],
		components: {
			'wind-speed-bar' : windSpeedBar
		},
	
		computed: {
			rowHeight () {
				return this.$store.state.existingPlaceView.view.chart.row.height;
			},
			style () {
				return {
					transform: `translate(0,${this.rowHeight * 0.5}px)`
				}
			},
			chartHeight () {
				return (this.weather.length) * this.rowHeight;
			},
			windSpeedThresholdPixels () {
				return this.speedToPixels(this.maxSpeedTreshold);
			},
			chartStyle () {
				return "width:" + this.chartWidth + "px; left:" + this.chartLeftPos + "px;";
			}
		},

		watch: {
			cursorY (val) {
				this.cursor(this.cursorY);
			},
			
			windSpeedThresholdPixels (windSpeedThresholdPixels) {
				this.$emit('treshold-pixel-change', windSpeedThresholdPixels);
			}
		},

		mounted () {
			this.$nextTick(function () {
				this.cursor(0);
			});
		},
	 
		methods: {
			cursor (position) {
				
				let y, pos, target;
		
				let pathEl = this.$refs.windSpeedPath;
				let pathLength = pathEl.getTotalLength();
				let end = pathLength;
		

				y = position;
				
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
				this.$emit('chart-x-update', {
					x: pos.x
				});
				this.positionX = pos.x;
				this.positionY = y;
				
			},
		
		
			curvePoints () {
				let i = 0;
				let points = [];
				let speed;
				this.weather.forEach((hour) => {
					
					speed = hour.windSpeed;
					
					points.push([
						parseFloat(this.speedToPixels(speed)) + this.CHART_OFFSET_X,
						this.rowHeight*i
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
			positionY: 0,
			CHART_OFFSET_X: 10,
		  }
		}

	}



</script>

<style lang="scss">
// --------------------------------
.windSpeedChart {
	display: block;
	position: absolute;
	top: 0;
	bottom: 0;
	height: 100%;
}


</style>
