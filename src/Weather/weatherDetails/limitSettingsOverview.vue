<template>
	<div class="limitSettingsOverview">
		<button class="limitSettingsOverview__button"
			@click="buttonClicked"
		>
			<svg width="3px" height="13px" viewBox="0 0 3 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<path d="M1.5,3 C0.671572875,3 0,2.32842712 0,1.5 C0,0.671572875 0.671572875,0 1.5,0 C2.32842712,0 3,0.671572875 3,1.5 C3,2.32842712 2.32842712,3 1.5,3 Z M1.5,13 C0.671572875,13 0,12.3284271 0,11.5 C0,10.6715729 0.671572875,10 1.5,10 C2.32842712,10 3,10.6715729 3,11.5 C3,12.3284271 2.32842712,13 1.5,13 Z M1.5,8 C0.671572875,8 0,7.32842712 0,6.5 C0,5.67157288 0.671572875,5 1.5,5 C2.32842712,5 3,5.67157288 3,6.5 C3,7.32842712 2.32842712,8 1.5,8 Z" id="path-1"></path>
			</svg>
			Max Limits
		</button>
		<div class="limitSettingsOverview__param limitSettingsOverview__param--windSpeed">
			<svg width="22px" height="14px" viewBox="0 0 22 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<path d="M18.9995,8 L18.9995,8 L17.4995,8 C16.947,8 16.4995,7.5525 16.4995,7.0005 C16.4995,6.4485 16.947,6.0005 17.4995,6.0005 L18.9995,6.0005 C19.5515,6.0005 19.9995,5.5525 19.9995,5.001 C19.9995,4.4485 19.5515,4.001 18.9995,4.001 C18.447,4.001 17.9995,3.553 17.9995,3.001 C17.9995,2.449 18.447,2.001 18.9995,2.001 C19.068,2.001 19.135,2.008 19.2005,2.0215 C20.761,2.127 21.9985,3.413 21.9985,5.001 C21.9985,6.657 20.656,8 18.9995,8 Z M13.9995,6.0005 L12.9995,6.0005 L9.5005,6.0005 L3.001,6.0005 C2.449,6.0005 2.0015,6.4485 2.0015,7.0005 C2.0015,7.5525 2.449,8 3.001,8 L4.001,8 L6.0005,8 L7.5005,8 L9.5005,8 L11.0005,8 L12.9995,8 L13.9995,8 C15.6565,8 16.9995,9.3435 16.9995,11 C16.9995,12.588 15.762,13.874 14.2015,13.9795 C14.136,13.993 14.069,14 13.9995,14 C13.4475,14 12.9995,13.552 12.9995,13 C12.9995,12.4475 13.4475,12 13.9995,12 C14.552,12 14.9995,11.552 14.9995,11 C14.9995,10.448 14.552,10 13.9995,10 L12.9995,10 L11.0005,10 L9.5005,10 L7.5005,10 L6.0005,10 L4.001,10 L3.001,10 C1.3445,10 0.0015,8.657 0.0015,7.0005 C0.0015,5.413 1.239,4.127 2.7995,4.021 C2.865,4.008 2.9325,4.001 3.001,4.001 L3.001,4.001 L9.5005,4.001 L12.9995,4.001 L13.9995,4.001 C14.552,4.001 14.9995,3.553 14.9995,3.001 C14.9995,2.449 14.552,2.001 13.9995,2.001 C13.4475,2.001 12.9995,1.5535 12.9995,1.001 C12.9995,0.449 13.4475,0.001 13.9995,0.001 C14.069,0.001 14.136,0.0085 14.2015,0.0215 C15.762,0.127 16.9995,1.413 16.9995,3.001 C16.9995,4.657 15.6565,6.0005 13.9995,6.0005 Z" id="Shape"></path>
			</svg>
			<h3 class="limitSettingsOverview__label">Wind Speed</h3>
			<p class="limitSettingsOverview__value">{{settingsMaxWindSpeed}} ms</p>
		</div>
		<div class="limitSettingsOverview__param limitSettingsOverview__param--crossWind">
			<svg width="24px" height="14px" viewBox="0 0 24 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<path d="M23.25,2.96774194 L6.75,0 C6.59625,0 6.4485,0.0793870968 6.30825,0.229258065 L0.974975586,4.19935484 L0.974975586,2.96774194 C0.974975586,2.55967742 1.167,2.22580645 0.75,2.22580645 C0.33525,2.22580645 0,2.55151613 0,2.96477419 L0,13.5977022 C0,14.0065086 0.368522461,13.9716797 0.785522461,13.9716797 C1.20027246,13.9716797 0.974975586,14.0109602 0.974975586,13.5977022 L0.974975586,6.16177419 L6.28875,10.1370645 C6.43425,10.2995484 6.58875,10.3870968 6.75,10.3870968 L23.25,7.41935484 C23.66475,7.41935484 24,6.42293548 24,5.19354839 C24,3.96416129 23.66475,2.96774194 23.25,2.96774194 Z M5.62125,8.61387097 L1.5,5.19354839 L1.5,5.16832258 L5.6295,1.74058065 C5.39325,2.65835484 5.25,3.86770968 5.25,5.19354839 C5.25,6.50380645 5.39025,7.70054839 5.62125,8.61387097 Z M7.125,9.64516129 C6.504,9.64516129 6,7.65158065 6,5.19354839 C6,2.73551613 6.504,0.741935484 7.125,0.741935484 C7.746,0.741935484 8.25,2.73551613 8.25,5.19354839 C8.25,7.65158065 7.746,9.64516129 7.125,9.64516129 Z M15,8.16129032 L11.51625,8.85054839 C11.80875,8.04629032 12,6.70858065 12,5.19354839 C12,3.67851613 11.80875,2.34080645 11.51625,1.53654839 L15,2.22580645 C15.41475,2.22580645 15.75,3.5546129 15.75,5.19354839 C15.75,6.83248387 15.41475,8.16129032 15,8.16129032 Z M21.75,7.0483871 L19.04175,7.58480645 C19.32,7.04393548 19.5,6.1743871 19.5,5.19354839 C19.5,4.21270968 19.32,3.34316129 19.04175,2.80229032 L21.75,3.33870968 C21.95625,3.33870968 22.125,4.16893548 22.125,5.19354839 C22.125,6.21816129 21.95625,7.0483871 21.75,7.0483871 Z" id="Shape"></path>
			</svg>
			<h3 class="limitSettingsOverview__label">Cross Wind</h3>
			<p class="limitSettingsOverview__value">{{settingsMaxCrossWindSpeed}} ms</p>
		</div>
		<div class="limitSettingsOverview__param limitSettingsOverview__param--windDirection">
			<svg width="22px" height="22px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<path d="M11,20 C6.038,20 2,15.963 2,11 C2,6.038 6.038,2 11,2 C15.963,2 20,6.038 20,11 C20,15.963 15.963,20 11,20 M11,0 C4.9346,0 0,4.9346 0,11 C0,17.0654 4.9346,22 11,22 C17.0654,22 22,17.0654 22,11 C22,4.9346 17.0654,0 11,0" id="Fill-1"></path>
				<polygon id="Triangle-3" points="9.98997852 10.8361123 17.8807525 3.5655619 21.3159014 10.8361123 18.1950691 19.2544306"></polygon>
			</svg>
			<h3 class="limitSettingsOverview__label">Wind Direction</h3>
			<p class="limitSettingsOverview__value">± {{settingsMaxWindBearingToRWY}}&deg;</p>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	
	export default {
		name: 'limitSettingsOverview',
		props: {
			
		},
		computed: {
			// @todo: this to come from props
			settingsMaxWindSpeed () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxWindSpeed);
			},
			settingsMaxCrossWindSpeed () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxCrossWindSpeed);
			},
			settingsMaxWindBearingToRWY () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.maxWindBearingToRWY);
			},
			settingsRunwayOrientation () {
				return parseFloat(this.$store.state.existingPlaceView.place.placeSettings.runwayOrientation);
			},
			settingsMinTemperature () {
				return this.$store.state.existingPlaceView.place.placeSettings.minTemperature;
			},
			settingsMaxTemperature () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxTemperature;
			},
			settingsMaxPrecipProbability () {
				return this.$store.state.existingPlaceView.place.placeSettings.maxPrecipProbability;
			},
		},
	 
		methods: {
			buttonClicked () {
				this.$emit('buttonClicked');
			}
		},
		
		data () {
		  return {
		  }
		}

	}
</script>

