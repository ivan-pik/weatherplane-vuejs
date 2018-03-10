<template>
	<div 
		class="hourTemperature"
		:class="status"
	>
		{{temperatureDisplay}}&deg;
		
	</div>
</template>

<script>
	import Vue from 'vue';

  
	
	export default {
		name: 'temperature',
		props: {
			temperature : {
				type : Number
			},
			status : {
				type : String
			}
		},

		computed: {
			temperatureUnit () {
				return this.$store.state.globalApp.settings.temperatureUnit;
			},
			temperatureDisplay () {
				if (this.temperatureUnit == 'c') {
					return Math.round(this.temperature);
				} else {
					// @todo: check this is the correct mathgic
					return Math.round(this.temperature * 9 / 5 + 32);
				}
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

<style lang="scss">
	@import '~globalVars';
	// --------------------------------
	.hourTemperature {
		font-size: 12px;
		margin-right: $widthStatusBar;
		padding: 0 $widthGridSpace 0 0;
		min-width: 2em;
		text-align: right;

		&.yes {
			color: $statusYes;
		}
		&.no {
			color: $statusNo;
		}
	}
</style>
