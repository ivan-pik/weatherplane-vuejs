<template>
	<div class="uiLabel">
		<slot />
	</div>
</template>

<script>
	export default {
		name: 'uiLabel',
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	.uiLabel {
		font-size: 0.7rem;
		display: block;
	}
</style>
