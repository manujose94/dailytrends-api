import encoding from 'k6/encoding';
import { CONFIGURATION } from '../constants.js';
import { waitTime } from './wait-k6.js'
export function encodedCredentials (username, password) {
    const credentials = `${username}:${password}`;
    const encodedCredentials = encoding.b64encode(credentials);
    return encodedCredentials;
  }

export function waitTimeRandom() {
    let min = CONFIGURATION.WAIT_TIME - CONFIGURATION.WAIT_TIME_RANDOM
    let max = CONFIGURATION.WAIT_TIME + CONFIGURATION.WAIT_TIME_RANDOM
  
    waitTime(min, max)
  }

  export function bodyBuilderUserLogin(password,email){
    return JSON.stringify({
         "email": email,
         "password": password ? password : "pass",
       }); 
   }
 
   export function bodyBuilderUserRegister(username,email){
     return JSON.stringify({
             "email": email,
             "password": password ? password : "pass",
         }); 
   }