<template>
	<div
		class="uiMessage"
		:class="type"
	>
		{{text}}
		<button class="uiMessage__dismiss"
		@click="dismissMessage">
			X
		</button>
	</div>
</template>

<script>
	import Vue from 'vue';
  
	export default {
		name: 'message',
		props: {
			type: {
				type: String
			}, 
			text: {
				type: String
			},
			dismiss: {
				type: String
			}
		},
		created () {
			if (this.dismiss == 'auto') {
				setTimeout(this.dismissMessage, 3000);
			}
		},
		computed: {
			
		},
	 
		methods: {
			dismissMessage () {
				this.$emit('dismiss');
			}
		},
		
		data () {
			return {
			
			}
		}

	}

</script>

