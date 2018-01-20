<template>
	<div class="uiOverlayPanel"
		v-if="open"
	>
		<div class="uiOverlayPanel__header">
			<div class="uiOverlayPanel__title">
				<slot name="title"></slot>		
			</div>
			<button class="uiOverlayPanel__close" @click="close">Close</button>
		</div>
		<div class="uiOverlayPanel__body">
			<slot name="content"></slot>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'ui-overlay-panel',
		props: {
			// Is panel open or not
			open: { 
				type: Boolean
			}
		},
		created () {
			
		},
		computed: {
			
		},
	 
		methods: {
			close () {
				this.$emit('close'); // set prop 'open' to false in parent component
			}
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
.uiOverlayPanel__header {
	display: flex;
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	background: blue;
	z-index: 1000;
	height: 40px;
}
.uiOverlayPanel__title {
	margin-right: auto;
}

.uiOverlayPanel__close {
	background: red;
	width: 40px;
	height: 40px;
}

.uiOverlayPanel__body {
	padding: 50px 0 0 0;
}

</style>