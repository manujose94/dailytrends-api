import { check, group, randomSeed } from 'k6';
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
    // REVIEW: It is necessary to use token for each call
    // add token to header
    let pathType = randomWithWeight(PATH_WEIGHT);
    let limit = randomSeed(12);
    group('useCase', function () {
        switch (pathType) {
            case "getNewsElMundo":
                service.getNewsElMundo(limit);
                break;
           case "getNewsElPais":
                service.getNewsElPais(limit);
                break;
            default:
                check(false, { 'NOT VALID PATH TYPE': (r) => r === true, })
            }
    });
}

// 4. teardown code
export function teardown() {

}