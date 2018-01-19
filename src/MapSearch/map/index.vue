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
				place: {
					type: Object
				},
				coordinates: {
					type: Array 
				},
				disableControls: {
					type: Boolean
				},
				lockMarker: {
					type: Boolean
				}
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
					 });

					this.updateMap();

				}.bind(this), function(error) {
					console.error("Failed!", error);
				});
			},

			watch: {
				place () {
					this.updateMap();
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
				lockMarker (lockMarker) {
					if (lockMarker) {

					}
				}
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

					let coordinates = {
						lat: marker.getPosition().lat(),
						lng: marker.getPosition().lng()
					}

					this.emitLocation(coordinates);

					this.markersArray.push(marker);

					this.mapWidget.setCenter(location);

					this.emitLocation(coordinates);

				},

				clearOverlays () {
					this.markersArray.forEach(marker => {
						marker.setMap(null);
					})
				},

				updateMap () {
					var geocoder = new this.googleApi.Geocoder;
					geocoder.geocode({'placeId': this.place.place_id}, (results, status) => {
						if (status === 'OK') {
							if (results[0]) {
									this.mapWidget.setZoom(16);
									this.mapWidget.setCenter(results[0].geometry.location);

									this.placeMarker(results[0].geometry.location);
									
							} else {
									// @todo: No results found
							}
						} else {
							console.error('Geocoder failed due to: ' + status);
						}
					});
				}
			},
			data() {
				return {
					markersArray: []
				}
			}
		}

</script>

