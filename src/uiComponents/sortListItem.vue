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
				'uiSortListItem__dragger--dragging' : isDragging
			}"
		>
			<slot />
			<button
				class="placesList__sortingDragger"
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
			}
		},
		created () {
			document.addEventListener('mousedown', this.mousedownHandler);
			document.addEventListener('mouseup', this.mouseupHandler);
			document.addEventListener('mousemove', this.mousemoveHandler);
			document.addEventListener('touchmove', this.touchmoveHandler);
			document.addEventListener('touchstart', this.touchstartHandler);
			document.addEventListener('touchend', this.touchendHandler);
		},
		beforeDestroy () {
			document.removeEventListener('mousedown', this.mousedownHandler);
			document.removeEventListener('mouseup', this.mouseupHandler);
			document.removeEventListener('mousemove', this.mousemoveHandler);
			document.removeEventListener('touchmove', this.touchmoveHandler);
			document.removeEventListener('touchstart', this.touchstartHandler);
			document.removeEventListener('touchend', this.touchendHandler);
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
			y (y) {
				this.itemMoveHandler(y);
			},
			listScroll (top) {
				this.itemMoveHandler(this.y);
			}
		},
		computed: {
			draggerStyle () {
				return {
					top: this.itemTop + 'px',
					'z-index': this.isDragging ? '1' : '0',
					height: this.itemHeight + 'px',
					transition: 'all ' + (this.draggerCanTransition ? '200' : '0' ) + 'ms ease-in-out' 
				}
			},
			itemStyle () {
				return {
					height: this.itemHeight + 'px',
					top: this.moveItemOffset + 'px',
					transition: 'all ' + (this.itemCanTransition ? '200' : '0' ) + 'ms ease-in-out'
				}
			}
		},
		methods: {
			touchstartHandler (event) {
				this.mousedownHandler(event);
			},
			mousedownHandler (event) {
				if (this.busy) {
					return;
				}
				this.isDropped = false;
				this.draggerCanTransition = false;
				this.itemCanTransition = true;
				if (!this.arrangeList) {
					return true;
				}
				if (event.target == this.$refs.dragger) {
					this.isDragger = true;
				} else {
					this.isDragger = false;
				}
			},
			touchendHandler (event) {
				this.mouseupHandler(event);
			},
			mouseupHandler (event) {
				this.busy = true;

				this.isDropped = true;
				if (this.isDragger) {
					this.dropDragger();
				}
				if (this.isDragger) {
					// this.isDragging = false; //xxx
					this.itemTop =  (this.moveAway.takeSpaceOfIndex - this.index) * this.itemHeight;
					this.draggerCanTransition = true;
				} else {
					this.itemCanTransition = false;
				}
				setTimeout(this.itemReset, this.TRANSITION_TIME + 100);
				
			},
			dropDragger () {
				this.$parent.$emit('dropItem', {
					index: this.index,
					top: event.pageY,
					change: (this.index != this.moveAway.takeSpaceOfIndex)
				});

			},
			itemReset () {
				this.isDropped = false;
				this.isDragger = false;
				this.isDragging = false;
				this.itemTop = 0;
				this.moveItemOffset = 0;
				this.initialPageY = null;
				this.busy = false;
			},
			touchmoveHandler (event) {
				if (this.busy) {
					return;
				}
				this.y = event.touches[0].clientY;
			},
			mousemoveHandler (event) {
				if (this.busy) {
					return;
				}

				this.y = event.pageY;

			},
			itemMoveHandler (y) {
				if (this.isDragger && !this.isDropped) {
					this.isDragging = true;

					y = y + this.listScroll;

					if (!this.initialPageY) {
						this.initialPageY = y;
					}

					this.itemTop = y - this.initialPageY;

					this.$parent.$emit('itemIsDragging', {
						index: this.index,
						top: y
					});
				}
			},
			moveOnePosition (pos) {
				let offset = this.itemHeight;
				this.moveItemOffset = offset * pos;

			},
		},
		data() {
			return {
				isDragger: false,
				isDragging: false,
				itemTop: 0,
				moveItemOffset: 0,
				transitionTime: 200,
				TRANSITION_TIME: 200,
				isDropped: false,
				initialPageY: null,
				draggerCanTransition: false,
				itemCanTransition: true,
				busy: false,
				y: 0
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

</style>
