<template>
	<div class="">
		My places
		<br>
		{{places}}
	</div>
</template>
<script>
    import Vue from 'vue';
		import {HTTP} from '../../http-common';


    export default {
        name: 'UserPlacesView',

				created () {
					this.loadPlacesData ()
				},
        computed: {


        },
				methods: {
					loadPlacesData () {


						HTTP.get('places/'+this.$route.params.username)
								.then(response => {
										if (response.data.success) {

											console.log(response.data.data.places);
											this.places = response.data.data.places;



										}
								}).catch(err => {

									console.log("ooops!")

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
