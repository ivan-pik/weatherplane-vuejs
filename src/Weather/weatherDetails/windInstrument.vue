<template>
	<div class="windInstrument">
		<svg width="180px" height="180px" viewBox="0 0 180 180" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<defs>
				<polygon
					id="arrow"
					points="0,10 16,10 8,0"
				/>
				<mask id="inactiveMask">
					<rect  
						width="92" 
						height="180"
						:fill="sideOpacityStyle.leftBg"
						:x="(activeSide == 'left' ? -1: -3) "  
						y="0"
					/>
					<rect  
						width="92" 
						height="180"
						:fill="sideOpacityStyle.rightBg"
						:x="(activeSide == 'right' ? 89: 91) "  
						y="0"
					/>
				</mask>
				<clipPath id="windBearingClip">
					<circle cx="90" cy="90" r="67"></circle>
				</clipPath>
				
			</defs>

			<g mask="url(#inactiveMask)">
				<circle class="windInstrument__dial" cx="90" cy="90" r="77"></circle>
			</g>

			<g clip-path="url(#windBearingClip)">
				<svg x="08" y="08" width="164" height="164"  viewBox="-1 -1 2 2">
					<path 
						class="windInstrument__crossWindPie"
						:class="statusWindDirection"
						:transform="rotateSlice"
						:d="slice"
						
					/>
				</svg>
			</g>
				

				<ellipse
					class="windInstrument__maxWindSpeedIndicator"
					:class="{
						'windInstrument__maxWindSpeedIndicator--outOfLimit' : crossWindSpeedOutOfLimit
					}"
					cx="90"
					cy="90"
					:rx="maxWindSpeedDiameter" 
					:ry="maxCrossWindSpeedDiameter"
				>
				</ellipse>
				<circle class="windInstrument__dialSteps" cx="90" cy="90" r="77"></circle>

				<g :transform="rotation">
					<svg width="16px" height="180px" viewBox="0 0 16 180"
						x="82"
						y="0"
					>
						<rect 
							class="windInstrument__windDirectionIndicator"
							width="4" 
							height="148"
							x="6" 
							y="16"
						/>
						<use 
							:class="overflowClass"
							y="7" class="windInstrument__windDirectionArrow" xlink:href="#arrow">
						</use>

						<use y="162" class="windInstrument__windDirectionArrow" xlink:href="#arrow"></use>

						<g transform="rotate(-90 0 0) translate(-90,-17)">
							<svg width="73" height="50">
								<wind-speed-bar
									:uid="'instrumentBar'" 
									:order="0"
									:role="'windInstrument'"
									:windSpeed="windSpeed" 
									:windGust="windGust"
									:maxSpeedToDisplay="maxWindSpeedToDisplay"
									:maxSpeedTreshold="maxSpeedTresholdRelToBearing"
									:chartWidth="chartWidth"
								/>
							</svg>
						</g>
					</svg>
				</g>

				<circle class="windInstrument__center" cx="90" cy="90" r="8"></circle>
			

		</svg>
	</div>
</template>

