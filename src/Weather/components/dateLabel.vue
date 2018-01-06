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


				if (this.inView && (this.scrollPosition - this.initialScrollOffset > 50) ) {
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
		top: -10px;
		left: 0;
		right: 0;
		z-index: 1;
		height: 50px;
		line-height: 50px;
		font-size: 10px;
		text-align: center;
		opacity: 0;
		transition: all 0.2s ease-in-out;

		&.is-visible {
			opacity: 1;
			top: 0px;
		}
	}

	.dayLabel__date {
		display: inline-block;
		background: rgba(#000,0.8);
		color: #fff;
		border-radius: 15px;
		line-height: 1;
		padding: 0.5em 3em; 
	}

	

	fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>
