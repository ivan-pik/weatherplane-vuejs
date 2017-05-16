import Vue from 'vue'
import {checkAuth, getLocalToken} from '../auth'
import {HTTP} from '../http-common';


import Navigation from '../Navigation/index.vue'




export default {
  name: 'App',
  beforeCreate() {

    if(checkAuth()) {

        HTTP.post('identify')
            .then(response => {
                    if (response.data.success) {
                        this.$store.commit('USER_LOG_IN', {
                            username: response.data.data.username
                        })


                    } else {
                        console.log("something went wrong");
                        // Something unforseen happened
                    }
                }
            ).catch(err => {
							console.log(err);
            //  if(err.responnse.errors) {
            //    console.log("OMG BROKEN");
            //     // bus.$emit('failed-login');
            //  }
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
