/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createSharedState } from 'cseshared/lib/sharedState';

export interface OptionsState {
  messageBufferSize: number;
  parsing: {
    colors: boolean;
    emoji: boolean;
    markdown: boolean;
    embed: {
      gif: boolean;
      image: boolean;
      video: boolean;
      links: boolean;
      urlWhitelist: string[];
      _urlWhitelistRegExp: RegExp[],
    },
    highlight: boolean;
    highlightKeywords: string[];
  };
  markup: {
    timestamps: boolean;
    roomNames: boolean;
  };
  showJoins: boolean;
  showParts: boolean;
  shortcutPrefixes: {
    warband: string[];
    order: string[];
    campaign: string[];
    custom: string[];
  };
  roomColors: {
    warband: string;
    order: string;
    campaign: string;
    general: string;
    combat: string;
    system: string;
    custom: Dictionary<string>; // roomid => color
  };
}

function initialState(): OptionsState {
  const state = {
    messageBufferSize: 100,
    parsing: {
      colors: true,
      emoji: true,
      markdown: true,
      embed: {
        gif: true,
        image: true,
        video: true,
        links: true,
        urlWhitelist: [
          's3.amazonaws.com',
          'camelotunchained.com',
          'citystateentertainment.com',
          'twimg.com',
          'fbcdn.net',
          'imgur.com',
          'trillian.im',
          'imageshack.com',
          'postimage.org',
          'staticflickr.com',
          'tinypic.com',
          'photobucket.com',
          'cdninstagram.com',
          'deviantart.net',
          'imagebam.com',
          'dropboxusercontent.com',
          'youtube.com',
          'vimeo.com',
          'twitch.tv',
        ],
        _urlWhitelistRegExp: [] as RegExp[],
      },
      highlight: true,
      highlightKeywords: ['CSE'],
    },
    markup: {
      timestamps: false,
      roomNames: false,
    },
    showJoins: false,
    showParts: false,
    shortcutPrefixes: {
      warband: ['w', 'p'],
      order: ['o', 'g'],
      campaign: ['c'],
      custom: ['k'],
      help: ['h'],
    },
    roomColors: {
      warband: 'orange',
      order: 'green',
      campaign: 'darkgreen',
      general: 'white',
      combat: 'white',
      system: 'white',
      custom: {},
    }
  };
  state.parsing.embed._urlWhitelistRegExp = convertWhitelistToRegExp(state.parsing.embed.urlWhitelist);
  return state;
}

export function convertWhitelistToRegExp(whitelist: string[]): RegExp[] {
  return whitelist.map(s => new RegExp(`/${s}$/`));
}

export const useChatOptions = createSharedState(
  'chatoptions',
  initialState()
);
