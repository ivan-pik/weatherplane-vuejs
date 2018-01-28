<template>
	<li class="placesList__itemWrapper">
		<div v-if="isDragging" class="placesList__itemPlaceHolder">
		</div>
		<div class="placesList__item"
			v-bind:class="{ 'is-dragging': isDragging, 'can-transition': canTransition }"
			v-bind:style="[itemDraggedStyle,itemMovedStyle]"
		>
			
			<router-link class="placesList__itemLink" :to="'/' + activeUserName + '/' + place.placeSlug">
				<span class="placesList__name">
					{{place.placeName}}
				</span>
			</router-link>
			<button class="placesList__contextMenuToggler"
				@click.stop="contextMenu"
				v-if="!arranging"
			>
				<svg width="3px" height="13px" viewBox="0 0 3 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M1.5,3 C0.671572875,3 0,2.32842712 0,1.5 C0,0.671572875 0.671572875,0 1.5,0 C2.32842712,0 3,0.671572875 3,1.5 C3,2.32842712 2.32842712,3 1.5,3 Z M1.5,13 C0.671572875,13 0,12.3284271 0,11.5 C0,10.6715729 0.671572875,10 1.5,10 C2.32842712,10 3,10.6715729 3,11.5 C3,12.3284271 2.32842712,13 1.5,13 Z M1.5,8 C0.671572875,8 0,7.32842712 0,6.5 C0,5.67157288 0.671572875,5 1.5,5 C2.32842712,5 3,5.67157288 3,6.5 C3,7.32842712 2.32842712,8 1.5,8 Z" id="path-1"></path></svg>
			</button>
			<div
				v-if="contextMenuOpen"
				class="placesList__contextMenu">
				<button 
					class="uiLink"
					@click="openPlaceSettings"
				>
					Settings
				</button>
				<button class="uiLink"
					@click="moooveIt"
				>
					Reorder
				</button>
			</div>
		
			<button
				class="placesList__sortingDragger"
				v-bind:class="{ 'is-dragging': isDragging }"
				ref="dragger"
				v-if="arranging"
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