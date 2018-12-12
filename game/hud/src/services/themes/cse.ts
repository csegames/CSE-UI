/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default function(): Theme {
  return {
    name: 'cse',
    description: 'The default CSE theme.',
    author: 'City State Entertainment',

    unitFrames: {
      color: {
        health: '#3FA7FF',
        blood: '#DF2E00',
        stamina: '#53FF64',
        panic: '#FFF153',
      },
    },
  };
}
