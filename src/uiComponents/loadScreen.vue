<template>
	<div 
		class="uiLoadScreen">
		
	
				{{text}}
			
		
		
	</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'loadScreen',
		props: {
			text: {
				type: String
			},
			loading: {
				type: Boolean,
				default: true
			}
		},
		mounted () {
			
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

.uiLoadScreen {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
}


.fade-enter-active, .fade-leave-active {
	transition: opacity 1s
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>
