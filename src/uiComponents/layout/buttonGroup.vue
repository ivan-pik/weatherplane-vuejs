<template>
	<div
		class="uiButtonGroup"
	>
		<slot />
	</div>
</template>

<script>
	export default {
		name: 'uiGroup',
		props: {

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
		display: flex;
		min-height: 40px;
		.uiButton:not(:last-child) {
			margin-right: 1px;
		}
	}

	.uiButtonGroup--gutter {
		padding: $widthGridLargerSpace;
	}
</style>
