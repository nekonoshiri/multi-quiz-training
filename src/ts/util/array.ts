'use strict';

/**
 * Checks if two arrays are equal or not.
 */
export function equal<T>(arr1: Array<T>, arr2: Array<T>): boolean {
  if (arr1.length != arr2.length) return false;
  return arr1.every((x, i) => x === arr2[i]);
}

/**
 * Creates a new array with the sub-array elements concatted into it.
 */
export function flatten<T>(arr: Array<Array<T>>): Array<T> {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

/**
 * Creates a new array whose i-th element is modified by the function.
 */
export function
modified<T>(arr: Array<T>, i: number, f: (x: T) => T): Array<T> {
  const newArr = arr.slice();
  newArr[i] = f(newArr[i]);
  return newArr;
}

/**
 * (Destructive)
 * Randomizes the order of the elements in a given array
 * using Fisher-Yates algorithm.
 */
export function shuffle<T>(arr: Array<T>): Array<T> {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Creates a new array randomized the order of the elements
 * using Fisher-Yates algorithm.
 */
export function shuffled<T>(arr: Array<T>): Array<T> {
  return shuffle(arr.slice());
}
