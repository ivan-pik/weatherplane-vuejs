<template>
	<div class="placeSetting placeSetting--url">
	
		<div class="uiTextInputGroup">
			<label class="uiLabel" for="placeSlug">Location URL
			<span v-if="valueChanged" class="availability">
				Available: {{urlAvailable}}
			</span>
			</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('placeSlug') }"
				name="placeSlug"
				v-model="newValue"
				type="text"
				placeholder="URL here"
			>
			
			<span
				v-show="validationErrors.has('placeSlug')"
				class="help is-danger">{{ validationErrors.first('placeSlug') }}
			</span>
			
		</div>

		<ui-note>
			www.weatherplane.com/{{username}}/{{newValue}}
		</ui-note>

		<div class="uiButtonGroup" v-if="valueChanged">
			<button v-if="urlAvailable"  @click="saveSetting" class="uiButton uiButton--primary">Save</button>
			<button  @click="reset" class="uiButton">Reset</button>
		</div>

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