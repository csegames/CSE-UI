/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { webAPI, Race, Gender, Archetype } from '@csegames/camelot-unchained';
import { RaceInfo } from '../../services/session/races';
import { FactionInfo } from '../../services/session/factions';
import { PlayerClassInfo } from '../../services/session/playerClasses';
import VisualEffects from '../../../../components/VisualEffects/VisualEffects';

export interface PlayerClassVisualEffectsProps {
  selectedClass: Partial<PlayerClassInfo>;
  selectedRace: Partial<RaceInfo>;
  selectedFaction: Partial<FactionInfo>;
  selectedGender: Gender;
  hideCharImg?: boolean;
  effectsOff?: boolean;
}

export interface PlayerClassVisualEffectsState {
}

export class PlayerClassVisualEffects extends React.Component<PlayerClassVisualEffectsProps, PlayerClassVisualEffectsState> {
  public render() {
    const { selectedRace, selectedGender, selectedClass, hideCharImg } = this.props;
    const arthurianLayerInfo = [
      { id: 'ray1', extraClass: 'arthurian', resistance: 40 },
      { id: 'ray2', extraClass: 'arthurian', resistance: -15 },
      { id: 'ray3', extraClass: 'arthurian', resistance: -60 },
      { id: 'veil', extraClass: 'arthurian' },
      { id: 'veil2', extraClass: 'arthurian', resistance: 200,  shouldParallaxVertical: true },
      { id: 'base', extraClass: 'arthurian', resistance: 140 },
      {
        id: 'char',
        extraClass: 'standing__' +
          `${webAPI.raceString(selectedRace.id)}_${Gender[selectedGender]}_${Archetype[selectedClass.id]}`,
        resistance: 150,
        hidden: hideCharImg,
      },
    ];

    const arthurianPictLayerInfo = [
      { id: 'ray1', extraClass: 'arthurian pict', resistance: 40 },
      { id: 'ray2', extraClass: 'arthurian pict', resistance: -15 },
      { id: 'ray3', extraClass: 'arthurian pict', resistance: -60 },
      { id: 'veil', extraClass: 'arthurian' },
      { id: 'veil2', extraClass: 'arthurian', resistance: 200,  shouldParallaxVertical: true },
      { id: 'base', extraClass: 'arthurian', resistance: 140 },
      {
        id: 'char',
        extraClass: 'standing__' +
          `${webAPI.raceString(selectedRace.id)}_${Gender[selectedGender]}_${Archetype[selectedClass.id]}`,
        resistance: 150,
        hidden: hideCharImg,
      },
    ];

    const vikingLayerInfo = [
      { id: 'ray1', extraClass: 'viking', resistance: 40 },
      { id: 'ray2', extraClass: 'viking', resistance: -15 },
      { id: 'ray3', extraClass: 'viking', resistance: -60 },
      { id: 'veil', extraClass: 'viking', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'viking' },
      { id: 'base', extraClass: 'viking', resistance: 140 },
      {
        id: `char`,
        extraClass: 'viking standing__'
          + `${webAPI.raceString(selectedRace.id)}_${Gender[selectedGender]}_${Archetype[selectedClass.id]}`,
        resistance: 150,
        hidden: hideCharImg,
      },
    ];

    const vikingValkyrieLayerInfo = [
      { id: 'ray1', extraClass: 'viking', resistance: 40 },
      { id: 'ray2', extraClass: 'viking', resistance: -15 },
      { id: 'ray3', extraClass: 'viking', resistance: -60 },
      { id: 'veil', extraClass: 'viking-valkyrie', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'viking', resistance: 200 },
      { id: 'base', extraClass: 'viking', resistance: 140 },
      {
        id: `char`,
        extraClass: 'viking standing__' +
          `${webAPI.raceString(selectedRace.id)}_${Gender[selectedGender]}_${Archetype[selectedClass.id]}`,
        resistance: 150,
        hidden: hideCharImg,
      },
    ];

    const tddLayerInfo = [
      { id: 'ray1', extraClass: 'tdd', resistance: 40 },
      { id: 'ray2', extraClass: 'tdd', resistance: -15 },
      { id: 'ray3', extraClass: 'tdd', resistance: -60 },
      { id: 'veil', extraClass: 'tdd', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'tdd' },
      { id: 'base', extraClass: 'tdd', resistance: 140 },
      {
        id: 'char',
        extraClass: 'tdd luchorpan standing__' +
          `${Race[selectedRace.id]}_${Gender[selectedGender]}_${Archetype[selectedClass.id]}`,
        resistance: 150,
        hidden: hideCharImg,
      },
    ];

    const tddHumanLayerInfo = [
      { id: 'ray1', extraClass: 'tdd', resistance: 40 },
      { id: 'ray2', extraClass: 'tdd', resistance: -15 },
      { id: 'ray3', extraClass: 'tdd', resistance: -60 },
      { id: 'veil', extraClass: 'tdd-human', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'tdd' },
      { id: 'base', extraClass: 'tdd', resistance: 140 },
      {
        id: 'char',
        extraClass: 'tdd standing__' +
          `${webAPI.raceString(selectedRace.id)}_${Gender[selectedGender]}_${Archetype[selectedClass.id]}`,
        resistance: 150,
        hidden: hideCharImg,
      },
    ];

    let layerInfo;
    let miscInfo;

    switch (selectedRace.id) {
      case Race.HumanMaleA: {
        layerInfo = arthurianLayerInfo;
        break;
      }
      case Race.Pict: {
        layerInfo = arthurianPictLayerInfo;
        break;
      }
      case Race.HumanMaleV: {
        layerInfo = vikingLayerInfo;
        miscInfo = () => <div className='clouds viking'></div>;
        break;
      }
      case Race.Valkyrie: {
        layerInfo = vikingValkyrieLayerInfo;
        miscInfo = () => <div className='clouds viking'></div>;
        break;
      }
      case Race.HumanMaleT: {
        layerInfo = tddHumanLayerInfo;
        miscInfo = () => <div className='clouds tdd'></div>;
        break;
      }
      case Race.Luchorpan: {
        layerInfo = tddLayerInfo;
        miscInfo = () => <div className='clouds tdd'></div>;
        break;
      }
      default: {
        layerInfo = arthurianLayerInfo;
        break;
      }
    }

    return (
      <VisualEffects
        id={'playerclass-parallax'}
        effectsOff={this.props.effectsOff}
        layerInfo={layerInfo}
        renderMisc={miscInfo}
      />
    );
  }
}

export default PlayerClassVisualEffects;
