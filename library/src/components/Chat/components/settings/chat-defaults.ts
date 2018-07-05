/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const prefixes = {
  display: 'cse-chat-settings:chat-display:',
  rooms: 'cse-chat-settings:chat-rooms:',
};

export const display = {
  embedImages: {
    key: 'embed-images',
    type:'boolean',
    default: true,
    title: 'Embed Images',
    description: 'Display embedded images when a user posts a link to an image from a whitelisted host?',
  },
  embedVideos: {
    key: 'embed-videos',
    type:'boolean',
    default: true,
    title: 'Embed Videos',
    description: 'Display embedded videos and vines when a user posts a youtube, vimeo, vine link?',
  },
  showColors: {
    key: 'show-colors',
    type:'boolean',
    default: true,
    title: 'Show Colors',
    description: 'Display modified text color styles.',
  },
  showEmoticons: {
    key: 'show-emoticons',
    type:'boolean',
    default: true,
    title: 'Show Emoticons',
    description: 'Sometimes words just don`t say enough.',
  },
  showMarkdown: {
    key: 'show-markdown',
    type:'boolean',
    default: true,
    title: 'Show Markdown',
    description: 'Display modified font styles when markdown is used.',
  },
  timestamps: {
    key: 'timestamps',
    type:'boolean',
    default: false,
    title: 'Show Timestamps',
    description: 'Display a timestamp on each message?',
  },
  joinParts: {
    key: 'join-parts',
    type:'boolean',
    default: true,
    title: 'Show Joins/Parts',
    description: 'Display join and part messages when a user enter or leaves a channel?',
  },
};

export const rooms = [
  '_global',
];

export function initLocalStorage() {
  // Init each of the settings groups here
  for (const key in display) {
    const option = display[key];
    const v = JSON.parse(localStorage.getItem(`${prefixes.display}${option.key}`));
    if (v === null) localStorage.setItem(`${prefixes.display}${option.key}`, option.default);
  }
}

export default {
  'chat-display': display,
};
