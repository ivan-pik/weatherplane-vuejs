<template>
	<div class="">
		My places
		<br>
		<ul>
			<li v-for="place in places">{{place.placeName}} <br> {{place}}</li>
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
