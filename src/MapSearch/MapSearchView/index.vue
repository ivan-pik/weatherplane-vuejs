<template>
	<div class="viewWrapper">
		<navigation-header />

		<div class="viewWrapper__scroller">

			<place-input 
				v-if="!placeChosen" 
				v-on:suggestionHighlighted="suggestionHighlighted" 
				v-on:searching="searching=true"
			/>

			<ui-tabs
				v-if="placeChosen"
				:tabs="tabs"
			/>

			<div class="mapSearchView_wrapper">
				<location-map
					v-if="showMap"
					:place="place"
					:disableControls="this.tabs[0].active"
					v-on:placeSelected="saveActiveLocation"
				/>
				<bearing-selector
					:active="this.tabs[0].active"
					v-show="placeChosen"
					v-model="bearing"
				/>
			</div>
			
		</div>

		<div class="viewWrapper__bottom">
			<div class="uiButtonGroup">
				<button class="uiButton uiButton--primary" @click="choosePlace" v-if="place && !placeChosen">Confirm location</button>
				<button class="uiButton uiButton--primary" @click="setBearing" v-if="placeChosen">Continue</button>
			</div>
		</div>
		
	</div>

</template>
<script>
		import Vue from 'vue'
		import placeInput from '../placeInput/index.vue';
		import map from '../map/index.vue';
		import bearingSelector from '../bearingSelector.vue';
		import uiTabs from '../../uiComponents/tabs.vue';
		import navigationHeader from 'Navigation/navigationHeader.vue'
		import weatherPlaneIntro from 'Content/intro.vue'

		export default {
				name: 'MapSearchView',
				components: {
					'place-input' : placeInput,
					'location-map' : map,
					'bearing-selector' : bearingSelector,
					'ui-tabs' : uiTabs,
					'navigation-header' : navigationHeader,
					'weatherplane-intro' : weatherPlaneIntro
				},
				computed: {
						place() {
							return this.$store.state.placeSearch.place;
						},
						showMap () {
							if (this.place) {
								return true;
							} else {
								return false;
							}
						}
				},
				methods: {
					suggestionHighlighted (place) {
						this.$store.commit('PLACE_SEARCH_PLACE_SELECTED', place)
					},
					choosePlace () {
						this.placeChosen = true;
					},
					setBearing () {
						this.$store.commit('PLACE_SEARCH_BEARING', this.bearing)
						this.$router.push({ path: 'place' })
					},
					saveActiveLocation(coordinates) {
						this.$store.commit('LOCATION_SAVE_ACTIVE_LOCATION', coordinates);
					},
				},
				data () {
					return {
						placeChosen: false,
						bearing: 90,
						tabs: [
							{
								label: 'Runway Bearing',
								active: true,
							},
							{
								label: 'Move map',
								active: false
							}
						],
						searching: false,
					}
				}
		}



</script>
<style lang="scss">
	.appLogo {
		width: 160px;
	}

	.mapSearchView_wrapper {
		flex: 1 1 auto;
		position: relative;
		
	}
</style>
