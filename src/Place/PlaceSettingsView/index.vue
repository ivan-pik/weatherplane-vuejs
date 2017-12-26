<template>
	<div class="placeSettingsView" v-if="place">
		<div class="mainNav">
			<h1 class="mainNav__title">Place Settings - {{place.placeName}}</h1>
		</div>

		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Place Name
			</h3>
			<setting-name 
				:value="place.placeName"
				v-on:updateSetting="updatePlaceName"
			/>
		</div>

		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Place URL
			</h3>
			<setting-url
				:value="place.placeSlug"
				v-on:updateSetting="updatePlaceSlug"
			/>
		</div>


		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Privacy
			</h3>
			<setting-privacy
				:value="place.placeSettings.public"
				v-on:updateSetting="updatePrivacy"
			/>
		</div>

		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Location
			</h3>
			<setting-location
				:value="[place.placeLat, place.placeLng]"
				v-on:updateSetting="updateCoordinates"
			/>
		</div>

		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Runway Bearing
			</h3>
			<setting-bearing
				:value="place.placeSettings.runwayOrientation"
				v-on:updateSetting="updateBearing"
			/>
		</div>

		<div class="uiGroup">
			<h3 class="uiGroup__title">
				Delete this Place
			</h3>
			<setting-delete
				v-on:deletePlace="deletePlace"
			/>
		</div>



		

	</div>
</template>

<script>
	import Vue from 'vue';
	import {HTTP} from '../../http-common';

	import WPAPI from '../../wpapi/index';

	import settingName from './settingName.vue';
	import settingURL from './settingURL.vue';
	import settingPrivacy from './settingPrivacy.vue';
	import settingLocation from './settingLocation.vue';
	import settingBearing from './settingBearing.vue';
	import settingDelete from './settingDelete.vue';
	
	export default {
		name: 'placeSettingsView',
		components: {
			'setting-name' : settingName,
			'setting-url' : settingURL,
			'setting-privacy' : settingPrivacy,
			'setting-location' : settingLocation,
			'setting-bearing' : settingBearing,
			'setting-delete' : settingDelete,
		},
		computed: {
			place () {
				return this.$store.state.existingPlaceView.place;
			}
		},
		mounted () {
			this.loadPlaceData();
		},
		watch: {
			'$route': function (route) {
				if (route.name == 'placeSettings') {
					this.loadPlaceData();
				}
				
			},
		},
		methods: {
			// @todo: DRY change to WPAPI :(
			loadPlaceData () {
				HTTP.get('places/'+this.$route.params.username + "/" + this.$route.params.place)
				.then(response => {
					if (response.data.success) {
						this.$store.commit('PLACE_SAVE_PLACE_DATA', response.data.data.place)
						this.saveOriginalSettings(response.data.data.place);
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
			},

			updatePlaceName (newName) {
				WPAPI.updatePlaceName(
					{
						placeName: newName,
						placeOID: this.place._id,
						userID: this.place._userID
					}
				).then((place) => {
					this.$store.commit('PLACE_SAVE_PLACE_DATA', place);
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Place name updated',
						type: 'success',
						dismiss: 'auto'
					});
				})
				.catch((error) => {
					if(this.errorCode("place-name-already-exists", error.errors)) {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Place name already exists',
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

			updatePlaceSlug (newSlug) {
				WPAPI.updatePlaceSlug(
					{
						placeSlug: newSlug,
						placeOID: this.place._id,
						userID: this.place._userID
					}
				).then((place) => {
					this.$store.commit('PLACE_SAVE_PLACE_DATA', place);
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Place URL updated',
						type: 'success',
						dismiss: 'auto'
					});
					this.$router.replace({ path: `/${this.place._userID}/${newSlug}/settings` });
				})
				.catch((error) => {
					if(this.errorCode("place-url-already-exists", error.errors)) {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Place url already exists',
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

			updatePrivacy (publicSetting) {
				WPAPI.updatePlacePrivacy(
					{
						placePrivacy: publicSetting,
						placeOID: this.place._id,
						userID: this.place._userID
					}
				).then((place) => {
					this.$store.commit('PLACE_SAVE_PLACE_DATA', place);
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Place privacy updated',
						type: 'success',
						dismiss: 'auto'
					});
				})
				.catch((error) => {
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Ooops, something went wrong',
						type: 'error',
					});
				});
			},

			updateCoordinates (coordinates) {
				WPAPI.updatePlaceCoordinates(
					{
						coordinates: {
							lat: coordinates.lat,
							lng: coordinates.lng
						},
						placeOID: this.place._id,
						userID: this.place._userID
					}
				).then((place) => {
					this.$store.commit('PLACE_SAVE_PLACE_DATA', place);
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Place coordinates updated',
						type: 'success',
						dismiss: 'auto'
					});
				})
				.catch((error) => {
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Ooops, something went wrong',
						type: 'error',
					});
				});
			},

			updateBearing (newBearing) {
				WPAPI.updatePlaceBearing(
					{
						bearing: newBearing,
						placeOID: this.place._id,
						userID: this.place._userID
					}
				).then((place) => {
					this.$store.commit('PLACE_SAVE_PLACE_DATA', place);
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Runway bearing updated',
						type: 'success',
						dismiss: 'auto'
					});
				})
				.catch((error) => {
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Ooops, something went wrong',
						type: 'error',
					});
				});
			},

			deletePlace () {
				WPAPI.deletePlace(
					{
						placeOID: this.place._id
					}
				).then((place) => {
					this.$store.commit('PLACE_SAVE_PLACE_DATA', {});

					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Place is deleted',
						type: 'success',
						dismiss: 'auto'
					});

					this.$router.push({ path: `/${this.$route.params.username}/` });
				})
				.catch((error) => {
					this.$store.commit('GLOBAL_ADD_MESSAGE', {
						text: 'Ooops, something went wrong',
						type: 'error',
					});
				});
			},

			saveOriginalSettings (place) {
				this.originalPlace = this.deep_copy(place);
			},
			deep_copy (obj) {
				// @todo: make object spread operator working with babel/webpack
				return JSON.parse(JSON.stringify(obj));
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
				originalPlace: {},
				nameAvailable: false
			}
		}
	}

</script>