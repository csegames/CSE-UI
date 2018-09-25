/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { utils } from '../../../';

enum emojis {
  ANGRY,
  BAFFLED,
  CONFUSED,
  COOL,
  CRYING,
  EVIL,
  FRUSTRATED,
  GRIN,
  HAPPY,
  HIPSTER,
  NEUTRAL,
  SAD,
  SHOCKED,
  SLEEPY,
  SMILE,
  TONGUE,
  WINK,
  WONDERING,
  ANDREWFEZ,
  ANDREW,
  JBHEAD,
  JB,
  MARKHEAD,
  MJHEAD,
  MJ,
  MJELF,
  SANDRAGRIN,
  TIMHEAD,
  TINYMICHELLE,
  BATGRIN,
  BATHAPPY,
  BATMAD,
  BATSAD,
  BATTONGUE,
  BOB,
  BOBLOVE,
  CROWN,
  CUPOTEARS,
  QQCUP,
  DRAGONLICK,
  DRAGONWHALE,
  DUCK,
  DUCKMAGE,
  FROWNSTRM,
  SADSTRM,
  HAPPYSTRM,
  JUDGINGDUCKONE,
  JUDGINGDUCK1,
  JUDGINGDUCKTWO,
  JUDGINGDUCK2,
  ARTHURIANLOVE,
  ARTLOVE,
  TUATHALOVE,
  TDDLOVE,
  VIKINGLOVE,
  VIKLOVE,
  PLUSTEN,
  PLUS10,
  PVP,
  RAGE,
  SALT,
  ARTHURIANSHIELD,
  ARTSHIELD,
  TUATHASHIELD,
  TDDSHIELD,
  VIKINGSHIELD,
  VIKSHIELD,
  SHOTSFIRED,
  UNICORN,
}

const emojiNames = Object.keys(emojis).map(k => (emojis as any)[k]).filter(v => typeof v === 'string') as string[];

function emojiNameFromText(text: string): string {

  // parse symbol emoji -- like :D
  switch (text) {
    case ':D': case ':-D':
      return 'GRIN';
    case '-_-zzZ': case '(-_-)zzZ': case ':zzz:':
      return 'SLEEPY';
    case '8-o': case ':o': case '8o':
      return 'SHOCKED';
    case '8)': case '8-)':
      return 'COOL';
    case ':\'(': case ':qq:':
      return 'CRYING';
    case ':)': case ':-)':
      return 'HAPPY';
    case ':|': case ':-|':
      return 'NEUTRAL';
    case ':(': case ':-(':
      return 'SAD';
    case ':p': case ':-p': case ';p':
    case ';-p': case '8p': case '8-p':
    case ':P': case ':-P': case ';P':
    case ';-P': case '8P': case '8-P':
      return 'TONGUE';
    case ':>':
      return 'SMILE';
    case 'o.o':
      return 'BAFFLED';
    case '3:)':
      return 'EVIL';
    case ';)': case ';-)':
      return 'WINK';
  }

  const upper = text.replace(/:/g, '').toUpperCase();
  return utils.findIndexWhere(emojiNames, n => n === upper) ? upper : null;
}

function fromText(text: string, keygen: () => number): JSX.Element[] {
  const emoji: string = emojiNameFromText(text);
  if (emoji) {
    return [<span key={keygen()} className={'emoji emoji--' + emoji}></span>];
  }
}

function createRegExp(): RegExp {
  return /:[a-zA-Z0-9]+:|[3]*[;:8][-']*[()@oO#$*pPD/|><]|\([6aAhH]\)|-_-zzZ|\(-_-\)zzZ|[oO]\.[oO]/g;
}

export default {
  fromText,
  createRegExp,
};
