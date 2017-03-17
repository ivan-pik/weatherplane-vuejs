import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import LoginView from './LoginView/index.vue'
import RegisterView from './RegisterView/index.vue'

import AppComponent from './App/index.vue'
import Navigation from './Navigation/index.vue'



Vue.use(VueRouter)
Vue.use(Vuex)



const routes = [
  { path: '/login', component: LoginView },
  { path: '/signup', component: RegisterView }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

import VeeValidate from 'vee-validate';

const veeConfig = {
  errorBagName: 'validationErrors', // change if property conflicts.
  fieldsBagName: 'fields',
  delay: 0,
  locale: 'en',
  dictionary: null,
  strict: true,
  enableAutoClasses: true,
  classNames: {
    touched: 'is-touched', // the control has been blurred
    untouched: 'is-untouched', // the control hasn't been blurred
    valid: 'is-valid', // model is valid
    invalid: 'is-invalid', // model is invalid
    pristine: 'is-pristine', // control has not been interacted with
    dirty: 'is-dirty' // control has been interacted with
  }
};

Vue.use(VeeValidate, veeConfig);


const store = new Vuex.Store({
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




const app = new Vue({
  el : '#app',
  store,
  router,
  components: {
    'navigation': Navigation
  },
  data : {
    userInfo : "user info"
  }
})
