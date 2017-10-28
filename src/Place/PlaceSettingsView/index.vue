<template>
	<div class="placeSettingsView">
		<div class="mainNav">
			<h1 class="mainNav__title">Settings</h1>
		</div>

		<form  v-on:submit.prevent="onSubmit">
			<label class="label" for="username">Place Name</label>
			<br>
			<input
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('placeName') }"
				name="placeName"
				v-model="placeName"
				type="text"
				placeholder="Location name here"
			>
			<br>

		</form>

		// @todo: This could be component shared in Save place as well

		Public

		Runway orientation

		Location

		{{place}}

	</div>
</template>

<script>
	import Vue from 'vue';
	import {HTTP} from '../../http-common';
	
	export default {
		name: 'placeSettingsView',
		computed: {
			place () {
				return this.$store.state.existingPlaceView.place;
			}
		},
		mounted () {
			this.loadPlaceData();
		},
		methods: {
			// @todo: DRY :(
			loadPlaceData () {
				HTTP.get('places/'+this.$route.params.username + "/" + this.$route.params.place)
				.then(response => {
					if (response.data.success) {
						this.$store.commit('PLACE_SAVE_PLACE_DATA', response.data.data.place)
					}
				}).catch(err => {
					if(err.response) {
						// @todo: DRY!!!
						let errorCode = function(code, errors) {
							let check = errors.filter(function( obj ) {
								return obj.code == code;
							});
							if (check.length > 0) {
								return true;
							}
							return false;
						}

						if(errorCode("authentication-required", err.response.data.errors)) {
							this.needToLogin = true;
							this.$store.commit('USER_AUTHENTICATION_REQUIRED')
						}

						if(errorCode("resource-does-not-exist", err.response.data.errors)) {
							// @todo: Place pseudo 404
							this.place404 = true;
						}
					}
				});
			}
		},
		data () {
			return {
			
			}
		}
	}

</script>