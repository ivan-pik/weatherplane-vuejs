<template>
	<div
		class="uiButtonGroup"
		:class="{
			'uiButtonGroup--show' : show,
			'uiButtonGroup--collapseHeight' : collapseHeight
		}"
	>
		<div class="uiButtonGroup__collapser">
			<slot />
		</div>
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
			collapseHeight: {
				type: Boolean,
				default: true
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
	.uiButtonGroup {
		height: 40px;
		.uiButtonGroup__collapser {
			height: 0px;
			overflow: hidden;
			display: flex;
			transition: all 100ms ease-in-out;
		}
	}

	.uiButtonGroup--collapseHeight {
		height: auto;		
	}

	.uiButtonGroup--gutter {
		padding: $widthGridLargerSpace;
	}

	.uiButtonGroup--show {
		.uiButtonGroup__collapser {
			height: 40px;
		}
	}


</style>
