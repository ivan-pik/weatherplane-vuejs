import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// @todo: separate into modules

export default new Vuex.Store({
	state: {
		user: {
			loggedIn: false,
			name: false,
				authenticationRequired: false,
				authenticated: false
		},
		placeSearch: {
			place: {},
				placeSelected: false,
				selectedLocation: {
				coordinates: {}
			}
		},
		existingPlaceView: {
			place: null,
			weatherData: null,
			view: {
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
		'USER_AUTHENTICATION_REQUIRED' (state) {
			state.user.authenticationRequired = true;
		},
		'USER_AUTHENTICATED' (state) {

			state.user.authenticated = true;
		},
		// Place Search
		'PLACE_SEARCH_PLACE_SELECTED' (state, place) {
			state.placeSearch.place = place;
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
		'PLACE_VIEW_LIMITS_SETTINGS' (state, val) {
			state.existingPlaceView.view.limitsSettings.panelOpen = val;
		},
		'PLACE_UPDATE_LIMITS_SETTINGS' (state, val) {
			state.existingPlaceView.place.placeSettings.maxWindSpeed = val.maxWindSpeed;
			state.existingPlaceView.place.placeSettings.maxCrossWindSpeed = val.maxCrossWindSpeed;
			state.existingPlaceView.place.placeSettings.maxPrecipProbability = val.maxPrecipProbability;
			state.existingPlaceView.place.placeSettings.minTemperature = val.minTemperature;
			state.existingPlaceView.place.placeSettings.maxTemperature = val.maxTemperature;
			state.existingPlaceView.place.placeSettings.maxWindBearingToRWY = val.maxWindBearingToRWY;
		}
	},
	actions: {
		'PLACE_UPDATE_LIMITS_SETTINGS' (state, val) {
			// @todo: API SAVE
			
			state.commit('PLACE_UPDATE_LIMITS_SETTINGS', val);
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
