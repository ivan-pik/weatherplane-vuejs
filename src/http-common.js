import axios from 'axios';
import {getLocalToken} from './auth'

var loadToken = getLocalToken()

export const HTTP = axios.create({

	baseURL: '//localhost:4000/',
	headers: {
    Authorization: loadToken.token
  }

})
