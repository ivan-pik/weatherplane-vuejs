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
					class="help is-danger">{{ validationErrors.first('placeName') }}
				</span>
			</div>

			
			<br>

			<p>You will be able to access the place quickly via</p>
			<p>{{newPlaceURL}}</p>

			<br>

			<label for="placeIsPublic">
			<input
				class="uiCheckBox"
				id="placeIsPublic"
				name="placeIsPublic"
				type="checkbox"
				v-model="placeIsPublic"
			/>
			Make this place URL public
			</label>
			<br>
			<small>
				You (and anyone) can access this place without having to log-in
			</small>

		

			<button type="submit" class="uiButton">Save</button>
		</form>
	</div>

</template>
<script>
		import Vue from 'vue';

		import WPAPI from '../../wpapi/index';
		import loginView from '../../Login/LoginView/index.vue';

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
					debugger;
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

							debugger;

							WPAPI.createPlace(newPlace).then(response => {
								if (response.data.success) {
									this.$router.push(this.userName + "/" + newPlace.placeSlug);
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

						
					}
				},
				data () {
					return {
						errors: null,
						placeName: '',
						placeIsPublic: false,
						message: "Log in bro",
						placesList: [],
						nameAvailable: false
					}
				}

		}



</script>
<style scoped>

</style>
