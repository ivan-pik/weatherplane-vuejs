<template>
	<div class="uiSortList" ref="list">
		<slot />
		<div
			class="uiSortList__dropCursor"
			v-bind:style="dropCursorStyle"
		>
		</div>
	</div>
</template>

<script>
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

		},
		mounted () {
			this.getSizes();
		},
		beforeDestroy () {
			window.removeEventListener('resize', this.getSizes);
		},
		watch: {
			movingItem (movingItem) {
				if (this.firstMove) {
					this.transitionAll = false;
					setTimeout(() => {
						this.transitionAll = true;
						this.firstMove = false;
					}, this.TRANSITION_TIME)
				}

				let cursor = movingItem.top - this.posTop;
				let chartHeight = this.items.length * this.itemHeight;

				this.takeSpaceOfIndex = Math.max(Math.min(Math.floor(cursor / this.itemHeight), this.items.length - 1),0)

				this.$emit('wedgeDraggedItem', {
					draggedItemIndex: movingItem.index,
					takeSpaceOfIndex: this.takeSpaceOfIndex,
				});
			},
			itemDropped (itemDropped) {
				if (itemDropped) {
					this.transitionAll = false;
					this.firstMove = true;

					setTimeout(() => {
						this.takeSpaceOfIndex = null;
						this.transitionAll = true;
					}, 200);
				}
			}
		},
		computed: {
			dropCursorStyle () {
				return {
					height: this.itemHeight + 'px',
					top: (this.takeSpaceOfIndex ? this.takeSpaceOfIndex * this.itemHeight : 0) + 'px',
					opacity: (this.takeSpaceOfIndex !== null && this.transitionAll) ? '1' : '0',
					transition: (this.transitionAll == true ? 'all' : 'opacity') + ' 200ms ease-in-out'
				}
			}
		},
		methods: {
			getSizes() {
				this.posTop = this.$refs.list.offsetTop;
			},
		},
		data() {
			return {
				posTop: 0,
				takeSpaceOfIndex: null,
				transitionAll: true,
				firstMove: true,
				TRANSITION_TIME: 200
			}
		}
	}
</script>

<style lang="scss">

	@import '~globalVars';

	.uiSortList {
		background-color: #fff;
		border-top: 1px solid #ddd;
		position: relative;
	}

	.uiSortList__dropCursor {
		position: absolute;
		background-color: rgba(green, 0.2);
		width: 100%;
		pointer-events: none;
		opacity: 0.2;
		transition: all 200ms ease-in-out;
	}

</style>
