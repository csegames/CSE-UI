/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ExtraButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExtraButton = styled.div`
  pointer-events: all;
  cursor: pointer;
  color: white;
  background-color: orange;
  padding: 5px;
  margin: 2.5px 0;

  &:hover {
    filter: brightness(110%);
  }
`;

export function ExtraButtons() {
  return (
    <ExtraButtonsContainer>
      <ExtraButton>
        <div onClick={() => game.reloadUI()}>Reload UI</div>
      </ExtraButton>
      <ExtraButton onClick={() => game.trigger('show-fullscreen')}>Open Full Screen</ExtraButton>
      <ExtraButton onClick={() => game.trigger('navigate', 'console')}>
        Open Console
      </ExtraButton>
    </ExtraButtonsContainer>
  );
}
