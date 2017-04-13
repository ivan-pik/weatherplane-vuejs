import Vue from 'vue'
import {checkAuth, getLocalToken} from '../auth'


import Navigation from '../Navigation/index.vue'


export default {
  name: 'App',
  beforeCreate() {

    if(checkAuth()) {


        this.$http.post('identify', getLocalToken())
            .then(response => {
                    if (response.body.success) {
                        this.$store.commit('USER_LOG_IN', {
                            username: response.body.data.username
                        })


                    } else {
                        console.log("something went wrong");
                        // Something unforseen happened
                    }
                }
            ).catch(err => {
            if(err.body.errors) {
                console.log("OMG BROKEN");
                // bus.$emit('failed-login');
            }
        });
    }
  },
  components: {
    'navigation': Navigation
  },
  data() {
    return {
        // @todo: this doesn't work for RegisterView
        notAliveViews: "LoginView RegisterView"
    }
  }
}
