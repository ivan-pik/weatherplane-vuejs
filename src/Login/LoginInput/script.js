import Vue from 'vue'
import {saveToken} from '../../auth'

export default {
  name: 'LoginInput',
  methods: {
    onSubmit(event) {
      this.$validator.validateAll().then(() => {
      let credentials = {
          userID :  this.username,
          password : this.password
      };
      this.$http.post('authenticate', credentials)
          .then(response => {
              if (response.body.success) {

                  saveToken(response.body.token);

                  this.$store.commit('USER_LOG_IN', {
                      username: credentials.userID
                  });

                  this.$router.push(credentials.userID);
              }
          }).catch(err => {
          if(err.body.errors) {
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
  data() {
    return {
      show: true,
      username: '',
      password: '',
      errors: {}
    }
  }
}
