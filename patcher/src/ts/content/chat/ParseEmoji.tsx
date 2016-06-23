/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

function emojiNameFromText(text:string): string {
  switch(text) {
    case ':angry:': case ':[': case ':-[':
      return 'angry';
    case ':baffled:': case 'O.o':
      return 'baffled';
    case ':confused:': case 'o.O':
      return 'confused';
    case ':cool:': case '8)': case '8-)':
      return 'cool';
    case ':cry:': case ':\'(':
      return 'crying';
    case ':evil:': case '3:)':
      return 'evil';
    case ':frustrated:':
      return 'frustrated';
    case ':grin:': case ':D': case ':-D':
      return 'grin';
    case ':happy:': case ':)': case ':-)':
      return 'happy';
    case ':hipster:':
      return 'hipster';
    case ':neutral:': case ':|': case ':-|':
      return 'neutral';
    case ':sad:': case ':(': case ':-(':
      return 'sad';
    case ':shocked:': case '8o': case '8-o': case '8-O':
    case ':O': case ':o':
      return 'shocked';
    case ':sleepy:': case '-_-zzZ': case '(-_-)zzZ':
      return 'sleepy';
    case ':smile:': case ':>':
      return 'smile';
    case ':tongue:':
    case ':p': case ':-p': case ':P': case ':-P':
    case ';p': case ';-p': case ';P': case ';-P':
      return 'tongue';
    case ':wink:': case ';)': case ';-)':
      return 'wink';
    case ':wondering:':
      return 'wondering';
  }
  return null;
}

function fromText(text: string, keygen: () => number) : JSX.Element[] {
  const emoji : string = emojiNameFromText(text);
  if (emoji) {
    return [<span key={keygen()} className={'chat-emoticon emote-' + emoji}></span>];
  }
}

function createRegExp() : RegExp {
  return /[3]*[;:8][-']*[()@oO#$*pPD/|><]|\([6aAhH]\)|-_-zzZ|\(-_-\)zzZ|[oO]\.[oO]|:[a-z]*:/g;
}

export default {
  fromText,
  createRegExp
}
