<template>
	<div class="placeSetting placeSetting--name">

		<div class="uiTextInputGroup">
			<label class="uiLabel" for="username">Location Name
			<span v-if="valueChanged" class="availability">
				Available: {{nameAvailable}}
			</span>
			</label>
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

		<div class="uiButtonGroup" v-if="valueChanged">
			<button v-if="nameAvailable"  @click="saveSetting" class="uiButton uiButton--primary">Save</button>
			<button  @click="reset" class="uiButton">Reset</button>
		</div>

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