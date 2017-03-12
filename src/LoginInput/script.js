import Vue from 'vue'
import bus from '../bus'

export default {
  name: 'LoginInput',
  created() {
    bus.$on('failed-login', this.onFailedLogin)
  },
  destroyed() {
    bus.$on('failed-login', this.onFailedLogin)
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
  },
  data() {
    return {
      username: '',
      password: '',
      errors: {}
    }
  }
}
