<template>
	<div class="placeSetting placeSetting--name">
		<ui-text-input
			label="Location Name"
			name="placeName"
			placeholder="Location name here"
			v-model="newValue"
			v-validate="{ rules: { required: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('placeName')"
			:available="(valueChanged) ? nameAvailable : null"
		/>

		<ui-button-group v-if="valueChanged">
			<ui-button
				text="Save"
				type="primary"
				@click="saveSetting"
				:disabled="!nameAvailable"
			/>
			<ui-button
				text="Reset"
				@click="reset"
			/>
		</ui-button-group>

	</div>
</template>

<script>
	import Vue from 'vue';
	
	export default {
		name: 'placeSettingName',
		props: {
			value: {
				type: String
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

				this.checkAvailability(newValue);
			}
		},
		computed: {
			placesList () {
				return this.$store.state.user.places;
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
			},
			checkAvailability (newValue) {
				var filtered = this.placesList.filter(function(item) {
					return item.placeName.toLowerCase() == newValue.toLowerCase();
				});

				if (filtered.length != 0) {
					this.nameAvailable =  false;
					return false;
				} else {
					this.nameAvailable = true;
					return true;
				}
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