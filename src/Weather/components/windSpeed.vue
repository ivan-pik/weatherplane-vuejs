<template>
	<div class="hourWindSpeed">
		<div :class="windSpeedStatus" class="hourWindSpeed__display hourWindSpeed__display--speed">{{windSpeedDisplay}}</div>
		<div :class="windGustStatus" v-if="displayGust" class="hourWindSpeed__display hourWindSpeed__display--gust">{{windGustDisplay}}</div>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	
	export default {
		name: 'windSpeed',
		props: ['windSpeed','windGust','windSpeedStatus','windGustStatus'],
		computed: {
			displayGust () {
				return ( this.windSpeed.toFixed() != this.windGust.toFixed() );
			},
			windUnit () {
				return this.$store.state.globalApp.settings.windUnit;
			},
			windSpeedDisplay () {
				return Math.round(this.convertWindSpeedUnit(this.windSpeed));
			},
			windGustDisplay () {
				return Math.round(this.convertWindSpeedUnit(this.windGust));
			},
		},
	 
		methods: {
			convertWindSpeedUnit (ms) {
				if (this.windUnit == 'meters-per-second') {
					return ms.toFixed(1);
				} else if (this.windUnit == 'kilometers-per-hour') {
					return (ms * 3.6).toFixed(1);
				} else if (this.windUnit == 'miles-per-hour') {
					return (ms * 2.2369).toFixed(1);
				}
			}
		},
		data () {
		  return {
			
		  }
		}

	}



</script>

<style lang="scss">
@import '~globalVars';

// --------------------------------
$hourWindSpeed__size: 2.4em;
$hourGustSpeed__size: 1.4em;

.hourWindSpeed {
	display: inline-flex;
	align-items: center;
	width: ($hourWindSpeed__size*1.6);

}



.hourWindSpeed__display {
	color: $textColourStatus;


	text-align: center;

	&.yes {
		background: $statusYes;
	}

	&.no {
		background: $statusNo;
	}
}

.hourWindSpeed__display--speed {
	font-size: 12px;
	border-radius: 50%;
	width: $hourWindSpeed__size;
	height: $hourWindSpeed__size;
	line-height: $hourWindSpeed__size;
}


.hourWindSpeed__display--gust {
	font-size: 10px;
	width: $hourGustSpeed__size;
	// height: $hourGustSpeed__size;
	margin-left: 0.4em;
	line-height: 2;
	background: none !important;
	
	position: relative;
	&::after {
		content: '';
		display: block;
		height: 2px;
		width: 100%;
		position: absolute;
		bottom: 0;
	}

	&.yes {
		color: $statusYes;
		&::after {
			background: $statusYes;
		}
	}

	&.no {
		color: $statusNo;
		&::after {
			background: $statusNo;
		}
	}
}

</style>
