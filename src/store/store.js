import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            name: false
        },
        placeSearch: {
          place: {},
          placeSelected: false,
          selectedLocation: {
            coordinates: {}
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
