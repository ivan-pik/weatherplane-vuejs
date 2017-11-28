import Vue from 'vue'
import {checkAuth, getLocalToken} from '../auth'
import {HTTP} from '../http-common';
import Navigation from '../Navigation/index.vue'
import globalMessage from '../uiComponents/message.vue'

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
						// Something unforseen happened
					}
				}
			).catch(err => {
			//  if(err.responnse.errors) {
			//     // bus.$emit('failed-login');
			//  }
		});
	}
  },
  components: {
	'navigation': Navigation,
	'global-message': globalMessage
  },
  computed: {
	globalMessages () {
		return this.$store.state.globalApp.globalMessages;
	}
  },
  methods: {
	dismissMessage (index) {
		this.$store.commit('GLOBAL_REMOVE_MESSAGE', index);
	}
  },
  data() {
	return {
		// @todo: this doesn't work for RegisterView
		notAliveViews: "LoginView RegisterView ExistingPlaceView"
	}
  }
}
