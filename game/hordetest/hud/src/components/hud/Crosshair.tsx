/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const CrosshairImage = styled.img`
  width: 45px;
  height: 45px;
`;

export function Crosshair() {
  const [isVisible, setIsVisible] = useState(cloneDeep(hordetest.game.selfPlayerState.isAlive));

  useEffect((() => {
    const evh = hordetest.game.selfPlayerState.onUpdated(() => {
      if (hordetest.game.selfPlayerState.isAlive) {
        if (!isVisible) {
          setIsVisible(true);
        }
      } else {
        if (isVisible) {
          setIsVisible(false);
        }
      }
    });

    return () => {
      evh.clear();
    };
  }));

  return isVisible ? (
    <Container>
      <CrosshairImage src={'images/hud/crosshair.png'} />
    </Container>
  ) : null;
}
