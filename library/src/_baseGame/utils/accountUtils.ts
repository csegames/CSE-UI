/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// coherent doesn't have native bigint, this acts as a wrapper when
// the native type is available.
import * as BigInt from 'big-integer';

interface TokenGuts {
  acc: string;
}

export function getAccountID(accessToken: string): string {
  const bits: string[] = accessToken.split('.');
  if (bits.length != 3) {
    return null;
  }

  const middle = atob(bits[1]);
  try {
    const parsed: TokenGuts = JSON.parse(middle);
    return parsed.acc;
  } catch (e) {
    console.error('Failed to parse account ID', e);
    return null;
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ID128 encoding functions -- applies to many id types including
// AccountID
//
// The legacy format is a homebrew base62 encoding ... a planned two
// step migration will replace this with an astrisk prefixed base64url
// (using the prefix as a hint until all systems are converted, which
// takes at least two full patch cycles) followed by just the
// base64url standard once all uses of base62 have been stamped out.
// The latter phase will still need to detect and remove the prefix
// for older systems. The code below supports the first two phases;
// reading the third phase requires no longer supporting the first
// and will happen at a future point in time.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
type Formats = 'legacy' | 'transition' | 'standard';
export let encodeFormat: Formats = 'legacy';
const code_0 = '0'.charCodeAt(0);
const code_9 = '9'.charCodeAt(0);
const code_A = 'A'.charCodeAt(0);
const code_a = 'a'.charCodeAt(0);
const code_Z = 'Z'.charCodeAt(0);
const code_z = 'z'.charCodeAt(0);
const factor = BigInt(62);
const byte = BigInt(256);

export function setID128Format(format: Formats) {
  encodeFormat = format;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// decode
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function decodeID128(id: string): Uint8Array | null {
  if (id.length == 23 && id[0] === '*') {
    // transition value
    return fromBase64Url(id.substring(1));
  }

  if (id.length != 22) {
    return null;
  }

  var bits0 = BigInt(0);
  var bits1 = BigInt(0);

  var t = BigInt(0);
  var i = 22;
  while (true) {
    var c = id.charCodeAt(--i);
    var n = 0;
    if (c >= code_0 && c <= code_9) {
      n = c - code_0;
    } else if (c >= code_A && c <= code_Z) {
      n = c - code_A + 10;
    } else if (c >= code_a && c <= code_z) {
      n = c - code_a + 36;
    } else {
      return null;
    }

    t = t.multiply(62).add(n);

    if (i == 0) {
      bits0 = t;
      break;
    } else if (i == 11) {
      bits1 = t;
      t = BigInt(0);
    }
  }

  var buffer = Buffer.alloc(16);
  var index = 0;
  for (i = 8; i > 0; --i) {
    var divRem = bits0.divmod(256);
    buffer[index++] = Number(divRem.remainder);
    bits0 = divRem.quotient;
  }

  for (i = 8; i > 0; --i) {
    var divRem = bits1.divmod(256);
    buffer[index++] = Number(divRem.remainder);
    bits1 = divRem.quotient;
  }
  return new Uint8Array(buffer);
}

function fromBase64Url(raw: string): Uint8Array {
  var formatted = raw.replace('-', '+').replace('_', '/');
  return new Uint8Array(Buffer.from(formatted, 'base64'));
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// encode
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function encodeID128(raw: Uint8Array): string | null {
  if (raw.byteLength != 16) {
    return null;
  }
  switch (encodeFormat) {
    case 'legacy':
      break;
    case 'transition':
      return '*' + toBase64Url(raw);
    case 'standard':
      return toBase64Url(raw);
  }

  const data = new DataView(raw.buffer);
  var c = '';
  var remaining = readUint64(raw, 0);

  for (var i = 0; i < 22; ++i) {
    if (i === 11) remaining = readUint64(raw, 8);

    var divRem = remaining.divmod(62);
    remaining = divRem.quotient;
    var nextChar = Number(divRem.remainder);
    if (nextChar < 10) {
      c += nextChar;
    } else if (nextChar < 36) {
      c += String.fromCharCode(code_A + nextChar - 10);
    } else {
      c += String.fromCharCode(code_a + nextChar - 36);
    }
  }
  return c;
}

function readUint64(raw: Uint8Array, offset: number): BigInt.BigInteger {
  const data = new DataView(raw.buffer);
  const low = data.getUint32(offset, true);
  const high = data.getUint32(offset + 4, true);
  return BigInt(low).add(BigInt(high).multiply(2 ** 32));
}

function toBase64Url(raw: Uint8Array): string {
  var str = Buffer.from(raw).toString('base64').replace('+', '-').replace('/', '_');
  return str.substring(0, 22);
}
