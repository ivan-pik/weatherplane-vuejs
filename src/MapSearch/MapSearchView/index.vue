<template>
		<div class="">

			
			<place-input v-if="!placeChosen" v-bind:placeInput="place"></place-input>

			<ul v-if="placeChosen" class="uiTabs">
				<li class="active">
						<span>Bearing</span>
				</li>
				<li>
					<a class="" @click="placeChosen=false">Adjust map</a>
				</li>
			</ul>
			
			<location-map
				v-if="showMap"
				:place="place"
			/>

			<bearing-selector v-if="placeChosen" />

			<button @click="choosePlace">Choose this place</button>

		</div>

</template>
<script>
		import Vue from 'vue'
		import placeInput from '../placeInput/index.vue';
		import map from '../map/index.vue';
		import bearingSelector from '../bearingSelector.vue';

		export default {
				name: 'MapSearchView',
				components: {
					'place-input' : placeInput,
					'location-map' : map,
					'bearing-selector' : bearingSelector
				},
				created: function () {
					this.$on('placeSelected', selectedPlace => {
						this.$store.commit('PLACE_SEARCH_PLACE_SELECTED', selectedPlace)
					 });
				},
				computed: {
						place() {
								return this.$store.state.placeSearch.place;
						},
						showMap () {
							if (this.place.description) {
								return true;
							} else {
								return false;
							}
						}
				},
				methods: {
					choosePlace () {
						this.placeChosen = true;
					}
				},
				data () {
					return {
						placeChosen: false
					}
				}
		}



</script>
<style scoped>

</style>
