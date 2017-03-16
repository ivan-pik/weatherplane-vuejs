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
      let errorCode = function(code, errors) {
        let check = errors.filter(function( obj ) {
          return obj.code == code;
        });
        if (check.length > 0) {
          return true;
        }
        return false;
      }

      let userName, userEmail;

      // Duplicate username and/or e-mail
      if (errorCode("username-or-email-already-registered", errors)) {
        if(errorCode("username-exists", errors)) {
          userName = true;
          console.log(userName);
        }
        if(errorCode("user-email-exists", errors)) {
          userEmail = true;
          console.log(userEmail);
        }
      // Unknown errors from the API, probably something quite serious
      } else {
        Vue.set(this.errors, 'unknown-failure', true)
      }


      let message = 'Sorry, user with this ' + (userName ? 'username' : '') + (userName && userEmail ? ' and ' : ' ') + (userEmail ? 'email' : '') + ' already exits.';

      Vue.set(this.errors, 'message', message);
      Vue.set(this.errors, 'registrationFailed', true);

    },
    onSuccessfulRegistration(user) {
      // @todo: When you initially try to register existing user and then finally submit unique user, this method seems to happen 3 times after the "successful-registration" event was emitted once.
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
