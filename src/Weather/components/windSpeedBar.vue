<template>
	<g :class="role">
		<defs>
			<mask :id="uid">
				<rect 
					:x="(this.role=='windInstrument') ? 0 : this.CHART_OFFSET_X" 
					y="2" 
					width="100%"
					height="8"
					fill="black"
					rx="4"
				/>

				<rect
					class="svgBar__windSpeedMask"
					:x="(this.role=='windInstrument') ? 0 : this.CHART_OFFSET_X" 
					y="2" 
					:width="windSpeedPixels"
					height="8"
					fill="white"
					:rx="(role=='windInstrument') ? 0 : 4"
				/>
				<line
					class="svgBar__windGust"
					:x1="(this.role=='windInstrument') ? 4 : this.CHART_OFFSET_X+4" 
					y1="6" 
					:x2="windGustPixels-4" 
					y2="6"
					
				/>
				<circle
					class="svgBar__windSpeedPoint"
					:cx="circleCX" 
					cy="6" 
					r="6"
					fill="white"
				/>

				
			</mask>
		</defs>

		<g :mask="uidURL" :transform="shift">
			<rect  
				width="100%" 
				class="svgBar__overThreshold" x="0" y="0" height="12" 
			/>
			<rect  
				:width="windSpeedThresholdPixels" 
				class="svgBar__windSpeed" fill="url(#linearGradient-1)" x="0" y="0" height="12"
			/>
			<circle
				v-if="(role=='windInstrument')"
				class="svgBar__windSpeedPoint--instrument"
				:cx="windSpeedPixels" 
				cy="6" 
				r="3"
			/>

			
		</g>
		
	</g>
</template>

<script>
	import Vue from 'vue';
	
	export default {
		name: 'windSpeedBar',
		// @todo: validate props
		props: ['windSpeed','windGust','uid','maxSpeedToDisplay','maxSpeedTreshold','order','chartWidth','role'],
		computed: {
			rowHeight () {
				return this.$store.state.existingPlaceView.view.chart.row.height;
			},
			shift () {
				if (this.role == 'windInstrument') {
					return "translate(0, 19)";
				}
				let amount = this.order * this.rowHeight + (this.rowHeight * 0.5 - 6);
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
			circleCX () {
				let offset = (this.role=='windInstrument') ? 0 : this.CHART_OFFSET_X;
				return parseFloat(this.windSpeedPixels) + offset;

				 
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
				return (((this.chartWidth)/this.maxSpeedToDisplay) * speed).toFixed(0);
			}
		},
		data () {
			return {
				CHART_OFFSET_X: 10
			}
		}
	}

</script>

<style lang="scss">
	@import '~globalVars';
	.svgBar{
		display: block;
		width: 100px;
	}

	.svgBar__threshold {
		stroke: rgba($statusNo, 0.3);
		stroke-width: 2;
	}

	.svgBar__overThreshold {
		fill: $statusNo;
	}

	.svgBar__windGust {
		stroke:#fff;
		stroke-width:8;
		stroke-dasharray: 2 4;
	}
</style>

