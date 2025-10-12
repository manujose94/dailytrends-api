import { check, group } from 'k6';
import {  bodyBuilderUserLogin,bodyBuilderUserRegister, waitTimeRandom } from '../utils/http-utils.js';
import { getRandomIntInclusiveZeroToMax } from '../utils/random-utils.js';
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
        
        const user = getRandomIntInclusiveZeroToMax(data - 1);
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

  getNewsElMundo (limit) {
    group('getNewsElMundo', function () {
        //POST request
        let res = client.getNewsElMundo();
        
        //Check HTTP 200
        check(res, {
          'is status 200': (r) => r.status === 200 ||  r.status === 202,
        });
    })
    waitTimeRandom()
  }

  getNewsElPais (limit) {
    group('getNewsElPais', function () {
        //POST request
        let res = client.getNewsElPais();
        
        //Check HTTP 200
        check(res, {
          'is status 200': (r) => r.status === 200 ||  r.status === 202,
        });
    })
    waitTimeRandom()
  }

}