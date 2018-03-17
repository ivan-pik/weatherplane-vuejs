<template>
	<div class="limitSettings">
		<div class="limitSettings__content">
			<div class="limitSettings__group">
				<ui-slider
					label="reactiveControls.windSpeed.label"
					:minValue="reactiveControls.windSpeed.minValue"
					:maxValue="convertWindSpeedUnit(reactiveControls.windSpeed.maxValue,'meters-per-second',this.windUnit)"
					v-model="reactiveControls.windSpeed.currentValue"
					:step="1"
					:name="reactiveControls.windSpeed.name"
					:unit="windSpeedUnitDisplay"
				/>
			</div>

			<div class="limitSettings__group">
				<ui-slider
					:label="reactiveControls.crossWindSpeed.label"
					:minValue="reactiveControls.crossWindSpeed.minValue || 0"
					:maxValue="reactiveControls.windSpeed.currentValue"
					v-model="reactiveControls.crossWindSpeed.currentValue"
					:step="1"
					:name="reactiveControls.crossWindSpeed.name"
					:unit="windSpeedUnitDisplay"
				/>
			</div>

			<div class="limitSettings__group">
				<ui-slider
					label="reactiveControls.bearing.label"
					:minValue="reactiveControls.bearing.minValue || 0"
					:maxValue="reactiveControls.bearing.maxValue"
					v-model="reactiveControls.bearing.currentValue"
					:step="1"
					:name="reactiveControls.bearing.name"
					:unit="'°'"
				/>
			</div>

			<div class="limitSettings__group">
				<ui-slider
					label="reactiveControls.minTemperature.label"
					:minValue="this.convertTemperatureUnit(-20,'c', this.temperatureUnit)"
					:maxValue="reactiveControls.maxTemperature.currentValue - 1"
					v-model="reactiveControls.minTemperature.currentValue"
					:step="1"
					:name="reactiveControls.minTemperature.name"
					:unit="temperatureUnitDisplay"
				/>
			</div>

			<div class="limitSettings__group">
				<ui-slider
					label="reactiveControls.maxTemperature.label"
					:minValue="reactiveControls.minTemperature.currentValue + 1"
					:maxValue="this.convertTemperatureUnit(60,'c', this.temperatureUnit)"
					v-model="reactiveControls.maxTemperature.currentValue"
					:step="1"
					:name="reactiveControls.maxTemperature.name"
					:unit="temperatureUnitDisplay"
				/>
			</div>

			<div class="limitSettings__group">
				<ui-slider
					label="reactiveControls.precipitation.label"
					:minValue="reactiveControls.precipitation.minValue || 0"
					:maxValue="reactiveControls.precipitation.maxValue"
					v-model="reactiveControls.precipitation.currentValue"
					:step="1"
					:name="reactiveControls.precipitation.name"
					:unit="'%'"
				/>
			</div>
		</div>
		<ui-button-group
			:show="settingsTweaked"
			:collapseHeight="false"
		>
			<ui-button
				text="Save"
				type="primary"
				@click="saveSettings"
			/>
			<ui-button
				text="Reset"
				@click="resetControls"
			/>
		</ui-button-group>
	</div>
</template>

