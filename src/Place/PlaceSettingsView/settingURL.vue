<template>
	<div class="placeSetting placeSetting--url">
		<ui-text-input
			label="Password"
			name="placeSlug"
			placeholder="URL here"
			v-model="newValue"
			v-validate="{ rules: { required: true, alpha_dash: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('placeSlug')"
			data-vv-delay="1000"
			:available="urlAvailable"
		/>

		<ui-note>
			www.weatherplane.com/{{username}}/{{newValue}}
		</ui-note>

		<ui-button-group v-if="valueChanged">
			<ui-button
				text="Save"
				type="primary"
				@click="saveSetting"
				:disabled="!urlAvailable"
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
	// @todo: validate field for correct slug
	export default {
		name: 'placeSettingURL',
		props: {
			value: {
				type: String
			},
			username: {
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
					return item.placeSlug.toLowerCase() == newValue.toLowerCase();
				});


				if (filtered.length != 0) {
					this.urlAvailable =  false;
					return false;
				} else {
					this.urlAvailable = true;
					return true;
				}
			}
		},
		data () {
			return {
				newValue: '',
				valueChanged: false,
				urlAvailable: false
			}
		}
	}

</script>