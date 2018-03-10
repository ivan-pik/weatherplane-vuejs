<template>
	<div
		class="uiHelp"
	>
		{{text}}
	</div>
</template>

<script>
	export default {
		name: 'uiHelp',
		props: {
			text: String
		},
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	@import '~globalVars';
	.uiHelp {
		display: block;
		font-size: 0.7rem;
		padding: 1em 0 0 0;
		color: #c70000;
	}

</style>
