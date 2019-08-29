/**
 * SOURCE:
 * https://github.com/BendingBender/object-assign-shim
 * 
The MIT License (MIT)

Copyright (c) 2014 Dimitri Benin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

(function () {
    'use strict';

    // modified from https://github.com/ljharb/object.assign
    if (Object.assign && Object.preventExtensions) {
        var assignHasPendingExceptions = (function () {
            // Firefox 37 still has "pending exception" logic in its Object.assign implementation,
            // which is 72% slower than our shim, and Firefox 40's native implementation.
            var thrower = Object.preventExtensions({1: 2});
            try {
                Object.assign(thrower, 'xy');
            } catch (e) {
                return thrower[1] === 'y';
            }
        }());
        if (assignHasPendingExceptions) {
            delete Object.assign;
        }
    }

    if (!Object.assign) {
        var keys = Object.keys;
        var defineProperty = Object.defineProperty;
        var canBeObject = function (obj) {
            return typeof obj !== 'undefined' && obj !== null;
        };
        var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
        var propIsEnumerable = Object.prototype.propertyIsEnumerable;
        var isEnumerableOn = function (obj) {
            return function isEnumerable(prop) {
                return propIsEnumerable.call(obj, prop);
            };
        };

        // per ES6 spec, this function has to have a length of 2
        var assignShim = function assign(target, source1) { //eslint-disable-line no-unused-vars
            if (!canBeObject(target)) {
                throw new TypeError('target must be an object');
            }
            var objTarget = Object(target);
            var s, source, i, props;
            for (s = 1; s < arguments.length; ++s) {
                source = Object(arguments[s]);
                props = keys(source);
                if (hasSymbols && Object.getOwnPropertySymbols) {
                    props.push.apply(props, Object.getOwnPropertySymbols(source).filter(isEnumerableOn(source)));
                }
                for (i = 0; i < props.length; ++i) {
                    objTarget[props[i]] = source[props[i]];
                }
            }
            return objTarget;
        };

        defineProperty(Object, 'assign', {
            value: assignShim,
            configurable: true,
            enumerable: false,
            writable: true
        });
    }
}());
