<template>
	<div class="userSetting userSetting--password">

		<ui-text-input
			label="Old password"
			name="oldPassword"
			placeholder="Your current password"
			v-model="oldPassword"
			v-validate="{ rules: { required: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('oldPassword')"
			data-vv-delay="1000"
			type="password"
		/>

		<ui-text-input
			label="New password"
			name="newPassword"
			placeholder="New password"
			v-model="newPassword"
			v-validate="{ rules: { required: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('newPassword')"
			data-vv-delay="1000"
			type="password"
		/>

		<ui-text-input
			label="Repeat new password"
			name="newPasswordConfirm"
			placeholder="Repeat new password"
			v-model="newPasswordConfirm"
			v-validate="{ rules: { required: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('newPasswordConfirm')"
			data-vv-delay="1000"
			type="password"
		/>

		<ui-button-group :show="valueChanged">
			<ui-button
				text="Save"
				type="primary"
				@click="saveSetting"
				:disabled="(validationErrors.errors.length > 0)"
			/>
		</ui-button-group>

	</div>
</template>

<script>
	import Vue from 'vue';
	import WPAPI from '../../wpapi/index';
	import {errorCodeParser} from 'libs/errorCodeParser.js';

	// @todo: check if newPassword and newPasswordConfirm matches
	// @todo: check if pass has changed
	// @todo: handle wrong password condition
	
	export default {
		name: 'userSettingPassword',
		props: {
			value: {
				type: String
			}
		},
		watch: {
			newPassword (newValue) {
				if (newValue != this.value) {
					this.valueChanged = true;
				} else {
					this.valueChanged = false;
				}

			}
		},
		computed: {
			placesList () {
				return this.$store.state.user.places;
			}
		},
		methods: {
			saveSetting () {
				WPAPI.updatePassword(
					{
						password: this.oldPassword,
						newPassword: this.newPassword
					}
				).then((user) => {
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Password updated',
						type: 'success',
						dismiss: 'auto'
					});
					this.valueChanged = false;
				})
				.catch((error) => {
					if (error.response && error.response.data.errors) {
						errorCodeParser ('wrong-current-password',error.response.data.errors)
						.then(() => {
							this.$store.commit('GLOBAL_ADD_MESSAGE', {
								text: 'The current password is wrong',
								type: 'error',
							});
						})
						.catch((error) => {
							this.$store.commit('GLOBAL_ADD_MESSAGE', {
								text: 'Ooops, something went wrong',
								type: 'error',
							});
						})
					} else {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Ooops, something went wrong',
							type: 'error',
						});
					}
					
				});
			},
			errorCode (code, errors) {
				let check = errors.filter(function( obj ) {
					return obj.code == code;
				});
				if (check.length > 0) {
					return true;
				}
				return false;
			}
		},
		data () {
			return {
				newPassword: '',
				oldPassword: '',
				newPasswordConfirm: '',
				valueChanged: false,
				urlAvailable: false
			}
		}
	}

</script>