<template>
	<li class="placesList__itemWrapper">
		<div v-if="isDragging" class="placesList__itemPlaceHolder">
		</div>
		<div class="placesList__item"
			v-bind:class="{ 'is-dragging': isDragging, 'can-transition': canTransition }"
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
			dragging: {
				type: Boolean
			},
			makeSpace: {
				type: Array
			},
			listDimensions: {
				type: Object
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
			setAbsoluteTop (top) {
				this.itemDraggedStyle = {
					position: 'absolute',
					top: `${top}px`
				};
			},
			mousedownHandler () {
				let dragger = this.$refs.dragger;
				if (event.target == dragger) {
					this.isDragger = true;
					this.canTransition = false;
				} else {
					this.isDragger = false;
				}
			},
			mouseupHandler () {
			
				if (this.isDragging) {
					this.canTransition = true;

					this.setAbsoluteTop(this.alignItemToGrid(event.pageY));
					this.dropItem();
				} 

				if (this.dragging) {
					setTimeout(() => {
						this.canTransition = false;
					},200);
					setTimeout(this.resetItem,201);
					setTimeout(() => {
						this.canTransition = true;
					},202);
					this.isDragging = false;
					this.isDragger = false;
					this.firstMove = true;
					this.movingAwayFirstTime = true;
				} 
			},

			alignItemToGrid (y) {
				let top =  (Math.floor( ( y - 45 ) / 40 ) * 40 ) + 45;
				return Math.min( Math.max(this.listDimensions.top, top), this.listDimensions.bottom - 40);
			},

			resetItem () {
				this.itemDraggedStyle = {};
				this.itemMovedStyle = {};
			
				
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
							this.setAbsoluteTop(top);
							this.$emit('itemDrag', {
								index: this.index,
								top: event.pageY
							});
						}
					}
				}
			},
			deep_copy (obj) {
				// @todo: make object spread operator working with babel/webpack
				return JSON.parse(JSON.stringify(obj));
			},
			dropItem () {
				const itemDataAtDropMoment = this.deep_copy({
					index: this.index,
					top: event.pageY,
					id: this.place._id,
					oldIndex: this.place.listOrder
				});

				setTimeout(() => {
					this.$emit('itemDrop', itemDataAtDropMoment);
				},202);
			},
			openPlaceSettings () {
				debugger;
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
				top: 0,
				canTransition: true
			}
		}
	}
</script>