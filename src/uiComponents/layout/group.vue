<template>
	<div
		class="uiGroup"
		:class="{
			'uiGroup--border' : border
		}"
	>
		<div class="uiGroup__title" v-if="title">
			{{title}}	
		</div>
		<slot />
	</div>
</template>

<script>
	export default {
		name: 'uiGroup',
		props: {
			border: {
				type: Boolean,
				default: true
			},
			title: {
				type: String
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
	.uiGroup {
		display: block;
		margin: $widthGridLargerSpace;
		position: relative;

		& > .uiButtonGroup > * {
			margin-bottom: $widthGridLargerSpace;
		}

		& > *:last-child {
			margin-bottom: 0;
		}
	}

	.uiGroup--border {
		border: 1px solid $uiFrame;
		padding: $widthGridLargerSpace * 1.5 $widthGridLargerSpace $widthGridLargerSpace $widthGridLargerSpace;
	}

	.uiGroup__title {
		display: inline-block;
		padding: 0 0.5em;
		font-size: 0.7rem;
		margin: 0 0 $widthGridLargerSpace -0.5em;
		position: absolute;
		top: -0.6em;
		left: $widthGridLargerSpace;
		background: #fff;
		color: #888;
	}
</style>
