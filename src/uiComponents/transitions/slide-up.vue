<template>
	<transition name="slide-up">
		<slot/>
	</transition>
</template>

<script>
	export default {
		name: 'ui-transition-slide-up',
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	.slide-up-enter-active, .slide-up-leave-active {
		transition: all 200ms;
	}
	.slide-up-enter, .slide-up-leave-to {
		opacity: 0;
		transform: translate(0, 100%);
	}
</style>
