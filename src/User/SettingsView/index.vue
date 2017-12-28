<template>
	<div class="">
		Settings View

		// @todo: check if logged in


		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Change Units
			</h3>
			<setting-units 
			/>
			
		</div>

		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Change Password
			</h3>
			<setting-password 
			/>
			
		</div>

		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Change Email
			</h3>
			<setting-email 
			/>
		</div>



		
		



	</div>

</template>
<script>
	import Vue from 'vue'
	import settingUnits from './settingUnits.vue';
	import settingPassword from './settingPassword.vue';
	import settingEmail from './settingEmail.vue';

	export default {
		name: 'SettingsView',
		components: {
			'setting-units' : settingUnits,
			'setting-password' : settingPassword,
			'setting-email' : settingEmail,
		},
		data() {
			return {

			}
		}
	}

</script>
