window.PFQ_ARRAY_UTILS = window.PFQ_ARRAY_UTILS || {};

/**
 * Returns the sum of all the numbers in the array.
 * @param {number[]} numbers
 */
PFQ_ARRAY_UTILS.sum = function(numbers) {
    return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};