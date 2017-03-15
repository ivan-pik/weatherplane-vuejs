import Vue from 'vue'
import bus from '../bus'

export default {
  name: 'RegisterInput',
  created() {
    bus.$on('failed-registration', this.onFailedRegistration)
    bus.$on('successful-registration', this.onSuccessfulRegistration)
  },
  destroyed() {
    bus.$on('failed-registration', this.onFailedRegistration)
    bus.$on('successful-registration', this.onSuccessfulRegistration)
  },
  methods: {
    onSubmit(event) {
      this.$validator.validateAll().then(() => {
        bus.$emit('new-registration', {
          username : this.username,
          password : this.password,
          email : this.email,
        })
      }).catch(() => {
          // when form is invalid
      });
    },
    onFailedRegistration(errors) {
      let userName, userEmail;
      Vue.set(this.errors, 'registrationFailed', true);

      // @todo @nextstep This doesn't work as is probably quite naive

      var result = errors.filter(function( obj ) {
        return obj.code == 'username-exists';
      });

      console.log('---------------------');
      console.log(result);
      console.log('---------------------');


      if (errors.filter(function(e) {e.code == 'username-or-email-already-registered'}).length > 0) {
        if (errors.filter(function(e) {e.code == 'user-email-exists'}).length > 0) {
          userEmail = true;
          console.log("The error is: " + userEmail);
        }
        if (errors.filter(function(e) {e.code == 'username-exists'}).length > 0) {
          userName = true;
          console.log("The error is: " + userName);
        }
      } else {
        Vue.set(this.errors, 'unknown-failure', true)
      }

      let message = 'Sorry, user with this ' + (userName ? 'username' : '') + (userName && userEmail ? ' and ' : ' ') + (userEmail ? 'email' : '') + ' already exits.';

      Vue.set(this.errors, 'message', message);

    },
    onSuccessfulRegistration(user) {
      console.log("Registration successful method")



      Vue.set(this.errors, 'registrationFailed', false)
      Vue.set(this.errors, 'userExists', false)
      Vue.set(this.errors, 'emailExists', false)
      Vue.set(this.errors, 'unknown-failure', false)
    },
  },
  data() {
    return {
      show: true,
      username: '',
      password: '',
      email: '',
      confirmPassword: '',
      errors: {
        registrationFailed : false,
        userExists : false,
        emailExists : false,
        unknownFailure : false,
        message : ''
      }
    }
  }
}
