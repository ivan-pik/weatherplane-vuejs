<template>
	<div
		class="uiSortListItem"
		v-bind:style="itemStyle"
	>
		<div
			class="uiSortListItem__dragger"
			ref="dragItem"
			v-bind:style="draggerStyle"
			v-bind:class="{
				'uiSortListItem__dragger--dragging' : item.isDragging,
				'uiSortListItem__dragger--dragging-active' : item.isDragger
			}"
		>
			<slot />
			<button
				class="uiSortListItem__draggerButton"
				v-if="arrangeList"
				ref="dragger"
			>
				<svg viewBox="0 0 40 40" version="1.1" 
					width="40" height="40"
				>
					<polygon class="" points="15 19 20 13 25 19"
					></polygon>
					<polygon class="" points="15 21 20 27 25 21"
					></polygon>
				</svg>
			</button>
		</div>
	</div>
</template>

<script>

	import {minMaxLimiter} from 'libs/minMaxLimiter.js';

	export default {
		name: 'SortListItem',
		components: {
		},
		props: {
			arrangeList: {
				type: Boolean
			},
			itemHeight: {
				type: Number
			},
			index: {
				type: Number
			},
			moveAway: {
				type: Object
			},
			dropItem: {
				type: Object
			},
			itemDropped: {
				type: Boolean
			},
			listScroll: {
				type: Number
			},
			nOfItems: {
				type: Number
			}
		},
		created () {
			document.addEventListener('mousedown', this.mousedownHandler);
			document.addEventListener('mouseup', this.mouseupHandler);
			document.addEventListener('mousemove', this.mousemoveHandler);
			document.addEventListener('touchmove', this.touchmoveHandler);
			document.addEventListener('touchstart', this.touchstartHandler);
			document.addEventListener('touchend', this.touchendHandler);
			window.addEventListener('contextmenu', this.contextmenuHandler);
		},
		beforeDestroy () {
			document.removeEventListener('mousedown', this.mousedownHandler);
			document.removeEventListener('mouseup', this.mouseupHandler);
			document.removeEventListener('mousemove', this.mousemoveHandler);
			document.removeEventListener('touchmove', this.touchmoveHandler);
			document.removeEventListener('touchstart', this.touchstartHandler);
			document.removeEventListener('touchend', this.touchendHandler);
			window.removeEventListener('contextmenu', this.contextmenuHandler);
		},
		watch: {
			moveAway (moveAway) {
				if (moveAway.draggedItemIndex == this.index) {
					return;
				}

				// Moving Bottom to Top
				if (moveAway.draggedItemIndex > moveAway.takeSpaceOfIndex) {
					if (moveAway.takeSpaceOfIndex == this.index) {
						this.moveOnePosition(1);
					} else if (moveAway.takeSpaceOfIndex >= this.index) {
						this.moveOnePosition(0);
					} 
				// Moving Top to Bottom
				} else if (moveAway.draggedItemIndex < moveAway.takeSpaceOfIndex) {
					if (moveAway.takeSpaceOfIndex == this.index) {
						this.moveOnePosition(-1);
					} else if (moveAway.takeSpaceOfIndex <= this.index) {
						this.moveOnePosition(0);
					} 
				} else if (moveAway.draggedItemIndex == moveAway.takeSpaceOfIndex) {
					this.moveOnePosition(0);
				}
			},
			itemDropped (itemDropped) {
				if (itemDropped) {
					this.itemReset();
				}
			},
			listScroll (top) {
				if (this.item.isDragging) {
					if (!this.sortList.lastScrollTop) {
						this.sortList.lastScrollTop = top;
					}

					let difference = top - this.sortList.lastScrollTop;

					let newTop = Math.round(this.dragger.positionTop + difference)

					this.itemMoveHandler( newTop, { scrollType: 'scroll' } );

					this.$nextTick(() => {
						this.sortList.lastScrollTop = top;
					});
				}
			}
		},
		computed: {
			draggerStyle () {
				return {
					top: this.dragger.positionTop + 'px',
					'z-index': this.item.isDragging ? '1' : '0',
					height: this.itemHeight + 'px',
					transition: 'all ' + (this.dragger.isAnimating ? '200' : '0' ) + 'ms ease-in-out' 
				}
			},
			itemStyle () {
				return {
					height: this.itemHeight + 'px',
					top: this.item.moveItemOffset + 'px',
					transition: 'all ' + (this.item.isAnimating ? '200' : '0' ) + 'ms ease-in-out'
				}
			}
		},
		methods: {
			touchstartHandler (event) {
				this.interaction.isTouch = true;
				this.mousedownHandler(event);
			},
			mousedownHandler (event) {
				if (this.sortList.isBusySorting) {
					return;
				}
				this.item.isDropped = false;
				this.dragger.isAnimating = false;
				this.item.isAnimating = true;
				if (!this.arrangeList) {
					return;
				}
				if (event.target == this.$refs.dragger) {
					if (this.interaction.isTouch) {
						this.interaction.longTapTimer = setTimeout(
							() => {
								this.item.isDragger = true;
							},
							this.interaction.LONG_TAP_TIMEOUT
						);
					} else {
						this.item.isDragger = true;
					}
				} else {
					this.item.isDragger = false;
				}
			},
			touchendHandler (event) {
				this.interaction.isTouch = false;
				clearTimeout(this.interaction.longTapTimer);
				this.mouseupHandler(event);
			},
			mouseupHandler (event) {
				if (!this.arrangeList) {
					return;
				}

				if (!this.item.isDragging) {
					this.itemReset();
					return;
				}

				this.sortList.isBusySorting = true;

				this.item.isDropped = true;
				if (this.item.isDragger) {
					this.dropDragger();
				}
				if (this.item.isDragger) {
					this.dragger.positionTop =  (this.moveAway.takeSpaceOfIndex - this.index) * this.itemHeight;
					this.dragger.isAnimating = true;
				} else {
					this.item.isAnimating = false;
				}
				setTimeout(this.itemReset, this.interaction.TRANSITION_TIME + 100);
				
			},
			dropDragger () {
				this.$parent.$emit('dropItem', {
					index: this.index,
					top: event.pageY,
					change: ( (this.index != this.moveAway.takeSpaceOfIndex ) && this.item.isDragging)
				});

			},
			itemReset () {
				this.item.isDropped = false;
				this.item.isDragger = false;
				this.item.isDragging = false;
				this.dragger.positionTop = 0;
				this.item.moveItemOffset = 0;
				this.item.initialScreenY = null;
				this.sortList.isBusySorting = false;
				this.sortList.lastScrollTop = null;
				this.item.screenPositionTop = 0;
				this.dragger.offsetTop = null;
				this.sortList.scrollTopOffset = 0;
			},
			touchmoveHandler (event) {
				if (this.sortList.isBusySorting || !this.arrangeList) {
					return;
				}
				if(this.interaction.longTapTimer) {
					clearTimeout(this.interaction.longTapTimer);
				}

				this.itemMoveHandler(event.touches[0].clientY, {scrollType: 'pointer'});
			},
			mousemoveHandler (event) {
				if (this.sortList.isBusySorting || !this.arrangeList) {
					return;
				}

				this.itemMoveHandler(event.pageY, {scrollType: 'pointer'});

			},
			/* Moves draged item to follow cursor
				options: {
					scrollType: 'scroll' / 'pointer'
				}
			*/
			itemMoveHandler (y, options) {
				if (this.item.isDragger && !this.item.isDropped) {
					this.item.isDragging = true;

					if (options.scrollType == 'pointer') {
						if (!this.item.initialScreenY) {
							let itemTop = (this.$refs.dragItem.getBoundingClientRect()).top;
							let difference = y - (itemTop + this.itemHeight * 0.5);
							this.item.initialScreenY = y - difference;
						}
						this.item.screenPositionTop = y;
						this.dragger.offsetTop = y - this.item.initialScreenY;
					} else if (options.scrollType == 'scroll') {
						// Just in case somehow the scroll event is fired before the item is actually dragged away
						if (!this.item.screenPositionTop) {
							return;
						}
						this.sortList.scrollTopOffset = y - this.dragger.offsetTop;
						
					}

					this.dragger.positionTop = Math.round(
						minMaxLimiter(
							// Current Value
							this.dragger.offsetTop + this.sortList.scrollTopOffset,
							// Min Value
							- this.index * this.itemHeight,
							// Max Value
							this.itemHeight * (this.nOfItems - 1 - this.index)
						)
					);

					console.log('itemTop', this.dragger.positionTop);

					this.$parent.$emit('itemIsDragging', {
						index: this.index,
						top: this.item.screenPositionTop
					});
				}
			},
			moveOnePosition (pos) {
				let offset = this.itemHeight;
				this.item.moveItemOffset = offset * pos;

			},
			contextmenuHandler (event) {
				if (this.arrangeList) {
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			}
		},
		data() {
			return {
				item: {
					isDragger: false,
					isDragging: false,
					initialScreenY: null,
					isAnimating: true,
					moveItemOffset: 0,
					isDropped: false,
					screenPositionTop: 0,
				},
				sortList: {
					isBusySorting: false,
					lastScrollTop: null,
					scrollTopOffset: 0
				},
				dragger: {
					isAnimating: false,
					positionTop: 0,
					offsetTop: null,
				},
				interaction: {
					isTouch: false,
					LONG_TAP_TIMEOUT: 200,
					longTapTimer: null,
					TRANSITION_TIME: 200,
				},
			}
		}
	}
</script>

<style lang="scss">

	@import '~globalVars';

	.uiSortListItem {
		border-bottom: 1px solid #ddd;
		position: relative;
		
	}

	.uiSortListItem__dragger {
		position: relative;
		left: 0;
		right: 0;
		
	}

	.uiSortListItem__dragger--dragging {
		border-top: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
		background-color: rgba(#fff, 0.8);
	}

	.uiSortListItem__dragger--dragging-active {
		box-shadow: 0 0 6px 4px rgba(0,0,0,0.1);
		.uiSortListItem__draggerButton svg {
			fill: $uiInputInactive;
		}
	}

	.uiSortListItem__draggerButton {
		position: absolute;
		left: 0;
		right: 0;
		width: 100%;
		top: 0;
		bottom: 0;
		height: 100%;
		text-align: right;

		svg {
			pointer-events: none;
			fill: $uiInputActive;
		}
	}

</style>
