<template>
	<div class="">
		<div class="mainNav">
			<h1 class="mainNav__title">My places</h1>
		</div>
		
		<ul class="placesNavigator">
			<li v-for="place in places">
				<router-link :to="place.placeSlug">
					<span class="placesNavigator">
						{{place.placeName}}
					</span>
				</router-link>
			</li>
		</ul>
	</div>
</template>
<script>
	import Vue from 'vue';
		import {HTTP} from '../../http-common';


	export default {
		name: 'UserPlacesView',

				created () {
					// @load places also when component is re rendered AND when user has just logged in
					this.loadPlacesData ()
				},
		computed: {
			userName () {
				return this.$route.params.username;
			}

		},
				methods: {

					loadPlacesData () {


						HTTP.get('places/'+this.$route.params.username)
								.then(response => {
										if (response.data.success) {

											this.places = response.data.data.places;



										}
								}).catch(err => {


						});
					}
				},
				data () {
					return {
						places: null
					}
				}


	}



</script>
<style scoped>

</style>
