/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ExtraButtonsContainer = styled.div`
  display: flex;
`;

const ExtraButton = styled.div`
  pointer-events: all;
  cursor: pointer;
  color: white;
  background-color: black;
  padding: 5px;
  margin: 0 2.5px;
  font-size: 16px;

  &:hover {
    filter: brightness(110%);
  }
`;

export function ExtraButtons() {
  return !game.isPublicBuild ? (
    <ExtraButtonsContainer>
      <ExtraButton onClick={() => game.reloadUI()}>
        <span className='fas fa-sync'></span>
      </ExtraButton>
      <ExtraButton onClick={() => game.trigger('show-fullscreen')}>
        <span className='fas fa-expand'></span>
      </ExtraButton>
      <ExtraButton onClick={() => game.trigger('navigate', 'console')}>
        <span className='fas fa-terminal'></span>
      </ExtraButton>
      <ExtraButton onClick={() => game.trigger('navigate', 'mocks')}>
        <span className='fas fa-tasks'></span>
      </ExtraButton>
    </ExtraButtonsContainer>
  ) : null;
}
