<template>
	<layout-view-wrapper>
		<register-form 
			slot="content"
			@login-successful="loginSuccessful"
		/>
	</layout-view-wrapper>
</template>

<script>
	import RegisterForm from '../RegisterForm/index.vue'

	export default {
		name: 'RegisterView',
		components: {
			'register-form': RegisterForm,
		},
		methods: {
			loginSuccessful (user) {
				this.$router.push('/' + user.userID);
			}
		},
		data() {
			return {

			}
		}
	}
</script>

