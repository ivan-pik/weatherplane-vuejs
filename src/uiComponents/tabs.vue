<template>
	<ul
		class="uiTabs"
	>
		<li v-for="(tab,index) in tabs" class="uiTabs__tab"
			:class="{'uiTabs__tab--active' : tab.active}"
			@click="activeTabHandler(index)"
			>
			{{tab.label}}
		</li>
	</ul>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'ui-tabs',
		props: {
			tabs: {
				type: Array
				/*
				{
					label: 'Tab Label'
					active: true
				}
				*/
			}, 
		},
		created () {
			
		},
		computed: {
			
		},
	 
		methods: {
			activeTabHandler (index) {
				var i = 0;
				this.tabs.forEach(function (tab) {
					tab.active = false;
					if (i==index) {
						tab.active = true;
					}
					i++;
				});
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

	.uiTabs {
		height: $uiInputHeight;
		display: flex;
		border-top: 1px solid $uiFrame;
	}

	.uiTabs__tab {
		flex: 1 1 auto;
		height: $uiInputHeight;
		line-height: $uiInputHeight;
		text-align: center;
		border-bottom: 2px solid $uiFrame;
		color: $uiInputInactive;
		font-size: $fontSizeButton;
		text-transform: uppercase;
	}

	.uiTabs__tab--active {
		color: $uiInputActive;
		border-bottom: 3px solid $uiInputActive;
	}

</style>