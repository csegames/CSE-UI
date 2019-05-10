/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { OptionsState } from '../state/optionsState';
import { Parser } from './parseText';

export function parseColors(text: string, opts: OptionsState, next: Parser): [string, JSX.Element] {
  if (!opts.parsing.colors) {
    return [text, null];
  }
  const regex = /(?=:::?#?[A-Za-z0-9]+)::([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})?:?([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})?::([\S\s]+)$/g;
  const match = regex.exec(text);
  if (!match) {
    return [text, null];
  }
  return [
    text.substr(0, match.index),
    <span key={genID()} style={{color: match[1], backgroundColor: match[2]}}>{next(match[3], opts, next)}</span>
  ];
}
