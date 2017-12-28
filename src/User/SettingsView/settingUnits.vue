<template>
	<div class="userSetting userSetting--password">

		@todo: use browser locales to get the best initial Setting
		@todo: note that these need to work for logged out / new places as well


		



		<ui-radio
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
	import uiRadio from '../../uiComponents/buttonRadio.vue';

	export default {
		name: 'settingUnits',
		props: {
			
		},
		components: {
			'ui-radio' : uiRadio
		},
		mounted () {
		},
		watch: {
		
		},
		computed: {
		},
		methods: {
			updateTemperatureSetting (value) {
				console.log(value.value);
				// @todo: update settings
			},
			updateTimeFormatSetting (value) {
				console.log(value.value);
				// @todo: update settings
			},
			updateWindUnitSetting (value) {
				console.log(value.value);
				// @todo: update settings
			},
			updateDateFormatSetting (value) {
				console.log(value.value);
				// @todo: update settings
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
						active: true
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
						active: true
					}
				],
				windUnitOptions: [
					{
						label: 'm/s',
						value: 'meters-per-second',
						active: true
					},
					{
						label: 'km/h',
						value: 'kilometers-per-hour',
						active: false
					},
					{
						label: 'mph',
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
						active: true
					},
				]
			}
		}
	}


</script>