<template>
	<div class="limitSettings uiOverlayPanel uiOverlayPanel--hasButtons">
		<button class="uiClose"
			@click="closePanel"
		>X</button>
		
		<form  v-on:submit.prevent="onSubmit">

			<div
				class="limitSettings__control"
			>
				<label class="uiLabel">
					{{reactiveControls.windSpeed.label}}: {{reactiveControls.windSpeed.currentValue}}
				</label>
				<ui-slider
					:minValue="reactiveControls.windSpeed.minValue || 0"
					:maxValue="reactiveControls.windSpeed.maxValue"
					v-model="reactiveControls.windSpeed.currentValue"
					:step="1"
					:name="reactiveControls.windSpeed.name"
				/>
			</div>

			<div
				class="limitSettings__control"
			>
				<label class="uiLabel">
					{{reactiveControls.crossWindSpeed.label}}: {{reactiveControls.crossWindSpeed.currentValue}}
				</label>
				<ui-slider
					:minValue="reactiveControls.crossWindSpeed.minValue || 0"
					:maxValue="reactiveControls.windSpeed.currentValue"
					v-model="reactiveControls.crossWindSpeed.currentValue"
					:step="1"
					:name="reactiveControls.crossWindSpeed.name"
				/>
			</div>

			<div
				class="limitSettings__control"
			>
				<label class="uiLabel">
					{{reactiveControls.bearing.label}}: {{reactiveControls.bearing.currentValue}}
				</label>
				<ui-slider
					:minValue="reactiveControls.bearing.minValue || 0"
					:maxValue="reactiveControls.bearing.maxValue"
					v-model="reactiveControls.bearing.currentValue"
					:step="1"
					:name="reactiveControls.bearing.name"
				/>
			</div>

			<div
				class="limitSettings__control"
			>
				<label class="uiLabel">
					{{reactiveControls.minTemperature.label}}: {{reactiveControls.minTemperature.currentValue}}
				</label>
				<ui-slider
					:minValue="0"
					:maxValue="40"
					v-model="reactiveControls.minTemperature.currentValue"
					:step="1"
					:name="reactiveControls.minTemperature.name"
				/>
			</div>

			<div
				class="limitSettings__control"
			>
				<label class="uiLabel">
					{{reactiveControls.maxTemperature.label}}: {{reactiveControls.maxTemperature.currentValue}}
				</label>
				<ui-slider
					:minValue="0"
					:maxValue="40"
					v-model="reactiveControls.maxTemperature.currentValue"
					:step="1"
					:name="reactiveControls.maxTemperature.name"
				/>
			</div>

			<div
				class="limitSettings__control"
			>
				<label class="uiLabel">
					{{reactiveControls.precipitation.label}}: {{reactiveControls.precipitation.currentValue}}
				</label>
				<ui-slider
					:minValue="reactiveControls.precipitation.minValue || 0"
					:maxValue="reactiveControls.precipitation.maxValue"
					v-model="reactiveControls.precipitation.currentValue"
					:step="1"
					:name="reactiveControls.precipitation.name"
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
				type: Object
			}
		},
		created () {
			this.reactiveControls = this.deep_copy(this.controls);

			document.addEventListener('keyup', this.escKeyHandler);
		},
		beforeDestroy () {
			document.removeEventListener('keyup', this.escKeyHandler);
		},
		computed: {
			settingsTweaked () {
				let differences = 0;

				

				if (this.reactiveControls.windSpeed.currentValue != this.controls.windSpeed.currentValue) {
					differences++;
				}

				if (this.reactiveControls.crossWindSpeed.currentValue != this.controls.crossWindSpeed.currentValue) {
					differences++;
				}

				if (this.reactiveControls.bearing.currentValue != this.controls.bearing.currentValue) {
					differences++;
				}

				if (this.reactiveControls.minTemperature.currentValue != this.controls.minTemperature.currentValue) {
					differences++;
				}

				if (this.reactiveControls.maxTemperature.currentValue != this.controls.maxTemperature.currentValue) {
					differences++;
				}

				if (this.reactiveControls.precipitation.currentValue != this.controls.precipitation.currentValue) {
					differences++;
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
			escKeyHandler (e) {
				if(e.keyCode == 27) {
					this.closePanel();
				}
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

