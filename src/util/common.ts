'use strict';

/**
 * Returns true if x is array and (∀e ∈ x. typeof e === typeString).
 */
export const isArrayOfType = (typeString: string, x: any): boolean =>
  Array.isArray(x) && x.every((elem: any) => typeof elem === typeString);
