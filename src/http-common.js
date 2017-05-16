import axios from 'axios';
import {getLocalToken} from './auth'



export const HTTP = axios.create({

	baseURL: '//localhost:4000/'


})

HTTP.defaults.headers.authorization = getLocalToken();
