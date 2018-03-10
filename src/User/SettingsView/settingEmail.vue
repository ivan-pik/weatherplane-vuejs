<template>
	<div class="userSetting userSetting--password">

		<ui-text-input
			label="New email"
			name="newEmail"
			placeholder="Enter your new email"
			v-model="newEmail"
			v-validate="{ rules: { required: true, alpha_dash: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('newEmail')"
			data-vv-delay="1000"
		/>

		<!-- @todo: check if email exists alreadt -->

		<ui-button-group
			v-if="valueChanged"  
		>
			<ui-button
				text="Save"
				type="primary"
				@click="saveSetting"
			/>
		</ui-button-group>

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
				if (val !== '') {
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