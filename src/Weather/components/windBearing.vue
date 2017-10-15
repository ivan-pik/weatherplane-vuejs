<template>
	<div class="windBearing">
		<div class="windBearing__value">
			{{bearingRelToRWY}}&deg;
		</div>

		<svg  class="windBearing__chart" width="38px" height="38px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

			<svg 
				v-if="activeSide!='none'"
				x="6" y="6" width="26" height="26"  viewBox="-1 -1 2 2"
			>
				<path 
					class="windBearing__crossWindPie"
					:class="windBearingStatus"
					:transform="rotateSlice"
					:d="slice"
				/>
			</svg>

			<circle class="windBearing__fullCircle"
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
						:class="windSpeedStatus"
						d="M 19 2 L 19 36"
					/>
					<path 
						class="windBearing__directionArrow"
						:class="windSpeedStatus"
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
			windBearingStatus: {
				type: String
			},
			windSpeedStatus: {
				type: String
			},
			windBearingRelToRWY: {
				type: Boolean
			},
			runwayDirection: {
				type: Number
			},
			settingsMaxWindBearing: {
				type: Number
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
			bearingRelToRWY () {
				
				let activeSide;
				let relBearing;
				let runway = this.runwayDirection;
				let windBearing = this.windBearing;

				
	

				// offset values for the runway orientation

				let offset = runway - 90;
				windBearing = windBearing - offset;
				// windBearing must not be negative
				if (windBearing < 0) {
					windBearing = 360 - windBearing;
				}
				// windBearing must not be larger or equal to 360
				if (windBearing >= 360) {
					windBearing = windBearing - 360;
				}

				// now pretend runway at 90deg

				if (windBearing == 0 || windBearing == 180) {
					activeSide = "none";
					relBearing = windBearing - 90;
				}  else if (windBearing <= 90 || (windBearing > 90 && windBearing < 180)) {
					activeSide = "left";
					relBearing = (windBearing -90);
				} else if (
					(windBearing > 180 && windBearing <= 270) || windBearing > 270) {
					activeSide = "right"
					relBearing = 270 - windBearing;
				} 

				this.activeSide = activeSide;
				return relBearing;

				
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
			}
		},
	 
		methods: {
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
				slice: '',
				activeSide: "none"
			}
		}

	}



</script>

<style>
   
</style>
