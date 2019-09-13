/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { BattlePassDay } from './testData';
import { EquipmentItem } from '../ChampionProfile/EquipmentItem';
import { Skin } from '../Store/testData';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  flex-shrink: 0;
  opacity: 0.5;
  margin: 0 10px;

  &.unlocked {
    opacity: 1;
  }
`;

const DayNumber = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
  font-family: Colus;
  color: #9d9d9d;
`;

const FreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  background: linear-gradient(to bottom, #616161, #3c3c3c);
  border: 2px solid #4d4d4d;
  flex: 1;
  width: 100%;
`;

const PremiumContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  background: linear-gradient(to bottom, #e3a360, #b05b36);
  border: 2px solid #ff9e57;
  flex: 1;
  width: 100%;
`;

export interface Props {
  day: BattlePassDay;
  selectedPreviewSkinInfo: Skin;
  onClickSkin: (skin: Skin) => void;
}

export function BattlePassDay(props: Props) {
  return (
    <Container className={props.day.isUnlocked ? 'unlocked' : ''}>
      <DayNumber>{props.day.dayNumber}</DayNumber>
      <FreeContainer>
        {props.day.freeRewards.map((freeReward) => {
          return (
            <EquipmentItem
              skin={freeReward}
              onClick={props.onClickSkin}
              className={props.selectedPreviewSkinInfo &&
                freeReward.id === props.selectedPreviewSkinInfo.id ? 'selected-preview' : ''}
            />
          );
        })}
      </FreeContainer>
      <PremiumContainer>
        {props.day.premiumRewards.map((premiumReward) => {
          return (
            <EquipmentItem
              skin={premiumReward}
              onClick={props.onClickSkin}
              className={props.selectedPreviewSkinInfo &&
                premiumReward.id === props.selectedPreviewSkinInfo.id ? 'selected-preview' : ''}
            />
          );
        })}
      </PremiumContainer>
    </Container>
  );
}
