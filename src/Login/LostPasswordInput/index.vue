<template>
	<div class="modal">

		<div class="message message--error" v-if="wrongUsername">
			This user doesn't exist
		</div>

		<div v-if="passwordResetSent">
			Check your mail for new password
		</div>

		<form v-if="!passwordResetSent" v-on:submit.prevent="onSubmit">
			<div class="uiTextInputGroup">
				<label class="uiLabel" for="username">Username</label>
				<input
					class="uiTextInput"
					v-validate="{ rules: { required: true, alpha_dash: true } }"
					:class="{'input': true, 'is-danger': validationErrors.has('username') }"
					name="username"
					v-model="username"
					type="text"
					placeholder="Enter your username here"
					autofocus
				>
				<span
					v-show="validationErrors.has('username')"
					class="uiHelp uiHelp--danger">
					{{ validationErrors.first('username') }}
				</span>
			</div>
			<button class="uiButton uiButton--primary" type="submit">Continue</button>
		</form>

		<button class="uiLink" @click="cancel">Back to login</button>

	</div>
</template>
<script>
	import Vue from 'vue'
	import WPAPI from '../../wpapi/index';

	export default {
		name: 'LostPasswordInput',
		methods: {
			onSubmit(event) {
				this.$validator.validateAll().then(() => {
					let payload = {
						userID :  this.username,
					};

					WPAPI.retrieveLostPassword(payload).then((response) => {
						if (response.response.data.success) {
							this.passwordResetSent = true;
							this.wrongUsername = false;
						} else if(response.response.data.errors) {
							this.wrongUsername = true;
						}
					}).catch(err => {
						// @todo: API request error handling
					});

				}).catch(() => {
					// when form is invalid
				});
			},
			cancel () {
				this.$emit('cancel');
			}
		},
		data() {
			return {
				username: '',
				passwordResetSent: false,
				wrongUsername: false
			}
		}
	}

</script>
<style scoped></style>
