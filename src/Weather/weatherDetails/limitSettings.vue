<template>
	<div class="limitSettings">
		<form  v-on:submit.prevent="onSubmit">
			<label class="label" for="username">MaxWind Speed (ms)</label>
			<br>
			<ui-slider
				:minValue="0"
				:maxValue="50"
				v-model="testVal"
				:step="1"
			/>
			<br>
			<input type="text"
				v-model="testVal"
			  />
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
				testVal: 25
			}
		}
	}
</script>

