<template>
	<layout-view-wrapper>
		<span slot="header">
			User Settings
		</span>

		<div slot="content">

			<login-form
				v-if="!loggedIn"
				:message="'You need to log-in to access user settings'"
			/>
			<ui-transition-fade v-else>
				<div>
					<ui-group
						title="Change Units"
					>
						<setting-units />
					</ui-group>

					<ui-group
						title="Weather Settings"
					>
						<setting-weather />
					</ui-group>

					<ui-group
						title="Change Password"
					>
						<setting-password />
					</ui-group>

					<ui-group
						title="Change Email"
					>
						<setting-email />
					</ui-group>
				</div>
			</ui-transition-fade>
		</div>
	</layout-view-wrapper>

</template>

<script>
	import Vue from 'vue'
	import settingUnits from './settingUnits.vue';
	import settingPassword from './settingPassword.vue';
	import settingEmail from './settingEmail.vue';
	import settingWeather from './settingWeather.vue';
	import navigationHeader from 'Navigation/navigationHeader.vue';
	import loginForm from 'Login/loginForm.vue';

	export default {
		name: 'SettingsView',
		components: {
			'navigation-header' : navigationHeader,
			'setting-units' : settingUnits,
			'setting-password' : settingPassword,
			'setting-email' : settingEmail,
			'setting-weather' : settingWeather,
			'login-form' : loginForm
		},
		computed: {
			loggedIn() {
				return this.$store.state.user.loggedIn;
			},
		},
		data() {
			return {

			}
		}
	}

</script>
