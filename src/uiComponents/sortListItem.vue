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
			},
			sortListIsBusy: {
				type: Boolean
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
				// SortList tells this item to make a space for the dragger

				// Dragger haven't taken anyone's space yet
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
				// Places are sorted and saved in Store
				// We can reset everything
				if (itemDropped) {
					this.itemReset();
				}
			},
			listScroll (top) {
				// The list can scroll while dragging the item
				// We will tell itemMoveHandler to compenasate
				// position for the scrolled amount
				if (this.item.isDragging) {
					if (!this.sortList.lastScrollTop) {
						this.sortList.lastScrollTop = top;
					}

					let difference = top - this.sortList.lastScrollTop;

					let newTop = Math.round(this.dragger.positionTop + difference)

					this.itemMoveHandler(newTop, {scrollType: 'scroll'});

					this.$nextTick(() => {
						this.sortList.lastScrollTop = top;
					});
				}
			},
			sortListIsBusy (sortListIsBusy) {
				if (sortListIsBusy) {
					this.sortList.isBusySorting = sortListIsBusy;
					this.item.canAnimate = false;
				}
			}
		},
		computed: {
			draggerStyle () {
				return {
					top: this.dragger.positionTop + 'px',
					'z-index': this.item.isDragging ? '1' : '0',
					height: this.itemHeight + 'px',
					transition: (this.dragger.canAnimate) ? `all ${this.interaction.TRANSITION_TIME}ms ease-in-out` : `none`
				}
			},
			itemStyle () {
				return {
					height: this.itemHeight + 'px',
					top: this.item.moveItemOffset + 'px',
					transition: (this.item.canAnimate) ? `top ${this.interaction.TRANSITION_TIME}ms ease-in-out` : `none`
				}
			}
		},
		methods: {
			touchstartHandler (event) {
				this.interaction.isTouch = true;
				this.mousedownHandler(event);
			},
			mousedownHandler (event) {
				// List is sorting itself, do nothing
				if (this.sortList.isBusySorting) {
					return;
				}

				// We are not sorting the list, do nothing
				if (!this.arrangeList) {
					return;
				}

				// If this particular item is being dragged
				if (event.target == this.$refs.dragger) {
					// Item will become a dragger after a long tap
					// on a touch screen
					if (this.interaction.isTouch) {
						this.interaction.longTapTimer = setTimeout(
							() => {
								this.item.isDragger = true;
							},
							this.interaction.LONG_TAP_TIMEOUT
						);
					} 
					// otherwise immediately become the dragged item
					else {
						this.item.isDragger = true;
					}
				}
			},
			touchendHandler (event) {
				this.interaction.isTouch = false;
				clearTimeout(this.interaction.longTapTimer);

				this.mouseupHandler(event);
			},
			mouseupHandler (event) {
				// Not arraning list, do nothing
				if (!this.arrangeList) {
					return;
				}

				// The dragger hasn't been moved, do nothing
				if (!this.item.isDragging) {
					return;
				}

				// Prevent all UI interactions till the new order is in the store
				this.sortList.isBusySorting = true;

				// If this is a dragged item, drop it now
				if (this.item.isDragger) {
					this.dropDragger();
				} 

				// Disable animations for normal items
				// because Vue will swop their order and reset styles
				// Like this it won't be noticeable in the browser
				this.item.canAnimate = false;
			},
			dropDragger () {

				this.item.isDragger = false;

				// Align the dragger between items
				
				this.dragger.canAnimate = true;
				this.dragger.positionTop =  (this.moveAway.takeSpaceOfIndex - this.index) * this.itemHeight;
				setTimeout(() => {
					this.dragger.canAnimate = false;
				}, this.interaction.TRANSITION_TIME)

			

				// Let the SortList know it's been dropped
				// let it know if it has been dropped to 
				// a new slot or not
				this.$parent.$emit('dropItem', {
					index: this.index,
					top: event.pageY,
					change: ( (this.index != this.moveAway.takeSpaceOfIndex ) && this.item.isDragging)
				});

			},
			itemReset () {
				// This is called after the SortList
				// has rearranged itself
				// We can then clean up all the mess
		
				this.item.isDragger = false;
				this.item.isDragging = false;
				this.item.initialScreenY = null;
				this.item.moveItemOffset = 0;
				this.item.screenPositionTop = 0;

				this.sortList.isBusySorting = false;
				this.sortList.lastScrollTop = null;
				this.sortList.scrollTopOffset = 0;

				this.dragger.canAnimate = false;
				this.dragger.positionTop = 0;
				this.dragger.offsetTop = null;

				this.interaction.isTouch = false;
				this.interaction.longTapTimer = null;

				// This needs to be reset after the top 
				// position is removed, to prevent unwanted
				// transition
				setTimeout(() => {
					this.item.canAnimate = true;
				}, this.TRANSITION_TIME);
			},
			touchmoveHandler (event) {
				// List is being sorted or we are not arranging, do nothing
				if (this.sortList.isBusySorting || !this.arrangeList) {
					return;
				}

				// As we have moved the finger, prevent long tap from happening
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
				// SortList is being sorted or this is not a dragger, do nothing
				if (this.sortList.isBusySorting || !this.item.isDragger) {
					return;
				}

				// Flag that the dragger is moving
				this.item.isDragging = true;

				// Dragger position can be either caused 
				// by a pointer (mousemove or touchmove)

				// or by the SortList being scrolled up and down
				// the position of the dragger on the screen need to be offset
				// by the scrolled amount

				if (options.scrollType == 'pointer') {
					if (!this.item.initialScreenY) {
						// We will align the dragged item to the middle with the cursor
						let itemTop = (this.$refs.dragItem.getBoundingClientRect()).top;
						let difference = y - (itemTop + this.itemHeight * 0.5);
						this.item.initialScreenY = y - difference;
					}
					// Save the absolute screen position
					this.item.screenPositionTop = y;

					// Save the relative position away from dragger's original slot
					this.dragger.offsetTop = y - this.item.initialScreenY;
				} else if (options.scrollType == 'scroll') {
					// Just in case the pointer event doesn't happen first, do nothing
					if (!this.item.screenPositionTop) {
						return;
					}

					// How much we need to compensate for the scroll
					this.sortList.scrollTopOffset = y - this.dragger.offsetTop;
					
				}

				this.dragger.positionTop = Math.round(
					minMaxLimiter(
						// Current Value - Item's + scrolled offset
						this.dragger.offsetTop + this.sortList.scrollTopOffset,
						// Min Value
						- this.index * this.itemHeight,
						// Max Value
						this.itemHeight * (this.nOfItems - 1 - this.index)
					)
				);

				// Let the SortList know that we are dragging this item
				// It will make sure the other items will move away
				// And it will tell us some useful stuff via this component properties
				this.$parent.$emit('itemIsDragging', {
					index: this.index,
					top: this.item.screenPositionTop
				});
			},
			// This makes space for the dragger by moving away
			// up or down
			// pos = -1, 0 , 1
			moveOnePosition (pos) {
				let offset = this.itemHeight;
				this.item.moveItemOffset = offset * pos;
			},
			contextmenuHandler (event) {
				// When arraning a list,
				// we need a long tap event
				// to select the item
				// not to open the context menu
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
					canAnimate: true,
					moveItemOffset: 0,
					screenPositionTop: 0,
				},
				sortList: {
					isBusySorting: false,
					lastScrollTop: null,
					scrollTopOffset: 0
				},
				dragger: {
					canAnimate: false,
					positionTop: 0,
					offsetTop: null,
				},
				interaction: {
					isTouch: false,
					LONG_TAP_TIMEOUT: 200,
					TRANSITION_TIME: 200,
					longTapTimer: null,
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
