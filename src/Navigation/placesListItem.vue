<template>
	<li class="placesList__itemWrapper"
		
	>
		<div v-if="isDragging" class="placesList__itemPlaceHolder">
		</div>
		<div class="placesList__item"
			v-bind:class="{ 'is-dragging': isDragging }"
			v-bind:style="[itemDraggedStyle,itemMovedStyle]"
		>
			
			<router-link :to="'/' + activeUserName + '/' + place.placeSlug">
				<span class="placesList__name">
					{{place.placeName}}
				</span>
			</router-link>
			<button class="placesList__contextMenuToggler"
				@click.stop="contextMenu"
			>
				...
			</button>
			<div
				v-if="contextMenuOpen"
				class="placesList__contextMenu">
				<button 
					class="placesList__contextLink placesList__contextLink--settings"
					@click="openPlaceSettings"
				>
					Place Settings
				</button>
				<button class="placesList__contextLink placesList__contextLink--move"
					@click="moooveIt"
				>move</button>
			</div>
		
			<button
				class="placesList__sortingDragger"
				v-bind:class="{ 'is-dragging': isDragging }"
				ref="dragger"
				v-if="arranging"
			>
			</button>
		</div>
	</li>
</template>

<script>
	export default {
		name: 'PlacesListItem',
		props: {
			contextMenuClose: {
				type: Number
			},
			index: {
				type: Number
			},
			place: {
				type: Object
			},
			arranging: {
				type: Boolean
			},
			makeSpace: {
				type: Array
			}
		},
		created () {
			document.addEventListener('mousedown', this.mousedownHandler);
			document.addEventListener('mouseup', this.mouseupHandler);
			document.addEventListener('mousemove', this.mousemoveHandler);
		},
		beforeDestroy () {
			document.removeEventListener('mousedown', this.mousedownHandler);
			document.removeEventListener('mouseup', this.mouseupHandler);
			document.removeEventListener('mousemove', this.mousemoveHandler);
		},
		computed: {
			activeUserName () {
				return this.$store.state.user.name;
			}
		},
		watch: {
			contextMenuClose (value) {
				if (value != -1 && value != this.index) {
					this.contextMenuOpen = false;
				}
			},
			makeSpace (value) {
				let toIndex = value[0];
				let fromIndex = value[1];
				let direction = 0;


				if (this.isDragging) {
					this.moveOrder(0);
				} else {
					// Return back
					if (toIndex == fromIndex) {
						direction = 0;
					} else {
						if (toIndex > fromIndex) {
							direction = 1;
						} else {
							direction = -1;
						}
					}

					if (direction == 0) {
						this.moveOrder(0);
					} else {
						// move destination item up or down
						if (this.index == toIndex) {
							this.moveOrder(direction * -1);
						} else {
							if (
								(direction == 1 && this.index > toIndex)
								||
								(direction == -1 && this.index < toIndex)
							) {
								this.moveOrder(0);
							} 
						}
					}

				}
			}
		},
		methods: {
			moveOrder(pos) {
				if (pos == 0) {
					this.itemMovedStyle = {};
				} else {
					this.itemMovedStyle = {
						position: 'relative',
						top: `${pos * 40}px`
					};
				}
			},
			setDraggedStyle (top) {
				this.itemDraggedStyle = {
					position: 'absolute',
					top: `${top}px`
				};
			},
			mousedownHandler () {
				let dragger = this.$refs.dragger;
				if (event.target == dragger) {
					this.isDragger = true;
				} else {
					this.isDragger = false;
				}
			},
			mouseupHandler () {
				if (this.isDragging) {
					this.dropItem();
				}
				this.isDragging = false;
				this.isDragger = false;
				this.firstMove = true;
				this.itemDraggedStyle = {};
				this.itemMovedStyle = {};
				this.movingAwayFirstTime = true;
				
			},
			mousemoveHandler (event) {
				if (this.isDragger) {
					if (this.firstMove) {
						this.firstPos = event.pageY;
						this.firstMove = false;
					} else {
						if (Math.abs(this.firstPos - event.pageY) > 10) {
							this.isDragging = true;
							let top = event.pageY - 20;
							this.setDraggedStyle(top);
							this.$emit('itemDrag', {
								index: this.index,
								top: event.pageY
							});
						}
					}

					// if (this.first) {
					// 	this.offset = event.clientX - this.left;
					// 	this.first = false;
					// }
					// let movement = Math.min(Math.max(event.clientX - this.offset, 0), this.posRight - 40);
					// this.left =+ movement;
				}
			},
			dropItem () {
				this.$emit('itemDrop', {
					index: this.index,
					top: event.pageY
				});
			},
			openPlaceSettings () {
				let placeName = this.place.placeSlug;
				let userName = this.activeUserName;
				this.$router.push({ path: `/${userName}/${placeName}/settings` });
			},
			moooveIt () {
				this.$emit('arrangeItems', this.index);
				this.contextMenuOpen=false;
			},
			contextMenu () {
				this.$emit('contextMenuTriggered');
				this.contextMenuOpen=!this.contextMenuOpen;
			}
		},
		data() {
			return {
				contextMenuOpen: false,
				isDragging: false,
				isDragger: false,
				firstMove: true,
				firstPos: 0,
				itemDraggedStyle: {},
				itemMovedStyle: {},
				top: 0
			}
		}
	}
</script>