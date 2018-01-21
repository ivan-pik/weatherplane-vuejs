<template>
	<div class="viewWrapper">
		<navigation-header>
			<span slot="title">
				User Settings
			</span>
		</navigation-header>	
		

		<div class="viewWrapper__scroller">


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



			<div class="uiGroup" v-if="loggedIn">
				<h3 class="uiGroup__title">
					Change Password
				</h3>
				<setting-password />
				
			</div>


			<div class="uiGroup" v-if="loggedIn">
				<h3 class="uiGroup__title">
					Change Email
				</h3>
				<setting-email />
			</div>



		
		
		</div>


	</div>

</template>
<script>
	import Vue from 'vue'
	import settingUnits from './settingUnits.vue';
	import settingPassword from './settingPassword.vue';
	import settingEmail from './settingEmail.vue';
	import settingWeather from './settingWeather.vue';
	import navigationHeader from 'Navigation/navigationHeader.vue'

	export default {
		name: 'SettingsView',
		components: {
			'navigation-header' : navigationHeader,
			'setting-units' : settingUnits,
			'setting-password' : settingPassword,
			'setting-email' : settingEmail,
			'setting-weather' : settingWeather,
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
