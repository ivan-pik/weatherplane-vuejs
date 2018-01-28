<template>
	<div class="viewWrapper">
		<navigation-header />

		<div class="viewWrapper__scroller">
			<register-form
				@login-successful="loginSuccessful"
			/>
		</div>
	</div>
</template>

<script>
	import bus from '../../bus'
	import Vue from 'vue'

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

