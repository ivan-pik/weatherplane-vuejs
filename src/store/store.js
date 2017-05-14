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
				placeView: {

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
        }

    }
});
