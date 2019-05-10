/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { OptionsState } from '../state/optionsState';
import { Parser } from './parseText';
import { styled } from '@csegames/linaria/react';

type Props = { textColor1: string; textColor2: string; bgColor1: string; bgColor2: string } & React.HTMLProps<HTMLSpanElement>;
const Blink = styled.span`
  animation: blink 1s linear infinite;
  @keyframes blink {
    from { color: ${(props: Props) => props.textColor1}; background-color: ${(props: Props) => props.bgColor1}; }
    to { color: ${(props: Props) => props.textColor2}; background-color: ${(props: Props) => props.bgColor2}; }
  }
`;

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
  return [
    text.substr(0, match.index),
      <Blink textColor1={textColor1} textColor2={textColor2} bgColor1={bgColor1} bgColor2={bgColor2}>{next(matchText, opts, next)}</Blink>
  ]
}