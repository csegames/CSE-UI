/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { OptionsState } from '../state/optionsState';
// import { parseColors } from './colors';
// import { parseBlink } from './blink';
import { parseEmoji } from './emoji';
import { parseHighlight } from './highlight';
import { parseEmbeds } from './embeds';
import { parseMarkdown } from './markdown';

export type Parser = (text: string, opts: OptionsState, next: Parser) => [string, JSX.Element];

const parsers: Parser[] = [
  parseHighlight,
  parseMarkdown,
  // parseColors,
  // parseBlink,
  parseEmoji,
  parseEmbeds,
]

export function parseText(text: string, opts: OptionsState, next: Parser = this) {

  let before = text;
  let content = null;
  const result = [];
  for (let i = 0; i < parsers.length, before.length > 0; ++i) {
    [before, content] = parsers[i](before, opts, next);
    if (content) result.push(content);
  }

  return (
    <>
      {before && before}
      {result.reverse()}
    </>
  )
}