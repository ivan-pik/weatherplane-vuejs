<template>
	<layout-view-wrapper>
		<ui-loader
			slot="content"
			:loaded="!!places"
		>
			<ui-title>
				{{userInTitle}} places
			</ui-title>
			
			<places-list
				:places="places"
			/>

			<div
				class=""
				v-if="!loggedIn"
			>
				@todo: Design
				<br>
				Are you <strong>{{routeUserName}}</strong>?
				<br>
				<a class="uiButton" href="">Login</a> to manage your list or to see your private places
			</div>
		</ui-loader>

		<ui-button-group
			:show="displayAddToPlaceButton"
			slot="bottom"
		>
			<ui-button
				text="Add a new place"
				type="primary"
				@click="$router.push('/search');"
			/>
		</ui-button-group>
	</layout-view-wrapper>
</template>
<script>

	import WPAPI from 'wpapi/index';
	import placesList from 'Navigation/placesList.vue';

	export default {
		name: 'UserPlacesView',
		components: {
			'places-list' : placesList
		},
		mounted () {
			this.loadPlacesData();
		},
		computed: {
			routeUserName () {
				return this.$route.params.username;
			},
			loggedIn () {
				return this.$store.state.user.loggedIn;
			},
			userName () {
				return this.$store.state.user.name;
			},
			places () {
				return this.$store.state.user.places;	
			},	
			userInTitle () {
				if (this.loggedIn && this.userName == this.routeUserName) {
					return `Your`;
				} else {
					return `${this.routeUserName}'s`
				}
			},
			displayAddToPlaceButton () {
				return (this.routeUserName == this.userName && this.loggedIn)
			}
		},
		methods: {
			loadPlacesData () {
				WPAPI.getUserPlaces(this.routeUserName)
				.then(places => {
					this.places = places;
					if (this.loggedIn && this.userName == this.routeUserName) {
						this.$store.dispatch('USER_GET_PLACES', places);
					}
				});
			},
		},
		data () {
			return {
			}
		}
	}

</script>
