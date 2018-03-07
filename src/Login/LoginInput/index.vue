<template>
	<div class="loginForm"
		v-bind:class="{
			'loginForm__content--error' : errors.wrongCredentials,
			'loginForm__content--success' : this.successfulLogin
		}"
	>
		<transition name="fade">
			<div v-if="show=='login'" class="loginForm__content">

				<div class="loginForm__sucessOverlay"
					v-bind:class="{
						'loginForm__sucessOverlay--active' : this.successfulLogin
					}"
				>
					<svg enable-background="new 0 0 500 500" height="500px" id="Layer_1" version="1.1" viewBox="0 0 500 500" width="500px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path clip-rule="evenodd" d="M68.29,431.711c0,20.078,16.264,36.34,36.343,36.34h290.734  c20.078,0,36.345-16.262,36.345-36.34V250c0-20.079-16.267-36.342-36.345-36.342H177.317v-63.597  c0-40.157,32.525-72.685,72.683-72.685c40.158,0,72.685,32.528,72.685,72.685v4.541c0,12.538,10.176,22.715,22.711,22.715  c12.537,0,22.717-10.177,22.717-22.715v-4.541c0-65.232-52.882-118.111-118.112-118.111c-65.24,0-118.111,52.879-118.111,118.111  v63.597h-27.256c-20.079,0-36.343,16.263-36.343,36.342V431.711z M213.658,313.599c0-20.078,16.263-36.341,36.342-36.341  s36.341,16.263,36.341,36.341c0,12.812-6.634,24.079-16.625,30.529c0,0,3.55,21.446,7.542,46.699  c0,7.538-6.087,13.625-13.629,13.625h-27.258c-7.541,0-13.627-6.087-13.627-13.625l7.542-46.699  C220.294,337.678,213.658,326.41,213.658,313.599z" fill-rule="evenodd"/></svg>
				</div>

				<div class="message info">
					{{message}}
				</div>

				<form  class="" v-on:submit.prevent="onSubmit">
					<transition name="fade">
						<div
							v-show="errors.wrongCredentials"
							class="loginForm__denied"
						>
							<div class="uiHelp uiHelp--danger">
								Wrong combination of username and password
							</div>
						</div>
					</transition>
					<transition name="fade">
						<span
							v-show="errors.networkError"
							class="uiHelp uiHelp--danger">
							Something went wrong, please try again
						</span>
					</transition>

					<div class="uiTextInputGroup">
						<label class="uiLabel" for="username">Username</label>
						<input
							class="uiTextInput"
							v-validate="{ rules: { required: true, alpha_dash: true } }"
							:class="{'input': true, 'is-danger': validationErrors.has('username') }"
							name="username"
							v-model="username"
							type="text"
							placeholder="Enter your username"
							:autofocus="(!this.fillUsername)"
						>
						<span
							v-show="validationErrors.has('username')"
							class="uiHelp uiHelp--danger">{{ validationErrors.first('username') }}
						</span>
					</div>

					<div class="uiTextInputGroup">
						<label class="uiLabel" for="password">Password</label>
						<input
							class="uiTextInput"
							v-validate="{ rules: { required: true } }"
							:class="{'input': true, 'is-danger': validationErrors.has('password') }"
							type="password"
							name="password"
							v-model="password"
							placeholder="Enter your password"
							:autofocus="(this.fillUsername)"
						/>
						<span v-show="validationErrors.has('password')" class="uiHelp uiHelp--danger">{{ validationErrors.first('password') }}</span>
					</div>
					<button class="uiButton uiButton--primary" type="submit">Login</button>
				</form>

				<div class="loginForm__links">
					<a 
						class="uiLink"
						@click="show='recoverPassword'"
					>
						Recover lost password
					</a>
					<a 
						class="uiLink"
						@click="show='recoverUsername'"
					>
						Recover lost username
					</a>

					<p>Don't have an account?</p>
					<router-link class="uiLink" to="/signup">Sign Up!</router-link>
				</div>

			</div>

			<div v-else-if="show=='recoverPassword'" class="loginForm__content">
				<lost-password-input
					v-on:cancel="show='login'"
				/>
			</div>

			<div v-else-if="show=='recoverUsername'" class="loginForm__content">
				<lost-username-input
					v-on:cancel="show='login'"
				/>
			</div>
		</transition>
	</div>
</template>

<script>
import Vue from 'vue'
import {saveToken} from '../../auth'
import {HTTP} from '../../http-common';

import WPAPI from '../../wpapi/index';

import LostPasswordInput from 'Login/LostPasswordInput/index.vue'
import LostUsernameInput from 'Login/LostUsernameInput/index.vue'

export default {
	name: 'LoginInput',
	components: {
		'lost-password-input': LostPasswordInput,
		'lost-username-input': LostUsernameInput,
		
	},
	props: {
		message: {
			type: String,
		},
		fillUsername: {
			type: String
		}
	},
	mounted () {
		if (this.fillUsername) {
			this.username = this.fillUsername;
		}
	},
	methods: {
		onSubmit(event) {
			this.$validator.validateAll()
			.then(() => {

				this.errors = {};

				let credentials = {
						userID :  this.username,
						password : this.password
				};

				WPAPI.authenticate(credentials)
				.then (token => {
						saveToken(token);

						

						this.successfulLogin = true;

						// Delay for visual effect
						setTimeout(() => {
							this.$emit('loginSuccessful', {
								userID : credentials.userID,
								token
							});
						},this.LOGIN_SUCCESSFUL_TIMEOUT);

				}).catch((error) => {
					if (error[0] && error[0].code == 'wrong-userID-or-password') {
						Vue.set(this.errors, 'wrongCredentials', true)
					} else {
						Vue.set(this.errors, 'networkError', true)
					}
					// @todo: handle network error
				});

			}).catch((error) => {
				// Missing fields or unnalowed characters
			});
		},
	},
	computed: {
		noRouterRedirect () {
			return this.$store.state.user.authenticationRequired;
		}
	},
	data() {
		return {
			username: '',
			password: '',
			errors: {},
			successfulLogin: false,
			LOGIN_SUCCESSFUL_TIMEOUT: 800,
			show: 'login',
		}
	}
}

</script>

<style lang="scss">
	@import '~globalVars';

	.loginForm{
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: stretch;
		align-items: center;

		
	}

	.loginForm__content {
		position: relative;
	}

	.loginForm__content--error {
		.loginForm__content {
			border-color: #c70000;
			animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
			transform: translate3d(0, 0, 0);
			backface-visibility: hidden;
			perspective: 1000px;
		}
	}

	.loginForm__content--success {
		.loginForm__content {
			border-color: green;
		}
	}

	.loginForm__content {
		width: 100%;
		max-width: 290px;
		padding: $widthGridLargerSpace $widthGridLargerSpace * 2;
		border: 2px solid $uiFrame;
		border-radius: 7px;
		background-color: $colorAppBackground;
	}

	.loginForm__links {
		margin-top: 1em;
	}



	.loginForm__sucessOverlay {
		display: none;
		pointer-events: none;
		background: green;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
		align-items: center;
		
		transform: translate3d(0, 0, 0);
		perspective: 1000px;
		border-radius: 5px;

		svg {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-25px, -25px, 0);
			width: 50px;
			height: auto;
			fill: #fff;
		}
	}

	.loginForm__sucessOverlay--active {
		display: block;
		animation: flipInY 800ms linear both;
	}


</style>
