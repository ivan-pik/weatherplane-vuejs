<template>
	<div class="uiTitle">
		<slot />
	</div>
</template>

<script>
	export default {
		name: 'message',
		data () {
			return {
				
			}
		}
	}

</script>

<style lang="scss">
	@import '~globalVars';
	
	.uiTitle {
		text-align: center;
		background: rgb(223, 108, 0);
		color: #fff;
		padding: 1em;
		display: block;
		font-size: 0.8rem;
	}
</style>
