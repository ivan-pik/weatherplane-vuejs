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
		created () {
			document.addEventListener('keyup', this.escKeyHandler);
		},
		beforeDestroy () {
			document.removeEventListener('keyup', this.escKeyHandler);
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
			escKeyHandler () {
				this.navOpened = false;
			},
			logOut() {
				localStorage.removeItem('id_token');
				this.$store.commit('USER_LOG_OUT');
			},
			navClickHandler () {
				// @todo: this seems silly
				if (event.target._prevClass == "router-link-active" || event.target.className == "router-link-active" || event.target.parentElement.className == "router-link-active") {
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
