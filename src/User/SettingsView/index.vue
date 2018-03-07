<template>
	<div class="viewWrapper">
		<navigation-header>
			<span slot="title">
				User Settings
			</span>
		</navigation-header>	
		

		<div class="viewWrapper__scroller">

			<login-form
				v-if="!loggedIn"
				:message="'You need to log-in to access user settings'"
			/>

			<transition v-else name="fade">
				<div>
					<div class="uiGroup">
						<h3 class="uiGroup__title">
							Change Units
						</h3>
						<setting-units />
						
					</div>

					<div class="uiGroup">
						<h3 class="uiGroup__title">
							Weather Settings
						</h3>
						<setting-weather />
						
					</div>



					<div class="uiGroup">
						<h3 class="uiGroup__title">
							Change Password
						</h3>
						<setting-password />
						
					</div>


					<div class="uiGroup">
						<h3 class="uiGroup__title">
							Change Email
						</h3>
						<setting-email />
					</div>
				</div>
			</transition>
		</div>
	</div>

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
