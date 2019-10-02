/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ChampionInfoDisplay } from './ChampionInfoDisplay';
import { SkinInfo } from './SkinInfo';
import { SkillInfo } from './SkillInfo';
import { ActionButton } from '../../ActionButton';

import { Skin, StoreItemType } from '../Store/testData';
import { champions, ChampionInfo } from './testData';
import { InputContext } from 'components/context/InputContext';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ChampionImage = styled.img`
  position: absolute;
  object-fit: contain;
  pointer-events: none;
  width: 100%;
  height: 100%;

  &.should-offset {
    bottom: -20%;
    width: 120%;
    height: 120%;
  }
`;

const ChampionInfoPosition = styled.div`
  position: absolute;
  top: 10%;
  left: 20%;
`;

const SkinInfoPosition = styled.div`
  position: absolute;

  &.no-offset {
    top: 40%;
    right: 10%;
    transform: translateY(-50%);
  }

  &.should-offset {
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const ButtonPosition = styled.div`
  display: flex;
  position: absolute;
  right: 40px;
  bottom: 40px;
`;

const ConsoleIcon = styled.span`
  margin-right: 5px;
`;

const ConsoleSelectSpacing = css`
  margin-right: 20px;
`;

export interface Props {
}

export enum EditingMode {
  None,
  Skin,
  Helmet,
  Weapon,
  Portrait,
  Logo,
}

export function ChampionProfile(props: Props) {
  const [editingMode, setEditingMode] = useState(EditingMode.None);
  const [selectedChampion, setSelectedChampion] = useState(champions[0]);
  const [selectedPreviewSkinInfo, setSelectedPreviewSkinInfo] = useState<Skin>(null);
  const [hideSkinButtons, setHideSkinButtons] = useState(true);

  // function onSelectChampion(championID: string) {
  //   const champion = champions.find(c => c.id === championID);
  //   setSelectedChampion(champion);
  // }

  function onReset() {
    setEditingMode(EditingMode.None);
    setSelectedPreviewSkinInfo(null);
    setHideSkinButtons(true);
  }

  function onShowSkills() {
    game.trigger('show-right-modal', <SkillInfo selectedChampion={selectedChampion} />);
  }

  function onEditingModeChanged(editingMode: EditingMode) {
    setEditingMode(editingMode)
  }

  function onSelectChampion(champion: ChampionInfo) {
    setSelectedChampion(champion);

    switch (editingMode) {
      case EditingMode.Skin: {
        setSelectedPreviewSkinInfo(champion.availableSkins.find(s => s.id === champion.selectedSkinId));
        return;
      }
      case EditingMode.Weapon: {
        setSelectedPreviewSkinInfo(champion.availableWeapons.find(s => s.id === champion.selectedWeaponId));
        return;
      }
      default: return;
    }
  }

  function onSkinChange(skinId: string) {
    const newSelectedChampion: ChampionInfo = {
      ...selectedChampion,
      selectedSkinId: skinId,
    };
    setSelectedChampion(newSelectedChampion);
    setHideSkinButtons(true);
  }

  function onWeaponChange(weaponId: string) {
    const newSelectedChampion: ChampionInfo = {
      ...selectedChampion,
      selectedWeaponId: weaponId,
    };
    setSelectedChampion(newSelectedChampion);
    setHideSkinButtons(true);
  }

  function onSave(skin: Skin) {
    switch (skin.type) {
      case StoreItemType.Skin: {
        onSkinChange(skin.id);
        onReset();
        break;
      }
      case StoreItemType.Weapon: {
        onWeaponChange(skin.id);
        onReset();
        break;
      }
    }
  }
  function onSelectedPreviewSkinInfoChange(skin: Skin, hideSkinButtons?: boolean) {
    setSelectedPreviewSkinInfo(skin);

    if (typeof hideSkinButtons === 'boolean') {
      setHideSkinButtons(hideSkinButtons);
    }
  }

  const offsetClass = editingMode === EditingMode.None ? 'should-offset' : 'no-offset';
  return (
    <InputContext.Consumer>
      {({ isConsole }) => (
        <Container>
          <ChampionImage className={offsetClass} src={selectedChampion.image} />
          <ChampionInfoPosition>
            <ChampionInfoDisplay
              onSave={onSave}
              champions={champions}
              selectedPreviewSkinInfo={selectedPreviewSkinInfo}
              selectedChampion={selectedChampion}
              editingMode={editingMode}
              onEditingModeChange={onEditingModeChanged}
              onWeaponChange={onWeaponChange}
              onSkinChange={onSkinChange}
              setSelectedPreviewSkinInfo={onSelectedPreviewSkinInfoChange}
              onSelectChampion={onSelectChampion}
            />
          </ChampionInfoPosition>
          <SkinInfoPosition className={offsetClass}>
            <SkinInfo
              hideSkinButtons={hideSkinButtons}
              selectedPreviewSkinInfo={selectedPreviewSkinInfo}
              onSave={onSave}
            />
          </SkinInfoPosition>
          {!isConsole ?
            <ButtonPosition>
              {editingMode === EditingMode.None ?
                <ActionButton onClick={onShowSkills}>Show skills</ActionButton> :
                <ActionButton onClick={onReset}>Cancel</ActionButton>
              }
            </ButtonPosition> :
            <ButtonPosition>
              {editingMode === EditingMode.None &&
                <ActionButton className={ConsoleSelectSpacing}>
                  <ConsoleIcon className='icon-xb-a'></ConsoleIcon> Select
                </ActionButton>
              }
              {editingMode === EditingMode.None ?
                <ActionButton><ConsoleIcon className='icon-xb-x'></ConsoleIcon> Show Skills</ActionButton> :
                <ActionButton><ConsoleIcon className='icon-xb-x'></ConsoleIcon> Cancel</ActionButton>
              }
            </ButtonPosition>
          }
        </Container>
      )}
    </InputContext.Consumer>
  );
}
