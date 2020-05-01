/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { EditingMode } from './index';
import { EquipmentItem } from './EquipmentItem';
import { Title } from '../../Title';
import { Champion } from './index';
import { Skin } from '../Store/testData';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChampionName = styled.div`
  font-family: Colus;
  font-size: 30px;
  color: white;
`;

const EquipmentContainer = styled.div`
  max-width: 350px;
  margin-top: 10px;
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
  champions: Champion[];
  editingMode: EditingMode;
  selectedChampion: Champion;
  selectedPreviewSkinInfo: Skin;
  onEditingModeChange: (editingMode: EditingMode) => void;
  onSkinChange: (id: string) => void;
  onWeaponChange: (id: string) => void;
  setSelectedPreviewSkinInfo: (skin: Skin, hideButtons?: boolean) => void;
  onSelectChampion: (champion: Champion) => void;
  onSave: (skin: Skin) => void;
}

export function ChampionInfoDisplay(props: Props) {
  function getSelectedSkin() {
    // const { selectedChampion } = props;
    // return selectedChampion.availableSkins.find(s => s.id === selectedChampion.selectedSkinId);
    return null as any;
  }

  function getSelectedWeapon() {
    // const { selectedChampion } = props;
    // return selectedChampion.availableWeapons.find(w => w.id === selectedChampion.selectedWeaponId);
    return null as any;
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
        <EquipmentItem skin={null} />
        <EquipmentItem
          skin={selectedSkin}
          onClick={onEditSkinClick}
          onMouseEnter={() => onMouseEnter(selectedSkin)}
          onMouseLeave={onMouseLeave}
        />
        <EquipmentItem
          skin={selectedWeapon}
          onClick={onEditWeaponClick}
          onMouseEnter={() => onMouseEnter(selectedSkin)}
          onMouseLeave={onMouseLeave}
        />
      </>
    );
  }

  function renderSkinEdit() {
    // const sortedSkins = props.selectedChampion.availableSkins.sort((a, b) => a.rarity - b.rarity);
    const sortedSkins: any = [];
    return sortedSkins.map((skin: any) => {
      const selectedPreviewSkinClass = props.selectedPreviewSkinInfo.id === skin.id ? 'selected-preview' : '';
      // const isSelected = props.selectedPreviewSkinInfo.isUnlocked ? skin.id === props.selectedPreviewSkinInfo.id :
      //   skin.id === props.selectedChampion.selectedSkinId;
      const isSelected = false;
      return (
        <EquipmentItem
          shouldShowStatus
          isSelected={isSelected}
          skin={skin}
          onClick={() => onSkinClick(skin, false)}
          onDoubleClick={() => skin.isUnlocked ? props.onSave(skin) : {}}
          className={`${selectedPreviewSkinClass}`}
        />
      );
    });
  }

  function renderWeaponEdit() {
    // const sortedWeapons = props.selectedChampion.availableWeapons.sort((a, b) => a.rarity - b.rarity);
    const sortedWeapons: any = [];
    return sortedWeapons.map((weapon: any) => {
      const selectedPreviewSkinClass = props.selectedPreviewSkinInfo.id === weapon.id ? 'selected-preview' : '';
      // const isSelected = props.selectedPreviewSkinInfo.isUnlocked ? weapon.id === props.selectedPreviewSkinInfo.id :
      //   weapon.id === props.selectedChampion.selectedWeaponId;
      const isSelected = false;
      return (
        <EquipmentItem
          shouldShowStatus
          isSelected={isSelected}
          skin={weapon}
          onClick={() => onSkinClick(weapon, false)}
          onDoubleClick={() => weapon.isUnlocked ? props.onSave(weapon) : {}}
          className={`${selectedPreviewSkinClass}`}
        />
      );
    });
  }

  const selectedSkin = getSelectedSkin();
  const selectedWeapon = getSelectedWeapon();
  return (
    <Container>
      <ChampionName>{props.selectedChampion.name}</ChampionName>
      <EquipmentContainer>
        <Title>{getEquipmentTitle()}</Title>
        <EquipmentItemsContainer>
          {renderEquipmentDisplay()}
        </EquipmentItemsContainer>
      </EquipmentContainer>
    </Container>
  );
}
