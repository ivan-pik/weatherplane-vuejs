<template>
	<div class="placeSetting placeSetting--name">

		<div class="uiTextInputGroup">
			
			<input
				class="uiCheckBox"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('placePrivacy') }"
				name="placePrivacy"
				v-model="newValue"
				type="checkbox"
			>
			<label class="uiLabel" for="placePrivacy">Public</label>

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
		name: 'placeSettingPrivacy',
		props: {
			value: {
				type: Boolean
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
				this.newValue = this.value;
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