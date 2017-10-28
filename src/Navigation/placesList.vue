<template>
	<div>
		<div v-if="places">
			<ul class="placesList"
				:class="'placesList--' + role + arrangeClass"
			>
				<places-list-item
					v-for="(place, index) in places"
					v-on:contextMenuTriggered="contextMenuHandler(index)"
					v-on:arrangeItems="arrangeItems(index)"
					:contextMenuClose="activeIndex"
					:index="index"
					:place="place"
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
			}
		},
		mounted () {
			this.loadPlacesData();
		},
		methods: {
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
					}
				}).catch(err => {
					//@todo: error message

				});
			}
		},
		data() {
			return {
				activeIndex: -1,
				arranging: false
			}
		}
	}
</script>