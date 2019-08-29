/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export function getNumberSuffix(num: number) {
  const numString = num.toString();
  if (num - 10 < 10 && num - 10 > 0) {
    // All teen numbers are suffixed with th
    return 'th';
  }

  switch (numString.charAt(numString.length - 1)) {
    case '1': {
      return 'st';
    }
    case '2': {
      return 'nd';
    }
    case '3': {
      return 'rd';
    }
    default: {
      return 'th';
    }
  }
}
