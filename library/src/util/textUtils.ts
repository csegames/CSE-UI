/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// This function will capitalize the beginning of each word and put a space between them.
// Ex.) forearmLeft -> Forearm Left
export const toTitleCase = (text: string) => {
  if (text) return text.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
};

export const toSentenceCase = (text: string) => {
  if (text) return text.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, (str) => { return str.toUpperCase(); });
};
