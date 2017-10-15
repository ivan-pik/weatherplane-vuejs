<template>
	<div class="weatherIcon">
	<svg  class="weatherIcon__image"
		v-if="icon!='not-available'"
		width="30" height="30"
		viewBox="0 0 80 80"
		:class="status"
	>
		<use
			y="-5"
			x="-12"
			:xlink:href="xlink">
		</use>
	</svg>
	<span
		class="weatherIcon__NA"
		v-if="icon=='not-available'"
	>N/A</span>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'weatherIcon',
		props: {
			icon : {
				type: String
			},
			precipProbability : {
				type: Number
			},
			precipIntensity : {
				type: Number
			},
			settingsMaxPrecipProbability : {
				type: Number
			},
			status : {
				type: String
			},
		},
		computed: {
			xlink () {
				let icon = this.icon;

				// There are 6 different rain icons
				// @todo: Make sure the values make sense
				if (icon === 'rain') {
					let prefix = "";
					let intensity = "";

					if (this.precipProbability < 0.5) {
						prefix = "part-";
					}

					if (this.precipIntensity <= 0.33) {
						intensity = "1";
					} else if (this.precipIntensity <= 0.66 ) {
						intensity = "2";
					} else {
						intensity = "3";
					}

					icon = `${prefix}${icon}${intensity}`
				}

				// Turn Sleet into Snow
				if (icon === 'sleet') {
					icon = 'snow';
				}



				return `/static/weather-icons.svg#${icon}`;
			}
		},

	 
		methods: {
		


		},
		data () {
		  return {
			
		  }
		}

	}



</script>

<style>
   
</style>
