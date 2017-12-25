<template>
	<div class="googleMap">


	<div id="map" ref="mapWraper">
		Map
	</div>



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
				disableControls: {
					type: Boolean
				}
			},
			created () {

				loadGoogleApi().then(function(googleApi) {

					this.googleApi = googleApi;

					this.mapWidget = new googleApi.Map(this.$refs.mapWraper, {
						center: {lat: -12.1430911, lng: -77.0227697},
						zoom: 16,
						// disableDefaultUI: true,
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

					let mapWidget = this.mapWidget;

					// place marker
					google.maps.event.addListener(mapWidget, 'click', (event) => {
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
				}
			},


			methods: {

				saveActiveLocation(coordinates) {
					this.$store.commit('LOCATION_SAVE_ACTIVE_LOCATION', coordinates);
				},

				placeMarker (location) {


					this.clearOverlays();

					// @todo: you are repeating yourself

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
						this.saveActiveLocation(coordinates);
					 });

					this.markersArray.push(marker);

					this.mapWidget.setCenter(location);

					let coordinates = {
						lat: marker.getPosition().lat(),
						lng: marker.getPosition().lng()
					}

					this.saveActiveLocation(coordinates);



				},

				clearOverlays () {
					for (var i = 0; i < this.markersArray.length; i++ ) {
						this.markersArray[i].setMap(null);
					}
					this.markersArray.length = 0;
				},

				updateMap () {
					var geocoder = new this.googleApi.Geocoder;
					geocoder.geocode({'placeId': this.place.place_id}, (results, status) => {
							if (status === 'OK') {
								if (results[0]) {
										this.mapWidget.setZoom(16);
										this.mapWidget.setCenter(results[0].geometry.location);

										// @todo: you are repeating yourself

										var marker = new this.googleApi.Marker({
											map: this.mapWidget,
											position: results[0].geometry.location,
											draggable: true
										});

										let coordinates = {
											lat: marker.getPosition().lat(),
											lng: marker.getPosition().lng()
										}


										this.saveActiveLocation(coordinates);

										google.maps.event.addListener(marker, 'dragend', function() { console.log('marker dragged'); } );


										this.markersArray.push(marker);
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

