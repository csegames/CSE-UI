/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as objectUtils from './objectUtils';

interface testObject {
  foo: string;
  bar: testNestedObject;
}

interface testNestedObject {
  baz: string;
}

describe('objectUtils', () => {

  describe('clone', () => {

    test('should return an object', () => {
      const original: testObject = { foo: 'bar', bar: { baz: 'foo' } };
      const cloned: testObject = objectUtils.clone(original);
      expect(cloned).toBeInstanceOf(Object);
    });

    it('contains exact values of input object', () => {
      const original: testObject = { foo: 'bar', bar: { baz: 'foo' } };
      const cloned: testObject = objectUtils.clone(original);
      expect(cloned).toEqual(original);
    });

    it('should not reference input object', () => {
      const original: testObject = { foo: 'bar', bar: { baz: 'foo' } };
      const originalReference: testObject = original;
      const cloned: testObject = objectUtils.clone(original);
      expect(originalReference).toBe(original);
      expect(cloned).not.toBe(original);
      expect(cloned.foo).toEqual(original.foo);
      cloned.foo = 'baz';
      expect(cloned.foo).not.toEqual(original.foo);
    });

  });

});
