<template>
	<layout-view-wrapper>
		<div slot="content">
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
				<ui-group
					title="Enter a new password"
				>
					<ui-text-input
						label="Password"
						name="password"
						placeholder="Enter your password here"
						v-model="password"
						v-validate="{ rules: { required: true, confirmed:'password' } }"
						data-vv-value-path="innerValue"
						:help="validationErrors.first('password')"
						data-vv-delay="1000"
						:autofocus="true"
					/>

					<ui-text-input
						label="Confirm Password"
						name="confirmPassword"
						placeholder="Enter your password again"
						v-model="confirmPassword"
						v-validate="{ rules: { required: true, confirmed:'password' } }"
						data-vv-value-path="innerValue"
						:help="validationErrors.first('confirmPassword')"
						data-vv-delay="1000"
					/>

					<!-- @todo: Delay the validation till the first field is filled -->
					
					<ui-button
						text="Continue"
						type="primary"
						:submit="true"
					/>
				</ui-group>
			</form>

		</div>
	</layout-view-wrapper>
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
