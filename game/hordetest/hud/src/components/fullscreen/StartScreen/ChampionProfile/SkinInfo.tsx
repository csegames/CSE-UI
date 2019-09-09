/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from 'components/fullscreen/Button';

import { Skin, Rarity } from '../Store/testData';
import { ConfirmPurchase } from '../Store/ConfirmPurchase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DescriptionContainer = styled.div`
  padding: 15px;
  width: 400px;
  background-color: #161616;
  color: gray;
  border: 2px solid #2c2c2c;

  &.Rare {
    border: 2px solid #45a724;
    background-color: rgba(48, 70, 41, 0.5);
    color: #8be76c;
  }

  &.Epic {
    border: 2px solid #d424d1;
    background-color: rgba(76, 23, 71, 0.5);
    color: #ff9ae4;
  }

  &.Legendary {
    border: 2px solid #eec06a;
    background-color: rgba(37, 31, 22, 0.5);
    color: #fee1aa;
  }
`;

const SkinName = styled.div`
  font-size: 18px;
  font-family: Lato;
  font-weight: bold;
  margin-bottom: 13px;
`;

const SkinDescription = styled.div`
  font-size: 12px;
  font-family: Lato;
  font-weight: bold;
  color: #d9d9d9;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const ButtonStyle = css`
  flex: 1;
  margin-top: 13px;
  width: fit-content;
  font-size: 24px;
  padding: 15px 0px;
`;

const ButtonSpacing = styled.div`
  width: 5px;
`;

export interface Props {
  hideSkinButtons: boolean;
  selectedPreviewSkinInfo: Skin;
  onSave: (skin: Skin) => void;
}

export function SkinInfo(props: Props) {
  function onUnlockClick(skin: Skin) {
    game.trigger('show-right-modal', <ConfirmPurchase skin={skin} />)
  }

  if (props.selectedPreviewSkinInfo) {
    return (
      <Container>
        <DescriptionContainer className={Rarity[props.selectedPreviewSkinInfo.rarity]}>
          <SkinName>{props.selectedPreviewSkinInfo.name}</SkinName>
          <SkinDescription>{props.selectedPreviewSkinInfo.description}</SkinDescription>
        </DescriptionContainer>
        {!props.hideSkinButtons &&
          <ButtonContainer>
            <Button
              type={props.selectedPreviewSkinInfo.isUnlocked ? 'gray' : 'blue'}
              disabled={props.selectedPreviewSkinInfo.isUnlocked}
              text={props.selectedPreviewSkinInfo.isUnlocked ? 'Unlocked' : 'Unlock'}
              styles={ButtonStyle}
              onClick={() => props.selectedPreviewSkinInfo.isUnlocked ?
                () => {} : onUnlockClick(props.selectedPreviewSkinInfo)}
            />
            <ButtonSpacing />
            <Button
              type='gray'
              disabled={!props.selectedPreviewSkinInfo.isUnlocked}
              text='Save and exit'
              styles={ButtonStyle}
              onClick={() => props.onSave(props.selectedPreviewSkinInfo)}
            />
          </ButtonContainer>
        }
      </Container>
    );
  }

  return null;
}
