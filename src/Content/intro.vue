<template>
	<div class="contentIntro">
			<h2>Weather Forecast for Model Pilots</h2>
			<p>
				Find your flying field, set your runway bearing and 
				easily check if the weather conditions are favourable for flying.
			</p>
	</div>
</template>

<script>

	export default {
		name: 'contentIntro',
		
		computed: {
			
		},
		methods: {
			
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss">
@import '~globalVars';

.contentIntro {
	text-align: center;
	padding: $widthGridLargerSpace;

	h2 {
		font-size: 0.8rem;
		font-weight: bold;
		margin: 0 0 0.5em 0;
	}
	p {
		font-size: 0.6rem;
		line-height: 1.4;
	}
}
</style>
