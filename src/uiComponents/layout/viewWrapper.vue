<template>
	<div class="viewWrapper">
		<navigation-header>
			<div slot="title" v-if="displayDefaultTitle">
				<slot name="header" />
			</div>
		</navigation-header> 

		<navigation-toggle />

		<div class="viewWrapper__scroller"
			:class="{
				'viewWrapper__scroller--noScroll' : !enableScroll
			}"
		>
			<slot name="content" />
		</div>

		<div class="viewWrapper__bottom">
			<slot name="bottom" />
		</div>
	</div>
</template>

<script>
	import Navigation from 'Navigation/index.vue'

	export default {
		name: 'viewWrapper',
		components: {
			'navigation-toggle': Navigation
		},
		props: {
			title: {
				type: String
			},
			enableScroll: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			displayDefaultTitle () {
				return this.$slots.header;
			},
			displayBottomSlot () {
				return this.$slots.bottom;
			}
		},
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	.viewWrapper {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		min-height: 100%;
		flex: 1 0 auto;
	}

	.viewWrapper__scroller {
		flex: 1 1 auto;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: stretch;

		& > div {
			display: flex;
			flex-direction: column;
		}
	}

	.viewWrapper__scroller--noScroll {
		overflow: hidden;
	}

	.viewWrapper__bottom {
	}
</style>
