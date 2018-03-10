<template>
	<div class="googleMap">

		<div id="map" ref="mapWraper"></div>

	</div>
</template>

<script>
		import Vue from 'vue'
		import {loadGoogleApi} from '../../libs/googleApi.js';

		export default {
			name: 'mapWidget',
			props: {
				// Pass either Google Place Obj. or coordinates to display on the map
				place: {
					type: Object // Google Place Object
				},
				coordinates: { // [lat,lng]
					type: Array 
				},
				disableControls: { // Remove Google Maps Controls
					type: Boolean
				},
			},
			created () {

				loadGoogleApi().then(function(googleApi) {

					this.googleApi = googleApi;

					this.mapWidget = new googleApi.Map(this.$refs.mapWraper, {
						center: {lat: -12.1430911, lng: -77.0227697},
						zoom: 16,
						streetViewControl: false,
						mapTypeId: 'satellite',
						rotateControl: false,
						scaleControl: true,
						zoomControl: true,
						mapTypeControl: true,
						fullscreenControl: false,
						mapTypeControlOptions: {
							style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
							mapTypeIds: ['roadmap', 'terrain', 'hybrid', 'satellite']
						}
					});

					// place marker on click
					google.maps.event.addListener(this.mapWidget, 'click', (event) => {
						 this.placeMarker(event.latLng);

						let coordinates = {
							lat: event.latLng.lat(),
							lng: event.latLng.lng()
						}
						this.emitLocation(coordinates);
					 });

					// Map can display position of Google Place object or Coordinates
					if (this.place) {
						this.getLocationOfGooglePlaceObject(this.place);
					} else if (this.coordinates) {
						this.updateMap({
							lat: this.coordinates[0],
							lng: this.coordinates[1]
						});
					}
				}.bind(this), function(error) {
					console.error("Failed!", error);
				});
			},
			watch: {
				place (place) {
					this.getLocationOfGooglePlaceObject(place);
				},
				coordinates (coordinates) {
					this.updateMap({
						lat: coordinates[0],
						lng: coordinates[1]
					});
				},
				disableControls (val) {
					if (val) {
						this.mapWidget.set('zoomControl', false);
						this.mapWidget.set('mapTypeControl', false);
					} else {
						this.mapWidget.set('zoomControl', true);
						this.mapWidget.set('mapTypeControl', true);
					}
				},
			},

			methods: {
				emitLocation(coordinates) {
					this.$emit('placeSelected', coordinates);
				},

				placeMarker (location) {

					this.clearOverlays();

					var marker = new google.maps.Marker({
							position: location,
							map: this.mapWidget,
							draggable: true
					});

					google.maps.event.addListener(marker, 'dragend', (event) => {
						let coordinates = {
							lat: marker.getPosition().lat(),
							lng: marker.getPosition().lng()
						}
						this.emitLocation(coordinates);
					});

					this.markersArray.push(marker);

					this.mapWidget.setCenter(location);

				},

				clearOverlays () {
					this.markersArray.forEach(marker => {
						marker.setMap(null);
					})
				},

				getLocationOfGooglePlaceObject (place) {
					var geocoder = new this.googleApi.Geocoder;
					geocoder.geocode({'placeId': this.place.place_id}, (results, status) => {
						if (status === 'OK') {
							if (results[0]) {
									// this.mapWidget.setZoom(16);
									// this.mapWidget.setCenter(results[0].geometry.location);
									// this.placeMarker(results[0].geometry.location);

									this.updateMap(results[0].geometry.location);
									
									let coordinates = {
										lat: results[0].geometry.location.lat(),
										lng: results[0].geometry.location.lng()
									}
									this.emitLocation(coordinates);
									

									
							} else {
									// @todo: No results found
							}
						} else {
							console.error('Geocoder failed due to: ' + status);
						}
					});
				},

				updateMap (location) {
					

					this.displayMap = true;
					this.mapWidget.setZoom(16);
					this.mapWidget.setCenter(location);
					this.placeMarker(location);
				}
			},
			data() {
				return {
					markersArray: [],
					firstRun: true
				}
			}
		}

</script>

<style lang="scss">
	.googleMap {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		#map {
			position: absolute !important;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}
	}
</style>
