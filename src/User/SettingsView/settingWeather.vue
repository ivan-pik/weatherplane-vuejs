<template>
	<div class="userSetting userSetting--units">
		<ui-slider
			:label="`Get weather for ${newWeatherRange} days ahead`"
			:minValue="1"
			:maxValue="7"
			v-model="newWeatherRange"
			:step="1"
			v-on:change="updateWeatherRange"
			:unit="'day'"
			:unitPlural="'days'"
		/>
		<ui-note>
			@todo: copy Please note, that the forecast reliability is worse 
		</ui-note>
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
				this.newWeatherRange = this.weatherRange;
			},
			updateWeatherRange (value) {
				this.newWeatherRange = value;

				this.$store.commit('GLOBAL_SET_WEATHER_RANGE', value );

				if (this.loggedIn) {
					WPAPI.updateWeatherRange(
						{
							weatherRange: value,
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
				newWeatherRange: null
			}
		}
	}
</script>