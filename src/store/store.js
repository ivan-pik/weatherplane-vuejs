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
          place: {}
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

    }
});