<script>
	import Vue from 'vue';
	import windSpeedBar from '../components/windSpeedBar.vue';
	
	export default {
		name: 'windInstrument',
		props: {
			windBearing: {
				type: Number
			},
			windSpeed: {
				type: Number
			},
			windGust: {
				type: Number
			},
			maxSpeedTreshold: {
				type: Number
			},
			activeSide: {
				type: String
			},
			windDirectionRelToRWY: {
				type: Boolean
			},
			windBearingRelToRWY: {
				type: Number
			},
			runwayDirection: {
				type: Number
			},
			settingsMaxCrossWindSpeed: {
				type: Number
			},
			maxWindSpeedToDisplay: {
				type: Number
			},
			crossWindComponent: {
				type: Number
			},
			settingsMaxWindBearingToRWY: {
				type: Number
			},
			statusWindDirection: {
				type: String
			},
			settingMode: {
				type: Boolean
			}
			
		},
		mounted () {
			this.sideOpacity(this.activeSide);
		},
		created () {
			this.generateSlice(this.bearingToPercents);
		},
		components: {
			'wind-speed-bar' : windSpeedBar
		},
		watch: {
			activeSide(val) {
				this.sideOpacity(val);
			}
		},

		computed: {
			crossWindSpeedOutOfLimit () {
				return (this.windSpeed > this.maxSpeedTresholdRelToBearing);
			},
			bearingToPercents () {
				return (this.settingsMaxWindBearingToRWY / 180);
			},
			maxSpeedTresholdRelToBearing () {
				let x = this.maxSpeedTreshold;
				let y = this.settingsMaxCrossWindSpeed;

				if (y < x) {
					let angle =  this.toRadians(Math.abs(this.windBearingRelToRWY));
					let x1 = Math.pow(x, 2) * Math.pow(Math.sin(angle), 2);
					let y1 = Math.pow(y, 2) * Math.pow(Math.cos(angle), 2);
					let radius = (x * y) / Math.sqrt(x1 + y1);
					return radius;
				} else {
					return x;
				}
			},
			overflowClass () {
				if (this.windSpeed > this.maxSpeedTreshold || this.windGust > this.maxSpeedTreshold) {
					return "overflow"
				}
				return false;
			},
			chartWidth () {
				// This is so that maxSpeedThreshold is as wide as the wind dial circle
				let proportion = this.maxWindSpeedToDisplay / this.maxSpeedTreshold;
				return proportion * 71;
			},
			maxCrossWindSpeedDiameter () {
				return this.speedToPixels(this.settingsMaxCrossWindSpeed);
			},
			maxWindSpeedDiameter () {
				return this.speedToPixels(this.maxSpeedTreshold);
			},
			angle () {

				if (this.activeSide == "left") {
					return this.windBearingRelToRWY + 270;
				} else if (this.activeSide == "right") {
					return 90 + this.windBearingRelToRWY * -1;
				} else {
					return 90 + this.windBearingRelToRWY * -1;
				}
				
			},
			rotation () {
				let angle = this.angle;
				return `rotate(${angle} 90 90)`;
			},
			rotateSlice () {
				let rotate = 0;
				if (this.activeSide == "left") {
					rotate = (90 - this.settingsMaxWindBearingToRWY) + 90;
				} else if (this.activeSide == "right") {
					rotate = (90 - this.settingsMaxWindBearingToRWY) - 90;
				}
				
				return `rotate(${rotate} 0 0)`;
			},
		},
	 
		methods: {
			
			speedToPixels(speed) {
				return ((this.chartWidth/this.maxWindSpeedToDisplay) * speed).toFixed(0);
			},
			// @todo: DRY DRY DRY
			toRadians (angle) {
				return angle * (Math.PI / 180);
			},
			sideOpacity () {
				if (this.activeSide == "left") {
					this.sideOpacityStyle = {
						leftBg: "#fff",
						rightBg: "#555"
					}
				} else if (this.activeSide == "right") {
					this.sideOpacityStyle = {
						leftBg: "#555",
						rightBg: "#fff"
					}
				} else {
					this.sideOpacityStyle = {
						leftBg: "#fff",
						rightBg: "#fff"
					}
				}
			},
			// @todo: DRY DRY DRY
			getCoordinatesForPercent (percent) {
				let x = Math.cos(2 * Math.PI * percent);
				let y = Math.sin(2 * Math.PI * percent);
				return [x, y];
			},
			// @todo: DRY DRY DRY
			generateSlice (percent) {
				const [startX, startY] = this.getCoordinatesForPercent(0);
				const [endX, endY] = this.getCoordinatesForPercent(percent);

				// if the slice is more than 50%, take the large arc (the long way around)
				const largeArcFlag = percent > .5 ? 1 : 0;

				// create an array and join it just for code readability
				this.slice = [
					`M ${startX} ${startY}`, // Move
					`A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
				].join(' ');

			}
		},
		
		data () {
			return {
				maxCrossWind: 40,
				sideOpacityStyle: {
					leftBg: "#fff",
					rightBg: "#fff"
				},
				slice: ''
				
			}
		}
	}
</script>

<style lang="scss">
@import '~globalVars';

.windInstrument {
	position: absolute;
	top: 14px;
	left: 50%;
	margin-left: -90px;
	width: 180px;
	height: 180px;
}

.windInstrument__dial {
	fill: none;
	stroke-width: 10;
	stroke: #cfd9e1;
}

.windInstrument__dialSteps {
	fill: none;
	stroke-width: 4;
	stroke: #7e8b96;
	stroke-dasharray: 1.5,16.5;
	stroke-dasharray: 0,30.2;
	stroke-dashoffset: 0;
	stroke-linecap: round;
}

.windInstrument__maxWindSpeedIndicator {
	fill: none;
	stroke-width: 2;
	stroke: rgba($statusYes, 0.5);
}

.windInstrument__maxWindSpeedIndicator--outOfLimit {
	stroke: $statusNo;
}

.windInstrument__center {
	fill: #2b3338;
}

.svgBar__windSpeedPoint--instrument {
	fill: #fff;
	stroke-width: 0;
}



.windInstrument__windDirectionArrow {
	fill: #2b3338;
	&.overflow {
		fill: $no;
	}
}

.windInstrument__windDirectionIndicator {
	fill: #2b3338;
}

.windInstrument {
	.svgBar__windGust {
		stroke:#fff;
		stroke-width:8;
		stroke-dasharray: 2 2;
	}
}

.windInstrument__crossWindPie {
	stroke-width: 0.6;
	fill: none;
	opacity: 0.3;
	&.yes {
		stroke: $statusYes;
	}
	&.no {
		stroke: $statusNo;
	}
}


.windInstrument__crossWindPie-center {
	fill: #fff;
}


</style>
