<template>
	<div class="placeSetting placeSetting--name">
		<ui-button
			text="Open map"
			type="primary"
			@click="openMap"
			:raised="false"
		/>

		<ui-text-input
			label="Latitude"
			name="latitude"
			placeholder="Enter latitude"
			v-model="newLocationValue[0]"
			v-validate="{ rules: { required: true, decimal: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('latitude')"
		/>

		<ui-text-input
			label="Longitude"
			name="longitude"
			placeholder="Enter longitude"
			v-model="newLocationValue[1]"
			v-validate="{ rules: { required: true, decimal: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('longitude')"
		/>

		<ui-text-input
			label="Bearing"
			name="bearing"
			placeholder="Enter runway bearing"
			v-model="newBearingValue"
			v-validate="{ rules: { required: true,  decimal: true } }"
			data-vv-value-path="innerValue"
			:help="validationErrors.first('bearing')"
		/>

		<ui-button-group
			:show="locationValueChanged || bearingValueChanged"
		>
			<ui-button
				text="Save"
				type="primary"
				@click="saveSetting" 
			/>
			<ui-button
				text="Reset"
				@click="resetMapAndBearing"
			/>
		</ui-button-group>


		<ui-modal
			:show="mapOpen"
			v-on:closed="closeMap"
			v-on:close-button-clicked="mapOpen=false"
			:closeButton="true"
			headerTitle="Change location or bearing"
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
				<ui-button-group>
					<ui-button
						text="Close Map"
						type="primary"
						 @click="mapOpen=false"
					/>
					<ui-button
						v-if="locationValueChanged || bearingValueChanged" 
						text="Reset"
						@click="resetMapAndBearing"
					/>
				</ui-button-group>
				
			</div>
		</ui-modal>

	</div>
</template>

<script>
	import Vue from 'vue';
	import placeInput from '../../MapSearch/placeInput/index.vue';
	import map from '../../MapSearch/map/index.vue';
	import bearingSelector from '../../MapSearch/bearingSelector.vue';
	import uiTabs from '../../uiComponents/tabs.vue';

	// @todo: Validation is broken
	
	export default {
		name: 'placeSettingLocation',
		components: {
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
	min-height: 500px;
}
</style>
