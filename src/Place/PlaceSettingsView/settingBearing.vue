<template>
	<div class="placeSetting placeSetting--bearing">
		@todo: validate 0-359
		@todo: bearing dial control popup
		<div class="uiTextInputGroup">
			<label class="uiLabel" for="username">Bearing</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('placeName') }"
				name="placeName"
				v-model="newValue"
				type="text"
				placeholder="Location name here"
			>
			
			<span
				v-show="validationErrors.has('placeName')"
				class="help is-danger">{{ validationErrors.first('placeName') }}
			</span>
		</div>

		<div class="uiButtonGroup">
			<button v-if="valueChanged" @click="saveSetting" class="uiButton">Save</button>
			<button v-if="valueChanged" @click="reset" class="uiButton">Reset</button>
		</div>

	</div>
</template>

<script>
	import Vue from 'vue';
	
	export default {
		name: 'placeSettingBearing',
		props: {
			value: {
				type: Number
			}
		},
		mounted () {
			this.copyOriginalSetting(this.value);
		},
		watch: {
			newValue (newValue) {
				if (newValue != this.value) {
					this.valueChanged = true;
				} else {
					this.valueChanged = false;
				}
			}
		},
		methods: {
			copyOriginalSetting (value) {
				this.newValue = this.deep_copy(value);
			},
			deep_copy (obj) {
				// @todo: make object spread operator working with babel/webpack
				return JSON.parse(JSON.stringify(obj));
			},
			reset() {
				this.newValue = '' + this.value;
			},
			saveSetting () {
				this.valueChanged = false;
				this.$emit('updateSetting', this.newValue);
			}
		},
		data () {
			return {
				newValue: '',
				valueChanged: false,
				nameAvailable: false
			}
		}
	}

</script>