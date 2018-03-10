<template>
	<div class="modal">
		<ui-message
			v-if="wrongUsername"
			type="error"
		>
			This user doesn't exist
		</ui-message>

		<div v-if="passwordResetSent">
			Check your mail for new password
		</div>

		<form v-if="!passwordResetSent" v-on:submit.prevent="onSubmit">

			<ui-text-input
				label="Username"
				name="username"
				placeholder="Enter your username here"
				:autofocus="true"
				v-model="username"
				v-validate="{ rules: { required: true, alpha_dash: true } }"
				data-vv-value-path="innerValue"
				:help="validationErrors.first('username')"
			/>
			
			<ui-button
				text="Continue"
				:submit="true"
				type="primary"
				:disabled="!username"
			/>
		</form>

		<ui-button
			text="Back to login"
			type="primary"
			@click="cancel"
			:raised="false"
		/>

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
