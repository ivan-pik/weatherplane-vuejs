<template>
	<div class="userSetting userSetting--units">
		<!-- @todo: date format options -->
		<ui-radio
			v-if="false"
			:radios="dateFormatOptions"
			v-on:change="updateDateFormatSetting"
		>
		<label slot="label">Date Format</label>
		</ui-radio>

		<ui-radio
			:radios="windUnitOptions"
			v-on:change="updateWindUnitSetting"
		>
		<label slot="label">Wind Unit</label>
		</ui-radio>

		<ui-radio
			:radios="timeFormatOptions"
			v-on:change="updateTimeFormatSetting"
		>
		<label slot="label">Time Format</label>
		</ui-radio>

		<ui-radio
			:radios="temperatureOptions"
			v-on:change="updateTemperatureSetting"
		>
		<label slot="label">Temperature Unit</label>
		</ui-radio>

		
	</div>
</template>

<script>
	import Vue from 'vue';
	import WPAPI from '../../wpapi/index';
	import uiRadio from '../../uiComponents/buttonRadio.vue';

	export default {
		name: 'settingUnits',
		props: {
			
		},
		components: {
			'ui-radio' : uiRadio
		},
		mounted () {
			this.setDefaults();
		},
		watch: {
			windUnit () {
				this.setDefaults();
			},
			timeFormat () {
				this.setDefaults();
			},
			temperatureUnit () {
				this.setDefaults();
			}
		},
		computed: {
			loggedIn() {
				return this.$store.state.user.loggedIn;
			},
			settings() {
				return this.$store.state.globalApp.settings;
			},
			windUnit() {
				return this.$store.state.globalApp.settings.windUnit;
			},
			timeFormat() {
				return this.$store.state.globalApp.settings.timeFormat;
			},
			temperatureUnit() {
				return this.$store.state.globalApp.settings.temperatureUnit;
			},
		},
		methods: {

			setDefaults () {
				this.setActiveOption(this.temperatureOptions, this.temperatureUnit);
				this.setActiveOption(this.timeFormatOptions, this.timeFormat);
				this.setActiveOption(this.windUnitOptions, this.windUnit);
			},

			setActiveOption (radios,activeValue) {
				radios.forEach(radio => {
					if (radio.value == activeValue) {
						radio.active = true;
					}
				});
			},

			updateTemperatureSetting (value) {
				this.$store.commit('GLOBAL_SET_TEMPERATURE_UNIT', value.value );

				if (this.loggedIn) {
					WPAPI.updateTemperatureUnit(
						{
							temperatureUnit: value.value}
					).then((user) => {

						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Temperature unit updated',
							type: 'success',
							dismiss: 'auto'
						});
						this.valueChanged = false;
					})
					.catch((error) => {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Ooops, something went wrong',
							type: 'error',
						});
					});
				}

			
			},
			updateTimeFormatSetting (value) {
				this.$store.commit('GLOBAL_SET_TIMEFORMAT', value.value );

				if (this.loggedIn) {
					WPAPI.updateTimeFormat(
					{
						timeFormat: value.value,
					}
					).then((user) => {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Time Format updated',
							type: 'success',
							dismiss: 'auto'
						});
						this.valueChanged = false;
					})
					.catch((error) => {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Ooops, something went wrong',
							type: 'error',
						});
					});
				}

				
			},
			updateWindUnitSetting (value) {
				this.$store.commit('GLOBAL_SET_WINDUNIT', value.value );

				if (this.loggedIn) {
					WPAPI.updateWindUnit(
					{
						windUnit: value.value,
					}
					).then((user) => {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Wind unit updated',
							type: 'success',
							dismiss: 'auto'
						});
						this.valueChanged = false;
					})
					.catch((error) => {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Ooops, something went wrong',
							type: 'error',
						});
					});
				}
			},
			updateDateFormatSetting (value) {
				this.$store.commit('GLOBAL_SET_DATEFORMAT', value.value );

				if (this.loggedIn) {
					WPAPI.updateDateFormat(
					{
						dateFormat: value.value,
					}
					).then((user) => {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Date format updated',
							type: 'success',
							dismiss: 'auto'
						});
						this.valueChanged = false;
					})
					.catch((error) => {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Ooops, something went wrong',
							type: 'error',
						});
					});
				}
			}
		},
		data () {
			return {
				temperatureOptions: [
					{
						label: '°F',
						value: 'f',
						active: false
					},
					{
						label: '°C',
						value: 'c',
						active: false
					}
				],
				timeFormatOptions: [
					{
						label: '12 Hours',
						value: '12-hours',
						active: false
					},
					{
						label: '24 Hours',
						value: '24-hours',
						active: false
					}
				],
				windUnitOptions: [
					{
						label: 'meters/s',
						value: 'meters-per-second',
						active: false
					},
					{
						label: 'kilometers/h',
						value: 'kilometers-per-hour',
						active: false
					},
					{
						label: 'miles/h',
						value: 'miles-per-hour',
						active: false
					}
				],
				// @todo: make a list of sensible date formats
				dateFormatOptions: [
					{
						label: '03-25 Wed',
						value: 'meters-per-second',
						active: false
					},
					{
						label: '03/25 Wed',
						value: 'meters-per-second',
						active: false
					},
					{
						label: 'March 25 Wed',
						value: 'meters-per-second',
						active: false
					},
				]
			}
		}
	}


</script>