/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useContext, useEffect } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/hordetest';
import { ChampionInfo, ChampionCostumeInfo } from '@csegames/library/lib/hordetest/graphql/schema';

import { ChampionInfoDisplay } from './ChampionInfoDisplay';
import { ChampionSelect } from './ChampionSelect';
import { SkinInfo } from './SkinInfo';
import { SkillInfo } from './SkillInfo';
import { ActionButton } from '../../ActionButton';
import { Skin, StoreItemType } from '../Store/testData';
import { InputContext } from 'context/InputContext';
import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { ColossusProfileContext } from 'context/ColossusProfileContext';
import { TransitionAnimation } from '../../../shared/TransitionAnimation';


const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ErrorContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Lato;
  font-size: 28px;
  color: white;
`;

const ChampionImage = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

const ChampionInfoPosition = styled.div`
  position: absolute;
  top: 20%;
  left: 20%;
  opacity: 0;
  margin-left: -10%;
  animation: slideIn 0.6s forwards;
  @keyframes slideIn {
    from {
      opacity: 0;
      margin-left: -10%;
    }
    to {
      opacity: 1;
      margin-left: 0;
    }
  }
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
  opacity: 0;
  margin-top: -10%;
  animation: slideIn 0.3s forwards ;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-bottom: -10%;
    }
    to {
      opacity: 1;
      margin-bottom: 0;
    }
  }
`;

const ConsoleIcon = styled.span`
  margin-right: 5px;
`;

const ConsoleSelectSpacing = css`
  margin-right: 20px;
`;

const AnimationContainerClass = css`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  margin-right: -10%;
  opacity: 0;

  &.should-offset {
    bottom: -45%;
    right: -30%;
    width: 140%;
    height: 140%;
  }
`;

const TransitionAnimationClass = css`
  animation: slideIn 0.5s forwards;
  opacity: 0;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-right: -10%;
    }
    to {
      opacity: 1;
      margin-right: 0;
    }
  }
`;

// const ChampionSelectPosition = styled.div`

// `;

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

export interface Champion extends ChampionInfo {
  costumes: ChampionCostumeInfo[];
}

export function ChampionProfile(props: Props) {
  const inputContext = useContext(InputContext);
  const championInfoContext = useContext(ChampionInfoContext);
  const colossusProfileContext = useContext(ColossusProfileContext);
  const [editingMode, setEditingMode] = useState(EditingMode.None);
  const [selectedChampion, setSelectedChampion] = useState(getDefaultChampion());
  const [selectedPreviewSkinInfo, setSelectedPreviewSkinInfo] = useState<Skin>(null);
  const [hideSkinButtons, setHideSkinButtons] = useState(true);

  // function onSelectChampion(championID: string) {
  //   const champion = champions.find(c => c.id === championID);
  //   setSelectedChampion(champion);
  // }

  useEffect(() => {
    if (!selectedChampion)
    {
      setSelectedChampion(getDefaultChampion());
    }
  }, [])

  function onReset() {
    setEditingMode(EditingMode.None);
    setSelectedPreviewSkinInfo(null);
    setHideSkinButtons(true);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  function onShowSkills() {
    game.trigger('show-right-modal', <SkillInfo selectedChampion={selectedChampion} />);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  function onEditingModeChanged(editingMode: EditingMode) {
    setEditingMode(editingMode)
  }

  function onSelectChampion(champion: Champion) {
    setSelectedChampion(champion);

    switch (editingMode) {
      case EditingMode.Skin: {
        // setSelectedPreviewSkinInfo(champion.find(s => s.id === champion.costumes.));
        return;
      }
      case EditingMode.Weapon: {
        // setSelectedPreviewSkinInfo(champion.availableWeapons.find(s => s.id === champion.selectedWeaponId));
        return;
      }
      default: return;
    }
  }

  function onSkinChange(skinId: string) {
    const newSelectedChampion: Champion = {
      ...selectedChampion,
      // selectedSkinId: skinId,
    };
    setSelectedChampion(newSelectedChampion);
    setHideSkinButtons(true);
  }

  function onWeaponChange(weaponId: string) {
    const newSelectedChampion: Champion = {
      ...selectedChampion,
      // selectedWeaponId: weaponId,
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

  function getChampions(): Champion[] {
    const champions = championInfoContext && championInfoContext.champions;

    if (!champions) {
      console.error('Champion Profile tried to use ChampionInfoContext and it was null');
      return [];
    }

    return champions.map((champ) => {
      const championCostumes = championInfoContext.championCostumes.filter(costume =>
        costume.requiredChampionID === champ.id);
      return {
        ...champ,
        costumes: championCostumes,
      };
    });
  }

  function getDefaultChampion() {
    const colossusProfile = colossusProfileContext && colossusProfileContext.colossusProfile;
    if (colossusProfile && colossusProfile.defaultChampion && colossusProfile.defaultChampion.championID) {
      const colossusProfileChampion =
        getChampions().find(c => c.id === colossusProfileContext.colossusProfile.defaultChampion.championID);

        if (colossusProfileChampion) {
          return colossusProfileChampion;
        } else {
          console.error('User had a ColossusProfile default champion with an invalid championID');
        }
    }

    return getChampions()[0];
  }

  async function onSetAsDefault() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);

    const res = await webAPI.ProfileAPI.SetDefaultChampion(
      webAPI.defaultConfig,
      selectedChampion.id as any,
      selectedChampion.costumes[0].id as any,
    );

    if (res.ok) {
      colossusProfileContext.graphql.refetch();
    }
  }

  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  const offsetClass = editingMode === EditingMode.None ? 'should-offset' : 'no-offset';
  const champions = getChampions();

  const standingImage = selectedChampion ? selectedChampion.costumes[0].standingImageURL : '';
  return champions && selectedChampion ? (
    <Container>
      <TransitionAnimation
        defaultShouldPlayAnimation
        changeVariable={standingImage}
        containerStyles={`${AnimationContainerClass} ${offsetClass}`}
        animationClass={TransitionAnimationClass}
        animationDuration={500}>
        <ChampionImage src={standingImage} />
      </TransitionAnimation>
      <ChampionSelect
        champions={champions}
        selectedChampion={selectedChampion}
        onSelectChampion={onSelectChampion}
      />
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
      {!inputContext.isConsole ?
        <ButtonPosition>
            <ActionButton style={{ marginRight: 30 }} onClick={onSetAsDefault} onMouseEnter={onMouseEnter}>Set As Default</ActionButton>
          {editingMode === EditingMode.None ?
            <ActionButton onClick={onShowSkills} onMouseEnter={onMouseEnter}>Show skills</ActionButton> :
            <ActionButton onClick={onReset} onMouseEnter={onMouseEnter}>Cancel</ActionButton>
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
  ) :
    <ErrorContainer>We are having some technical difficulties</ErrorContainer>;
}
