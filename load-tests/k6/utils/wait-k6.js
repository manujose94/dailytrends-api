"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitTime = void 0;

function randomIntMaxMin(min, max) {
    return Math.abs(Math.floor(Math.random() * (max - min + 1) + min));
};

let _k6 = require("k6");
/**
 * Utility function for load test scripts.
 * Generates a random wait time between min and max milliseconds.
 * @param {number} min - Minimum wait time in milliseconds.
 * @param {number} max - Maximum wait time in milliseconds.
 */
var waitTime = function waitTime(min, max) {
  (0, _k6.sleep)(randomIntMaxMin(min, max) / 1000);
};

exports.waitTime = waitTime;