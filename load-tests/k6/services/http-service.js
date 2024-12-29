import { check, group } from 'k6';
import {  bodyBuilderUserLogin,bodyBuilderUserRegister, waitTimeRandom } from '../utils/http-utils.js';
import { randomInt } from '../libs/lib_ksixcommon/random-util.js';
import { HttpClient } from '../clients/http-client.js';

let client = new HttpClient()

export class HttpServices {
  
  constructor() {
  }

  registerUser(data) {
    group('registerUser', function () {

        const body = bodyBuilderUserRegister(data.length - 1);
        let res = client.registerUser(body)
       
        //Check HTTP 200
        check(res, {
          'is status 200': (r) => r.status === 200,

        });
    })
    waitTimeRandom()
  }

  loginUser (data) {
    group('loginUser', function () {
        
        const user = randomInt(data - 1);
        const body = bodyBuilderUserLogin(user);

        //POST request
        let res = client.loginUser(artifactId, body);
        
        //Check HTTP 200
        check(res, {
          'is status 200': (r) => r.status === 200 ||  r.status === 202,
        });
    })
    waitTimeRandom()
  }

  getNews () {
    group('getNews', function () {
        //POST request
        let res = client.getNews();
        
        //Check HTTP 200
        check(res, {
          'is status 200': (r) => r.status === 200 ||  r.status === 202,
        });
    })
    waitTimeRandom()
  }

}