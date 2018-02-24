<template>
	<div class="runwaySideIndicator">
		<svg  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			preserveAspectRatio="none"
			width="100%"
			height="40"
			viewBox="0 0 100 40"
		>
			<defs>
				<path id="plane" d="M20.11,38.178l-0.22,0l-0.063,-4.931l-2.228,2.088l-5.079,-0.803l0,-3.706l7.095,-1.065l-1.107,-11.484l-17.121,-2.777l0,-5.308c0,0 16.502,-1.175 16.507,-1.27c0.004,-0.095 -0.004,-1.889 -0.022,-2.654c-0.017,-0.766 0.237,-2.639 0.371,-2.977c0.556,-1.397 1.528,-1.471 1.757,-1.469c0.229,-0.002 1.201,0.072 1.757,1.469c0.134,0.338 0.388,2.211 0.371,2.977c-0.018,0.765 -0.026,2.559 -0.022,2.654c0.005,0.095 16.507,1.27 16.507,1.27l0,5.308l-17.121,2.777l-1.107,11.484l7.095,1.065l0,3.706l-5.079,0.803l-2.228,-2.088l-0.063,4.931Z" />
			</defs>
			<path vector-effect="non-scaling-stroke" d="M0,0 L100,0" class="runwaySideIndicator__runway"></path>
		</svg>

		<svg 
			class="runwaySideIndicator__planePosition"
			:class="{
				'runwaySideIndicator__planePosition--left': (activeSide == 'left'),
				'runwaySideIndicator__planePosition--right': (activeSide == 'right'),
				'runwaySideIndicator__planePosition--none': (activeSide == 'none')
			}"
			:style="crabAngleTransform"
			width="40"
			height="40"
			viewBox="0 0 40 40"
			preserveAspectRatio
		>
			<use 
				x="0"
				y="0"
				width="40"
				height="40"
				class="runwaySideIndicator__plane" xlink:href="#plane"
			/>
		</svg>
		
	</div>
</template>

<script>
//@todo: better plane image
	import Vue from 'vue';
	
	export default {
		name: 'runwaySideIndicator',
		props: {
			activeSide: {
				type: String
			},
			crabAngle: {
				type: Number
			}
		},
		computed: {
			crabAngleTransform () {
				if (this.activeSide == 'left') {
					return {
						transform: `rotate(${this.crabAngle + 90}deg)`
					}
				} else if (this.activeSide == 'right') {
					return {
						transform: `rotate(${- this.crabAngle + 270}deg)`
					}
				}
			}
		},
	 
		methods: {
		
		},
		
		data () {
		  return {
			  
		  }
		}

	}
</script>

<style lang="scss">

	@import '~globalVars';

	.runwaySideIndicator {
		position: absolute;
		top: 91px;
		left: 0;
		width: 100%;
		height: 27px;
	}

	.runwaySideIndicator__runway {
		transform: translate(0,13px);
		stroke: #859098;
		stroke-width: 2;
		stroke-dasharray: 0.5,8;
		stroke-dashoffset: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.runwaySideIndicator__planePosition {
		position: absolute;
		top: -7px;
		width: 40px;
		height: 40px;
		fill: red;
	}

	.runwaySideIndicator__planePosition--left {
		left: $widthGridSpace*4;
	}

	.runwaySideIndicator__planePosition--right {
		right: $widthGridSpace*4;
		
	}

	.runwaySideIndicator__plane {
		fill: #859098;
	}

</style>
