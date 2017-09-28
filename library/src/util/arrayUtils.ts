/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clone } from './objectUtils';

export function cloneArray<T>(array: T[]): T[] {
  return array.slice();
}

export function defaultCompare<T>(a: T, b: T): boolean {
  return a === b;
}

export function findIndexWhere<T>(arr: T[], predicate: (a: T) => boolean): number {
  if (!arr) return -1;
  let i = arr.length;
  while (--i >= 0) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}

export function findIndex<T>(arr: T[], obj: T, equals: (a: T, b: T) => boolean = defaultCompare): number {
  if (!arr) return -1;
  let i = arr.length;
  while (--i >= 0) {
    if (equals(obj, arr[i])) return i;
  }
  return -1;
}

export function addOrUpdate<T>(arr: T[], obj: T, equals: (a: T, b: T) => boolean = defaultCompare): T[] {
  const copy = !arr ? [] : arr.slice();
  let index = -1;
  let i = copy.length;

  while (--i >= 0) {
    if (equals(obj, copy[i])) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    copy[index] = obj;
  } else {
    copy.push(obj);
  }

  return copy;
}

export function remove<T>(arr: T[], obj: T, equals: (a: T, b: T) => boolean = defaultCompare): T[] {
  if (!(arr && arr.length)) return arr;

  const copy = arr.slice();
  let index = -1;
  let i = copy.length;

  while (--i > -1) {
    if (equals(obj, copy[i])) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    copy.splice(index, 1);
  }

  return copy;
}

export function removeWhere<T>(arr: T[], predicate: (o: T) => boolean): { result: T[], removed: T[] } {
  const result: T[] = [];
  const removed: T[] = [];

  if (!(arr && arr.length)) return { result, removed };

  let i = arr.length;
  while (--i > -1) {
    const o = Array.isArray(arr[i]) ? cloneArray(arr[i] as any) as any : clone(arr[i]);
    if (predicate(o)) {
      removed.push(o);
    } else {
      result.unshift(o);
    }
  }

  return { result, removed };
}
