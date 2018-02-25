<template>
	<div class="userSetting userSetting--password">
		<div class="uiTextInputGroup">
			<label class="uiLabel" for="placeSlug">Old password
			</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('oldPassword') }"
				name="oldPassword"
				v-model="oldPassword"
				type="password"
				placeholder="Your current password"
			>
			
			<span
				v-show="validationErrors.has('oldPassword')"
				class="help is-danger">{{ validationErrors.first('oldPassword') }}
			</span>
		</div>

		<div class="uiTextInputGroup">
			<label class="uiLabel" for="placeSlug">New password
			</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('newPassword') }"
				name="newPassword"
				v-model="newPassword"
				type="password"
				placeholder="New password"
			>
			
			<span
				v-show="validationErrors.has('newPassword')"
				class="help is-danger">{{ validationErrors.first('newPassword') }}
			</span>
		</div>

		<div class="uiTextInputGroup">
			<label class="uiLabel" for="placeSlug">Repeat new password
			</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('newPasswordConfirm') }"
				name="newPasswordConfirm"
				v-model="newPasswordConfirm"
				type="password"
				placeholder="Repeat new password"
			>
			
			<span
				v-show="validationErrors.has('newPasswordConfirm')"
				class="help is-danger">{{ validationErrors.first('newPasswordConfirm') }}
			</span>
		</div>


		<div class="uiButtonGroup" v-if="valueChanged">
			<button @click="saveSetting" class="uiButton">Save</button>
		</div>

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