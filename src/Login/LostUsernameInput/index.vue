<template>
	<div class="modal">
		<ui-message
			v-if="wrongUsername"
			type="error"
		>
			This email address is not registered
		</ui-message>

		<ui-message
			v-if="passwordResetSent"
			type="error"
		>
			Email with your username was sent
		</ui-message>

		<form v-if="!passwordResetSent" v-on:submit.prevent="onSubmit">

			<ui-text-input
				label="Username"
				name="email"
				placeholder="Enter your email here"
				:autofocus="true"
				v-model="email"
				v-validate="{ rules: { required: true, email: true } }"
				data-vv-value-path="innerValue"
				data-vv-delay="1000"
				:help="validationErrors.first('email')"
			/>

			<ui-button
				text="Continue"
				type="primary"
				:submit="true"
				:disabled="!email"
			/>

		</form>

		<ui-button
			text="Back to login"
			type="primary"
			:raised="false"
			@click="cancel"
		/>

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