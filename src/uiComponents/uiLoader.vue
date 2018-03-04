<template>
	<div class="uiLoader">
		<slot v-if="loaded" />
		<div
			v-else
			class="uiLoader__screen"
		>
			LOADING
		</div>
	</div>
</template>


<script>
	import Vue from 'vue';
	export default {
		name: 'uiLoader',
		props: {
			loaded: {
				type: Boolean,
				required: true
			}
		},
		data () {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
.uiLoader {
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
}

.uiLoader__screen {
	background-color: red;
	color: #fff;
	padding: 3em;
}
</style>
