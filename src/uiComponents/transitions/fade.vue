<template>
	<transition name="fade">
		<slot/>
	</transition>
</template>

<script>
	export default {
		name: 'ui-transition-fade',
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	.fade-enter-active, .fade-leave-active {
		transition: opacity 1s
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>
