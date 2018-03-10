<template>
	<div
		class="viewWrapper"
	>
		<navigation-header>
			<div slot="title" v-if="displayDefaultTitle">
				<slot name="header" />
			</div>
		</navigation-header> 

		<div class="viewWrapper__scroller"
			:class="{
				'viewWrapper__scroller--noScroll' : !enableScroll
			}"
		>
			<slot name="content" />
		</div>

		<div
			class="viewWrapper__bottom"
		>
			<slot name="bottom" />
		</div>
		
	</div>
</template>

<script>
	export default {
		name: 'viewWrapper',
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
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding: 40px 0 0 0;
		height: 100vh;
		overflow: hidden;
	}

	.viewWrapper__scroller {
		flex: 1 1 auto;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.viewWrapper__scroller--noScroll {
		overflow: hidden;
	}

	.viewWrapper__bottom {
		
	}
</style>
