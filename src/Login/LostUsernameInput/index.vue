<template>
	<div class="modal">

		<div class="message message--error" v-if="wrongUsername">
			This email address is not registered
		</div>

		<div class="message message--success" v-if="passwordResetSent">
			Email with your username was sent
		</div>


		<form v-if="!passwordResetSent" v-on:submit.prevent="onSubmit">

			<div class="uiTextInputGroup">
				<label class="uiLabel" for="email">Please enter the email address you used for registration</label>
				<br>
				<input
					class="uiTextInput"
					v-validate="{ rules: { required: true, email: true } }"
					:class="{'input': true, 'is-danger': validationErrors.has('email') }"
					type="email"
					name="email"
					v-model="email"
					placeholder="Enter your email here"
					data-vv-delay="1000"

				/>
				<span v-show="validationErrors.has('email')" class="uiHelp uiHelp--danger">{{ validationErrors.first('email') }}</span>
			</div>

			<button class="uiButton uiButton--primary" type="submit">Continue</button>
		</form>

		<button class="uiLink" @click="cancel">Back to login</button>

	</div>
</template>
<script>
	import Vue from 'vue';
	import WPAPI from '../../wpapi/index';

	export default {
		name: 'LostUsernameInput',
		methods: {
			onSubmit(event) {
				this.$validator.validateAll().then(() => {
					let payload = {
						email :  this.email,
					};

					WPAPI.retrieveLostUsername(payload).then((response) => {
						
						if (response.response.data.success) {
							this.passwordResetSent = true;
							this.wrongUsername = false;
						} else {
							this.wrongUsername = true;
						}
					}).catch(err => {
						// @todo APi req error
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
				email: '',
				passwordResetSent: false,
				wrongUsername: false
			}
		}
	}

</script>
<style scoped></style>