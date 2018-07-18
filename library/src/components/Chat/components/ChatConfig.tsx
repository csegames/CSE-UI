/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events } from '../../../';
import { prefixes, display } from './settings/chat-defaults';

export class ChatConfig {
  public SCROLLBACK_BUFFER_SIZE: number = 100;
  public SHOW_COLORS: boolean = false;
  public SHOW_EMOTICONS: boolean = false;
  public SHOW_MARKDOWN: boolean = false;
  public EMBED_IMAGES: boolean = false;
  public EMBED_VIDEOS: boolean = false;
  public JOIN_PARTS: boolean = false;
  public TIMESTAMPS: boolean = false;
  public NICK: string = '';
  public HIGHLIGHTS: string[] = ['alpha','beta','CSE'];

  constructor() {
    this.refresh();
  }

  public setNick = (nick :string): void => {
    this.NICK = nick;
  }

  public getHighlights = () : string[] => {
    return this.HIGHLIGHTS.concat(this.NICK);
  }

  public refresh = () : void => {
    const LOAD = (option: any) : any => {
      return JSON.parse(localStorage.getItem(`${prefixes.display}${option.key}`));
    };
    this.SHOW_COLORS    = LOAD(display.showColors);
    this.SHOW_EMOTICONS = LOAD(display.showEmoticons);
    this.SHOW_MARKDOWN  = LOAD(display.showMarkdown);
    this.EMBED_IMAGES   = LOAD(display.embedImages);
    this.EMBED_VIDEOS   = LOAD(display.embedVideos);
    this.JOIN_PARTS     = LOAD(display.joinParts);
    this.TIMESTAMPS     = LOAD(display.timestamps);
    events.fire('chat-options-update', this);
  }
}

export const chatConfig = new ChatConfig();
