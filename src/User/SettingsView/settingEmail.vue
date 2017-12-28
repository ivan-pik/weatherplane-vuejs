<template>
	<div class="userSetting userSetting--password">

		<div class="uiTextInputGroup">
			<label class="uiLabel" for="newEmail">New email
			</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('newEmail') }"
				name="newEmail"
				v-model="newEmail"
				type="text"
				placeholder="URL here"
			>
			
			<span
				v-show="validationErrors.has('newEmail')"
				class="help is-danger">{{ validationErrors.first('newEmail') }}
			</span>
		</div>

		<div class="uiButtonGroup">
			<button v-if="valueChanged"  @click="saveSetting" class="uiButton">Save</button>
		</div>

	</div>
</template>

<script>
	import Vue from 'vue';
	import WPAPI from '../../wpapi/index';
	
	export default {
		name: 'settingEmail',
		props: {
			
		},
		mounted () {
		},
		watch: {
			newEmail (val) {
				if (val != '') {
					this.valueChanged = true;
				}
			}
		},
		computed: {
			userID () {
				return this.$store.state.user.name;
			}
		},
		methods: {
			saveSetting () {
				WPAPI.updateEmail(
					{
						email: this.newEmail,
						userID: this.userID
					}
				).then((user) => {
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Email updated',
						type: 'success',
						dismiss: 'auto'
					});
					this.valueChanged = false;
				})
				.catch((error) => {
					if(this.errorCode("email-already-exists", error.errors)) {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'This email is already used',
							type: 'error',
						});
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
				newEmail: '',
				valueChanged: false
			}
		}
	}

</script>