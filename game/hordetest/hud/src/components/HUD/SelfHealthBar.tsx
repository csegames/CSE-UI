/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';
import { throttle } from 'lodash';

import { HealthBar } from './HealthBar';
import { ActionButtons } from './ActionButtons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActionButtonsContainer = styled.div`
  margin-left: 7px;
  margin-bottom: 10px;
`;

export interface Props {
}

export function SelfHealthBar(props: Props) {
  const gameHealth = hordetest.game.selfPlayerState.health;
  const [health, setHealth] = useState({ current: gameHealth[0].current, max: gameHealth[0].max });
  const throttledSetHealth = useRef(throttle((val) => setHealth(val), 200));

  const [resource, setResource] = useState({ ...hordetest.game.selfPlayerState.stamina });
  const throttledSetResource = useRef(throttle((val) => setResource(val), 200));

  const [divineBarrier, setDivineBarrier] = useState({ ...hordetest.game.selfPlayerState.blood });
  const throttledSetDivineBarrier = useRef(throttle((val) => setDivineBarrier(val), 200));

  useEffect(() => {
    const handle = hordetest.game.selfPlayerState.onUpdated(() => {
      if (!hordetest.game.selfPlayerState.health[0].current.floatEquals(health.current) ||
          !hordetest.game.selfPlayerState.health[0].max.floatEquals(health.max)) {
        throttledSetHealth.current(hordetest.game.selfPlayerState.health[0]);
      }

      if (!hordetest.game.selfPlayerState.stamina.current.floatEquals(resource.current) ||
          !hordetest.game.selfPlayerState.stamina.max.floatEquals(resource.max)) {
        throttledSetResource.current(hordetest.game.selfPlayerState.stamina);
      }

      if (!hordetest.game.selfPlayerState.blood.current.floatEquals(divineBarrier.current) ||
          !hordetest.game.selfPlayerState.blood.max.floatEquals(divineBarrier.max)) {
        throttledSetDivineBarrier.current(hordetest.game.selfPlayerState.blood);
      }
    });

    return () => {
      handle.clear();
    }
  }, [hordetest.game.selfPlayerState.health[0], hordetest.game.selfPlayerState.stamina]);

  return (
    <Container>
      <ActionButtonsContainer>
        <ActionButtons />
      </ActionButtonsContainer>
      <HealthBar health={health} championResource={resource} divineBarrier={divineBarrier} />
    </Container>
  );
}
