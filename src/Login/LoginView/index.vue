<template>
	<layout-view-wrapper>
		<login-form 
			slot="content"
			v-on:logged-in="loggedInHandler"
			:overlay="false"
		/>
	</layout-view-wrapper>
</template>

<script>

	import navigationHeader from 'Navigation/navigationHeader.vue'
	import LoginInput from '../LoginInput/index.vue'
	import UiModal from 'uiComponents/modal.vue'
	import LoginForm from 'Login/loginForm.vue'

	export default {
		name: 'LoginView',
		components: {
			'navigation-header' : navigationHeader,
			'login-form': LoginForm,
			'ui-modal': UiModal,
		},
		props: {
		
		},
		watch: {
		
		},
		methods: {
			loggedInHandler () {
				this.$router.push('/');
			}
		},
		data() {
			return {
				
			}
		}
	}

</script>
