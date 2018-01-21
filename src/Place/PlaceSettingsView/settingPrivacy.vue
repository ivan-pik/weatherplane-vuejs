<template>
	<div class="placeSetting placeSetting--name">

		<div class="uiTextInputGroup">

			<ui-radio
				:radios="privacyOptions"
				v-on:change="updateHandler"
			>
				<label slot="label">Wind Unit</label>
			</ui-radio>
			
		</div>

		<div class="uiButtonGroup">
			<button v-if="valueChanged" @click="saveSetting" class="uiButton uiButton--primary">Save</button>
			<button v-if="valueChanged" @click="reset" class="uiButton">Reset</button>
		</div>

	</div>
</template>

<script>
	import uiRadio from 'uiComponents/buttonRadio.vue';

	
	export default {
		name: 'placeSettingPrivacy',
		components: {
			'ui-radio' : uiRadio,
		},
		props: {
			value: {
				type: Boolean
			}
		},
		mounted () {
			this.copyOriginalSetting(this.value);
			this.setActiveOption(this.privacyOptions, this.newValue);
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
			updateHandler (publicPlace) {
				this.newValue = publicPlace.value;
			},
			setActiveOption (radios,activeValue) {
				radios.forEach(radio => {
					if (radio.value == activeValue) {
						radio.active = true;
					} else {
						radio.active = false;
					}
				});
			},
			copyOriginalSetting (value) {
				this.newValue = this.deep_copy(value);
			},
			deep_copy (obj) {
				// @todo: make object spread operator working with babel/webpack
				return JSON.parse(JSON.stringify(obj));
			},
			reset() {
				this.newValue = this.value;
				this.setActiveOption(this.privacyOptions, this.newValue);
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
				nameAvailable: false,
				privacyOptions: [
					{
						label: 'Private',
						value: false,
						active: false
					},
					{
						label: 'Public',
						value: true,
						active: false
					},
				],
			}
		}
	}

</script>