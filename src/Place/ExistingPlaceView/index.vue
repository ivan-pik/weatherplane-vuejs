<template>
	<div class="">


		<place-not-found v-if="place404" />

		<login-view :message="message" @loggedIn="loggedIn" v-if="needToLogin" />


    <div v-else-if="place" class="">


			<place-details :activeLocation='place' />



    </div>

	<div v-else>
		LOADING ...
	</div>


		</div>
</template>
<script>
    import Vue from 'vue'
    import saveLocation from '../saveLocation/index.vue';
  
	import {HTTP} from '../../http-common';
	import placeNotFound from '../placeNotFound/index.vue';
	import loginView from '../../Login/LoginView/index.vue';
	import placeDetails from '../placeDetails/index.vue';

    export default {
        name: 'ExistingPlaceView',
        components: {
         
					'place-not-found' : placeNotFound,
					'login-view' : loginView,
					'place-details': placeDetails
        },
				created () {
					this.loadPlaceData();
				},
				methods: {
					loggedIn () {
						console.log("User is not authenticated");
					},
					loadPlaceData () {


						HTTP.get('places/'+this.$route.params.username + "/" + this.$route.params.place)
			          .then(response => {
			              if (response.data.success) {

							this.$store.commit('PLACE_SAVE_PLACE_DATA', response.data.data.place)



			              }
			          }).catch(err => {

				          if(err.response) {
										// @todo: DRY!!!
										let errorCode = function(code, errors) {
											let check = errors.filter(function( obj ) {
												return obj.code == code;
											});
											if (check.length > 0) {
												return true;
											}
											return false;
										}




										if(errorCode("authentication-required", err.response.data.errors)) {
											this.needToLogin = true;
											this.$store.commit('USER_AUTHENTICATION_REQUIRED')
										}

										if(errorCode("resource-does-not-exist", err.response.data.errors)) {
											// @todo: Place pseudo 404
											console.log("Show error");
											this.place404 = true;
										}

				          }
			      });
					}
				},
        computed: {
					authenticated () {
						return this.$store.state.user.authenticated;
					},
					place () {
						return this.$store.state.existingPlaceView.place;
					}
				

        },
				watch: {
					authenticated (authenticated) {
						if(authenticated) {
							this.needToLogin = false;
							this.loadPlaceData();
						}

					}
				},
				data () {
					return {
						needToLogin: false,
						place404: false,
						message: null
						
					}
				}

    }



</script>
<style scoped>

</style>
