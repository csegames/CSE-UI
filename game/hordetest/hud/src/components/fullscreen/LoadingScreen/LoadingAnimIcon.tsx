/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';

const Sprite = css`
  display: inline-block;
  overflow: hidden;
  background-repeat: no-repeat;
  width: 100px;
  height: 100px;
`;

export interface Props {
}

export class LoadingAnimIcon extends React.Component<Props> {
  public render() {
    return (
      <img className={Sprite} src='images/loading-anim.gif' />
    );
  }
}