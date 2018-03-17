<template>
	<div class="uiLoader">
		<slot v-if="loaded" />
		<div
			v-else
			class="uiLoader__screen"
		>
			{{text}}
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
			},
			text: {
				type: String
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
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: red;
	color: #fff;
	padding: 3em;
	z-index: 1000;
}
</style>
