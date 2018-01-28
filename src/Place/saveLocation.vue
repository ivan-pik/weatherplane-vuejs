<template>
	<div class="">

			<login-view :message="message" v-if="!loggedIn" />

			<form v-else v-on:submit.prevent="onSubmit">


					<div class="uiTextInputGroup">
						<label class="uiLabel" for="username">Location Name, Available: {{nameAvailable}}</label>
						<input
							class="uiTextInput"
							v-validate="{ rules: { required: true } }"
							:class="{'input': true, 'is-danger': validationErrors.has('placeName') }"
							name="placeName"
							v-model="placeName"
							type="text"
							placeholder="Location name here"
							autofocus
						>
						
						<span
							v-show="validationErrors.has('placeName')"
							class="uiHelp uiHelp--danger">{{ validationErrors.first('placeName') }}
						</span>

						
					</div>
					<ui-note>
						You will be able to access the place quickly via
						{{newPlaceURL}}
					</ui-note>
				
					<div class="uiTextInputGroup">
						<ui-radio
							:radios="privacyOptions"
							v-on:change="updateHandler"
						>
							<label class="uiLabel" slot="label">Who can access this place URL?</label>
						</ui-radio>
						<ui-note v-if="!placeIsPublic">
							You have to log-in to visit www.weatherplane.com/{{userName}}/{{placeNameURL}}
						</ui-note>
						<ui-note v-if="placeIsPublic">
							Anyone can visit www.weatherplane.com/{{userName}}/{{placeNameURL}}
						</ui-note>
					</div>

					<button type="submit" v-if="nameAvailable" class="uiButton uiButton--primary">Save</button>
			</form>
		
	</div>
	
</template>
<script>
		import Vue from 'vue';

		import WPAPI from 'wpapi/index.js';
		import loginView from 'Login/LoginView/index.vue';

		export default {
				name: 'saveLocationView',
				components: {
					'login-view' : loginView
				},
				computed: {
						placeSelected() {
								return this.$store.state.placeSearch.placeSelected;
						},
						activeLocation() {
								return this.$store.state.existingPlaceView.place;
						},
						loggedIn() {
								return this.$store.state.user.loggedIn;
						},
						userName() {
							return this.$store.state.user.name;
						},
						placeNameURL() {
							return this.placeName
								.trim()
								.toLowerCase()
								.replace(/ /g,'-')
								.replace(/[^\w-]+/g,'')
								;

						},
						newPlaceURL () {
							return "www.weatherplane.com/" + this.userName + '/' + this.placeNameURL;
						}
				},
				created () {
					console.log("created");
				},
				mounted () {
					if (!this.placeSelected) {
						this.$router.push('/');	
					} else {
						if (!this.loggedIn) {
							this.$store.commit('USER_AUTHENTICATION_REQUIRED');
						} else {
							this.getListOfExistingPlaces();
						}
					}
				},

				watch: {
					placeName (val) {
						if (val != '') {
							this.nameAvailable = this.checkAvailAbility(val.trim());
						}
					}
				},
			
				methods: {
					onSubmit(event) {

						if(!this.nameAvailable) {
							return false;
						}

						this.$validator.validateAll().then(() => {

							let newPlace = {
								placeName : this.placeName.trim(),
								placeSlug : this.placeNameURL,
								_userID : this.userName,
								placeLat : this.activeLocation.placeLat,
								placeLng : this.activeLocation.placeLng,
								placeSettings : {
									public : this.placeIsPublic,
									runwayOrientation : this.activeLocation.placeSettings.runwayOrientation,
									maxWindSpeed : this.activeLocation.placeSettings.maxWindSpeed,
									maxCrossWindSpeed : this.activeLocation.placeSettings.maxCrossWindSpeed,
									minTemperature : this.activeLocation.placeSettings.minTemperature,
									maxTemperature : this.activeLocation.placeSettings.maxTemperature,
									maxPrecipProbability : this.activeLocation.placeSettings.maxPrecipProbability,
									maxWindBearingToRWY : this.activeLocation.placeSettings.maxWindBearingToRWY
								}
							}


							WPAPI.createPlace(newPlace).then(response => {
								if (response.data.success) {
									this.$emit('place-saved', this.userName + "/" + newPlace.placeSlug)
								} else {
									Vue.set(this.errors, 'placeNotSaved', true)
								}
							});
						});
					},
					getListOfExistingPlaces () {
						console.log("Going to load places");
						WPAPI.getUserPlaces(this.userName)
						.then(places => {
							this.placesList = places;
							console.log('Places Loaded', places);
						});
					},
					checkAvailAbility (newPlaceName) {


						var filtered = this.placesList.filter(function(item) {
							return item.placeName.toLowerCase() == newPlaceName.toLowerCase();
						});

						console.log('Filtered results',filtered.length);

						if (filtered.length != 0) {
							return false;
						} else {
							return true;
						}

						
					},
					updateHandler (publicPlace) {
						this.placeIsPublic = publicPlace.value;
					},
				},
				data () {
					return {
						errors: null,
						placeName: '',
						placeIsPublic: false,
						message: "Log in bro",
						placesList: [],
						nameAvailable: false,
						privacyOptions: [
							{
								label: 'Only me',
								value: false,
								active: true
							},
							{
								label: 'Anyone',
								value: true,
								active: false
							},
						],
					}
				}

		}



</script>
<style scoped>

</style>
