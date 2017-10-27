<template>
	<div class="uiLoadScreen">
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
		},
		computed: {
			
		},
	 
		
		data () {
			return {
			
			}
		}

	}

</script>

