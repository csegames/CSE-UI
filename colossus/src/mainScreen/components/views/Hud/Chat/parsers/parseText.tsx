/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { ChatOptionsState } from '../../../../../redux/chatSlice';
import { parseNewline } from './newline';

export type Parser = (text: string, opts: ChatOptionsState, next: Parser) => [string, JSX.Element];

const parsers: Parser[] = [parseNewline];

function parse(text: string, opts: ChatOptionsState, next: Parser): [string, JSX.Element] {
  let before = text;
  let content = null;
  const result = [];
  for (let i = 0; i < parsers.length && before.length > 0; ++i) {
    const fn = parsers[i];
    [before, content] = fn(before, opts, next);
    if (content) result.push(content);
  }

  return [before, <>{result.reverse()}</>];
}

export function parseText(text: string, opts: ChatOptionsState): JSX.Element {
  var [before, after] = parse(text, opts, parse);
  return (
    <>
      {before && before}
      {after && after}
    </>
  );
}
