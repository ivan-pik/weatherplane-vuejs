<template>
	<div class="registerForm"
		v-bind:class="{
			'registerForm__content--error' : errors.registrationFailed,
			'registerForm__content--success' : this.successfulRegistration
		}"
	>
		<div class="registerForm__content">
			<div class="registerForm__sucessOverlay"
				v-bind:class="{
					'registerForm__sucessOverlay--active' : this.successfulRegistration
				}"
			>
				<svg  viewBox="0 0 24 24" width="24px"><path d="M16.972,6.251c-0.967-0.538-2.185-0.188-2.72,0.777l-3.713,6.682l-2.125-2.125c-0.781-0.781-2.047-0.781-2.828,0  c-0.781,0.781-0.781,2.047,0,2.828l4,4C9.964,18.792,10.474,19,11,19c0.092,0,0.185-0.006,0.277-0.02  c0.621-0.087,1.166-0.46,1.471-1.009l5-9C18.285,8.005,17.937,6.788,16.972,6.251z"/></svg>
			</div>
		
			<form  v-on:submit.prevent="onSubmit">
				<div class="message message--error"
					v-if="errors.registrationFailed && !errors.unknownFailure"
				>
						{{errors.message}}
				</div>
				<div class="message message--error"
					v-else-if="errors.unknownFailure"
				>
						Registration failed. Please try again.
				</div>

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
						data-vv-delay="1000"
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

				<!-- @todo: Delay the validation till the first field is filled -->

				<div class="uiTextInputGroup">
					<label class="uiLabel" for="confirmPassword">Confirm Password</label>
					<input
						class="uiTextInput"
						v-validate="{ rules: { required: true, confirmed:'password' } }"
						:class="{'input': true, 'is-danger': validationErrors.has('confirmPassword') }"
						name="confirmPassword"
						v-model="confirmPassword"
						type="password"
						placeholder="Repeat your password here"
						autofocus
						data-vv-delay="1000"
					>
					<span
						v-show="validationErrors.has('confirmPassword')"
						class="uiHelp uiHelp--danger">
							{{ validationErrors.first('confirmPassword') }}
					</span>
				</div>


				<div class="uiTextInputGroup">
					<label class="uiLabel" for="email">Email</label>
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

				<button class="uiButton uiButton--primary" type="submit">Signup</button>
			</form>
		</div>
	</div>
</template>

<script>

import WPAPI from 'wpapi/index';
import {saveToken} from '../../auth'

export default {
	name: 'RegisterForm',
	computed: {
		windUnit() {
			return this.$store.state.globalApp.settings.windUnit;
		},
		timeFormat() {
			return this.$store.state.globalApp.settings.timeFormat;
		},
		temperatureUnit() {
			return this.$store.state.globalApp.settings.temperatureUnit;
		},
		weatherRange() {
			return this.$store.state.globalApp.settings.weatherRange;
		},
	},
	methods: {
		onSubmit(event) {
			this.$validator.validateAll().then(() => {
				const credentials = {
					userID : this.username,
					password : this.password,
					email : this.email,
					windUnit : this.windUnit,
					timeFormat : this.timeFormat,
					temperatureUnit : this.temperatureUnit,
					weatherRange : this.weatherRange,
				}
				WPAPI.register(credentials)
				.then (user => {
						
					this.onSuccessfulRegistration(user);

				}).catch((error) => {
					this.onFailedRegistration(error);
				});

			
			}).catch(() => {
				// when form is invalid
			});
		},
		onFailedRegistration(errors) {
			let errorCode = function(code, errors) {
				let check = errors.filter(function( obj ) {
					return obj.code == code;
				});
				if (check.length > 0) {
					return true;
				}
				return false;
			}

			let userName, userEmail;

			// Duplicate username and/or e-mail
			if (errorCode("username-or-email-already-registered", errors)) {
				if(errorCode("username-exists", errors)) {
					userName = true;
				}
				if(errorCode("user-email-exists", errors)) {
					userEmail = true;
				}
			// Unknown errors from the API
			} else {
				this.errors.unknownFailure = true;
			}

			let message = 'Sorry, user with this ' + (userName ? 'username' : '') + (userName && userEmail ? ' and ' : ' ') + (userEmail ? 'email' : '') + ' already exits.';

			this.errors.message = message;
			this.errors.registrationFailed = true;
			
		},
		onSuccessfulRegistration(user) {
			this.errors.registrationFailed = false;
			this.errors.userExists = false;
			this.errors.emailExists = false;
			this.errors.unknownFailure = false;

			this.successfulRegistration = true;

			let credentials = {
				userID :  this.username,
				password : this.password
			};

			WPAPI.authenticate(credentials)
			.then (token => {
				saveToken(token);

				this.successfulLogin = true;

				WPAPI.getPublicSettings(credentials.userID)
				.then(settings => {
					this.$store.commit('GLOBAL_SET_WINDUNIT', settings.windUnit );
					this.$store.commit('GLOBAL_SET_TIMEFORMAT', settings.timeFormat );
					this.$store.commit('GLOBAL_SET_TEMPERATURE_UNIT', settings.temperatureUnit );
					this.$store.commit('GLOBAL_SET_WEATHER_RANGE', settings.weatherRange );
				});

				setTimeout(() => {
					this.$emit('login-successful', {
						userID : credentials.userID,
						token
					});

					this.$store.commit('USER_LOG_IN', {
						username: credentials.userID
					});
		
					this.$store.commit('USER_SAVE_TOKEN',token);

					this.$store.commit('USER_AUTHENTICATED');

					

				}, this.REGISTRATION_SUCCESSFUL_TIMEOUT)

			}).catch((error) => {
				// @todo: handle error
			});
		},
	},
	data() {
		return {
			successfulLogin: false,
			successfulRegistration: false,
			show: true,
			username: '',
			password: '',
			email: '',
			confirmPassword: '',
			errors: {
				registrationFailed : false,
				userExists : false,
				emailExists : false,
				unknownFailure : false,
				message : ''
			},
			REGISTRATION_SUCCESSFUL_TIMEOUT: 800
		}
	}
}


</script>



<style lang="scss">
	@import '~globalVars';

	.registerForm{
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: stretch;
		align-items: center;

		
	}

	.registerForm__content {
		position: relative;
	}

	.registerForm__content--error {
		.registerForm__content {
			border-color: #c70000;
			animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
			transform: translate3d(0, 0, 0);
			backface-visibility: hidden;
			perspective: 1000px;
		}
	}

	.registerForm__content--success {
		.registerForm__content {
			border-color: green;
		}
	}

	.registerForm__content {
		width: 100%;
		max-width: 290px;
		padding: $widthGridLargerSpace $widthGridLargerSpace * 2;
		border: 2px solid $uiFrame;
		border-radius: 7px;
		background-color: $colorAppBackground;
	}

	.registerForm__links {
		margin-top: 1em;
	}



	.registerForm__sucessOverlay {
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

	.registerForm__sucessOverlay--active {
		display: block;
		animation: flipInY 800ms linear both;
	}


</style>


