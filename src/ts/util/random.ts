'use strict';

/**
 * Getting a random integer between two numbers.
 * if max_inclusive: min <= result <= max
 * else: min <= result < max
 */
export const getRandomInt =
  (min: number, max: number, max_inclusive: boolean = false): number =>
{
  min = Math.ceil(min);
  max = max_inclusive ? Math.floor(max) : Math.ceil(max);
  return min +
    Math.floor(Math.random() * ((max_inclusive ? 1 : 0) + max - min));
};
