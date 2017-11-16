<template>
	<div ref="placesList">
		<div v-if="places">
			<ul class="placesList"
				:class="'placesList--' + role + arrangeClass"
			>
				<places-list-item
					v-for="(place, index) in places"
					v-on:contextMenuTriggered="contextMenuHandler(index)"
					v-on:arrangeItems="arrangeItems(index)"
					v-on:itemDrag="dragHandler"
					v-on:itemDrop="dropHandler"
					:contextMenuClose="activeIndex"
					:index="index"
					:place="place"
					:arranging="arranging"
					:makeSpace="movePlease"
				/>
			</ul>
		</div>
		<div v-if="!loggedIn">@todo: log in to see private places or save new ones</div>
		<router-link  to="/">Add new place</router-link>
	</div>
</template>

<script>
	import {HTTP} from '../http-common';
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
			}
		},
		mounted () {
			this.loadPlacesData();

			
		},
		methods: {
			getListDimensions () {
				this.listTop = (this.$refs.placesList.getBoundingClientRect()).top;
				this.listBottom = (this.$refs.placesList.getBoundingClientRect()).bottom;
				this.listHeight = (this.$refs.placesList.getBoundingClientRect()).bottom;
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
				let newIndex = this.getIndex(val.top);
				this.giveMeSpace(newIndex, val.index);		
			},
			dropHandler (val) {
				let newIndex = this.getIndex(val.top);
				console.log("move",val.index, newIndex);
				if (val.index != newIndex) {
					// @todo: recalc places positions
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
				HTTP.get('places/' + this.userName)
				.then(response => {
					if (response.data.success) {
						let newPlaces = response.data.data.places;
						if (newPlaces !=this.places) {
							this.$store.dispatch('USER_GET_PLACES', newPlaces);
						}
						this.$nextTick(function () {
							this.getListDimensions();
						});
					}
				}).catch(err => {
					//@todo: error message

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
				movePlease: [-1, null]
			}
		}
	}
</script>