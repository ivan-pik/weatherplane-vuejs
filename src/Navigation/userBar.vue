<template>
	<div class="userBar">
		<div class="userBar__group">
			<router-link class="uiLink" v-if="!loggedIn" to="/login">Login</router-link>
			<router-link class="uiLink" v-if="!loggedIn" to="/signup">Signup</router-link>
			<span v-if="loggedIn" class="userBar__username">{{ username }}</span>
			<router-link  v-if="loggedIn" class="uiLink" to="/settings">User Settings</router-link>
			<a class="uiLink" v-if="loggedIn" @click="logOut">Logout</a>
		</div>
		<div class="userBar__group">
			

			<a class="uiLink" @click="openUnitsSettings=true">Set Units</a>

			<a class="uiLink" @click="openWeatherSettings=true">Weather Settings</a>
		</div>

		<ui-modal
			:show="openUnitsSettings"
			:closeButton="true"
			:popup="true"
			@close-button-clicked="openUnitsSettings=false"
		>
			<setting-units
				slot="content"
			 />
		</ui-modal>

		<ui-modal
			:show="openWeatherSettings"
			:closeButton="true"
			:popup="true"
			@close-button-clicked="openWeatherSettings=false"
		>
			<setting-weather
				slot="content"
			 />
		</ui-modal>


	</div>
</template>

<script>
	import settingUnits from 'User/SettingsView/settingUnits.vue';
	import settingWeather from 'User/SettingsView/settingWeather.vue';
	
	export default {
		name: 'UserBar',
		components: {
			'setting-units' : settingUnits,
			'setting-weather' : settingWeather,
		},
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
				openUnitsSettings: false,
				openWeatherSettings: false,
			}
		}
	}
</script>
<style lang="scss">

@import '~globalVars';

.userBar {
	padding: 0 $widthGridLargerSpace 0 50px;
	
	margin: 0 0 1em 0;
	a {
		margin-left: 1em;
	}
}

.userBar__group {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	align-items: center;
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
