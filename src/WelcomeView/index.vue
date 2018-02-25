<template>
	<div class="viewWrapper">
		<navigation-header />

		<div class="viewWrapper__scroller">
			<div v-if="!loggedIn" class="">
				<p>Hi, blah blah blah blaaaahblah</p>
				@Todo: Quick slider intro!

				<button
					class="uiButton uiButton--primary"
					@click="goToPlaceSearch"
				>
					Find my airfield!	
				</button>

				<br>

				<router-link class="uiLink" to="/login">Log In!</router-link>
			</div>

			<ui-loader
				v-else
				:loaded="!!places"
				>
				<places-list
					:places="places"
				/>
			</ui-loader>
		</div>
	</div>
</template>

<script>
	import navigationHeader from 'Navigation/navigationHeader.vue'
	import WPAPI from 'wpapi/index';
	import placesList from 'Navigation/placesList.vue';

	export default {
		name: 'WelcomeView',
		components: {
			'navigation-header' : navigationHeader,
			'places-list' : placesList,
		},
		mounted () {
			if (this.username) {
				this.loadPlacesData();
			}
		},
		computed: {
			loggedIn() {
				return this.$store.state.user.loggedIn;
			},
			username() {
				return this.$store.state.user.name;
			},
			places () {
				return this.$store.state.user.places;	
			},	
		},
		watch: {
			username (username) {
				if (username !== null) {
					this.loadPlacesData();
				}
			}
		},
		methods: {
			goToPlaceSearch () {
				this.$router.push('search');
			},
			loadPlacesData () {
				WPAPI.getUserPlaces(this.username)
				.then(places => {
					this.$store.dispatch('USER_GET_PLACES', places);
				});
			}
		},
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	
</style>
