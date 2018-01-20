<template>
	<div id="app">
		<div class="globalMessages"
			v-if="globalMessages.length > 0"
		>
			<global-message
				v-for="(message, index) in globalMessages"
				key="index"
				:text="message.text"
				:type="message.type"
				:dismiss="message.dismiss"
				v-on:dismiss="dismissMessage(index)"
			/>
		</div>

		<navigation-toggle />

		<keep-alive v-bind:exclude="notAliveViews">
			<router-view></router-view>
		</keep-alive>
	</div>

</template>

<script>
import Vue from 'vue'
import {checkAuth, getLocalToken} from '../auth'
import {HTTP} from '../http-common';
import WPAPI from '../wpapi/index';
import globalMessage from '../uiComponents/message.vue'
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
	'global-message': globalMessage,
	'navigation-toggle': Navigation
	},
	computed: {
		globalMessages () {
			return this.$store.state.globalApp.globalMessages;
		}
	},
	methods: {
		dismissMessage (index) {
			this.$store.commit('GLOBAL_REMOVE_MESSAGE', index);
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
<style src="../styles/main.scss" lang="scss"></style>
