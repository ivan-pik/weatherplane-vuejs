import Vue from 'vue'
import bus from '../bus'

export default {
  name: 'LoginInput',
  created() {
    bus.$on('failed-login', this.onFailedLogin)
    bus.$on('successful-login', this.onSuccessfulLogin)
  },
  destroyed() {
    bus.$on('failed-login', this.onFailedLogin)
    bus.$on('successful-login', this.onSuccessfulLogin)
  },
  methods: {
    onSubmit(event) {
      this.$validator.validateAll().then(() => {
        bus.$emit('new-login', {
          username : this.username,
          password : this.password
        })
      }).catch(() => {
          // when form is invalid
      });
    },
    onFailedLogin(user) {
       Vue.set(this.errors, 'wrongCredentials', true)
    },
    onSuccessfulLogin(user) {
       Vue.delete(this.errors, 'wrongCredentials')
    },
  },
  data() {
    return {
      username: '',
      password: '',
      errors: {}
    }
  }
}
