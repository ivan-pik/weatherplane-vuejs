<template>
	<div id="app" class="app">
		<ui-global-messages
			:messages="globalMessages"
			v-on:dismissMessage="dismissMessage"
		/>

		<navigation-toggle />

		<transition name="routerTransition">
			<router-view></router-view>
		</transition>
	</div>

</template>

<script>
import Vue from 'vue'
import {checkAuth, getLocalToken} from '../auth'
import {HTTP} from '../http-common';
import WPAPI from '../wpapi/index';
import globalMessges from '../uiComponents/globalMessages.vue'

import Navigation from '../Navigation/index.vue'


export default {
	name: 'App',
	beforeCreate() {

		if(checkAuth()) {

			HTTP.post('identify')
				.then(response => {
					if (response.data.success) {
						
						this.$store.commit('USER_LOG_IN', {
							username: response.data.data.username
						})

						WPAPI.getPublicSettings(response.data.data.username)
						.then(settings => {
							this.$store.commit('GLOBAL_SET_WINDUNIT', settings.windUnit );
							this.$store.commit('GLOBAL_SET_TIMEFORMAT', settings.timeFormat );
							this.$store.commit('GLOBAL_SET_TEMPERATURE_UNIT', settings.temperatureUnit );
							this.$store.commit('GLOBAL_SET_WEATHER_RANGE', settings.weatherRange );
						});

					} else {
						// Something unforseen happened
					}
				}
				).catch(err => {
					
				//  if(err.responnse.errors) {
				//     // bus.$emit('failed-login');
				//  }
			});
		} else {
			// @todo: Detect initial settings for new users
			// when loading existing saved public place, the settings will come from
			// user profile

			// return awesomeDate.toLocaleTimeString(navigator.language, {hour: 'numeric'});

			this.$store.commit('GLOBAL_SET_WINDUNIT', "meters-per-second" );
			this.$store.commit('GLOBAL_SET_TIMEFORMAT', "24-hours" );
			this.$store.commit('GLOBAL_SET_TEMPERATURE_UNIT', "c" );
			this.$store.commit('GLOBAL_SET_WEATHER_RANGE', 3 );
		}
	},
	components: {
		'ui-global-messages': globalMessges,
		'navigation-toggle': Navigation
	},
	computed: {
		globalMessages () {
			return this.$store.state.globalApp.globalMessages;
		}
	},
	methods: {
		dismissMessage (id) {
			this.$store.commit('GLOBAL_REMOVE_MESSAGE', id);
		}
	},
	data() {
	return {
		// @todo: this doesn't work for RegisterView
		notAliveViews: "LoginView RegisterView ExistingPlaceView"
	}
	}
}

</script>

<style lang="scss">
	// @todo: save locally
	@import url('https://rsms.me/inter/inter-ui.css');

	@import '../styles/reset';
	@import '~globalVars';

	body, html {
		height: 100vh;
		overflow: hidden;
	}

	body {
		color: $textBaseColour;
		font-family: 'Inter UI', sans-serif;
	}

	.routerTransition-enter-active, .routerTransition-leave-active {
		transition-property: opacity;
		transition-duration: .4s;


	}

	.routerTransition-enter-active {
		transition-delay: .4s;


	}

	.routerTransition-enter, .routerTransition-leave-active {
		opacity: 0;


	}

</style>

