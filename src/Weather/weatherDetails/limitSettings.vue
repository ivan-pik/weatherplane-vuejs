<template>
	<div class="limitSettings uiOverlayPanel uiOverlayPanel--hasButtons">
		<button class="uiClose"
			@click="closePanel"
		>X</button>
		
		<form  v-on:submit.prevent="onSubmit">

			<div
				class="limitSettings__control"
				v-for="control in reactiveControls"
			>
				<label class="uiLabel">
					{{control.label}}
				</label>
				<ui-slider
					:minValue="control.minValue || 0"
					:maxValue="control.maxValue"
					v-model="control.currentValue"
					:step="1"
					:name="control.name"
				/>
			</div>

			
		</form>
		<div
			v-if="settingsTweaked"
			class="uiButtonGroup uiButtonGroup--limitSettings">
			<button
				class="uiButton"
				@click="saveSettings"
			>Save</button>
			<button
				class="uiButton"
				@click="resetControls"
			>Reset</button>
		</div>
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
			controls: {
				type: Array
			}
		},
		created () {
			this.reactiveControls = this.deep_copy(this.controls);
		},
		computed: {
			settingsTweaked () {
				let differences = 0;
				 for (var i = 0; i < this.controls.length; i++) {
					if (this.controls[i].currentValue != this.reactiveControls[i].currentValue) {
						differences++;
					} 
				} 
				if (differences != 0) {
					return true;
				} else {
					return false;
				}
			}
		},
		watch: {
		},
	 
		methods: {
			deep_copy (obj) {
				return JSON.parse(JSON.stringify(obj));
			},
			resetControls () {
				this.reactiveControls = this.deep_copy(this.controls);
			},
			resetKnobs () {
				
			},
			closePanel() {
				this.$emit('closePanel');
			},
			saveSettings () {
				this.$emit('saveSettings', this.reactiveControls);
			}
		},
		
		data () {
			return {
				reset: false,
				reactiveControls: []
				
			}
		}
	}
</script>

