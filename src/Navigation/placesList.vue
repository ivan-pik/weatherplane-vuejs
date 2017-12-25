<template>
	<div ref="placesList">
		<div v-if="places">
			<ul class="placesList"
				:class="'placesList--' + role + arrangeClass"
			>
				<places-list-item
					v-for="(place, index) in places"
					key="place._id"
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
		</div>


		<div v-if="arranging" class="">
			<button @click="cancelSorting">I am done</button>
		</div>

		<div v-if="places.length == 0" class="emptyState emptyState--placesList">
			Oh, nothing in here!
		</div>
		<div v-if="!loggedIn">@todo: log in to see private places or save new ones</div>
		<router-link v-if="!arranging"  to="/">Add new place</router-link>
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