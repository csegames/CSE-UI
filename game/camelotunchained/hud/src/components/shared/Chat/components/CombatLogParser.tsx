/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ChatTextParser, ChatTextParserToken } from './ChatTextParser';
import { chatConfig } from './ChatConfig';

import parseColors from './ParseColors';
import parseBlink from './ParseBlink';
import parseMarkdown from './ParseMarkdown';
import parseLinks from './ParseLinks';
import parseHighlight from './ParseHighlight';

class CombatLogParser {
  public static LINK: number = ChatTextParser.TEXT + 1;
  public static MARKDOWN: number = ChatTextParser.TEXT + 3;
  public static COLOR: number = ChatTextParser.TEXT + 4;
  public static BLINK: number = ChatTextParser.TEXT + 5;
  public static HIGHLIGHT: number = ChatTextParser.TEXT + 7;
  public _key: number = 1;

  public parseText(text: string): JSX.Element[] {
    return [<span key={this._key++}>{text}</span>];
  }

  public parseAction(text: string): JSX.Element[] {
    if (!text) {
      return null;
    }
    const html: JSX.Element[] = [];
    const content: JSX.Element[] = this.parse(text.substr(4).trim());
    html.push(<span key={this._key++} className='chat-line-action'>&lt;{content}&gt;</span>);
    return html;
  }

  public isAction(text: string): boolean {
    if (!text) {
      return false;
    }
    return text.toLowerCase().substr(0, 4) === '/me ';
  }

  public parse(text: string): JSX.Element[] {
    if (text === null) return null;
    const keygen = (): number => { return this._key++; };
    const tokens: ChatTextParserToken[] = [];
    // Parsers which need recursion should be first
    tokens.push({ token: CombatLogParser.COLOR, expr: parseColors.createRegExp() });
    tokens.push({ token: CombatLogParser.BLINK, expr: parseBlink.createRegExp() });
    if (chatConfig.SHOW_MARKDOWN) {
      tokens.push({ token: CombatLogParser.MARKDOWN, expr: parseMarkdown.createRegExp() });
    }
    // Parsers with simple search/replace should be last
    tokens.push({ token: CombatLogParser.LINK, expr: parseLinks.createRegExp() });
    const highlights = chatConfig.getHighlights();
    if (highlights.length) {
      tokens.push({ token: CombatLogParser.HIGHLIGHT, expr: parseHighlight.createRegExp(highlights) });
    }

    // Run through each parser
    const parser: ChatTextParser = new ChatTextParser(tokens);
    return parser.parse(text, (token: number, text: string, match: RegExpExecArray) => {
      switch (token) {
        case CombatLogParser.COLOR: return parseColors.fromText(text, keygen, match, this);
        case CombatLogParser.BLINK: return parseBlink.fromText(text, keygen, match, this);
        case CombatLogParser.MARKDOWN: return parseMarkdown.fromText(text, keygen, match, this);
        case CombatLogParser.LINK: return parseLinks.fromText(text, keygen);
        case CombatLogParser.HIGHLIGHT: return parseHighlight.fromText(text, keygen);
      }
      // treat everything else as just text
      return this.parseText(text);
    });
  }

}

export default CombatLogParser;
