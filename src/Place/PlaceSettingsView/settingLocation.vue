<template>
	<div class="placeSetting placeSetting--name">
		
		<button
			class="uiLink"
			@click="openMap"
		>
			Open map
		</button>

		<div class="uiTextInputGroup">
			<label class="uiLabel" for="username">Lat</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('placeName') }"
				name="placeName"
				v-model="newLocationValue[0]"
				type="text"
				placeholder="Location name here"
			>
			<span
				v-show="validationErrors.has('placeName')"
				class="help is-danger">{{ validationErrors.first('placeName') }}
			</span>
		</div>

		<div class="uiTextInputGroup">
			<label class="uiLabel" for="username">Lng</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('longitude') }"
				name="longitude"
				v-model="newLocationValue[1]"
				type="text"
				placeholder="Location name here"
			>
			<span
				v-show="validationErrors.has('longitude')"
				class="help is-danger">{{ validationErrors.first('longitude') }}
			</span>
		</div>

		<div class="uiTextInputGroup">
			<label class="uiLabel" for="username">Bearing</label>
			<input
				class="uiTextInput"
				v-validate="{ rules: { required: true } }"
				:class="{'input': true, 'is-danger': validationErrors.has('placeName') }"
				name="placeName"
				v-model="newBearingValue"
				type="text"
				placeholder="Location name here"
			>
			
			<span
				v-show="validationErrors.has('placeName')"
				class="help is-danger">{{ validationErrors.first('placeName') }}
			</span>
		</div>

		<div class="uiButtonGroup">
			<button v-if="locationValueChanged || bearingValueChanged" @click="saveSetting" class="uiButton uiButton--primary">Save</button>
			<button v-if="locationValueChanged || bearingValueChanged" @click="resetMapAndBearing" class="uiButton">Reset</button>
		</div>


		<ui-modal
			:show="mapOpen"
			v-on:closed="closeMap"
			v-on:close-button-clicked="mapOpen=false"
			:closeButton="true"
		>	
			<div slot="content" class="mapWrapper">
				<ui-tabs
					:tabs="tabs"
				/>

				<div class="mapSearchView_wrapper">
					<location-map
						:coordinates="newLocationValue"
						:disableControls="this.tabs[0].active"
						v-on:placeSelected="updateLocation"
					/>
					<bearing-selector
						:active="this.tabs[0].active"
						v-show="placeChosen"
						v-model="newBearingValue"
					/>
				</div>
				<div class="uiButtonGroup"  >
					<button class="uiButton uiButton--primary" @click="mapOpen=false">Close Map</button>
					<button class="uiButton" v-if="locationValueChanged || bearingValueChanged" @click="resetMapAndBearing">Reset</button>
				</div>
				
			</div>
		</ui-modal>

	</div>
</template>

<script>
	import Vue from 'vue';
	import uiOverlayPanel from '../../uiComponents/overlayPanel.vue'
	import placeInput from '../../MapSearch/placeInput/index.vue';
	import map from '../../MapSearch/map/index.vue';
	import bearingSelector from '../../MapSearch/bearingSelector.vue';
	import uiTabs from '../../uiComponents/tabs.vue';

	// @todo: Validation is broken
	
	export default {
		name: 'placeSettingLocation',
		components: {
			'overlay-panel' : uiOverlayPanel,
			'place-input' : placeInput,
			'location-map' : map,
			'bearing-selector' : bearingSelector,
			'ui-tabs' : uiTabs,
					
		},
		props: {
			location: {
				type: Array
			},
			bearing: {
				type: Number
			}
		},
		mounted () {
			this.newLocationValue = this.deep_copy(this.location);
			this.newBearingValue = this.deep_copy(this.bearing);
		},
		watch: {
			newLocationValue (newLocationValue) {
				if (newLocationValue[0] != this.location[0] || newLocationValue[1] != this.location[1]) {
					this.locationValueChanged = true;
				} else {
					this.locationValueChanged = false;
				}
			},
			newBearingValue (newBearingValue) {
				if (newBearingValue != this.bearing) {
					this.bearingValueChanged = true;
				} else {
					this.bearingValueChanged = false;
				}
			}
		},
		methods: {
			openMap () {
				this.mapOpen = true;
			},
			closeMap () {
				this.mapOpen = false;
			},
			updateLocation (val) {
				this.newLocationValue = [val.lat, val.lng];
			},
	
			updateLocationAndBearingFromMap () {

			},

			resetMapAndBearing () {
				this.newLocationValue = this.deep_copy(this.location);
				this.newBearingValue = this.deep_copy(this.bearing);
			},

			setBearing () {

			},
			deep_copy (obj) {
				// @todo: make object spread operator working with babel/webpack
				return JSON.parse(JSON.stringify(obj));
			},
		
			saveSetting () {
				if (this.locationValueChanged) {
					this.$emit('updateLocation', 
						{
							lat: this.newLocationValue[0],
							lng: this.newLocationValue[1]
						}
					);
				}

				if (this.bearingValueChanged) {
					this.$emit('updateBearing', this.newBearingValue);
				}

				this.locationValueChanged = false;
				this.bearingValueChanged = false;
			}
		},
		data () {
			return {
				newLocationValue: [0,0],
				newBearingValue: 0,
				locationValueChanged: false,
				bearingValueChanged: false,
				nameAvailable: false,
				tabs: [
					{
						label: 'Set Bearing',
						active: true,
					},
					{
						label: 'Adjust map',
						active: false
					}
				],
				placeChosen: true,
				mapOpen: false
			}
		}
	}

</script>

<style lang="scss">
.mapWrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
}
</style>
