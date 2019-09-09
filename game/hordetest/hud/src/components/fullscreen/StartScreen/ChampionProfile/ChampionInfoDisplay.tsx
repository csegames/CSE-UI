/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionInfo, Rarity, Skin } from './testData';
import { EditingMode } from './index';
import { EquipmentItem } from './EquipmentItem';
import { ChampionSelect } from './ChampionSelect';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChampionName = styled.div`
  font-family: Colus;
  font-size: 23px;
  color: white;
`;

const EquipmentTitle = styled.div`
  font-family: Colus;
  font-size: 18px;
  color: #a9a9a9;
  border-width: 0px;
  border-bottom-width: 2px;
  border-image: url(../images/fullscreen/underline-border.png);
  border-image-slice: 2;
`;

const EquipmentContainer = styled.div`
  max-width: 350px;
  margin-top: 30px;
`;

const EquipmentItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 402px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: none;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4f4f4f;
  }
`;

export interface Props {
  champions: ChampionInfo[];
  editingMode: EditingMode;
  selectedChampion: ChampionInfo;
  selectedPreviewSkinInfo: Skin;
  onEditingModeChange: (editingMode: EditingMode) => void;
  onSkinChange: (id: string) => void;
  onWeaponChange: (id: string) => void;
  setSelectedPreviewSkinInfo: (skin: Skin, hideButtons?: boolean) => void;
  onSelectChampion: (champion: ChampionInfo) => void;
  onSave: (skin: Skin) => void;
}

export function ChampionInfoDisplay(props: Props) {
  function getSelectedSkin() {
    const { selectedChampion } = props;
    return selectedChampion.availableSkins.find(s => s.id === selectedChampion.selectedSkinId);
  }

  function getSelectedWeapon() {
    const { selectedChampion } = props;
    return selectedChampion.availableWeapons.find(w => w.id === selectedChampion.selectedWeaponId);
  }

  function onEditSkinClick() {
    props.setSelectedPreviewSkinInfo(getSelectedSkin(), false);
    props.onEditingModeChange(EditingMode.Skin);
  }

  function onSkinClick(skin: Skin, hideButtons?: boolean) {
    props.setSelectedPreviewSkinInfo(skin, hideButtons);
  }

  function onEditWeaponClick() {
    props.setSelectedPreviewSkinInfo(getSelectedWeapon(), false);
    props.onEditingModeChange(EditingMode.Weapon);
  }

  function onMouseEnter(skin: Skin) {
    props.setSelectedPreviewSkinInfo(skin, true);
  }

  function onMouseLeave() {
    props.setSelectedPreviewSkinInfo(null);
  }

  function getEquipmentTitle() {
    switch (props.editingMode) {
      case EditingMode.None: {
        return 'Equipment';
      }
      case EditingMode.Portrait: {
        return 'Select a portrait';
      }
      case EditingMode.Logo: {
        return 'Select a logo';
      }
      default: {
        return 'Select a skin';
      }
    }
  }

  function renderEquipmentDisplay() {
    switch (props.editingMode) {
      case EditingMode.None: {
        return renderEquipmentOverview();
      }
      case EditingMode.Skin: {
        return renderSkinEdit();
      }
      case EditingMode.Weapon: {
        return renderWeaponEdit();
      }
    }
  }

  function renderEquipmentOverview() {
    return (
      <>
        <EquipmentItem
          skin={selectedSkin}
          onClick={onEditSkinClick}
          className={selectedSkin ? Rarity[selectedSkin.rarity] : ''}
          onMouseEnter={() => onMouseEnter(selectedSkin)}
          onMouseLeave={onMouseLeave}
        />
        <EquipmentItem skin={null} />
        <EquipmentItem
          skin={selectedWeapon}
          onClick={onEditWeaponClick}
          className={selectedWeapon ? Rarity[selectedWeapon.rarity] : ''}
          onMouseEnter={() => onMouseEnter(selectedSkin)}
          onMouseLeave={onMouseLeave}
        />
        <EquipmentItem skin={null} />
        <EquipmentItem skin={null} />
      </>
    );
  }

  function renderSkinEdit() {
    const sortedSkins = props.selectedChampion.availableSkins.sort((a, b) => a.rarity - b.rarity);
    return sortedSkins.map((skin) => {
      const rarityClass = skin ? Rarity[skin.rarity] : '';
      const selectedPreviewSkinClass = props.selectedPreviewSkinInfo.id === skin.id ? 'selected-preview' : '';
      const isSelected = props.selectedPreviewSkinInfo.isUnlocked ? skin.id === props.selectedPreviewSkinInfo.id :
        skin.id === props.selectedChampion.selectedSkinId;
      return (
        <EquipmentItem
          shouldShowStatus
          isSelected={isSelected}
          skin={skin}
          onClick={() => onSkinClick(skin, false)}
          onDoubleClick={props.onSave}
          className={`${rarityClass} ${selectedPreviewSkinClass}`}
        />
      );
    });
  }

  function renderWeaponEdit() {
    const sortedWeapons = props.selectedChampion.availableWeapons.sort((a, b) => a.rarity - b.rarity);
    return sortedWeapons.map((weapon) => {
      const rarityClass = weapon ? Rarity[weapon.rarity] : '';
      const selectedPreviewSkinClass = props.selectedPreviewSkinInfo.id === weapon.id ? 'selected-preview' : '';
      const isSelected = props.selectedPreviewSkinInfo.isUnlocked ? weapon.id === props.selectedPreviewSkinInfo.id :
        weapon.id === props.selectedChampion.selectedWeaponId;
      return (
        <EquipmentItem
          shouldShowStatus
          isSelected={isSelected}
          skin={weapon}
          onClick={() => onSkinClick(weapon, false)}
          onDoubleClick={props.onSave}
          className={`${rarityClass} ${selectedPreviewSkinClass}`}
        />
      );
    });
  }

  const selectedSkin = getSelectedSkin();
  const selectedWeapon = getSelectedWeapon();
  return (
    <Container>
      <ChampionName>{props.selectedChampion.name}</ChampionName>
      <ChampionSelect
        champions={props.champions}
        selectedChampion={props.selectedChampion}
        onSelectChampion={props.onSelectChampion}
      />
      <EquipmentContainer>
        <EquipmentTitle>{getEquipmentTitle()}</EquipmentTitle>
        <EquipmentItemsContainer>
          {renderEquipmentDisplay()}
        </EquipmentItemsContainer>
      </EquipmentContainer>
    </Container>
  );
}
