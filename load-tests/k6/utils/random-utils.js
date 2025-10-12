/**
 * Selects a random item from a weighted map.
 * @param {Object} map - An object where keys represent items and values represent weights.
 * @returns {string} - The randomly selected item.
 */
export function randomWithWeight(map) {
    let sum = 0;
    const r = Math.random();

    for (const item in map) {
        sum += map[item];
        if (r <= sum) {
            return item;
        }
    }
}


/**
 * Generates a random integer between 0 and the specified maximum, inclusive.
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random integer between 0 and max.
 */
export function getRandomIntInclusiveZeroToMax(max) {
    return Math.floor(Math.random() * (max + 1)); // The maximum is inclusive
}

/**
 * Generates a random integer between the specified minimum and maximum, inclusive.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random integer between min and max.
 */
export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min); // The minimum is inclusive
    max = Math.floor(max); // The maximum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive
}