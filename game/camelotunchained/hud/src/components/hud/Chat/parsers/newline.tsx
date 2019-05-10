/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { OptionsState } from '../state/optionsState';
import { Parser, parseText } from './parseText';

export function parseNewline(text: string, opts: OptionsState, next: Parser): [string, JSX.Element] {

  const split = text.split(/\n/);
  if (split.length === 1) {
    return [text, null];
  }

  return [
    '',
    <>
      {split.map((s, i) => 
        <>
          {parseText(s, opts)}
          {i < split.length -1 ? <br/> : null}
        </>
      )}
    </>
  ];
}
