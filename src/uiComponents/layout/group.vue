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
		margin: 1.5rem;
		margin-bottom: 3rem;
		position: relative;

		& > .uiButtonGroup > * {
			margin-bottom: $widthGridLargerSpace;
		}

		& > div:last-child {
			margin-bottom: 0;
		}
	}

	.uiGroup--border {
		border-radius: 3px;
		border: 1px solid $uiFrame;
		padding: $widthGridLargerSpace * 1.5 $widthGridLargerSpace $widthGridLargerSpace $widthGridLargerSpace;
		margin: 0.7rem;
	}

	.uiGroup__title {
		display: inline-block;
		padding: 0 0.5em;
		font-size: 0.9rem;
		margin: 0 0 $widthGridLargerSpace -0.5em;
		position: absolute;
		top: -0.6em;
		left: $widthGridLargerSpace;
		background: #fff;
		color: #888;
		font-weight: 700;
	}
</style>
