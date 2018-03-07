import Vue from 'vue'
import store from './store/store';
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate';
import App from './App/index.vue'

// import {checkAuth, getLocalToken} from './auth/index.js'

import WelcomeView from 'WelcomeView/index.vue'
import MapSearchView from './MapSearch/MapSearchView/index.vue'
import LoginView from './Login/LoginView/index.vue'
import RegisterView from './Register/RegisterView/index.vue'
import ResetPassword from './User/ResetPassword/index.vue'
import SettingsView from './User/SettingsView/index.vue'
import ExistingPlaceView from './Place/ExistingPlaceView/index.vue'
import UserPlacesView from './Place/UserPlacesView/index.vue'

import uiNote from 'uiComponents/uiNote.vue'
import uiModal from 'uiComponents/modal.vue'
import uiRadio from 'uiComponents/buttonRadio.vue'
import uiSlider from 'uiComponents/slider.vue'
import uiLoader from 'uiComponents/uiLoader.vue'
import uiHelpBubble from 'uiComponents/helpBubble.vue'

import navigationHeader from 'Navigation/navigationHeader.vue'


// @todo: better way of registering global components
Vue.component(
	'ui-note', uiNote
);

Vue.component(
	'ui-modal', uiModal
);

Vue.component(
	'navigation-header', navigationHeader
);

Vue.component(
	'ui-radio', uiRadio
);

Vue.component(
	'ui-slider', uiSlider
);

Vue.component(
	'ui-loader', uiLoader
);

Vue.component(
	'ui-help-bubble', uiHelpBubble
);


const routes = [
		{ path: '/', name: 'home', component: WelcomeView},
		{ path: '/search', name: 'search', component: MapSearchView},
		{ path: '/login', name: 'login', component: LoginView },
		{ path: '/settings', name: 'settings', component: SettingsView },
		{ path: '/reset-password', name: 'resetPassword', component: ResetPassword },
		{ path: '/signup', name: 'signup', component: RegisterView },
		{ path: '/place', name: 'place', component: ExistingPlaceView },
		{ path: '/:username/', component: UserPlacesView },
		{ path: '/:username/:place', component: ExistingPlaceView },
]

const router = new VueRouter({
	mode: 'history',
	routes
})

Vue.use(VueRouter);
Vue.use(VueResource);


// Vue.http.options.root = '//localhost:4000';

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






const app = new Vue({
	el : '#app',
	store,
	router,
	render: h => h(App)
})
