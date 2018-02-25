<template>
	<div class="viewWrapper">
		<navigation-header />
		<div class="viewWrapper__scroller">
			<div class="uiMessage uiMessage--error" v-if="tokenInvalid">
				The password reset link has expired.
				@todo: Go to retrieve your password again
			</div>

			<div v-if="passwordResetSent">
				<div class="uiMessage uiMessage--success" v-if="tokenInvalid">
					Your password has been reset
					@todo: Login here
				</div>
			</div>

			<form v-if="!passwordResetSent && !tokenInvalid" v-on:submit.prevent="onSubmit">
				<div class="uiGroup">

					<h1 class="uiGroup__title">
						Enter a new password
					</h1>
						
					<div class="uiTextInputGroup">
						<label class="uiLabel" for="password">Password</label>
						<input
							class="uiTextInput"
							v-validate="{ rules: { required: true } }"
							:class="{'input': true, 'is-danger': validationErrors.has('password') }"
							name="password"
							v-model="password"
							type="password"
							placeholder="Enter your password here"
							autofocus
							data-vv-delay="1000"
						>
						<span
							v-show="validationErrors.has('password')"
							class="uiHelp uiHelp--danger">{{ validationErrors.first('password') }}
						</span>
					</div>

					<div class="uiTextInputGroup">
						<label class="uiLabel" for="confirmPassword">Confirm Password</label>
						<input
							class="uiTextInput"
							v-validate="{ rules: { required: true, confirmed:'password' } }"
							:class="{'input': true, 'is-danger': validationErrors.has('confirmPassword') }"
							name="confirmPassword"
							v-model="confirmPassword"
							type="password"
							placeholder="Enter your password here"
							autofocus
							data-vv-delay="1000"
						>
						<span
							v-show="validationErrors.has('confirmPassword')"
							class="uiHelp uiHelp--danger">
							{{ validationErrors.first('confirmPassword') }}
						</span>

					</div>

					<!-- @todo: Delay the validation till the first field is filled -->
					
					<button class="uiButton uiButton--primary" type="submit">Continue</button>
				</div>
			</form>

		</div>
	</div>
</template>

<script>
	import WPAPI from 'wpapi/index';
	import {errorCodeParser} from 'libs/errorCodeParser.js';

	export default {
		name: 'ResetPassword',
		methods: {
			onSubmit(event) {
				this.$validator.validateAll().then(() => {
					let payload = {
						userID :  this.$route.query.userID,
						password: this.password,
						token : this.$route.query.token
					};

					WPAPI.resetPassword(
						payload
					).then(response => {
						if (response.success) {
							this.passwordResetSent = true;
							this.tokenInvalid = false;
						} else {
							if (response.errors) {
								errorCodeParser ('token-expired',response.errors)
								.then(() => {
									this.tokenInvalid = true;
								})
								.catch(() => {
									
								});

								errorCodeParser ('token-is-invalid',response.errors)
								.then(() => {
									this.tokenInvalid = true;
								})
								.catch(() => {
									
								})
							} else {
								this.$store.commit('GLOBAL_ADD_MESSAGE', {
									text: 'Ooops, something went wrong',
									type: 'error',
								});
							}
						}
					}).catch(err => {
						// @todo:network error
					})
					
				}).catch(() => {
					// when form is invalid
				});
			}
		},
		data() {
			return {
				password: '',
				confirmPassword: '',
				passwordResetSent: false,
				tokenInvalid: false
			}
		}
	}

</script>
<style scoped></style>
