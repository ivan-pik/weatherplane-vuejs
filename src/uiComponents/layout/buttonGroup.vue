<template>
	<div
		class="uiButtonGroup"
		:class="{
			'uiButtonGroup--show' : show,
			'uiButtonGroup--hide' : !show,
		}"
	>
		<slot />
	</div>
</template>

<script>
	export default {
		name: 'uiGroup',
		props: {
			show: {
				type: Boolean,
				default: true
			},
		},
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	@import '~globalVars';
	.uiButtonGroup {
		height: 50px;
		display: flex;
		transition: all 200ms ease-in-out;

		.uiButton {
			flex: 0 1 auto;
		}
	}

	.uiButtonGroup--hide {
		filter: grayscale(100%);
		opacity: 0.3;
		pointer-events: none;
	}

	.uiButtonGroup--show {
		opacity: 1;
		pointer-events: all;
	}


</style>
