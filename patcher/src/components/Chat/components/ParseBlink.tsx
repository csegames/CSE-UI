/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { chatConfig } from './ChatConfig';

function fromText(text: string, keygen: () => number, match: RegExpExecArray, parser: any): JSX.Element[] {
  const textColor1: string = match[1];
  const textColor2: string = match[2];
  const bgColor1: string = match[3];
  const bgColor2: string = match[4];
  const matchText: string = match[5];
  const id = makeid();

  if (chatConfig.SHOW_COLORS) {
    return [
      <span
        key={keygen()}
        dangerouslySetInnerHTML={{ __html: animationStyle(textColor1, textColor2, bgColor1, bgColor2, id) }}
      />,
      <span key={keygen()} className={`blink-${id}`}>{parser.parse(matchText)}</span>,
    ];
  }

  return [<span key={keygen()}>{this.parse(matchText)}</span>];
}

const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function makeid() {
  let text = '';
  for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function animationStyle(textColor1: string, textColor2: string, bgColor1: string, bgColor2: string, id: string) {
  return `<style type='text/css' scoped>
    @keyframes blink-${id} {
      from { color: ${textColor1}; background-color: ${bgColor1}; }
      to { color: ${textColor2}; background-color: ${bgColor2}; }
    }
    @-webkit-keyframes blink-${id} {
      from { color: ${textColor1}; background-color: ${bgColor1}; }
      to { color: ${textColor2}; background-color: ${bgColor2}; }
    }
    .blink-${id} {
      -webkit-animation: blink-${id} 1s linear infinite;
      -moz-animation: blink-${id} 1s linear infinite;
      animation: blink-${id} 1s linear infinite;
    }
  </style>`;
}

// ^:textcolor-fadetocolor:bgcolor-fadetocolor:^ text and stuff
// tslint:disable
function createRegExp() : RegExp {
  return /(?=\^::?#?[A-Za-z0-9]+-)\^:(?:([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})-([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6}))?:?(?:([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})-([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6}))?:\^([\S\s]+)$/g;
}

export default {
  fromText,
  createRegExp,
}
