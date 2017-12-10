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

					} else {
						// Something unforseen happened
					}
				}
			).catch(err => {
			//  if(err.responnse.errors) {
			//     // bus.$emit('failed-login');
			//  }
		});
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
