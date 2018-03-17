<template>
	<div class="placeSetting placeSetting--name">

		<ui-text-input-group>

			<ui-radio
				label="Who can access this place URL?"
				:radios="privacyOptions"
				v-on:change="updateHandler"
			/>
			<ui-note v-if="!newValue">
				You have to log-in to visit www.weatherplane.com/{{username}}/{{placeSlug}}
			</ui-note>
			<ui-note v-if="newValue">
				Anyone can visit www.weatherplane.com/{{username}}/{{placeSlug}}
			</ui-note>
		</ui-text-input-group>

		<ui-button-group
			:show="valueChanged"
		>
			<ui-button
				text="Save"
				type="primary"
				@click="saveSetting" 
			/>
			<ui-button
				text="Reset"
				@click="reset"
			/>
		</ui-button-group>
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
			},
			username: {
				type: String
			},
			placeSlug: {
				type: String
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
						label: 'Only me',
						value: false,
						active: false
					},
					{
						label: 'Anyone',
						value: true,
						active: false
					},
				],
			}
		}
	}

</script>