/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Skin, Rarity } from './testData';
import { EquipmentItem } from '../ChampionProfile/EquipmentItem';

const CostContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
  height: 20%;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background-color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
`;

const Name = styled.div`
  font-size: 18px;
  font-family: Colus;
  color: white;
`;

const Cost = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-family: Colus;
  color: #f1d381;
`;

const CostIcon = styled.img`
  width: 12px;
  height: auto;
  object-fit: contain;
  margin-right: 5px;
`;

export interface Props {
  skin: Skin;
  onSkinClick: (skin: Skin) => void;

  disabled?: boolean;
}

export function SkinItem(props: Props) {
  function onSkinClick() {
    if (props.disabled) return;

    props.onSkinClick(props.skin);
  }

  return (
    <EquipmentItem
      disabled={props.disabled}
      skin={props.skin}
      className={Rarity[props.skin.rarity]}
      onClick={onSkinClick}
      width={200}
      height={300}>
      <CostContainer>
        <Name>{props.skin.name}</Name>
        <Cost>
          <CostIcon src='images/fullscreen/startscreen/currency.png' />
          {props.skin.cost}
        </Cost>
      </CostContainer>
    </EquipmentItem>
  );
}
