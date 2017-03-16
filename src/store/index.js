import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  // data structure of your application
  // initial state here
  state: {
    locations : [],
    userProfile : {}
  },

  // calls that will commit changes
  actions: {

  },

  // update store
  mutations: {
    saveUserProfile(state, data) {
      state.userProfile = data;
    }
  },

  // Calculated data
  getters: {

  }
})

export default store
