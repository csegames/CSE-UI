/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { chatConfig } from './ChatConfig';

function fromText(text: string, keygen: () => number, match: RegExpExecArray, parser: any): JSX.Element[] {
  const textColor: string = match[1];
  const bgColor: string = match[2];
  const matchText: string = match[3];
  if (chatConfig.SHOW_COLORS) {
    return [<span key={keygen()} style={{ color: textColor, backgroundColor: bgColor }}>{parser.parse(matchText)}</span>];
  }
  return [<span key={keygen()}>{parser.parse(matchText)}</span>];
}

// tslint:disable
function createRegExp() : RegExp {
  //return /::([A-Za-z]+|#[A-Fa-f0-9]{3,6})::([\S\s]+)$/g;
  return /(?=:::?#?[A-Za-z0-9]+)::([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})?:?([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})?::([\S\s]+)$/g;
}

export default {
  fromText,
  createRegExp,
};
