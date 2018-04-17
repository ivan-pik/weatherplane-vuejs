<template>
	<div class="rainIcon">
	<svg  class="rainIcon__image"
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
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'rainIcon',
		props: {
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
				let icon = 'rain';

				// @todo: Make sure the values make sense
				let prefix = "";
				let intensity = "";

				if (this.precipProbability < 0.15) {
					prefix = "part-";
				}

				if (this.precipIntensity <= 0.20) {
					intensity = "1";
				} else if (this.precipIntensity <= 0.30 ) {
					intensity = "2";
				} else {
					intensity = "3";
				}

				icon = `${prefix}${icon}${intensity}`


				return `/static/weather-icons.svg#${icon}`;
			}
		},
	}



</script>

<style lang="scss">

@import '~globalVars';

.rainIcon {
	width: 24px;
	height: 36px;
	text-align: center;
}

.rainIcon__image {
	&.yes {
		fill: $statusYes;
	}
	&.no {
		fill: $statusNo;
	}
}

</style>
