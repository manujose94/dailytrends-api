import { sleep } from "k6";

/**
 * Utility function for load test scripts.
 * Generates a random wait time between min and max milliseconds.
 * @param {number} min - Minimum wait time in milliseconds.
 * @param {number} max - Maximum wait time in milliseconds.
 */
function randomIntMaxMin(min, max) {
  return Math.abs(Math.floor(Math.random() * (max - min + 1) + min));
}

export function waitTime(min, max) {
  sleep(randomIntMaxMin(min, max) / 1000);
}
