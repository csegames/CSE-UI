/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { OptionsState } from '../state/optionsState';
import { Parser } from './parseText';

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
export function parseBlink(text: string, opts: OptionsState, next: Parser): [string, JSX.Element] {
  if (!opts.parsing.colors) {
    return [text, null];
  }
  const regex = /(?=\^::?#?[A-Za-z0-9]+-)\^:(?:([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})-([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6}))?:?(?:([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6})-([A-Za-z]+|#[A-Fa-f0-9]{3}|#[A-Fa-f0-9]{6}))?:\^([\S\s]+)$/g;
  const match = regex.exec(text);
  if (!match) {
    return [text, null];
  }
  const textColor1: string = match[1];
  const textColor2: string = match[2];
  const bgColor1: string = match[3];
  const bgColor2: string = match[4];
  const matchText: string = match[5];
  const blinkID = genID();
  return [
    text.substr(0, match.index),
    (
      <>
        <span
          key={genID()}
          dangerouslySetInnerHTML={{ __html: animationStyle(textColor1, textColor2, bgColor1, bgColor2, blinkID) }}
        />,
        <span key={genID()} className={`blink-${blinkID}`}>{next(matchText, opts, next)}</span>
      </>
    )
  ]
}