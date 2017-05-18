import bus from '../../bus'
import Vue from 'vue'
import RegisterUserData from '../RegisterUserData/index.vue'

export default {
  name: 'RegisterOutput',
  components: {
    'register-user-data': RegisterUserData,
  },
  created() {
    bus.$on('new-registration', this.onRegisterFormChange)
  },
  destroyed() {
    bus.$off('new-registration', this.onRegisterFormChange)
  },
  methods: {
    onRegisterFormChange(user) {
      console.log("onRegisterFormChange")
      console.log(user)
      this.currentUsername = user.username
      this.currentEmail = user.email
      this.register(user)
    },
    register(user) {
      if (this.user.hasOwnProperty('name') && this.user.hasOwnProperty('password') && this.user.hasOwnProperty('email')) return

      var payLoad = {
        userID :  user.username,
        password : user.password,
        email : user.email
      }
  // @todo: use axios resource here
      const url = `//localhost:4000/register`
      fetch(url, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payLoad)
      }).then(r => r.json()).then(data => {
        if (data.errors) {
          console.log("failed emit");
          bus.$emit('failed-registration', data.errors);
        } else if (data.success) {
          console.log("emitting successful-registration")
          bus.$emit('successful-registration')

        
    // @todo: use store

          Vue.set(this.user, name, data)
          this.user.registered = true;

          // @todo: login as the newly created user
        }
      })
    }
  },
  data() {
    return {
      currentUsername: null,
      currentPassword: null,
      user: {
        registered : false
      },
      errors: {}
    }
  }
}
