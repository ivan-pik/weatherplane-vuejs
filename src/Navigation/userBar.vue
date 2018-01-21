<template>
	<div class="userBar">
		<router-link class="uiLink" v-if="!loggedIn" to="/login">Login</router-link>
		<router-link class="uiLink" v-if="!loggedIn" to="/signup">Signup</router-link>
		<span v-if="loggedIn" class="userBar__username">{{ username }}</span>
		<a class="uiLink" v-if="loggedIn" @click="logOut">Logout</a>
		<router-link class="uiLink" v-if="loggedIn" to="/settings">Settings</router-link>
	</div>
</template>

<script>
	export default {
		name: 'UserBar',
	
		props: {
			title: {
				type: String
			}
		},
		computed: {
			loggedIn() {
				return this.$store.state.user.loggedIn;
			},
			username() {
				return this.$store.state.user.name;
			},
		},
		methods: {
			logOut() {
				localStorage.removeItem('id_token');
				this.$store.commit('USER_LOG_OUT');
			},
		},
		data() {
			return {
			}
		}
	}
</script>
<style lang="scss">

@import '~globalVars';

.userBar {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 40px;
	padding: 0 $widthGridLargerSpace 0 50px;
	display: flex;

	a {
		margin-left: 1em;
	}
}

.userBar__username {
	font-size: 0.7rem;
	font-weight: bold;
	border: 1px solid silver;
	display: inline-block;
	padding: 0.5em;
}

// ----------------------------

</style>
