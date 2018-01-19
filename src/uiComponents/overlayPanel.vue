<template>
	<div class="uiOverlayPanel">
		<slot name="content"></slot>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'ui-overlay-panel',
		props: {
		
		},
		created () {
			
		},
		computed: {
			
		},
	 
		methods: {
	
		},
		
		data () {
			return {
			
			}
		}

	}

</script>

<style lang="scss">
.uiOverlayPanel {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	width: 100vw;
	height: 100vh;
	background-color: #00ff00;
	overflow: auto;
}
</style>