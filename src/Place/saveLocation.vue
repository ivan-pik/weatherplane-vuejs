<template>
	<div class="">

		<login-view :message="message" v-if="!loggedIn" />

		<form v-else v-on:submit.prevent="onSubmit">

				<ui-text-input
					label="Location Name"
					name="newPassword"
					placeholder="New password"
					v-model="placeName"
					v-validate="{ rules: { required: true } }"
					data-vv-value-path="innerValue"
					:help="validationErrors.first('placeName')"
					:available="nameAvailable"
					:autocomplete="false"
					:autofocus="true"
				/>
				
				<ui-note
					v-if="nameAvailable"
				>
					You will be able to access the place quickly via
					{{newPlaceURL}}
				</ui-note>

				<ui-text-input-group>
					<ui-radio
						label="Who can access this place URL?"
						:radios="privacyOptions"
						v-on:change="updateHandler"
					/>
					<ui-note v-if="!placeIsPublic">
						You have to log-in to visit www.weatherplane.com/{{userName}}/{{placeNameURL}}
					</ui-note>
					<ui-note v-if="placeIsPublic">
						Anyone can visit www.weatherplane.com/{{userName}}/{{placeNameURL}}
					</ui-note>
				</ui-text-input-group>

				<ui-button
					v-if="nameAvailable" 
					text="Save"
					type="primary"
					:submit="true"
				/>
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
						WPAPI.getUserPlaces(this.userName)
						.then(places => {
							this.placesList = places;
						});
					},
					checkAvailAbility (newPlaceName) {


						var filtered = this.placesList.filter(function(item) {
							return item.placeName.toLowerCase() == newPlaceName.toLowerCase();
						});


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
