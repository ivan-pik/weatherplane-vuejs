<template>
	<div class="viewWrapper">
		<navigation-header />

		<div class="viewWrapper__scroller">
			<ui-modal
				:overlay="false"
				:show="!loginSuccessfulState"
				v-on:closed="modalClosedHandler"
			>
				<login-form  slot="content"
					v-on:loginSuccessful="loginSuccessful"
				/>
			</ui-modal>

		</div>
		
	</div>
</template>
<script>

	import navigationHeader from 'Navigation/navigationHeader.vue'
	import LoginInput from '../LoginInput/index.vue'
	import UiModal from 'uiComponents/modal.vue'


	export default {
		name: 'LoginView',
		components: {
			'navigation-header' : navigationHeader,
			'login-form': LoginInput,
			'ui-modal': UiModal,
		},
		props: {
			message: {
				type: String
			}
		},
		watch: {
		
		},
		methods: {
			modalClosedHandler () {
				if (this.loginSuccessfulState) {
					this.$router.push(this.userID);

				}
			},
			loginSuccessful (payload) {
				this.loginSuccessfulState = true;
				this.userID = payload;
			},
		},
		data() {
			return {
				loginSuccessfulState: false,
				modalClosed: false,
				userID: '',
			}
		}
	}

</script>
