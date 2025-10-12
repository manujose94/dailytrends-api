import http from 'k6/http';
import { CONFIGURATION } from '../constants.js';
import { encodedCredentials } from '../utils/http-utils.js';

let token; 

if(CONFIGURATION.AUTHORIZATION == "Basic") {
  token = encodedCredentials(`${config.USER}`, `${config.PASSWORD}`);
} else { //Bearer
  token = `${CONFIGURATION.JWT_TOKEN}`;
}

let authorization = CONFIGURATION.AUTHORIZATION + ' ' + token;

let params = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${authorization}`,
    'x-itx-traffic': 'synthetic',
  },
  timeout: "5s"
};
  
export class HttpClient {
    constructor() {
    }
  
    getNewsElMundo(limit=10) {
      return http.get(`${CONFIGURATION.HOST}//api/v1/news/scrape?provider=elmundo&limit=${limit}`, params);
    }

    getNewsElPais(limit=10) {
      return http.get(`${CONFIGURATION.HOST}//api/v1/news/scrape?provider=elmundo&limit=${limit}`, params);
    }

    loginUser(body) {
      return http.post(`${CONFIGURATION.HOST}/api/v1/auth/login`, body, params);
    }
    registerUser(body) {
        return http.post(`${CONFIGURATION.HOST}/api/v1/auth/register`, body, params);
      }
}