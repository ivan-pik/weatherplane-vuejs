import bus from '../bus'
import Vue from 'vue'

import RegisterInput from '../RegisterInput/index.vue'
import RegisterOutput from '../RegisterOutput/index.vue'
import RegisterUserData from '../RegisterUserData/index.vue'

export default {
  name: 'RegisterView',
  components: {
    'register-input': RegisterInput,
    'register-output': RegisterOutput,
    'register-user-data': RegisterUserData
  },
  data() {
    return {

    }
  }
}
