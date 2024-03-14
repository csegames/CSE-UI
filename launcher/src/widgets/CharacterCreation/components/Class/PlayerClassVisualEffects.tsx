/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import VisualEffects from '../../../../components/VisualEffects/VisualEffects';
import { ArchetypeInfo, FactionInfo, RaceInfo } from '../../../../api/webapi';
import { Gender, Race } from '../../../../api/helpers';

export interface PlayerClassVisualEffectsProps {
  selectedClass: Partial<ArchetypeInfo>;
  selectedRace: Partial<RaceInfo>;
  selectedFaction: Partial<FactionInfo>;
  selectedGender: Gender;
  hideCharImg?: boolean;
  effectsOff?: boolean;
}

export interface PlayerClassVisualEffectsState {}

export class PlayerClassVisualEffects extends React.PureComponent<
  PlayerClassVisualEffectsProps,
  PlayerClassVisualEffectsState
> {
  public render() {
    const { selectedRace, selectedGender, selectedClass, hideCharImg } = this.props;
    const raceVal = Race[selectedRace.stringID as keyof typeof Race];
    const race = raceVal.toLowerCase().includes('human') ? 'Human' : raceVal;

    const arthurianLayerInfo = [
      { id: 'ray1 arthurian', src: 'images/visualfx/ray-1.png', resistance: 40 },
      { id: 'ray2 arthurian', src: 'images/visualfx/ray-2.png', resistance: -15 },
      { id: 'ray3 arthurian', src: 'images/visualfx/ray-3.png', resistance: -60 },
      { id: 'veil arthurian', src: 'images/visualfx/art/art-veil.png' },
      { id: 'veil2 arthurian', src: 'images/visualfx/art/art-veil2.png', resistance: 200 },
      { id: 'base arthurian', isDiv: true, resistance: 140 },
      {
        id: `char standing__${race}_${Gender[selectedGender]}_${selectedClass.stringID}`,
        isDiv: true,
        resistance: 150,
        hidden: hideCharImg
      }
    ];

    const arthurianPictLayerInfo = [
      { id: 'ray1 arthurian pict', src: 'images/visualfx/ray-1.png', resistance: 40 },
      { id: 'ray2 arthurian pict', src: 'images/visualfx/ray-2.png', resistance: -15 },
      { id: 'ray3 arthurian pict', src: 'images/visualfx/ray-3.png', resistance: -60 },
      { id: 'veil arthurian', src: 'images/visualfx/art/art-veil.png' },
      { id: 'veil2 arthurian', src: 'images/visualfx/art/art-veil2.png', resistance: 200 },
      { id: 'base arthurian', isDiv: true, resistance: 140 },
      {
        id: `char standing__${race}_${Gender[selectedGender]}_${selectedClass.stringID}`,
        isDiv: true,
        resistance: 150,
        hidden: hideCharImg
      }
    ];

    const vikingLayerInfo = [
      { id: 'ray1 viking', src: 'images/visualfx/ray-1.png', resistance: 40 },
      { id: 'ray2 viking', src: 'images/visualfx/ray-2.png', resistance: -15 },
      { id: 'ray3 viking', src: 'images/visualfx/ray-3.png', resistance: -60 },
      { id: 'veil viking', src: 'images/visualfx/vik/vik-veil.png', resistance: 200, shouldParallaxVertical: true },
      { id: 'veil2 viking', src: 'images/visualfx/vik/vik-veil2.png' },
      { id: 'base viking', isDiv: true, resistance: 140 },
      {
        id: 'char viking standing' + `__${race}_${Gender[selectedGender]}_${selectedClass.stringID}`,
        isDiv: true,
        resistance: 150,
        hidden: hideCharImg
      }
    ];

    const vikingValkyrieLayerInfo = [
      { id: 'ray1 viking', src: 'images/visualfx/ray-1.png', resistance: 40 },
      { id: 'ray2 viking', src: 'images/visualfx/ray-2.png', resistance: -15 },
      { id: 'ray3 viking', src: 'images/visualfx/ray-3.png', resistance: -60 },
      { id: 'veil valkyrie viking', src: 'images/visualfx/vik/vik-veil.png', resistance: 200 },
      { id: 'veil2 viking', src: 'images/visualfx/vik/vik-veil2.png', resistance: 200 },
      { id: 'base viking', isDiv: true, resistance: 140 },
      {
        id: 'char viking standing__' + `${race}_${Gender[selectedGender]}_${selectedClass.stringID}`,
        isDiv: true,
        resistance: 150,
        hidden: hideCharImg
      }
    ];

    const tddLayerInfo = [
      { id: 'ray1 tdd', src: 'images/visualfx/ray-1.png', resistance: 40 },
      { id: 'ray2 tdd', src: 'images/visualfx/ray-2.png', resistance: -15 },
      { id: 'ray3 tdd', src: 'images/visualfx/ray-3.png', resistance: -60 },
      { id: 'veil tdd', src: 'images/visualfx/tdd/tdd-veil.png', resistance: 200, shouldParallaxVertical: true },
      { id: 'veil2 tdd', src: 'images/visualfx/tdd/tdd-veil2.png' },
      { id: 'base tdd', isDiv: true, resistance: 140 },
      {
        id: `char tdd luchorpan standing__${race}_${Gender[selectedGender]}_${selectedClass.stringID}`,
        isDiv: true,
        resistance: 150,
        hidden: hideCharImg
      }
    ];

    const tddHumanLayerInfo = [
      { id: 'ray1 tdd', src: 'images/visualfx/ray-1.png', resistance: 40 },
      { id: 'ray2 tdd', src: 'images/visualfx/ray-2.png', resistance: -15 },
      { id: 'ray3 tdd', src: 'images/visualfx/ray-3.png', resistance: -60 },
      { id: 'veil tdd-human', src: 'images/visualfx/tdd/human/tdd2-veil.png', resistance: 200 },
      { id: 'veil2 tdd', src: 'images/visualfx/tdd/tdd-veil2.png' },
      { id: 'base tdd', isDiv: true, resistance: 140 },
      {
        id: 'char standing__' + `${race}_${Gender[selectedGender]}_${selectedClass.stringID}`,
        isDiv: true,
        resistance: 150,
        hidden: hideCharImg
      }
    ];

    let layerInfo;

    switch (selectedRace.stringID) {
      case Race.Golem:
      case Race.Strm:
      case Race.CaitSith:
      case Race.HumanMaleA: {
        layerInfo = arthurianLayerInfo;
        break;
      }
      case Race.Pict: {
        layerInfo = arthurianPictLayerInfo;
        break;
      }
      case Race.Jotnar:
      case Race.HumanMaleV: {
        layerInfo = vikingLayerInfo;
        // miscInfo = () => <div className='clouds viking'></div>;
        break;
      }
      case Race.Valkyrie: {
        layerInfo = vikingValkyrieLayerInfo;
        // miscInfo = () => <div className='clouds viking'></div>;
        break;
      }
      case Race.HumanMaleT: {
        layerInfo = tddHumanLayerInfo;
        // miscInfo = () => <div className='clouds tdd'></div>;
        break;
      }
      case Race.Firbog:
      case Race.Hamadryad:
      case Race.Luchorpan: {
        layerInfo = tddLayerInfo;
        // miscInfo = () => <div className='clouds tdd'></div>;
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
        renderMisc={() => null}
      />
    );
  }
}

export default PlayerClassVisualEffects;
