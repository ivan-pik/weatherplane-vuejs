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

			<ul class="placesList">
				<li class="placesList__item">
					<span class="placesList__item">
						Woodspring Wings
					</span>
					<button class="placesList__contextMenuToggler">
						...
					</button>
					<ul class="placesList__contextMenu">
						<li>Place Settings</li>
						<li>move</li>
					</ul>
				</li>
			</ul>

			<router-link  to="/">Add new place</router-link>
			
			
			
		</div>
	</nav>
</template>



<script>
	export default {
		name: 'Navigation',
		data() {
			return {

			}
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
				if (event.target.nodeName == "A" || event.target.nodeName == "BUTTON") {
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
