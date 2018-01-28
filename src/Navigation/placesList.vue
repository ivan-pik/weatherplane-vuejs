<template>
	<div class="placesList" ref="placesList">
		<ul v-if="places" class="placesList__items"
			:class="'placesList--' + role + arrangeClass"
		>
			<places-list-item
				v-for="(place, index) in places"
				:key="place._id"
				v-on:contextMenuTriggered="contextMenuHandler(index)"
				v-on:arrangeItems="arrangeItems(index)"
				v-on:itemDrag="dragHandler"
				v-on:itemDrop="dropHandler"
				:contextMenuClose="activeIndex"
				:index="index"
				:place="place"
				:arranging="arranging"
				:makeSpace="movePlease"
				:dragging="dragging"
				:listDimensions="listDimensions"
			/>
		</ul>


		<button  v-if="arranging" class="placesList__exitSorting uiButton uiButton--primary" @click="cancelSorting">Exit Sorting</button>

		<div v-if="places.length == 0" class="emptyState emptyState--placesList">
			Oh, nothing in here!
		</div>
		<div v-if="!loggedIn">@todo: log in to see private places or save new ones</div>
		
	</div>
</template>

<script>
	import WPAPI from '../wpapi/index';
	import placesListItem from './placesListItem.vue';
	

	export default {
		name: 'PlacesList',
		components: {
			'places-list-item' : placesListItem 
		},
		props: {
			userName: {
				type: String
			},
			role: {
				type: String
			}
		},
		computed: {
			loggedIn () {
				return this.$store.state.user.loggedIn;
			},
			places () {
				return this.$store.state.user.places;	
			},
			arrangeClass () {
				if (this.arranging) {
					return ' arranging';
				}
				return false;
			},
			nOfItems () {
				if (this.places) {
					return this.places.length;
				}
			},
			listDimensions () {
				return {
					top: this.listTop,
					bottom: this.listBottom,
					height: this.listHeight
				}
			}
		},
		mounted () {
			this.loadPlacesData();

			
		},
		methods: {
			cancelSorting () {
				this.arranging = false;
			},
			getListDimensions () {
				this.listTop = (this.$refs.placesList.getBoundingClientRect()).top;
				this.listBottom = (this.$refs.placesList.getBoundingClientRect()).bottom;
				this.listHeight = (this.$refs.placesList.getBoundingClientRect()).height;
			},
			getIndex (top) {
				let newIndex;
				if (top < this.listTop) {
					newIndex = 0;
				} else if (top > this.listBottom) {
					newIndex = this.nOfItems - 1;
				} else {
					newIndex = Math.ceil((top - this.listTop) / 40) - 1;
				}

				newIndex = Math.max(Math.min(newIndex,this.nOfItems - 1) , 0);

				console.log('newIndex',newIndex);

				return newIndex;
			},
			dragHandler(val) {
				this.dragging = true;
				let newIndex = this.getIndex(val.top);
				this.giveMeSpace(newIndex, val.index);		
			},
			dropHandler (val) {
				let newIndex = this.getIndex(val.top);
				console.log("move",val.index, newIndex);
				if (val.index != newIndex) {
					

					const directionDown = (newIndex > val.index);

					let newPlaces = this.places.map((place) => {
						
						if (place._id == val.id) {
							place.listOrder = newIndex;
						} else {
							if (directionDown && place.listOrder > val.index && place.listOrder <= newIndex) {
								place.listOrder--
							} else if (!directionDown && place.listOrder < val.index && place.listOrder >= newIndex) {
								place.listOrder++
							}
						}
						return place;
					});

					newPlaces.sort(function(placeA, placeB) {
						return (placeA.listOrder > placeB.listOrder)
					});

					this.newlyOrderedList = newPlaces;

					// @todo: treshold this, prevent AJAX calls while still fiddling with the menu
					this.$store.dispatch('PLACE_UPDATE_LIST_ORDERS', newPlaces);
				}
			},
			giveMeSpace (toIndex,fromIndex) {

				this.movePlease = [toIndex,fromIndex];
			},
			contextMenuHandler (index) {
				this.activeIndex = index;
			},
			arrangeItems () {
				this.arranging = true;
			},
			loadPlacesData () {
				WPAPI.getUserPlaces(this.userName)
				.then(places => {
					this.$store.dispatch('USER_GET_PLACES', places);

					this.$nextTick(function () {
						this.getListDimensions();
					});
				});
			}
		},
		data() {
			return {
				activeIndex: -1,
				arranging: false,
				listTop: 0,
				listBottom: 0,
				listHeight: 0,
				movePlease: [-1, null],
				dragging: false
			}
		}
	}
</script>

<style lang="scss">

	@import '~globalVars';

	.placesList {
		position: relative;
		display: block;
		padding-bottom: 1px;
		border-top: 1px solid #ddd;
	}

	.placesList__items.arranging {
		display: block;
		margin-bottom: 40px;
	}

	.placesList__exitSorting {
		position: absolute;
		bottom: 0;
	}

	.placesList__itemWrapper {
		display: block;
		height: 40px;
		border-bottom: 1px solid #ddd;
	
	}

	.placesList__itemPlaceHolder {
		display: block;
		height: 40px;
	}

	.placesList__item {
		height: 40px;
		line-height: 40px;
		width: 100%;
		display: flex;
		position: relative;
		top: 0;
		
		
		justify-content: space-between;
		
		font-size: 0.9rem;

		&.can-transition {
			transition: all 0.2s ease-in-out;
		}

		&.is-dragging {
			position: absolute;
			left: 0;
			z-index: 1;
		}
	}

	.placesList__itemLink {
		flex: 1 1 auto;
	}

	

	.placesList__name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0 0 0 $widthGridLargerSpace;
		width: 100%;
	}

	.placesList__contextMenuToggler {
		position: absolute;
		right: 0;
		top: 0;
		display: block;
		width: 40px;
		height: 40px;
		svg {
			fill: $uiButtonPrimary;
		}
	}

	.placesList__contextMenu {
		position: absolute;
		background: #fff;
		right: 40px;
		top: 0;
		height: 39px;

		.uiLink {
			margin-left: 1em; 
			line-height: 38px;
			height: 38px;
		}
	}

	.placesList__sortingDragger {
		position: absolute;
		right: 0;
		top: 0;
		width: 100%;
		height: 40px;
		text-align: right;
		&.is-dragging {
			background: rgba(#000, 0.2);
		}

		svg {
			pointer-events: none;
			fill: $uiInputActive;
		}
	}
</style>
