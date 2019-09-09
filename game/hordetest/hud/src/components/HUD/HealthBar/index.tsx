/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ResourceBar } from 'components/shared/ResourceBar';
import { ChampionProfile } from './ChampionProfile';

const Container = styled.div`
  display: flex;
  padding: 15px;
  background-image: url(../images/hud/main-health-border.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const ChampionProfileSpacing = styled.div`
  margin-right: 6px;
`;

const ResourcesContainer = styled.div`
  width: 215px;
  user-select: none;
  pointer-events: none;
`;

const DivineBarrierContainer = css`
  width: 100%;
  height: 17px;
  margin-bottom: 3px;
  border: 3px solid black;
`;

const HealthBarContainer = css`
  width: 100%;
  height: 17px;
  margin-bottom: 3px;
  margin-left: -4px;
  border: 3px solid black;
`;

const ResourceContainer = css`
  width: 100%;
  height: 5px;
  margin-left: -8px;
  border: 3px solid black;
`;

export interface Props {
}

export function HealthBar(props: Props) {
  const gameHealth = hordetest.game.selfPlayerState.health;
  const [health, setHealth] = useState({ current: gameHealth[0].current, max: gameHealth[0].max });
  const throttledSetHealth = useRef(throttle((val) => setHealth(val), 200));

  const [resource, setResource] = useState({ ...hordetest.game.selfPlayerState.stamina });
  const throttledSetResource = useRef(throttle((val) => setResource(val), 200));

  const [divineBarrier, setDivineBarrier] = useState({ ...hordetest.game.selfPlayerState.blood });
  const throttledSetDivineBarrier = useRef(throttle((val) => setDivineBarrier(val), 200));

  useEffect(() => {
    const handle = hordetest.game.selfPlayerState.onUpdated(() => {
      throttledSetHealth.current(hordetest.game.selfPlayerState.health[0]);
      throttledSetResource.current(hordetest.game.selfPlayerState.stamina);
      throttledSetDivineBarrier.current(hordetest.game.selfPlayerState.blood);
    });

    return () => {
      handle.clear();
    }
  }, [hordetest.game.selfPlayerState.health[0], hordetest.game.selfPlayerState.stamina]);

  return (
    <Container>
      <ChampionProfileSpacing>
        <ChampionProfile />
      </ChampionProfileSpacing>
      <ResourcesContainer>
        <ResourceBar
          type='blue'
          containerStyles={DivineBarrierContainer}
          current={divineBarrier.current}
          max={divineBarrier.max}
        />

        <ResourceBar
          type='green'
          containerStyles={HealthBarContainer}
          current={health.current}
          max={health.max}
        />

        <ResourceBar
          hideText
          type='orange'
          containerStyles={ResourceContainer}
          current={resource.current}
          max={resource.max}
        />
      </ResourcesContainer>
    </Container>
  );
}
