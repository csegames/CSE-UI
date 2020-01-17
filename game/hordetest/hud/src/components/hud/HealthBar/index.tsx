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
import { LOW_HEALTH_PERCENT } from '../FullScreenEffects/LowHealth';

const Container = styled.div`
  display: flex;
  align-items: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const ChampionProfileSpacing = styled.div`
  margin-right: 6px;
`;

const ResourcesContainer = styled.div`
  width: ${(props: { width: number } & React.HTMLProps<HTMLDivElement>) => props.width ? `${props.width}px` : '200px'};
  user-select: none;
  pointer-events: none;
  transform: skewX(-10deg);
`;

const ResourceBarContainer = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  width: 100%;

  &.flex-end {
    align-items: flex-end;
    margin-top: 10px;
  }
`;

const MainResourceStyles = css`
  flex: 1;
  height: 26px;
`;

const BarrierStyles = css`
  flex: 1;
  height: 26px;
`;

const ResourceContainer = css`
  width: 100%;
  height: 13px;
`;

const TextStyles = css`
  font-family: Exo;
`;

export interface Props {
  health: CurrentMax;
  race: Race;
  isAlive: boolean;
  divineBarrier: CurrentMax;
  championResource: CurrentMax;
  resourcesWidth?: number;
  hideChampionResource?: boolean;
  championProfileStyles?: string;
  hideMax?: boolean;
  collectedRunes?: { [runeType: number]: number };
  runeBonuses?: { [runeType: number]: number };
  statuses?: ArrayMap<{ id: number; } & Timing>;
}

export function HealthBar(props: Props) {
  return (
    <Container>
      <ChampionProfileSpacing>
        <ChampionProfile
          isAlive={props.isAlive}
          race={props.race}
          containerStyles={props.championProfileStyles}
          statuses={props.statuses}
        />
      </ChampionProfileSpacing>
      <ResourcesContainer width={props.resourcesWidth}>
        <ResourceBarContainer>
          <ResourceBar
            isSquare
            unsquareText
            type='blue'
            containerStyles={BarrierStyles}
            current={props.divineBarrier.current}
            max={props.divineBarrier.max}
            text={props.hideMax ? props.divineBarrier.current.toString() : ''}
            textStyles={TextStyles}
          />
        </ResourceBarContainer>
        <ResourceBarContainer>
          <ResourceBar
            isSquare
            unsquareText
            type={(props.health.current / props.health.max * 100) <= LOW_HEALTH_PERCENT ? 'red' : 'green'}
            containerStyles={MainResourceStyles}
            current={props.health.current === 0 ? 100 : props.health.current}
            max={props.health.current === 0 ? 100 : props.health.max}
            text={props.hideMax ? props.health.current.toString() : ''}
            textStyles={TextStyles}
          />
        </ResourceBarContainer>

        {!props.hideChampionResource &&
          <ResourceBarContainer className='flex-end'>
            <ResourceBar
              isSquare
              hideText
              type='rage'
              containerStyles={ResourceContainer}
              current={props.championResource.current}
              max={props.championResource.max}
            />
          </ResourceBarContainer>
        }
      </ResourcesContainer>
    </Container>
  );
}
