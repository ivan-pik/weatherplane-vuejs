<template>
	<div class="windBearing">
		<div class="windBearing__value" v-if="false">
			{{bearingRelToRWY}}&deg; // @todo: display on large screens
		</div>

		<svg  class="windBearing__chart" width="38px" height="38px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

			<svg 
				v-if="activeSide!='none'"
				x="6" y="6" width="26" height="26"  viewBox="-1 -1 2 2"
			>
				<path 
					class="windBearing__crossWindPie"
					:class="statusWindDirection"
					:transform="rotateSlice"
					:d="slice"
				/>
			</svg>

			<circle
				:class="statusWindDirection"
				class="windBearing__fullCircle"
				r="12"
				cx="19"
				cy="19"
			/>

			<path
				vector-effect="non-scaling-stroke"
				d="M6,19.5 L32,19.5"
				class="windBearing__runway"
			></path>

			

			

			<svg width="38px" height="38px" viewBox="0 0 38 38">
				<g :transform="rotateChart">
					<path
						class="windBearing__directionLine"
						:class="statusCrossWindComponent"
						d="M 19 2 L 19 36"
					/>
					<path 
						class="windBearing__directionArrow"
						:class="statusCrossWindComponent"
						d="M 14 7 L 19 1 L 24 7"
					/>
				</g>
			</svg>
		</svg>
	</div>
	
</template>

<script>
	import Vue from 'vue';
	
	export default {
		name: 'windBearing',
		props: {
			windBearing: {
				type: Number
			},
			windBearingRelToRWY: {
				type: Boolean
			},
			runwayDirection: {
				type: Number
			},
			settingsMaxWindBearing: {
				type: Number
			},
			settingsMaxCrossWindSpeed : {
				type: Number
			},
			windSpeed: {
				type: Number
			},
			bearingRelToRWY: {
				type: Number
			},
			statusWindDirection: {
				type: String
			},
			activeSide: {
				type: String
			},
			statusCrossWindComponent: {
				type: String
			}
		},
		created () {
			this.generateSlice(this.bearingToPercents);
		},
		computed: {
			
			angle () {
				if (this.activeSide == "left") {
					return this.bearingRelToRWY + 270;
				} else if (this.activeSide == "right") {
					return 90 + this.bearingRelToRWY * -1;
				} else {
					return 90 + this.bearingRelToRWY * -1;
				}
			},
		
			bearingToPercents () {
				return (this.settingsMaxWindBearing / 180);
			},
			rotateSlice () {
				let rotate = 0;
				if (this.activeSide == "left") {
					rotate = (90 - this.settingsMaxWindBearing) + 90;
				} else if (this.activeSide == "right") {
					rotate = (90 - this.settingsMaxWindBearing) - 90;
				}
				
				return `rotate(${rotate} 0 0)`;
			},
			rotateChart () {
				let angle = this.angle;
				return `rotate(${angle} 19 19)`;
			},
		
		
		
			crossWindComponent () {
				let speed = this.windSpeed;
				let angleInRadians = this.toRadians(Math.abs(this.bearingRelToRWY));
				return speed * Math.sin(angleInRadians);
			},
		},
	 
		methods: {
			toRadians (angle) {
				return angle * (Math.PI / 180);
			},
			toStatus (val) {
				if (val == true) {
					return "no";
				} else {
					return "yes";
				}
			},
			getCoordinatesForPercent (percent) {
				let x = Math.cos(2 * Math.PI * percent);
				let y = Math.sin(2 * Math.PI * percent);
				return [x, y];
			},
			generateSlice (percent) {
				const [startX, startY] = this.getCoordinatesForPercent(0);
				const [endX, endY] = this.getCoordinatesForPercent(percent);

				// if the slice is more than 50%, take the large arc (the long way around)
				const largeArcFlag = percent > .5 ? 1 : 0;

				// create an array and join it just for code readability
				this.slice = [
					`M ${startX} ${startY}`, // Move
					`A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
					`L 0 0`, // Line
				].join(' ');

			}
		},
		data () {
			return {
				slice: ''
			}
		}

	}



</script>

<style>
   
</style>
