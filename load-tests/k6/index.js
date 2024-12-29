import { check, group } from 'k6';
import { SharedArray } from 'k6/data';
import { CONFIGURATION, PATH_WEIGHT } from './constants.js';
import { randomWithWeight } from './utils/random-utils.js';

import  {HttpServices} from "./services/http-service.js"
import {USERS} from "./data/user-data.js"
const service = new HttpServices();


const dataShared = new SharedArray('userContent', function () {
    return USERS;
});

export function setup() {

}


export default function () {

    let pathType = randomWithWeight(PATH_WEIGHT);
    
    group('useCase', function () {
        switch (pathType) {
            case "getNews":
                servicesObj.getNews();
                break;
            case "registerUser":
                servicesObj.registerUser(dataShared);
                break;
            case "loginUser":
                servicesObj.loginUser(dataShared);
                break;
            default:
                check(false, { 'NOT VALID PATH TYPE': (r) => r === true, })
            }
    });
}

// 4. teardown code
export function teardown() {

}