import Vue from 'vue'
import {saveToken} from '../../auth'
import {HTTP} from '../../http-common';

import WPAPI from '../../wpapi/index';

export default {
	name: 'LoginInput',
	methods: {
		onSubmit(event) {
			this.$validator.validateAll()
			.then(() => {
				let credentials = {
						userID :  this.username,
						password : this.password
				};

				WPAPI.authenticate(credentials)
				.then (token => {
						saveToken(token);

						this.$store.commit('USER_LOG_IN', {
								username: credentials.userID
						});

						this.$store.commit('USER_SAVE_TOKEN', token);

						if(this.noRouterRedirect) {
							this.$store.commit('USER_AUTHENTICATED');
						} else {
							this.$router.push(credentials.userID);
						}

				})

			}).catch(() => {
					// when form is invalid
			});
		},
		onFailedLogin() {
			 Vue.set(this.errors, 'wrongCredentials', true)
		}
	},
	computed: {
		noRouterRedirect () {
			return this.$store.state.user.authenticationRequired;
		}
	},
	data() {
		return {
			show: true,
			username: '',
			password: '',
			errors: {}
		}
	}
}
