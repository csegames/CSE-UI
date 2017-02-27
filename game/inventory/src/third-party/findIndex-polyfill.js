/**
 * Based on source from:
 * https://github.com/jsPolyfill/Array.prototype.findIndex
 * 
 * This source code is released under the MIT license, see
 * terms below.
 * 
 The MIT License (MIT)

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

(function() {
  'use strict';

  Array.prototype.findIndex = Array.prototype.findIndex || function(callback) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    } else if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    for (var i = 0; i < length; i++) {
      if ( callback.call(thisArg, list[i], i, list) ) {
        return i;
      }
    }
    return -1;
  };
}());
