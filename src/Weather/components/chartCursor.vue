<template>
	<div class="chartCursor"
		v-bind:style="{
			'width': 100 + '%',
			'left': 0 + 'px',
			'top': chartTopStyle + 'px'
		}"
	>
	

		<svg
			width="100%"
			height="50"
		>
			<defs>
				<mask id="cursorMask">
					<rect
						:width="width" 
						fill="#666"
						:x="left" 
						y="5"
						height="40"
						rx="20"
					/>
					<rect
						:width="chartXstyle" 
						fill="#fff"
						:x="left" 
						y="23"
						height="4"
					/>
					<circle
						:cx="chartXstyle+left" 
						cy="25" 
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
					height="50"
				/>
				
				<rect
					:width="pixelTreshold" 
					fill="url(#linearGradient-1)"
					x="0" 
					y="0"
					height="50"
				/>
			</g>

			<circle
				:cx="chartXstyle + left" 
				cy="25" 
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
			viewportHeight: {
				type: Number
			},
			cursorPositionEdges: {
				type: String
			},
			chartHeight: {
				type: Number
			},
			isTouch: {
				type: Boolean
			},
			pixelTreshold: {
				type: Number
			}
		},
		computed: {
			chartXstyle () {
				return Math.max(Math.round(this.chartX) - this.CURSOR_X_OFFSET, 0);
			},
			chartTopStyle () {
				if (this.top == 0) {
					return this.viewportHeight - this.chartHeight; // @todo: magic numbers
				}


				if(!this.isTouch) {
					if (this.cursorPositionEdges == 'reached-the-top') { 
						return 280 + 25 - this.CURSOR_Y_OFFSET; // @todo: remove magic numbers
					} else if (this.cursorPositionEdges == 'reached-the-bottom') {
						return this.viewportHeight - 25 - this.CURSOR_Y_OFFSET; // @todo: magic numbers
					} else if (this.cursorPositionEdges == 'reached-the-bottom-touch') {
						return this.viewportHeight - 25 - this.CURSOR_Y_OFFSET; // @todo: magic numbers
					}
					else {
						return this.top - this.CURSOR_Y_OFFSET;
					}
				} else {
					return this.viewportHeight - this.chartHeight + 0 - this.CURSOR_Y_OFFSET; // @todo: magic numbers
				}
				
			}
		},
		methods: {
		


		},
		data () {
			return {
				CURSOR_X_OFFSET: 10,
				CURSOR_Y_OFFSET: 25,
			}
		}

	}



</script>

<style lang="scss">
.chartCursor {
	pointer-events: none;
	position: fixed;
	z-index: 10000;
	height: 50px;
	svg {
		 display: block;
	}
}


</style>