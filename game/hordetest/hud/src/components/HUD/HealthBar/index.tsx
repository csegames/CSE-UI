/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ResourceBar } from 'components/shared/ResourceBar';
import { ChampionProfile } from './ChampionProfile';

const Container = styled.div`
  display: flex;
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const ChampionProfileSpacing = styled.div`
  margin-right: 6px;
`;

const ResourcesContainer = styled.div`
  width: ${(props: { width: number } & React.HTMLProps<HTMLDivElement>) => props.width ? `${props.width}px` : '195px'};
  user-select: none;
  pointer-events: none;
  transform: skewX(-10deg);
`;

const DivineBarrierContainer = css`
  width: 100%;
  height: 13px;
  border: 3px solid black;
  margin-bottom: 1px;
`;

const HealthBarContainer = css`
  width: 100%;
  height: 13px;
  border: 3px solid black;
  margin-bottom: 5px;
`;

const ResourceContainer = css`
  width: 100%;
  height: 5px;
  border: 3px solid black;
`;

export interface Props {
  divineBarrier: CurrentMax;
  health: CurrentMax;
  championResource: CurrentMax;
  resourcesWidth?: number;
  hideChampionResource?: boolean;
}

export function HealthBar(props: Props) {
  return (
    <Container>
      <ChampionProfileSpacing>
        <ChampionProfile />
      </ChampionProfileSpacing>
      <ResourcesContainer width={props.resourcesWidth}>
        <ResourceBar
          isSquare
          unsquareText
          type='blue'
          containerStyles={DivineBarrierContainer}
          current={props.divineBarrier.current}
          max={props.divineBarrier.max}
        />

        <ResourceBar
          isSquare
          unsquareText
          type='green'
          containerStyles={HealthBarContainer}
          current={props.health.current}
          max={props.health.max}
        />

        {!props.hideChampionResource &&
          <ResourceBar
            isSquare
            hideText
            type='orange'
            containerStyles={ResourceContainer}
            current={props.championResource.current}
            max={props.championResource.max}
          />
        }
      </ResourcesContainer>
    </Container>
  );
}
