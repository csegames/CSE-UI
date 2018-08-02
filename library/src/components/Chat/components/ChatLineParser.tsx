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
import parseRooms from './ParseRooms';
import parseEmoji from './ParseEmoji';
import parseHighlight from './ParseHighlight';
import parseNicks from './ParseNicks';

class ChatLineParser {

  private static LINK: number = ChatTextParser.TEXT + 1;
  private static EMOJI: number = ChatTextParser.TEXT + 2;
  private static MARKDOWN: number = ChatTextParser.TEXT + 3;
  private static COLOR: number = ChatTextParser.TEXT + 4;
  private static BLINK: number = ChatTextParser.TEXT + 5;
  private static ROOM: number = ChatTextParser.TEXT + 6;
  private static HIGHLIGHT: number = ChatTextParser.TEXT + 7;
  private static NICK: number = ChatTextParser.TEXT + 8;

  private _key: number = 1;

  public parseText(text: string): JSX.Element[] {
    return [<span key={this._key++}>{text}</span>];
  }

  public parseAction(text: string): JSX.Element[] {
    const html: JSX.Element[] = [];
    const content : JSX.Element[] = this.parse(text.substr(4).trim());
    html.push(<span key={this._key++} className='chat-line-action'>&lt;{content}&gt;</span>);
    return html;
  }

  public isAction(text: string): boolean {
    return text.toLowerCase().substr(0, 4) === '/me ';
  }

  public parse(text: string): JSX.Element[] {
    if (!text) {
      return null;
    }
    const keygen = () : number => { return this._key++; };
    const tokens : ChatTextParserToken[] = [];
    // Parsers which need recursion should be first
    tokens.push({ token: ChatLineParser.COLOR, expr: parseColors.createRegExp() });
    tokens.push({ token: ChatLineParser.BLINK, expr: parseBlink.createRegExp() });
    if (chatConfig.SHOW_MARKDOWN) {
      tokens.push({ token: ChatLineParser.MARKDOWN, expr: parseMarkdown.createRegExp() });
    }
    // Parsers with simple search/replace should be last
    tokens.push({ token: ChatLineParser.LINK, expr: parseLinks.createRegExp() });
    tokens.push({ token: ChatLineParser.ROOM, expr: parseRooms.createRegExp() });
    if (chatConfig.SHOW_EMOTICONS) {
      tokens.push({ token: ChatLineParser.EMOJI, expr: parseEmoji.createRegExp() });
    }
    const highlights = chatConfig.getHighlights();
    if (highlights.length) {
      tokens.push({ token: ChatLineParser.HIGHLIGHT, expr: parseHighlight.createRegExp(highlights) });
    }
    const nicks = parseNicks.createRegExp();
    if (nicks) {
      tokens.push({ token: ChatLineParser.NICK, expr: nicks });
    }

    // Run through each parser
    const parser : ChatTextParser = new ChatTextParser(tokens);
    return parser.parse(text, (token: number, text: string, match: RegExpExecArray) => {
      switch (token) {
        case ChatLineParser.COLOR: return parseColors.fromText(text, keygen, match, this);
        case ChatLineParser.BLINK: return parseBlink.fromText(text, keygen, match, this);
        case ChatLineParser.MARKDOWN: return parseMarkdown.fromText(text, keygen, match, this);
        case ChatLineParser.LINK: return parseLinks.fromText(text, keygen);
        case ChatLineParser.ROOM: return parseRooms.fromText(text, keygen);
        case ChatLineParser.EMOJI: return parseEmoji.fromText(text, keygen);
        case ChatLineParser.HIGHLIGHT: return parseHighlight.fromText(text, keygen);
        case ChatLineParser.NICK: return parseNicks.fromText(text, keygen);
      }
      // treat everything else as just text
      return this.parseText(text);
    });
  }

}

export default ChatLineParser;
