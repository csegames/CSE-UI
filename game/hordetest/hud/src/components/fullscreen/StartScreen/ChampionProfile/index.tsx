/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionInfoDisplay } from './ChampionInfoDisplay';

import { champions, ChampionInfo, Skin } from './testData';
import { SkinInfo } from './SkinInfo';
import { SkillInfo } from './SkillInfo';
import { ActionButton } from '../../ActionButton';

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
  position: absolute;
  right: 40px;
  bottom: 40px;
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
      case 'skin': {
        onSkinChange(skin.id);
        onReset();
        break;
      }
      case 'weapon': {
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
      <ButtonPosition>
        {editingMode === EditingMode.None && <ActionButton onClick={onShowSkills}>Show skills</ActionButton>}
        {editingMode !== EditingMode.None && <ActionButton onClick={onReset}>Cancel</ActionButton>}
      </ButtonPosition>
    </Container>
  );
}
