/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// tslint:disable-next-line
export function CSENormalizeString(s: string): string {
  return s ? s.replace(/[^a-z0-9]/gi, '').toLowerCase() : s;
}
