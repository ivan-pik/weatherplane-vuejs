<template>
	<div 
		class="uiSortList"
		
		:class="{
			'uiSortList--arranging' : arrangeList
		}"
	>
		<div
			ref="list"
			class="uiSortList__scroller"
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

		},
		mounted () {
			this.getSizes();
		},
		beforeDestroy () {
			window.removeEventListener('resize', this.getSizes);
			document.removeEventListener('mousemove', this.mousemoveHandler);
		},
		watch: {
			arrangeList (arrangeList) {
				if (arrangeList) {
					this.getSizes();
				}
			},
			movingItem (movingItem) {
				if (!movingItem.top) {
					return;
				}

				if (this.firstMove) {
					this.transitionAll = false;
					setTimeout(() => {
						this.transitionAll = true;
						this.firstMove = false;
					}, this.TRANSITION_TIME)
				}

				let cursor = movingItem.top - this.posTop;

				let chartHeight = this.items.length * this.itemHeight;


				this.takeSpaceOfIndex = minMaxLimiter(
					Math.floor((cursor + this.scroll.top) / this.itemHeight),	// Current Value
					0,	// Min Value
					this.items.length - 1	// Max Value
				)

				this.$emit('wedgeDraggedItem', {
					draggedItemIndex: movingItem.index,
					takeSpaceOfIndex: this.takeSpaceOfIndex,
				});
			},
			itemDropped (itemDropped) {
				clearInterval(this.scroll.timer);
				this.autoScrollIsBusy = false;

				if (itemDropped) {
					this.transitionAll = false;
					this.firstMove = true;
					this.takeSpaceOfIndex = null;

					setTimeout(() => {
						this.takeSpaceOfIndex = null;
						this.transitionAll = true;
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
			dropCursorStyle () {
				return {
					height: this.itemHeight + 'px',
					top: this.takeSpaceOfIndex * this.itemHeight + 'px',
					opacity: (this.takeSpaceOfIndex !== null && this.transitionAll) ? '1' : '0',
					transition: (this.transitionAll == true ? 'all' : 'opacity') + ' 200ms ease-in-out'
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
			mousemoveHandler (event) {
				if (!this.arrangeList || !this.movingItem.top) {
					return;
				}
				if (event.clientY < (this.posTop + this.itemHeight)) {
					// Scroll Up
					this.scroll.speed = Math.round( (1 - (event.clientY - (this.posTop)) / this.itemHeight) * 10) / 10;
					this.scroll.direction = -1;
				} else if (event.clientY > (this.posTop + this.listHeight - this.itemHeight)) {
					// Scroll Down
					this.scroll.speed = Math.round( (1 - ((this.posTop + this.listHeight) - event.clientY) / this.itemHeight) * 10 ) / 10;	
					this.scroll.direction = 1;
				} else {
					this.scroll.direction = 0;
				}
			},
			scrollHandler () {
				this.scroll.top = this.$refs.list.scrollTop;
				this.$emit('listScroll', this.scroll.top);
			},
		},
		data() {
			return {
				posTop: 0,
				listHeight: null,
				listFullHeight: null,
				takeSpaceOfIndex: null,
				transitionAll: true,
				firstMove: true,
				TRANSITION_TIME: 200,
				scroll: {
					speed: 0,
					top: 0,
					direction: 0,
					timer: null,
				},
				autoScrollIsBusy: false,
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

	.uiSortList--arranging {
		.uiSortList__scroller {
		}
	}

	.uiSortList__dropCursor {
		position: absolute;
		background-color: rgba(green, 0.2);
		width: 100%;
		pointer-events: none;
		opacity: 0.2;
		transition: all 200ms ease-in-out;
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
