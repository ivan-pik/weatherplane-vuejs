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
				<ui-message
					v-if="errors.registrationFailed && !errors.unknownFailure"
					type="error"
				>
					{{errors.message}}
				</ui-message>

				<ui-message
					v-else-if="errors.unknownFailure" 
					type="error"
				>
					Registration failed. Please try again.
				</ui-message>

				<ui-text-input
					label="Username"
					name="username"
					placeholder="Enter your username here"
					v-model="username"
					v-validate="{ rules: { required: true, alpha_dash: true } }"
					data-vv-value-path="innerValue"
					:help="validationErrors.first('username')"
					data-vv-delay="1000"
					autofocus="autofocus"
				/>

				<ui-text-input
					label="Password"
					name="password"
					placeholder="Enter your password here"
					v-model="password"
					v-validate="{ rules: { required: true, alpha_dash: true } }"
					data-vv-value-path="innerValue"
					:help="validationErrors.first('password')"
					data-vv-delay="1000"
				/>

				

				<!-- @todo: Delay the validation till the first field is filled -->

				<ui-text-input
					label="Confirm Password"
					name="confirmPassword"
					placeholder="Enter your password here"
					v-model="confirmPassword"
					v-validate="{ rules: { required: true, confirmed:'password' } }"
					data-vv-value-path="innerValue"
					:help="validationErrors.first('confirmPassword')"
					data-vv-delay="1000"
				/>

				<ui-text-input
					label="Email"
					name="email"
					placeholder="Enter your email here"
					v-model="email"
					v-validate="{ rules: { required: true, email: true } }"
					data-vv-value-path="innerValue"
					:help="validationErrors.first('email')"
					data-vv-delay="1000"
				/>

				<ui-button
					text="Signup"
					type="primary"
					:submit="true"
					:disabled="(validationErrors.errors.length > 0)"
				/>
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
		flex: 1 0 auto;
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
		padding: 1em;
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

@keyframes shake {
	10%, 90% {
		transform: translate3d(-1px, 0, 0);
	}

	20%, 80% {
		transform: translate3d(2px, 0, 0);
	}

	30%, 50%, 70% {
		transform: translate3d(-4px, 0, 0);
	}

	40%, 60% {
		transform: translate3d(4px, 0, 0);
	}
}



</style>


