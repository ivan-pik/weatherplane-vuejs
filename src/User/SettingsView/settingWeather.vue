<template>
	<div class="userSetting userSetting--units">
		<ui-radio
			:radios="weatherRangeRadios"
			v-on:change="updateWeatherRange"
		>
			<label slot="label">Days ahead</label>
		</ui-radio>

		
		
	</div>
</template>

<script>
	import Vue from 'vue';
	import WPAPI from '../../wpapi/index';
	import uiRadio from '../../uiComponents/buttonRadio.vue';

	export default {
		name: 'settingWeather',
		components: {
			'ui-radio' : uiRadio
		},
		mounted () {
			this.setDefaults();
		},
		watch: {
			weatherRange () {
				this.setDefaults();
			},
		},
		computed: {
			loggedIn() {
				return this.$store.state.user.loggedIn;
			},
			userID () {
				return this.$store.state.user.name;
			},
			weatherRange () {
				return this.$store.state.globalApp.settings.weatherRange;
			},
		},
		methods: {
			setDefaults () {
				this.setActiveOption(this.weatherRangeRadios, this.weatherRange);
			},
			setActiveOption (radios,activeValue) {
				radios.forEach(radio => {
					if (radio.value == activeValue) {
						radio.active = true;
					}
				});
			},
			updateWeatherRange (value) {
				this.$store.commit('GLOBAL_SET_WEATHER_RANGE', value.value );

				if (this.loggedIn) {
					WPAPI.updateWeatherRange(
						{
							weatherRange: value.value,
							userID: this.userID
						}
					).then((user) => {
						this.$store.commit('GLOBAL_ADD_MESSAGE', {
							text: 'Weather range updated',
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
				}
			},
		
		
	
		},
		data () {
			return {
				weatherRangeRadios: [
					{
						label: '1 day',
						value: 1,
						active: false
					},
					{
						label: '2 days',
						value: 2,
						active: false
					},
					{
						label: '3 days',
						value: 3,
						active: false
					}
				],
			}
		}
	}
</script>