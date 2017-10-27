import Vue from 'vue'
import {saveToken} from '../../auth'
import {HTTP} from '../../http-common';

export default {
  name: 'LoginInput',
  methods: {
    onSubmit(event) {
      this.$validator.validateAll().then(() => {
      let credentials = {
          userID :  this.username,
          password : this.password
      };
      HTTP.post('authenticate', credentials)
          .then(response => {
              if (response.data.success) {


                  saveToken(response.data.token);


									HTTP.defaults.headers.authorization = response.data.token;




                  this.$store.commit('USER_LOG_IN', {
                      username: credentials.userID
                  });


									if(this.noRouterRedirect) {

										this.$store.commit('USER_AUTHENTICATED');
									} else {
										this.$router.push(credentials.userID);
									}


              }
          }).catch(err => {
	          if(err.response) {
	              this.onFailedLogin();
	          }
      });
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
