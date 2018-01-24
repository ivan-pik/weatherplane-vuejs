<template>
	<div class="viewWrapper">
		<navigation-header />

		<div v-if="!loggedIn" class="viewWrapper__scroller">
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
		<places-list v-else
			:userName="username"
		/>

	</div>
</template>

<script>
	import navigationHeader from 'Navigation/navigationHeader.vue'
	import placesList from 'Navigation/placesList.vue';

	export default {
		name: 'WelcomeView',
		components: {
			'navigation-header' : navigationHeader,
			'places-list' : placesList,
		},
		computed: {
			loggedIn() {
				return this.$store.state.user.loggedIn;
			},
			username() {
				return this.$store.state.user.name;
			},	
		},
		methods: {
			goToPlaceSearch () {
				this.$router.push('search');
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
