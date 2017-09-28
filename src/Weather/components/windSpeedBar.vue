<template>
	<g>
			 <defs>
				
				<mask :id="uid">
					<rect x="0" y="2" 
						width="100%"
						height="8"
						fill="black"
						rx="4"
					/>

					<rect
						class="svgBar__windSpeedMask"
						x="0" y="2" 
						:width="windSpeedPixels"
						height="8"
						fill="white"
						rx="4"
						
					/>
					<line
						class="svgBar__windGust"
						stroke-dasharray="2, 3"
						x1="4" y1="6" :x2="windGustPixels" y2="6"
						
					/>
					<circle
						:cx="windSpeedPixels" 
						cy="6" r="6"
						fill="white"
					/>
				</mask>
			</defs>

			<g :mask="uidURL" :transform="shift">

				<rect  
					width="100%" 
					class="svgBar__overThreshold"x="0" y="0" height="12" 
				/>
				<rect  
					:width="windSpeedThresholdPixels" 
					class="svgBar__windSpeed" fill="url(#linearGradient-1)" x="0" y="0" height="12"
				/>
			</g>

		

			

			
	   
	</g>
		
	
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'windSpeedBar',
		props: ['windSpeed','windGust','uid','maxSpeedToDisplay','maxSpeedTreshold','order','chartWidth'],
		computed: {
			shift () {
				let amount = this.order * 50 + 19;
				return "translate(0," + amount + ")";
			},
			
			
			// @todo: might be better to round up to whole pixels, instead of using %
			// @todo: the gust indicator is broken, shows a wrong amount
			uidURL () {
				return ('url(#' + this.uid + ')');
			},

			windSpeedPixels () {
				return this.speedToPixels(this.windSpeed);
			},
			windGustPixels () {
				return this.speedToPixels(this.windGust);
			},
			windSpeedThresholdPixels () {
				return this.speedToPixels(this.maxSpeedTreshold);
			}
		   
		},
	 
		methods: {
			speedToPixels(speed) {
				return ((this.chartWidth/this.maxSpeedToDisplay) * speed).toFixed(1);
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
