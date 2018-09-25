/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

function fromText(text: string, keygen: () => number, match: RegExpExecArray, parser: any): JSX.Element[] {
  if (match && (match[2] || match[4])) {
    const matchBeginChar: string = match[1] ? match[1] : '';
    const matchEndChar: string = match[6] ? match[6] : '';
    const matchCount: number = match[2] ? match[2].length : match[4].length;
    const matchText: string = match[2] ? matchBeginChar + match[3] + matchEndChar : matchBeginChar + match[5] + matchEndChar;
    if (matchCount === 1) {
      return [<i key={keygen()}>{parser.parse(matchText)}</i>];
    }
    return [<b key={keygen()}>{parser.parse(matchText)}</b>];
  }
}

function createRegExp(): RegExp {
  return /(^|\s)(?:(\*\*|\*)([^\*]+)\2)|(?:(__|_)([^_]+)\4)($|\s)/g;
}

export default {
  fromText,
  createRegExp,
};
