<template>
	<div class="placeSetting placeSetting--name">
		@todo: validate for correct number
		@todo: MapView
		<div class="uiTextInputGroup">
			<label class="uiLabel" for="username">Lat</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('placeName') }"
				name="placeName"
				v-model="newValue[0]"
				type="text"
				placeholder="Location name here"
			>
			<span
				v-show="validationErrors.has('placeName')"
				class="help is-danger">{{ validationErrors.first('placeName') }}
			</span>

			<label class="uiLabel" for="username">Lng</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('longitude') }"
				name="longitude"
				v-model="newValue[1]"
				type="text"
				placeholder="Location name here"
			>
			<span
				v-show="validationErrors.has('longitude')"
				class="help is-danger">{{ validationErrors.first('longitude') }}
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

	// @todo: Validation is broken
	
	export default {
		name: 'placeSettingLocation',
		props: {
			value: {
				type: Array
			}
		},
		mounted () {
			this.copyOriginalSetting(this.value);
		},
		watch: {
			newValue (newValue) {
				if (newValue[0] != this.value[0] || newValue[1] != this.value[1]) {
					this.valueChanged = true;
				} else {
					this.valueChanged = false;
				}
			}
		},
		methods: {
			copyOriginalSetting (value) {
				this.newValue[0] = '' + this.value[0];
				this.newValue[1] = '' + this.value[1];
			},
			deep_copy (obj) {
				// @todo: make object spread operator working with babel/webpack
				return JSON.parse(JSON.stringify(obj));
			},
			reset() {
				this.newValue = ['' + this.value[0], '' + this.value[1]];
				debugger;
			},
			saveSetting () {
				this.valueChanged = false;
				this.$emit('updateSetting', 
					{
						lat: this.newValue[0],
						lng: this.newValue[1]
					}
				);
			}
		},
		data () {
			return {
				newValue: [0,0],
				valueChanged: false,
				nameAvailable: false
			}
		}
	}

</script>