/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ResourceBar } from '../../../shared/ResourceBar';
import { CurrentMax } from '@csegames/library/dist/_baseGame/types/CurrentMax';

const Container = 'StartScreen-Play-Challenge-Container';
const Text = 'StartScreen-Play-Challenge-Text';
const ResourceBarContainer = 'StartScreen-Play-Challenge-ResourceBarContainer';

const SpecialText = 'StartScreen-Play-Challenge-SpecialText';

export interface Props {
  styles?: string;
  challengeText: string;
  progress: CurrentMax;
}

export function Challenge(props: Props) {
  return (
    <div className={`${Container} ${props.styles || ''}`}>
      <div className={Text}>{props.challengeText}</div>
      <div className={ResourceBarContainer}>
        <ResourceBar type="blue" hideText current={props.progress.current} max={props.progress.max} />
      </div>
      <div className={Text}>
        <span className={SpecialText}>{props.progress.current}</span> / {props.progress.max}
      </div>
    </div>
  );
}
