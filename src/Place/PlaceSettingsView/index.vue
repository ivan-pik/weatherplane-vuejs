<template>
	<div class="viewWrapper">
		<navigation-header />
		<div class="viewWrapper__scroller">
			<place-settings-controls />
		</div>
	</div>
</template>

<script>
	import navigationHeader from 'Navigation/navigationHeader.vue'
	import placesList from 'Navigation/placesList.vue';
	import PlaceSettingsControls from 'Place/PlaceSettingsView/placeSettingsControls.vue'

	export default {
		name: 'WelcomeView',
		components: {
			'navigation-header' : navigationHeader,
			'places-list' : placesList,
			'place-settings-controls' : PlaceSettingsControls
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
