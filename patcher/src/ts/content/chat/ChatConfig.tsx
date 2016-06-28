/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {prefixes, display} from './settings/chat-defaults';
import * as events from '../../../../../shared/lib/events';

export class ChatConfig {
  SCROLLBACK_BUFFER_SIZE: number = 1024;
  SHOW_COLORS: boolean = false;
  SHOW_EMOTICONS: boolean = false;
  SHOW_MARKDOWN: boolean = false;
  EMBED_IMAGES: boolean = false;
  EMBED_VIDEOS: boolean = false;
  JOIN_PARTS: boolean = false;
  TIMESTAMPS: boolean = false;
  NICK: string = '';
  HIGHLIGHTS: string[] = ['alpha','beta','CSE'];

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
    }
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
