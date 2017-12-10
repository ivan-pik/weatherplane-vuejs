import {getLocalToken} from '../auth'

import axios from 'axios';


const HTTP = axios.create({
	baseURL: '//localhost:4000/',
	headers: {'authorization': getLocalToken()}
})


var api = {
	// User Accounts

	// Authenticate
	authenticate(credentials) {
		return new Promise(function(resolve, reject) {
			HTTP.post('/authenticate', credentials)
			.then(function (response) {

				if (response.data.success) {
					// @todo: fix this!
					HTTP.interceptors.request.use(
						config => {
							config.headers.authorization = getLocalToken();
							return config;
						},
						error => Promise.reject(error)
					);

					resolve(response.data.token);

				} else {
					reject();
				}
				
			})
			.catch(function (error) {
				resolve(error);
			});	
		});
		
	},


	// Change order of places
	reorderPlaces(payload) {
		HTTP.post('/places/reorder-places', payload)
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});
	},
	// Fetch place details
	getPlace(payload) {
		return new Promise(function(resolve, reject) {
			HTTP.get(`/places/${payload.user}/${payload.place}/`)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				resolve(error);
			});	
		});
	},
	// Create a new place
	createPlace(payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post('/places', payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				resolve(error);
			});	
		});
	},
	// Get Place Weather
	getPlaceWeather(oid) {
		return new Promise(function(resolve, reject) {
			HTTP.get('weather/' + oid)
			.then(function (response) {
				resolve(response.data.data);
			})
			.catch(function (error) {
				resolve(error);
			});	
		});
	},
	// Get Temporary Place Weather
	// @todo: make the API work
	getTempPlaceWeather(coordinates) {
		return new Promise(function(resolve, reject) {
			HTTP.get('temporaryWeather/', {
				params: {
					lat: coordinates.lat,
					lng: coordinates.lng
				}
			})
			.then(function (response) {
				if (response.data.success) {
					resolve(response.data.data.weather);
				} else {
					reject(response.response.data.error)
				}
				
			})
			.catch(function (error) {
				reject(error);
			});	
		});
	},
	// Retrieve lost password
	retrieveLostPassword(payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post('/login/retrieve-lost-password', payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				resolve(error);
			});	
		});
	},
	// Retrieve lost username
	retrieveLostUsername(payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post('/login/retrieve-lost-username', payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				resolve(error);
			});	
		});
	} 
}

export default api;