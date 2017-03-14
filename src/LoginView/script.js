import bus from '../bus'
import Vue from 'vue'

import LoginInput from '../LoginInput/index.vue'
import LoginOutput from '../LoginOutput/index.vue'
import LoginUserData from '../LoginUserData/index.vue'

export default {
  name: 'LoginView',
  components: {
    'login-input': LoginInput,
    'login-output': LoginOutput,
    'login-user-data': LoginUserData
  },
  data() {
    return {

    }
  }
}
