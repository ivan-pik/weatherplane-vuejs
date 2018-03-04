<template>
	<div 
		class="uiSortList"
		:class="{
			'uiSortList--arranging' : arrangeList
		}"
	>

		<ui-help-bubble
			:open="arrangeList"
		>
			<span v-if="isTouchDeviceFlag">
				Tap long on the item you want to reorder<br />
				and then you can move it up and down
			</span>
			<span v-else>
				@TODO
			</span>
		</ui-help-bubble>

		<div
			ref="list"
			class="uiSortList__scroller"
			v-bind:style="scrollerStyle"
			@scroll="scrollHandler"
		>
			<slot />
			<div
				class="uiSortList__dropCursor"
				v-bind:style="dropCursorStyle"
			>
			</div>
		</div>
		<div class="uiSortList__arrangingTools">
			<button
				@click="stopArranging"
			>END</button>
		</div>
	</div>
</template>

<script>

	import {minMaxLimiter} from 'libs/minMaxLimiter.js';

	export default {
		name: 'SortList',
		components: {
		},
		props: {
			arrangeList: {
				type: Boolean
			},
			items: {
				type: Array
			},
			movingItem: {
				type: Object
			},
			itemHeight: {
				type: Number
			},
			itemDropped: {
				type: Boolean
			}
		},
		created () {
			window.addEventListener('resize', this.getSizes);
			document.addEventListener('mousemove', this.mousemoveHandler);
			document.addEventListener('touchmove', this.touchmoveHandler);
			document.addEventListener('touchstart', this.touchstartHandler);
			document.addEventListener('touchend', this.touchendHandler);

		},
		mounted () {
			this.getSizes();
		},
		beforeDestroy () {
			window.removeEventListener('resize', this.getSizes);
			document.removeEventListener('mousemove', this.mousemoveHandler);
			document.removeEventListener('touchmove', this.touchmoveHandler);
			document.removeEventListener('touchstart', this.touchstartHandler);
			document.removeEventListener('touchend', this.touchendHandler);
		},
		watch: {
			isTouch (isTouch) {
				// @todo: Replace with global app detection
				this.isTouchDeviceFlag = true;
			},
			arrangeList (arrangeList) {
				if (arrangeList) {
					this.getSizes();
				}
			},
			movingItem (movingItem) {
				if (!'top' in movingItem) {
					return;
				}

				

				if (this.firstMove) {
					setTimeout(() => {
						this.cursor.canTransitonPosition = true;
					}, 20)
					setTimeout(() => {
						this.cursor.canTransitonPosition = true;
						this.firstMove = false;
					}, this.TRANSITION_TIME)
				}

				let cursor = movingItem.top - this.posTop;

				let chartHeight = this.items.length * this.itemHeight;


				this.takeSpaceOfIndex = minMaxLimiter(
					// Current Value
					Math.floor((cursor + this.scroll.top) / this.itemHeight),
					// Min Value
					0,
					// Max Value
					this.items.length - 1
				)

				this.cursor.top = this.takeSpaceOfIndex * this.itemHeight;

				this.$emit('wedgeDraggedItem', {
					draggedItemIndex: movingItem.index,
					takeSpaceOfIndex: this.takeSpaceOfIndex,
				});
			},
			itemDropped (itemDropped) {
				this.cursor.canTransitonPosition = false;

				clearInterval(this.scroll.timer);
				this.autoScrollIsBusy = false;

				if (itemDropped) {
					this.firstMove = true;
					this.takeSpaceOfIndex = null;

					setTimeout(() => {
						this.takeSpaceOfIndex = null;
					}, 200);
				}
			},
			'scroll.direction': function (direction) {
				if(this.listHeight == this.listFullHeight) {
					return;
				}

				if (direction === 0) {
					clearInterval(this.scroll.timer);
					this.autoScrollIsBusy = false;
					return;
				} else {
					this.autoScrollIsBusy = true;
					this.scroll.timer = setInterval( () => {
						this.scroll.top = Math.min(Math.max(this.scroll.top + (10 * this.scroll.speed) * direction, 0), this.listFullHeight - this.listHeight);
						this.$refs.list.scrollTop = this.scroll.top;
					},50);
				}
			},
		},
		computed: {
			cursorOpacity () {
				if ('top' in this.movingItem) {
					return '1'
				} else {
					return '0'
				}
			},
			dropCursorStyle () {
				const fadeInTransition = `opacity ${this.TRANSITION_TIME}ms ease-in-out`;
				const movingTransition = `all ${this.TRANSITION_TIME}ms ease-in-out`;

				return {
					height: `${this.itemHeight}px`,
					top: `${this.cursor.top}px`,
					opacity: this.cursorOpacity,
					transition: (this.cursor.canTransitonPosition) ? movingTransition : fadeInTransition
				}
			},
			scrollerStyle () {
				return {
					'touch-action': (this.preventTouchScroll) ? 'none' : 'pan-y',
					'overflow': (this.preventTouchScroll) ? 'hidden' : 'auto'
				}
			}
		},
		methods: {
			getSizes() {
				this.posTop = this.$refs.list.offsetTop;
				this.listHeight = this.$refs.list.offsetHeight;
				this.listFullHeight = this.$refs.list.scrollHeight;
			},
			stopArranging () {
				this.$emit('stopArraning');
			},
			touchmoveHandler (event) {
				if (!this.preventTouchScroll) {
					clearTimeout(this.preventScrollTimer);
				}
				this.autoScroll(event.touches[0].clientY);
			},
			mousemoveHandler (event) {
				this.autoScroll(event.clientY);
			},
			autoScroll (y) {
				if (!this.arrangeList || !this.movingItem.top) {
					return;
				}
				if (y < (this.posTop + this.itemHeight)) {
					// Scroll Up
					this.scroll.speed = Math.round( (1 - (y - (this.posTop)) / this.itemHeight) * 10) / 10;
					this.scroll.direction = -1;
				} else if (y > (this.posTop + this.listHeight - this.itemHeight)) {
					// Scroll Down
					this.scroll.speed = Math.round( (1 - ((this.posTop + this.listHeight) - y) / this.itemHeight) * 10 ) / 10;	
					this.scroll.direction = 1;
				} else {
					this.scroll.direction = 0;
				}
			},
			scrollHandler () {
				this.scroll.top = this.$refs.list.scrollTop;
				this.$emit('listScroll', this.scroll.top);
			},
			touchstartHandler (e) {
				this.isTouch = true;

				if (e.target.closest('.uiSortList__scroller') && this.movingItem.top) {
					this.preventTouchScroll = true;
				}
				this.preventScrollTimer = setTimeout(() => {
					this.preventTouchScroll = true;
				}, this.LONG_TAP_TIMEOUT);
			},
			touchendHandler (event) {
				this.isTouch = false;
				this.preventTouchScroll = false;
				clearTimeout(this.preventScrollTimer);
			},
		},
		data() {
			return {
				posTop: 0,
				listHeight: null,
				listFullHeight: null,
				takeSpaceOfIndex: null,
				firstMove: true,
				TRANSITION_TIME: 200,
				scroll: {
					speed: 0,
					top: 0,
					direction: 0,
					timer: null,
				},
				autoScrollIsBusy: false,
				isTouch: false,
				preventTouchScroll: false,
				preventScrollTimer: null,
				LONG_TAP_TIMEOUT: 200,
				cursor: {
					canTransitonPosition: false,
					top: 0,
				},
				isTouchDeviceFlag: false
			}
		}
	}
</script>

<style lang="scss">

	@import '~globalVars';

	.uiSortList {
		background-color: #fff;
		border-top: 1px solid #ddd;
		
	}

	.uiSortList__scroller {
		position: relative;
		height: 200px;
		overflow: auto;
	}

	.uiSortList__dropCursor {
		position: absolute;
		background-color: rgba(green, 0.2);
		width: 100%;
		pointer-events: none;
	}

	.uiSortList__arrangingTools {
		position: fixed;
		bottom: 0;
		background-color: red;
		button {
			padding: 3em;
		}
	}

</style>
