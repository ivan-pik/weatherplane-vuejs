<template>
	<div class="chartCursor"
		v-bind:style="{
			'width': 100 + '%',
			'left': 0 + 'px',
			'top': top + 'px',
			'height': rowHeight
		}"
	>
		<svg
			width="100%"
			:height="rowHeight"
		>
			<defs>
				<mask id="cursorMask">
					<rect
						:width="width" 
						fill="#666"
						:x="left" 
						:y="rowHeight * 0.5 - 20"
						height="40"
						rx="20"
					/>
					<rect
						:width="chartXstyle" 
						fill="#fff"
						:x="left" 
						:y="rowHeight * 0.5 - 2"
						height="4"
					/>
					<circle
						:cx="chartXstyle+left" 
						:cy="rowHeight * 0.5" 
						r="10"
						fill="white"
					/>
				</mask>
			</defs>

			<g mask="url(#cursorMask)">
				<rect
					:width="width" 
					fill="#DF4410"
					:x="left" 
					y="0"
					:height="rowHeight"
				/>
				
				<rect
					:width="pixelTreshold" 
					fill="url(#linearGradient-1)"
					x="0" 
					y="0"
					:height="rowHeight"
				/>
			</g>

			<circle
				:cx="chartXstyle + left" 
				:cy="rowHeight * 0.5" 
				r="6"
				fill="white"
			/>
			
		</svg>
	</div>
</template>

<script>
	import Vue from 'vue';

	export default {
		name: 'chartCursor',
		props: {
			width: {
				type: Number
			},
			left: {
				type: Number
			},
			top: {
				type: Number
			},
			chartX: {
				type: Number
			},
			pixelTreshold: {
				type: Number
			}
		},
		computed: {
			rowHeight () {
				return this.$store.state.existingPlaceView.view.chart.row.height;
			},
			chartXstyle () {
				return Math.max(Math.round(this.chartX) - this.CURSOR_X_OFFSET, 0);
			},
		},
		data () {
			return {
				CURSOR_X_OFFSET: 10,
			}
		}
	}
</script>

<style lang="scss">
.chartCursor {
	pointer-events: none;
	position: fixed;
	z-index: 10000;
	svg {
		 display: block;
	}
}
</style>