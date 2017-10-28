<template>
	<div>
		<div v-if="places">
			<ul class="placesList">
				<places-list-item
					v-for="(place, index) in places"
					v-on:contextMenuTriggered="contextMenuHandler(index)"
					:contextMenuClose="activeIndex"
					:index="index"
				/>
			</ul>
			<router-link  to="/">Add new place</router-link>
		</div>
		<div v-else>
			<div v-if="loggedIn">@todo: loader</div>
			<div v-else>@todo: login to see save places</div>
		</div>
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
		computed: {
			loggedIn () {
				return this.$store.state.user.loggedIn;
			}
		},
		created () {
			this.loadPlacesData();
		},
		methods: {
			contextMenuHandler (index) {
				this.activeIndex = index;
			},
			loadPlacesData () {
				HTTP.get('places/'+this.$route.params.username)
				.then(response => {
					if (response.data.success) {
						this.places = response.data.data.places;
					}
				}).catch(err => {
					//@todo: error message

				});
			}
		},
		data() {
			return {
				places: [],
				activeIndex: -1
			}
		}
	}
</script>