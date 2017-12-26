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

	// Update place name
	/*
	payload = {
		placeName:
		userID:
		placeOID: 
	}
	*/
	updatePlaceName(payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post(`/places/update-name/`, payload)
			.then(function (response) {
				if (response.data.success) {
					resolve(response.data.data.place);
				} else {
					reject(response.data.data)
				}
				
			})
			.catch(function (error) {
				reject(error.response.data);
			});	
		});
	},

	// Update place slug
	/*
	payload = {
		placeSlug:
		userID:
		placeOID: 
	}
	*/
	updatePlaceSlug(payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post(`/places/update-slug/`, payload)
			.then(function (response) {
				if (response.data.success) {
					resolve(response.data.data.place);
				} else {
					reject(response.data.data)
				}
				
			})
			.catch(function (error) {
				reject(error.response.data);
			});	
		});
	},

	// Update place privacy
	/*
	payload = {
		placePrivacy:
		userID:
		placeOID: 
	}
	*/
	updatePlacePrivacy(payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post(`/places/update-privacy/`, payload)
			.then(function (response) {
				if (response.data.success) {
					resolve(response.data.data.place);
				} else {
					reject(response.data.data)
				}
				
			})
			.catch(function (error) {
				debugger;
				reject(error.response.data);
			});	
		});
	},

	// Update place coordinates
	/*
	payload = {
		coordinates: {lat: ,lng:}
		userID:
		placeOID: 
	}
	*/
	updatePlaceCoordinates(payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post(`/places/update-coordinates/`, payload)
			.then(function (response) {
				if (response.data.success) {
					resolve(response.data.data.place);
				} else {
					reject(response.data.data)
				}
				
			})
			.catch(function (error) {
				debugger;
				reject(error.response.data);
			});	
		});
	},

	/*
	payload = {
		bearing: 0-359
		userID:
		placeOID: 
	}
	*/
	updatePlaceBearing (payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post(`/places/update-bearing/`, payload)
			.then(function (response) {
				if (response.data.success) {
					resolve(response.data.data.place);
				} else {
					reject(response.data.data)
				}
				
			})
			.catch(function (error) {
				reject(error.response.data);
			});	
		});
	},


	/*
	payload = OID
	*/
	deletePlace (payload) {
		return new Promise(function(resolve, reject) {
			HTTP.post(`/places/delete/`, payload)
			.then(function (response) {
				if (response.data.success) {
					resolve(response.data.data.place);
				} else {
					reject(response.data.data)
				}
				
			})
			.catch(function (error) {
				reject(error.response.data);
			});	
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
	getUserPlaces(username) {
		return new Promise(function(resolve, reject) {
			HTTP.get(`/places/${username}/`)
			.then(function (response) {
				let newPlaces = response.data.data.places;
				newPlaces.sort(function(placeA, placeB) {
					return (placeA.listOrder > placeB.listOrder)
				});

				resolve(newPlaces);
			})
			.catch(function (error) {
				resolve(error);
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