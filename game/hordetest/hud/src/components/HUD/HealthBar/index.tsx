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
import { Rune } from './Rune';
import { LOW_HEALTH_PERCENT } from '../FullScreenEffects/LowHealth';

const Container = styled.div`
  display: flex;
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
  }
`;

const MainResourceStyles = css`
  flex: 1;
  height: 23px;
  border: 3px solid black;
  margin-bottom: 1px;
`;

const ResourceContainer = css`
  width: 100%;
  height: 8px;
  border: 3px solid black;
`;

const TextStyles = css`
  font-family: Exo;
`;

export interface Props {
  divineBarrier: CurrentMax;
  health: CurrentMax;
  championResource: CurrentMax;
  resourcesWidth?: number;
  hideChampionResource?: boolean;
  championProfileStyles?: string;
  hideMax?: boolean;
  collectedRunes?: { [runeType: number]: number };
  runeBonuses?: { [runeType: number]: number };
}

export function HealthBar(props: Props) {
  return (
    <Container>
      <ChampionProfileSpacing>
        <ChampionProfile containerStyles={props.championProfileStyles} />
      </ChampionProfileSpacing>
      <ResourcesContainer width={props.resourcesWidth}>
        <ResourceBarContainer>
          <ResourceBar
            isSquare
            unsquareText
            type='blue'
            containerStyles={MainResourceStyles}
            current={props.divineBarrier.current}
            max={props.divineBarrier.max}
            text={props.hideMax ? props.divineBarrier.current.toString() : ''}
            textStyles={TextStyles}
          />
          {props.collectedRunes &&
            <Rune
              runeType={RuneType.Protection}
              value={props.collectedRunes[RuneType.Protection]}
              bonus={props.runeBonuses[RuneType.Protection]}
            />
          }
        </ResourceBarContainer>

        <ResourceBarContainer>
          <ResourceBar
            isSquare
            unsquareText
            type={(props.health.current / props.health.max * 100) <= LOW_HEALTH_PERCENT ? 'red' : 'green'}
            containerStyles={MainResourceStyles}
            current={props.health.current}
            max={props.health.max}
            text={props.hideMax ? props.health.current.toString() : ''}
            textStyles={TextStyles}
          />
          {props.collectedRunes &&
            <Rune
              runeType={RuneType.Health}
              value={props.collectedRunes[RuneType.Health]}
              bonus={props.runeBonuses[RuneType.Health]}
            />
          }
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
            {props.collectedRunes &&
              <Rune
                runeType={RuneType.Weapon}
                value={props.collectedRunes[RuneType.Weapon]}
                bonus={props.runeBonuses[RuneType.Weapon]}
              />
            }
          </ResourceBarContainer>
        }
      </ResourcesContainer>
    </Container>
  );
}
