'use strict';

/**
 * (Destructive)
 * Delete if having, add if not having.
 */
export function toggle<T>(s: Set<T>, val: T): Set<T> {
  if (s.has(val)) {
    s.delete(val);
  } else {
    s.add(val);
  }
  return s;
}

export function toggled<T>(s: Set<T>, val: T): Set<T> {
  return toggle(new Set(s), val);
}
