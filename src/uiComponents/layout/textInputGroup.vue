<template>
	<div
		class="uiTextInputGroup"
	>
		<slot />
	</div>
</template>

<script>
	export default {
		name: 'uiTextInputGroup',
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	@import '~globalVars';

	.uiTextInputGroup {
		display: block;
		margin: 0 0 1em 0;
		position: relative;
	}
</style>
