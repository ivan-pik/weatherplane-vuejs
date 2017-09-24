<template>
	<div class="wind-speed-bar">
	  
		<svg class="svgBar" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			 <defs>
				<linearGradient x1="3.061617e-15%" y1="50%" x2="97.9532047%" y2="50%" id="linearGradient-1">
					<stop stop-color="#3CBB22" offset="0%"></stop>
					<stop stop-color="#ECA079" offset="80%"></stop>
					<stop stop-color="#DF4410" offset="100%"></stop>
				</linearGradient>
				<mask :id="uid">
					<rect x="0" y="0" 
						width="100%"
						height="8"
						fill="black"
					/>

					<rect x="0" y="0" 
						:width="windSpeedPercentage"
						height="8"
						fill="white"
						
					/>
					<line
						class="svgBar__wingGust"
						stroke-dasharray="2, 2"
						x1="0" y1="4" :x2="windGustPercentage" y2="4"
					/>
				</mask>
			</defs>

			<g :mask="uidURL" transform="translate(0,21)">
				<rect  
					width="100%" 
					class="svgBar__overThreshold"x="0" y="0" height="8"
				/>
				<rect  
					:width="windSpeedThresholdPercentage" 
					class="svgBar__windSpeed" fill="url(#linearGradient-1)" x="0" y="0" height="8"
				/>
			</g>

			<line class="svgBar__threshold" stroke-dasharray="2, 3" :x1="windSpeedThresholdPercentage" :x2="windSpeedThresholdPercentage" y1="0" y2="50" />
	   
		</svg>
		
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'windSpeedBar',
		props: ['windSpeed','windGust','uid','maxSpeedToDisplay','maxSpeedTreshold'],
		computed: {

			// @todo: might be better to round up to whole pixels, instead of using %
			// @todo: the gust indicator is broken, shows a wrong amount
			uidURL () {
				return ('url(#' + this.uid + ')');
			},

			windSpeedPercentage () {
				return this.speedToPercentages(this.windSpeed);
			},
			windGustPercentage () {
				return this.speedToPercentages(this.windGust);
			},
			windSpeedThresholdPercentage () {
				return this.speedToPercentages(this.maxSpeedTreshold);
			}
		   
		},
	 
		methods: {
			speedToPercentages(speed) {
				return ((100/this.maxSpeedToDisplay) * speed).toFixed(1) + '%';
			}


		},
		data () {
		  return {
			
		  }
		}

	}



</script>

<style>
   
</style>
