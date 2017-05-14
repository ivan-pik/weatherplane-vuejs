<template>
	<div class="">

		{{authenticated}}

		<place-not-found v-if="place404" />

		<loginView :message="message" @loggedIn="loggedIn" v-if="needToLogin" />


    <div v-else class="">



      <weather />


    </div>


		</div>
</template>
<script>
    import Vue from 'vue'
    import saveLocation from '../saveLocation/index.vue';
    import weather from '../weather/index.vue';
		import {HTTP} from '../../http-common';
		import placeNotFound from '../placeNotFound/index.vue';
		import loginView from '../../Login/LoginView/index.vue'

    export default {
        name: 'ExistingPlaceView',
        components: {
          'weather' : weather,
					'place-not-found' : placeNotFound,
					'loginView' : loginView
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
											console.log(response);
			              }
			          }).catch(err => {

				          if(err.response) {
										// @todo: DRY
										let errorCode = function(code, errors) {
											let check = errors.filter(function( obj ) {
												return obj.code == code;
											});
											if (check.length > 0) {
												return true;
											}
											return false;
										}

										console.log(err.response.data);


										if(errorCode("authentication-required", err.response.data.errors)) {
											//@todo: @next show login widget
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
						message: null,
						place: {}
					}
				}

    }



</script>
<style scoped>

</style>
