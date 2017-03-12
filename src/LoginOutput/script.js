import bus from '../bus'
import Vue from 'vue'
import LoginUserData from '../LoginUserData/index.vue'

export default {
  name: 'LoginOutput',
  components: {
    'login-user-data': LoginUserData,
  },
  created() {
    bus.$on('new-login', this.onUsernameChange)
  },
  destroyed() {
    bus.$off('new-login', this.onUsernameChange)
  },
  methods: {
    onUsernameChange(user) {
      console.log("onUsernameChange")
      console.log(user)
      this.currentUsername = user.username
      this.currentPassword = user.password
      this.authenticate(user)
    },
    authenticate(user) {
      if (this.user.hasOwnProperty('name') && this.user.hasOwnProperty('password')) return

      var credentials = {
        userID :  user.username,
        password : user.password
      }

      const url = `//localhost:3000/authenticate`
      fetch(url, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      }).then(r => r.json()).then(data => {

        if (data.errors) {
          bus.$emit('failed-login')
        } else if (data.success) {
          Vue.set(this.user, name, data)
          this.user.loggedIn = true;
        }
      })
    }
  },
  data() {
    return {
      currentUsername: null,
      currentPassword: null,
      user: {
        loggedIn : false
      },
      errors: {}
    }
  }
}
