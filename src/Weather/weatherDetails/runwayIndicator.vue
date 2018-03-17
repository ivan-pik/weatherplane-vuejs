<template>
	<div class="runwaySideIndicator">
		<svg  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			preserveAspectRatio="none"
			width="100%"
			height="40"
			viewBox="0 0 100 40"
		>
			<defs>
				<path id="plane" d="M6,13.4852986 L18,12.4558957 L18,12.135498 L17.1642491,1.99324415 C17.0807043,0.979386903 17.8348716,0.0897668036 18.8487288,0.00622204552 C18.899046,0.00207576812 18.9495123,-1.15797176e-14 19,-1.15766261e-14 C20.1758064,-1.15046288e-14 21.2011207,0.799278112 21.4880424,1.93953978 L24,11.9223633 L24,12.434255 L29.0065002,12.8388839 C30.132544,12.9298916 31,13.8702845 31,15 C31,16.1373224 30.14219,17.0915132 29.0112849,17.2121608 L24,17.7467765 L24,18.1635742 L21.4913727,28.0613012 C21.2023851,29.2014947 20.1762461,30 19,30 C17.9839664,30 17.1603084,29.176342 17.1603084,28.1603084 C17.1603084,28.1091255 17.1624444,28.057965 17.1667107,28.0069602 L18,18.0449219 L18,17.764452 L6,16.5881507 L6,17.1962891 L5.30570486,20.5314822 C5.12762939,21.3869053 4.37376175,22 3.5,22 C2.78430681,22 2.20412285,21.419816 2.20412285,20.7041228 C2.20412285,20.6411333 2.2087155,20.5782276 2.21786428,20.5159059 L2.83993037,16.2783845 L0.995229888,16.0975575 C0.430536236,16.0422034 6.94864856e-17,15.5674002 0,15 C-6.92655496e-17,14.4344039 0.432814283,13.9628716 0.996340773,13.9145303 L2.80129443,13.759695 L2.20669085,9.48569139 C2.10732022,8.77141646 2.60579864,8.11182642 3.32007356,8.01245579 C3.37969027,8.00416186 3.43980912,8 3.5,8 C4.37040669,8 5.11804289,8.61842834 5.28123606,9.47339957 L6,13.2390137 L6,13.4852986 Z"></path>
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
			viewBox="0 0 35 30"
			preserveAspectRatio
		>
			<use 
				x="0"
				y="0"
				width="30"
				height="30"
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
						transform: `rotate(${this.crabAngle}deg)`
					}
				} else if (this.activeSide == 'right') {
					return {
						transform: `rotate(${- this.crabAngle + 180}deg)`
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
		stroke: #cfd9e0;
		stroke-width: 2;
		// stroke-dasharray: 4,16;
		stroke-linecap: round;
	}

	.runwaySideIndicator__planePosition {
		position: absolute;
		top: -7px;
		width: 40px;
		height: 40px;
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
