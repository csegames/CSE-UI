/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { HudNavWindow } from '../../components/HudNavWindow';
import { Main } from './Main';

const SAMPLE_DIALOG_WIDTH = 1024;
const SAMPLE_DIALOG_HEIGHT = 768;

interface Size {
  width: number;
  height: number;
}

export const GameInfoDimensions: Size = {
  width: SAMPLE_DIALOG_WIDTH,
  height: SAMPLE_DIALOG_HEIGHT,
};

/* tslint:disable:function-name */
export function GameInfo() {
  return (
    <HudNavWindow name='gameinfo'>
      {(onClose) => {
        return <Main onClose={onClose}/>;
      }}
    </HudNavWindow>
  );
}

export default GameInfo;
