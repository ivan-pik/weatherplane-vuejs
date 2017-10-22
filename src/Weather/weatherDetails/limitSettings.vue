<template>
	<div class="limitSettings">
		<form  v-on:submit.prevent="onSubmit">
			<label class="label" for="username">Wind Speed</label>
			<br>
			<ui-slider
				:minValue="10"
				:maxValue="100"
				:currentValue="45"
				:step="10"
			/>
			<br>
		</form>
	</div>
</template>

<script>
	import Vue from 'vue';
	import uiSlider from '../../uiComponents/slider.vue';
	
	export default {
		name: 'limitSettings',
		components: {
			'ui-slider' : uiSlider
		},
		props: {
			
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

