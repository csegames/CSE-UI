/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function toTitleCase(value: string): string {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => {
    return str.toUpperCase();
  });
}

export function printWithSeparator(value: number, separator: string) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
