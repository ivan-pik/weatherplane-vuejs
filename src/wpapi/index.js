import {getLocalToken} from '../auth'

import axios from 'axios';


const HTTP = axios.create({
	baseURL: '//localhost:4000/',
	headers: {'authorization': getLocalToken()}
})


var api = {
	reorderPlaces(payload) {
		HTTP.post('/settings/reorder-places', payload)
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});
	}
}

export default api;