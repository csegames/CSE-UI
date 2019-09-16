/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { SpriteSheetAnimator } from 'cushared/components/SpriteSheetAnimator';

const Sprite = css`
  display: inline-block;
  overflow: hidden;
  background-repeat: no-repeat;
  filter: brightness(0) invert(1);
  opacity: 0.2;
  transform: scale(0.5);
  width: 300px;
  height: 300px;
`;

export interface Props {
}

export class LoadingAnimIcon extends React.Component<Props> {
  public render() {
    return (
      <SpriteSheetAnimator
        styles={Sprite}
        backgroundUrl={'images/spritesheet-loading.png'}
        numberOfRows={15}
        numberOfColumns={13}
        spriteHeight={300}
        spriteWidth={300}
        lastFrame={195}
      />
    );
  }
}