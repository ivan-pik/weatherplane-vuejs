<template>
	<div 
		class="dayLabel"
		ref="dayLabel"
		:class="{'is-visible' : labelVisible}">
		<div class="dayLabel__date">
			{{date}}
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'dateLabel',
		props: {
			date: {
				type: String
			},
			scrollPosition: {
				type: Number
			},
		},
		watch: {
		},
		mounted () {
			this.rendered = true;
		},
		computed: {
			rowHeight () {
				return this.$store.state.existingPlaceView.view.chart.row.height;
			},
			dateLabelPosition () {
				return (this.$refs.dayLabel.getBoundingClientRect()).bottom;
			},
			viewportHeight () {
				return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			},
			inView () {
				if (this.dateLabelPosition - this.scrollPosition < this.viewportHeight) {
					if (this.initialScrollOffset == 0) {
						this.initialScrollOffset = '' + this.scrollPosition;
					}
					return true;
				} else {
					this.initialScrollOffset = 0;
					return false;
				}
			},
			labelVisible () {
				if (!this.rendered) {
					return false;
				}


				if (this.inView && (this.scrollPosition - this.initialScrollOffset > this.rowHeight) ) {
					return false;
				} 
				return true;
			}
		},
		methods: {
			
		},
		data () {
		  return {
			rendered: false,
			initialScrollOffset: 0,
		  }
		}

	}



</script>

<style lang="scss">
	.dayLabel {
		position: absolute;
		top: 0;
		bottom: 0;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		left: 0;
		right: 0;
		z-index: 1;
		font-size: 1rem;
		font-weight: 500;
		text-align: center;
		opacity: 0;
		transition: all 0.2s ease-in-out;
		background: rgba(#fff,0.8);
		display: flex;
		align-content: center;
		align-items: center;

		&.is-visible {
			opacity: 1;
		}
	}

	.dayLabel__date {
		color: #000;
		line-height: 1;
	}

	
</style>
