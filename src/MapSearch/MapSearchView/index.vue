<template>
		<div class="">
			<place-input v-if="!placeChosen" v-bind:placeInput="place"></place-input>
			<ui-tabs
				v-if="placeChosen"
				:tabs="tabs"
			/>

			<div class="mapSearchView_wrapper">
				<location-map
					v-if="showMap"
					:place="place"
					:disableControls="this.tabs[0].active"
				/>
				<bearing-selector
					:active="this.tabs[0].active"
					v-show="placeChosen"
					v-model="bearing"
				/>
			</div>

			<button @click="choosePlace" v-if="!placeChosen">Choose this place</button>
			<button @click="setBearing" v-if="placeChosen">Set Bearing</button>

		</div>

</template>
<script>
		import Vue from 'vue'
		import placeInput from '../placeInput/index.vue';
		import map from '../map/index.vue';
		import bearingSelector from '../bearingSelector.vue';
		import uiTabs from '../../uiComponents/tabs.vue';

		export default {
				name: 'MapSearchView',
				components: {
					'place-input' : placeInput,
					'location-map' : map,
					'bearing-selector' : bearingSelector,
					'ui-tabs' : uiTabs
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
					},
					setBearing () {
						this.$store.commit('PLACE_SEARCH_BEARING', this.bearing)
						this.$router.push({ path: 'place' })
					}
				},
				data () {
					return {
						placeChosen: false,
						bearing: 90,
						tabs: [
							{
								label: 'Set Bearing',
								active: true,
							},
							{
								label: 'Adjust map',
								active: false
							}
						]
					}
				}
		}



</script>
<style scoped>

</style>
