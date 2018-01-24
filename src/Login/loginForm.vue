<template>
	<ui-modal
		:overlay="overlay"
		:show="!loginSuccessfulState"
		v-on:closed="modalClosedHandler"
	>	
		<login-form
			slot="content"
			v-on:loginSuccessful="loginSuccessful"
			:message="message"
		/>
	</ui-modal>
</template>
<script>

	import LoginInput from 'Login/LoginInput/index.vue'
	import UiModal from 'uiComponents/modal.vue'


	export default {
		name: 'LoginForm',
		components: {
			'login-form': LoginInput,
			'ui-modal': UiModal,
		},
		props: {
			message: {
				type: String
			},
			overlay: {
				type: Boolean,
				default: true
			}
		},
		watch: {
		
		},
		methods: {
			modalClosedHandler () {
				if (this.loginSuccessfulState) {
					this.$emit('logged-in');

					this.$store.commit('USER_LOG_IN', {
						username: this.userID
					});
		
					this.$store.commit('USER_SAVE_TOKEN', this.token);

					this.$store.commit('USER_AUTHENTICATED');

					
				}
			},
			loginSuccessful (payload) {
				this.loginSuccessfulState = true;
				this.userID = payload.userID;
				this.token = payload.token;
			},
		},
		data() {
			return {
				loginSuccessfulState: false,
				modalClosed: false,
				userID: '',
				token: ''
			}
		}
	}

</script>
