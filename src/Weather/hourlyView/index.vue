<template>
	<div id="scroller" class="weather-hourly"
		v-on:mousemove="chartPointer"
		v-on:scroll="chartScroll"
		v-on:touchstart="touchStart"
		
		ref="chartScroller"
	>
		<day 
			:weather="weather.hourly"
			:cursorY="cursorY"
			:cursorX="cursorX"
			:isTouch="isTouch"
		/>

		<div class="scroller__spacer"
			v-if="isTouch"
			:style="fillSpaceHeight"
		>
		</div>
	</div>
</template>

<script>
	// window.requestAnimationFrame
	import Vue from 'vue';
	import Day from './day/index.vue';
	
	export default {
		name: 'hourlyView',
		components: {
			'day' : Day
		},
		created: function () {

		},
		mounted () {
			
			this.fillSpace();
		},
		props: {
			weather: {
				type: Object
			}
		},
		computed: {
			cursorDayIndex () {
				return Math.max(Math.floor((this.cursorY - 25) / 50),0);
			},
			cursorDayProgress () {
				let beginning = ( this.cursorDayIndex * 50 ) + 25;
				return  Math.max((this.cursorY - beginning) / 50, 0);
			}
		},
		watch: {
			cursorY () {
				this.$store.commit('PLACE_VIEW_CHART_CURSOR', {
					index: this.cursorDayIndex,
					progress: this.cursorDayProgress
				});
			}
		},

		methods: {
		
			fillSpace () {
				let height = this.$refs.chartScroller.offsetHeight - 50;
				this.fillSpaceHeight = "height: " + height + "px";
				return;
			},
			
			touchStart (e) {
				this.isTouch = true;
			},
			chartPointer (e) {
				if(!this.isTouch) {
					let pos = e.pageY - 280;
					this.lastCursorPosition = pos;

					if (!this.cursorTicking) {
						window.requestAnimationFrame(() => {
							this.calcFinalCursor();
							this.cursorTicking = false;
						});
						this.cursorTicking = true;
					}
				}
			},
			chartScroll (e) {
				this.lastScrollPosition = this.$refs.chartScroller.scrollTop;

				if (!this.scrollTicking) {
					window.requestAnimationFrame(() => {
						this.calcFinalCursor();
						this.scrollTicking = false;
					});
					this.scrollTicking = true;
				}
				
			},
			calcFinalCursor () {
				this.cursorY = this.lastScrollPosition + this.lastCursorPosition;
			}
		
		},
		data () {
			return {
				// initial Y value
				cursorY: 25,
				cursorX: 0,
				lastScrollPosition: 0,
				scrollTicking: false,
				lastCursorPosition: 0,
				cursorTicking: false,
				isTouch: false,
				fillSpaceHeight: ""
				
			}
		}

	}



</script>

<style>

</style>