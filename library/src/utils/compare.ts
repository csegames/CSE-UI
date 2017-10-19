/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function stricmp(a: string, b: string) {
  const normalizedA = a.toLowerCase();
  const normalizedB = b.toLowerCase();
  return normalizedA < normalizedB ? -1 : normalizedB > normalizedA ? 1 : 0;
}

export function datecmp(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return da < db ? -1 : da > db ? 1 : 0;
}
