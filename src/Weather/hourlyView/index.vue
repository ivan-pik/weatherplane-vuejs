<template>
	<div id="scroller" class="weather-hourly"
		v-on:scroll="chartScroll"
		ref="chartScroller"
	>
		<day 
			:weather="weather.hourly"
			:sunTimes="sunTimes"
			:cursorY="chartCursorY"
			:scrollPosition="lastScrollPosition"
			:cursorScreenY="cursorScreenYlimited"
			:chartHeight="chartHeight"
		/>
		<div class="scroller__spacer"
			ref="chartSpacer"
			:style="fillSpaceHeight"
		>
		</div>
	</div>
</template>

<script>
	//v-on:mousemove="chartPointer"
	import Vue from 'vue';
	import Day from './day/index.vue';
	
	export default {
		name: 'hourlyView',
		components: {
			'day' : Day
		},
		mounted () {
			window.addEventListener('resize', this.sizeHandler);
			document.addEventListener('mousemove', this.chartPointer);
			document.addEventListener('mouseleave', this.stopScroll);
			document.addEventListener('touchstart', this.touchstartHandler);
			document.addEventListener('touchend', this.touchendHandler);
			this.attachSunTimesToHours();
			this.sizeHandler();

			this.cursorY = (this.rowHeight * 0.5);
		},
		beforeDestroy () {
			window.removeEventListener('resize', this.sizeHandler);
			document.removeEventListener('mousemove', this.chartPointer);
			document.removeEventListener('mouseleave', this.stopScroll);
			document.removeEventListener('touchstart', this.touchstartHandler);
			document.removeEventListener('touchend', this.touchendHandler);
		},
		props: {
			weather: {
				type: Object
			}
		},
		computed: {
			rowHeight () {
				return this.$store.state.existingPlaceView.view.chart.row.height;
			},
			cursorDayIndex () {
				let offset = this.rowHeight * 0.5; // @todo Magic number
				let maxCursorPosition = this.weather.hourly.length - 2;
				let cursorPos = Math.max(Math.floor((this.cursorY - offset) / this.rowHeight),0);
				return Math.min(cursorPos,maxCursorPosition);
			},
			cursorDayProgress () {
				let beginning = 0;
				beginning = ( this.cursorDayIndex * this.rowHeight ) + (this.rowHeight * 0.5); 
				return  Math.min( Math.max((this.cursorY - beginning) / this.rowHeight, 0), 1);
			},
			cursorScrollerY () {
				return this.cursorScreenY - this.positioning.chartTop;
			},
			endOfChart () {
				return (this.cursorY > (this.positioning.chartBottom - (this.rowHeight * 0.5)));
			},
			bottomOverflow () {
				return (this.cursorScreenY > (this.chartHeight + this.positioning.chartTop - (this.rowHeight * 0.5)));
			},
			topOverflow () {
				return (this.cursorY < ((this.rowHeight * 0.5) + this.lastScrollPosition ))
			},
			cursorScreenYlimited () {
				if (this.bottomOverflow) {
					return this.lastY - (this.rowHeight * 0.5);
				}

				if (this.endOfChart) {
					return this.lastY - (this.rowHeight * 0.5);
				}

				if (this.topOverflow) {
					return this.positioning.chartTop;
				}

				this.lastY = this.cursorScreenY;
				return this.lastY - (this.rowHeight * 0.5);
			},
			chartCursorY () {
				if (!this.edgeScrolling) {
					if (this.topOverflow || this.bottomOverflow || this.endOfChart) {
						return this.lastChartCursorY;
					}
				}
				return Math.min(Math.max(this.cursorY - (this.rowHeight * 0.5), 0), (this.weather.hourly.length - 1) * this.rowHeight);
			},
			scrollSpeed () {
				if (this.topOverflow) {
					return Math.max(((Math.max(this.cursorScrollerY,0) / (this.rowHeight * 0.5) )),0.1);
				} else if (this.bottomOverflow) {
					return Math.max((this.chartHeight - Math.max(this.cursorScrollerY,0)) / (this.rowHeight * 0.5),0.1);
				}
			},
			step () {
				let step =  (5 * 1 / this.scrollSpeed);
				if (this.topOverflow) {
					return -step;
				} else if (this.bottomOverflow) {
					return step;
				}
			},
			outOfChart () {
				if (this.isTouch) {
					return false;
				}
				if (this.cursorScrollerY < 0 || this.cursorScreenY > this.chartHeight + this.positioning.chartTop) {
					return true;
				} else {
					return false;
				}
			}
		},
		watch: {
			chartCursorY (val) {
				this.lastChartCursorY = val;
			},
			cursorY () {
				

				if (!this.edgeScrolling) {
					if (this.topOverflow || this.bottomOverflow || this.endOfChart) {
						return this.lastChartCursorY;
					}
				}
				this.$store.commit('PLACE_VIEW_CHART_CURSOR', {
					index: this.cursorDayIndex,
					progress: this.cursorDayProgress
				});
				
			},
			weather () {
				this.attachSunTimesToHours();
			},
			topOverflow (val) {
				if (val && !this.outOfChart && !this.isTouch) {
					this.scroll('up');
				} else {
					this.stopScroll();
				}
			},
			bottomOverflow (val) {
				if (val && !this.outOfChart && !this.isTouch) {
					this.scroll('down');
				} else {
					this.stopScroll();
				}
			},
		},
		methods: {
			touchstartHandler () {
				this.isTouch = true;
				this.stopScroll();
			},
			touchendHandler () {
				// this.stopScroll();
				// setTimeout(() => {
				// 	this.isTouch = false;
				// },500);
				
			},
			scroll (direction) {
				this.edgeScrolling = true;
				this.timer = setInterval(() => {
				
					this.$refs.chartScroller.scrollTop = this.$refs.chartScroller.scrollTop + this.step;
				},40);
				
			},
			stopScroll (e) {
				clearInterval(this.timer);
				this.edgeScrolling = false;
			},
			sizeHandler () {
				this.chartHeight = this.$refs.chartScroller.offsetHeight;
				this.positioning.chartTop = this.$refs.chartScroller.offsetTop;
			
				this.positioning.chartLeft = this.$refs.chartScroller.offsetLeft;
				this.positioning.chartRight = this.$refs.chartScroller.offsetRight;
				this.positioning.chartBottom = this.$refs.chartSpacer.offsetTop;

				let chartSpaceFillerHeight = this.chartHeight - this.rowHeight;
				this.fillSpaceHeight = "height: " + chartSpaceFillerHeight + "px";

				this.$nextTick(function () {
					this.cursorScreenY = this.positioning.chartTop + (this.rowHeight * 0.5);
				});
			
			
			},
			attachSunTimesToHours () {
				console.log('attachSunTimesToHours');
				this.weather.daily.forEach(day => {
					let sunTimesDayDate = (new Date(day.time)).getDate();
					let hour = this.weather.hourly.forEach(hour =>{
						let hourDate = (new Date(hour.time)).getDate();
						
						if (hourDate == sunTimesDayDate) {
							this.sunTimes.push({
								'sunriseTime' : day.sunriseTime,
								'sunsetTime' : day.sunsetTime
							});
						}
					});
				});
			},
			chartPointer (e) {
				console.log(e || e.type);
				if (e.sourceCapabilities.firesTouchEvents || this.isTouch) {
					this.isTouch = true;
				}

				let pos = e.pageY - this.positioning.chartTop;
				this.lastCursorPosition = pos;
				if (!this.cursorTicking) {
					window.requestAnimationFrame(() => {
						this.calcFinalCursor();
						this.calcAbsoluteCursor(e.pageY);
						this.cursorTicking = false;
					});
					this.cursorTicking = true;
				}
			},
			chartScroll (e) {
				console.log(e || e.type);
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
				if (this.endOfChart) {
					this.lastY = ( this.weather.hourly.length * this.rowHeight ) - this.lastScrollPosition + this.positioning.chartTop - (this.rowHeight * 0.5);
				}
			},
			calcAbsoluteCursor (y) {
				this.cursorScreenY = y;
			}
		},
		data () {
			return {
				// initial Y value
				cursorY: 0,
				cursorX: 0,
				lastScrollPosition: 0,
				scrollTicking: false,
				lastCursorPosition: 0,
				cursorTicking: false,
				fillSpaceHeight: "",
				sunTimes: [],
				cursorScreenY: 0,
				chartHeight: 0,
				positioning: {
					chartHeight: 0,
					chartTop: 0,
					chartBottom: 0,
					chartLeft: 0,
					chartRight: 0
				},
				lastY: 0,
				lastChartCursorY: 0,
				timer: null,
				edgeScrolling: false,
				isTouch: false,
			}
		}

	}

</script>

<style>

</style>