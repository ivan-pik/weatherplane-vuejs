import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

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
			layout: {
				windBearingRelativeToRunway: false
			},
			weatherThresholds: {
				// @todo: get those from API
				windSpeed: 4,
				temperature: 0,
				windDirectionRelToRWY: 45,
				crosswindSpeed: 4,
				precipProbability: 50
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
