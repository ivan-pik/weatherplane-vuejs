import Vue from 'vue';
import Vuex from 'vuex';

import WPAPI from '../wpapi/index';

Vue.use(Vuex);

// @todo: separate into modules

export default new Vuex.Store({
	state: {
		globalApp: {
			globalMessages: [],
			topBarTitle: '',
			settings: {
				windUnit: '',
				timeFormat: '',
				temperatureUnit: '',
				weatherRange: '', // how many days of weather to download
			}
		},
		user: {
			loggedIn: false,
			name: false,
			authenticationRequired: false,
			authenticated: false,
			places: []
		},
		placeSearch: {
			place: null,
			placeSelected: false,
			selectedLocation: {
			coordinates: {}
			}
		},
		existingPlaceView: {
			place: null,
			weatherData: null,
			view: {
				placeType: '',
				chartCursorPosition: {
					index: 0,
					progress: 0
				},
				limitsSettings: {
					panelOpen: false
				}
			}
		}

	},
	mutations: {
		// User
		'USER_LOG_IN' (state, user) {
			state.user.name = user.username;
			state.user.loggedIn = true;
		},
		'USER_LOG_OUT' (state) {
			state.user.name = false;
			state.user.loggedIn = false;
		},
		'USER_SAVE_TOKEN' (state, token) {
			state.user.token = token;
		},
		'USER_AUTHENTICATION_REQUIRED' (state) {
			state.user.authenticationRequired = true;
		},
		'USER_AUTHENTICATED' (state) {
			state.user.authenticated = true;
		},
		'USER_SAVE_PLACES' (state, newPlaces) {
			state.user.places = newPlaces;
		},
		// Place Search
		'PLACE_SEARCH_PLACE_SELECTED' (state, place) {
			state.placeSearch.place = place;
		},
		'PLACE_SEARCH_BEARING' (state, bearing) {
			state.placeSearch.bearing = bearing;
		},
		'LOCATION_SAVE_ACTIVE_LOCATION' (state, coordinates) {
			state.placeSearch.selectedLocation.coordinates = coordinates;
			state.placeSearch.placeSelected = true;
		},
		// Place View
		'PLACE_SAVE_PLACE_DATA' (state, place) {
			state.existingPlaceView.place = place;
		},
		'PLACE_SAVE_WEATHER_DATA' (state, weather) {
			state.existingPlaceView.weatherData = weather;
		},
		'PLACE_VIEW_CHART_CURSOR' (state, val) {
			state.existingPlaceView.view.chartCursorPosition = val;
		},
		'PLACE_VIEW_TYPE' (state, val) {
			state.existingPlaceView.view.placeType = val;
		},
		'PLACE_VIEW_LIMITS_SETTINGS' (state, val) {
			state.existingPlaceView.view.limitsSettings.panelOpen = val;
		},
		'PLACE_LIST_ORDERS_UPDATED' (state, newPlaces) {
			
			state.user.places = newPlaces;
		},
		'PLACE_UPDATE_LIMITS_SETTINGS' (state, val) {
			state.existingPlaceView.place.placeSettings.maxWindSpeed = val.maxWindSpeed;
			state.existingPlaceView.place.placeSettings.maxCrossWindSpeed = val.maxCrossWindSpeed;
			state.existingPlaceView.place.placeSettings.maxPrecipProbability = val.maxPrecipProbability;
			state.existingPlaceView.place.placeSettings.minTemperature = val.minTemperature;
			state.existingPlaceView.place.placeSettings.maxTemperature = val.maxTemperature;
			state.existingPlaceView.place.placeSettings.maxWindBearingToRWY = val.maxWindBearingToRWY;
		},
		// GlobalApp
		'GLOBAL_ADD_MESSAGE' (state, message) {
			state.globalApp.globalMessages.push(message);
		},
		'GLOBAL_REMOVE_MESSAGE' (state, index) {
			state.globalApp.globalMessages.splice(index, 1);
		},
		'GLOBAL_SET_TITLE' (state, title) {
			state.globalApp.topBarTitle = title;
		},
		'GLOBAL_SET_WINDUNIT' (state, value) {
			state.globalApp.settings.windUnit = value;
		},
		'GLOBAL_SET_TIMEFORMAT' (state, value) {
			state.globalApp.settings.timeFormat = value;
		},
		'GLOBAL_SET_TEMPERATURE_UNIT' (state, value) {
			state.globalApp.settings.temperatureUnit = value;
		},
		'GLOBAL_SET_WEATHER_RANGE' (state, value) {
			state.globalApp.settings.weatherRange = value;
		},
	},
	actions: {
		'PLACE_UPDATE_LIMITS_SETTINGS' (state, val) {
			// @todo: API LOAD HERE
			state.commit('PLACE_UPDATE_LIMITS_SETTINGS', val);
		},
		'PLACE_UPDATE_LIST_ORDERS' (state, val) {
			// Update the place's order Index

			// SAVE TO API
			WPAPI.reorderPlaces(val);
			
		
			state.commit('PLACE_LIST_ORDERS_UPDATED', val);
		},
		'USER_GET_PLACES' (state, newPlaces) {
			// @todo: API LOAD HERE
			state.commit('USER_SAVE_PLACES', newPlaces);
		}
	},
	getters: {
		maxWindSpeed: state => {
			if (state.existingPlaceView.weatherData && state.existingPlaceView.weatherData.hourly) {
				var maxAchievedSpeed = 0;
				state.existingPlaceView.weatherData.hourly.forEach(function(hour) {
					if(hour.windGust > maxAchievedSpeed) {
						maxAchievedSpeed = hour.windGust;
					}
				});
				return maxAchievedSpeed;
			}
			return null;
		}
	}
});
