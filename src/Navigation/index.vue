<template>
	<nav class="main-navigation">
		<button class="main-navigation__toggler" @click="navOpened=!navOpened">B</button>
		<div v-if="navOpened"
			@click="navClickHandler"
			class="main-navigation__panel">
			<div class="userBar">
				<router-link v-if="!loggedIn" to="/login">Login</router-link>
				<router-link v-if="!loggedIn" to="/signup">Signup</router-link>
				<span v-if="loggedIn" class="userBar__username">{{ username }}</span>
				<a v-if="loggedIn" @click="logOut">Logout</a>
				<router-link v-if="loggedIn" to="/settings">Settings</router-link>
			</div>
			<places-list
				:role="'navigation'"
				:userName="username"
			/>
		</div>
	</nav>
</template>



<script>
	import placesList from './placesList.vue';

	export default {
		name: 'Navigation',
		components: {
			'places-list' : placesList 
		},
		computed: {
			username() {
				return this.$store.state.user.name;
			},
			loggedIn() {
				return this.$store.state.user.loggedIn;
			}
		},
		methods: {
			logOut() {
				localStorage.removeItem('id_token');
				this.$store.commit('USER_LOG_OUT');
			},
			navClickHandler () {
				// @todo: this seems silly
				if (event.target.nodeName == "A" || event.target.nodeName == "BUTTON" || event.target.parentNode.nodeName == "A") {
					this.navOpened = false;
				}
			}
		},
	   data() {
		return {
		  navOpened: false
		}
	  }
	}
</script>
