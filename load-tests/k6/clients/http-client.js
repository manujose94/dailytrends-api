import http from 'k6/http';
import { config } from '../constants.js';
import { encodedCredentials } from '../utils/http-utils.js';

let token; 

if(config.AUTHORIZATION == "Basic") {
  token = encodedCredentials(`${config.USER}`, `${config.PASSWORD}`);
} else { //Bearer
  token = `${config.JWT_TOKEN}`;
}

let authorization = config.AUTHORIZATION + ' ' + token;

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
  
    getNews() {
      return http.get(`${config.HOST}//api/v1/news/scrape?provider=elmundo&limit=5`, params);
    }

    loginUser(body) {
      return http.post(`${config.HOST}/api/v1/auth/login`, body, params);
    }
    registerUser(body) {
        return http.post(`${config.HOST}/api/v1/auth/register`, body, params);
      }
}