<script>
	import Vue from 'vue';
	
	
	export default {
		name: 'limitSettings',
		props: {
			controls: {
				type: Object
			}
		},
		created () {
			this.reactiveControls = this.deep_copy(this.controls);
			this.originalControls = this.deep_copy(this.controls);
			this.recalcUnits();

			
		},
		computed: {
			settingsTweaked () {
				let differences = 0;

				

				if (this.reactiveControls.windSpeed.currentValue != this.originalControls.windSpeed.currentValue) {
					differences++;
				}

				if (this.reactiveControls.crossWindSpeed.currentValue != this.originalControls.crossWindSpeed.currentValue) {
					differences++;
				}

				if (this.reactiveControls.bearing.currentValue != this.originalControls.bearing.currentValue) {
					differences++;
				}

				if (this.reactiveControls.minTemperature.currentValue != this.originalControls.minTemperature.currentValue) {
					differences++;
				}

				if (this.reactiveControls.maxTemperature.currentValue != this.originalControls.maxTemperature.currentValue) {
					differences++;
				}

				if (this.reactiveControls.precipitation.currentValue != this.originalControls.precipitation.currentValue) {
					differences++;
				}

				if (differences != 0) {
					return true;
				} else {
					return false;
				}
			},
			windUnit () {
				return this.$store.state.globalApp.settings.windUnit;
			},
			temperatureUnit () {
				return this.$store.state.globalApp.settings.temperatureUnit;
			},
			temperatureUnitDisplay () {
				return '°' + this.temperatureUnit.toUpperCase();
			},
			windSpeedUnitDisplay () {
				if (this.windUnit == 'meters-per-second') {
					return 'ms';
				} else if (this.windUnit == 'kilometers-per-hour') {
					return 'kph';
				} else if (this.windUnit == 'miles-per-hour') {
					return 'mph';
				}
			},
		
		},
		watch: {
			windUnit () {
				this.recalcUnits();
			},
			temperatureUnit () {
				this.recalcUnits();
			},
			'reactiveControls.windSpeed.currentValue' (val) {
				if (val < this.reactiveControls.crossWindSpeed.currentValue) {
					this.reactiveControls.crossWindSpeed.currentValue = val;
				}
			}
		},
	 
		methods: {
			deep_copy (obj) {
				return JSON.parse(JSON.stringify(obj));
			},
			resetControls () {
				this.reactiveControls = this.deep_copy(this.originalControls);
			},
			resetKnobs () {
				
			},
		
		
			saveSettings () {
				var controls = this.normaliseUnits(this.deep_copy(this.reactiveControls));
				this.originalControls = this.deep_copy(this.reactiveControls);
				this.$emit('saveSettings', controls);
			},
			convertWindSpeedUnit (wind, fromWindUnit, toWindUnit) {
				let result;
				if (fromWindUnit == 'meters-per-second') {
					if (toWindUnit == 'meters-per-second') {
						result = wind;
					} else if (toWindUnit == 'kilometers-per-hour') {
						result = (wind * 3.6).toFixed(1);
					} else if (toWindUnit == 'miles-per-hour') {
						result = (wind * 2.2369).toFixed(1);
					}
				} else if (fromWindUnit == 'kilometers-per-hour') {
					if (toWindUnit == 'meters-per-second') {
						result = wind * 0.277777778;
					} else if (toWindUnit == 'kilometers-per-hour') {
						result = wind;
					} else if (toWindUnit == 'miles-per-hour') {
						result = wind * 0.621371192;
					}
				} else if (fromWindUnit == 'miles-per-hour') {
					if (toWindUnit == 'meters-per-second') {
						result = wind * 0.44704;
					} else if (toWindUnit == 'kilometers-per-hour') {
						result = wind * 0.621371192
					} else if (toWindUnit == 'miles-per-hour') {
						result = wind;
					}
				}

				return Math.round(parseFloat(result));
				
			},
			convertTemperatureUnit (temperature, fromTemperatureUnit, toTemperatureUnit) {
				let result;
				if (fromTemperatureUnit == 'c') {
					if (toTemperatureUnit == 'c') {
						result = temperature;
					} else if (toTemperatureUnit == 'f') {
						result = temperature * 9 / 5 + 32
					}
				} else if (fromTemperatureUnit == 'f') {
					if (toTemperatureUnit == 'c') {
						result = (temperature -32) * 5 / 9;
					} else if (toTemperatureUnit == 'f') {
						result = temperature;
					}
				}
				return Math.round(parseFloat(result));
			},
			recalcUnits () {
				this.reactiveControls.windSpeed.currentValue = this.convertWindSpeedUnit(this.reactiveControls.windSpeed.currentValue,'meters-per-second', this.windUnit);
				this.originalControls.windSpeed.currentValue = this.convertWindSpeedUnit(this.originalControls.windSpeed.currentValue,'meters-per-second', this.windUnit);

				this.reactiveControls.crossWindSpeed.currentValue = this.convertWindSpeedUnit(this.reactiveControls.crossWindSpeed.currentValue,'meters-per-second', this.windUnit);
				this.originalControls.crossWindSpeed.currentValue = this.convertWindSpeedUnit(this.originalControls.crossWindSpeed.currentValue,'meters-per-second', this.windUnit);

				this.reactiveControls.minTemperature.currentValue = this.convertTemperatureUnit(this.reactiveControls.minTemperature.currentValue, 'c', this.temperatureUnit);
				this.originalControls.minTemperature.currentValue = this.convertTemperatureUnit(this.originalControls.minTemperature.currentValue, 'c', this.temperatureUnit);

				this.reactiveControls.maxTemperature.currentValue = this.convertTemperatureUnit(this.reactiveControls.maxTemperature.currentValue, 'c', this.temperatureUnit);
				this.originalControls.maxTemperature.currentValue = this.convertTemperatureUnit(this.originalControls.maxTemperature.currentValue, 'c', this.temperatureUnit);

			},
			normaliseUnits (controls) {
				controls.windSpeed.currentValue = parseFloat( 
					(this.convertWindSpeedUnit(
					controls.windSpeed.currentValue,
					this.windUnit,
					'meters-per-second'))
					.toFixed(1) ); 
				controls.crossWindSpeed.currentValue = parseFloat( 
					(this.convertWindSpeedUnit(
					controls.crossWindSpeed.currentValue,
					this.windUnit,
					'meters-per-second'))
					.toFixed(1) ); 
				controls.minTemperature.currentValue = parseFloat( 
					(this.convertTemperatureUnit(
					controls.minTemperature.currentValue,
					this.temperatureUnit,
					'c')).toFixed(1) ); 
				controls.maxTemperature.currentValue = parseFloat( 
					(this.convertTemperatureUnit(
					controls.maxTemperature.currentValue,
					this.temperatureUnit,
					'c'))
					.toFixed(1) ); 
				return controls;
			}
			
		},
		
		data () {
			return {
				reset: false,
				reactiveControls: [],
				originalControls: [],
				
			}
		}
	}
</script>

<style lang="scss">
.limitSettings {
	width: 100%;
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	.uiLabel {
		text-align: center;
	}
}
.limitSettings__content {
	flex: 1 1 auto;
	overflow: auto;
	touch-action: pan-y;
	padding: 1em 0;
}
.limitSettings__group {
	margin: 0 0.5em;
	&:not(:last-child) {
		margin-bottom: 1.5em;
	}
	.uiLabel {
		margin: 0 10px;
	}
}
</style>
