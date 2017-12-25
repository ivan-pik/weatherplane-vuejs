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

