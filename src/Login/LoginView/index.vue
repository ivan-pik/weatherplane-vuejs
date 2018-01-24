<template>
	<div class="viewWrapper">
		<navigation-header />

		<div class="viewWrapper__scroller">
			<login-form 
				v-on:logged-in="loggedInHandler"
				:overlay="false"
			/>
		</div>
	</div>
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
