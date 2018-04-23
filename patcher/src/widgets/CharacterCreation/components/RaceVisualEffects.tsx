/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Race, Gender } from '@csegames/camelot-unchained';
import { RaceInfo } from '../services/session/races';
import { FactionInfo } from '../services/session/factions';
import VisualEffects from '../../../components/VisualEffects/VisualEffects';

import snowParticles from '../particles/snowParticles';
import glowyOrbsParticles from '../particles/glowyOrbsParticles';
import dustParticles from '../particles/dustParticles';

export interface RaceVisualEffectsProps {
  selectedRace: Partial<RaceInfo>;
  selectedFaction: Partial<FactionInfo>;
  selectedGender: Gender;
  hideCharImg?: boolean;
  effectsOff?: boolean;
}

export interface RaceVisualEffectsState {
}

export class RaceVisualEffects extends React.Component<RaceVisualEffectsProps, RaceVisualEffectsState> {
  public render() {
    const { selectedRace, selectedGender, hideCharImg } = this.props;
    const arthurianLayerInfo = [
      { id: 'bg', extraClass: 'arthurian',resistance: 120 },
      { id: 'layer1', extraClass: 'arthurian',resistance: 90},
      { id: 'dust', particleEffect: dustParticles },
      { id: 'ray1', extraClass: 'arthurian',resistance: 40 },
      { id: 'ray2', extraClass: 'arthurian',resistance: -15 },
      { id: 'ray3', extraClass: 'arthurian', resistance: -60 },
      { id: 'veil', extraClass: 'arthurian' },
      { id: 'veil2', extraClass: 'arthurian', resistance: 200,  shouldParallaxVertical: true },
      { id: 'base', extraClass: 'arthurian',resistance: 140 },
      { id: 'char', extraClass: `standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`,
        resistance: 150, hidden: hideCharImg },
      { id: 'particle', extraClass: 'arthurian', resistance: -50, shouldParallaxVertical: true },
    ];

    const arthurianPictLayerInfo = [
      { id: 'bg', extraClass: 'arthurian-pict',resistance: 120 },
      { id: 'layer1', extraClass: 'arthurian-pict',resistance: 90},
      { id: 'dust', particleEffect: dustParticles },
      { id: 'ray1', extraClass: 'arthurian pict',resistance: 40 },
      { id: 'ray2', extraClass: 'arthurian pict',resistance: -15 },
      { id: 'ray3', extraClass: 'arthurian pict', resistance: -60 },
      { id: 'veil', extraClass: 'arthurian' },
      { id: 'veil2', extraClass: 'arthurian', resistance: 200,  shouldParallaxVertical: true },
      { id: 'base', extraClass: 'arthurian',resistance: 140 },
      { id: 'char', extraClass: `standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`,
        resistance: 150, hidden: hideCharImg },
      { id: 'particle', extraClass: 'arthurian', resistance: -50, shouldParallaxVertical: true },
    ];
    
    const vikingLayerInfo = [
      { id: 'bg', extraClass: 'viking', resistance: 120 },
      { id: 'layer2', extraClass: 'viking', resistance: 70 },
      { id: 'layer1', extraClass: 'viking', resistance: 50 },
      { id: 'snow', particleEffect: snowParticles },
      { id: 'ray1', extraClass: 'viking', resistance: 40 },
      { id: 'ray2', extraClass: 'viking', resistance: -15 },
      { id: 'ray3', extraClass: 'viking', resistance: -60 },
      { id: 'veil', extraClass: 'viking', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'viking' },
      { id: 'base', extraClass: 'viking', resistance: 140 },
      { id: `char`, extraClass: `viking standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`,
        resistance:150, hidden: hideCharImg },
      { id: 'particle', extraClass: 'viking', resistance: -50, shouldParallaxVertical: true },
    ];

    const vikingValkyrieLayerInfo = [
      { id: 'bg', extraClass: 'viking-valkyrie', resistance: 120 },
      { id: 'layer2', extraClass: 'viking-valkyrie', resistance: 70 },
      { id: 'layer1', extraClass: 'viking-valkyrie', resistance: 50 },
      { id: 'snow', particleEffect: snowParticles },
      { id: 'ray1', extraClass: 'viking', resistance: 40 },
      { id: 'ray2', extraClass: 'viking', resistance: -15 },
      { id: 'ray3', extraClass: 'viking', resistance: -60 },
      { id: 'veil', extraClass: 'viking-valkyrie', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'viking', resistance: 200 },
      { id: 'base', extraClass: 'viking', resistance: 140 },
      { id: `char`, extraClass: `viking standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`,
        resistance:150, hidden: hideCharImg },
      { id: 'particle', extraClass: 'viking', resistance: -50, shouldParallaxVertical: true },
    ];

    const tddLayerInfo = [
      { id: 'bg', extraClass: 'tdd', resistance: 70 },
      { id: 'layer3', extraClass: 'tdd', resistance: 80 },
      { id: 'glowOrbs', particleEffect: glowyOrbsParticles },
      { id: 'layer2', extraClass: 'tdd', resistance: 100 },
      { id: 'ray1', extraClass: 'tdd', resistance: 40 },
      { id: 'ray2', extraClass: 'tdd', resistance: -15 },
      { id: 'ray3', extraClass: 'tdd', resistance: -60 },
      { id: 'veil', extraClass: 'tdd', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'tdd' },
      { id: 'base', extraClass: 'tdd', resistance: 140 },
      { id: 'char', extraClass: `tdd luchorpan standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`,
        resistance: 150, hidden: hideCharImg },
    ];

    const tddHumanLayerInfo = [
      { id: 'bg', extraClass: 'tdd-human', resistance: 70 },
      { id: 'layer2', extraClass: 'tdd-human', resistance: 80 },
      { id: 'glowOrbs', particleEffect: glowyOrbsParticles },
      { id: 'layer1', extraClass: 'tdd-human', resistance: 100 },
      { id: 'ray1', extraClass: 'tdd', resistance: 40 },
      { id: 'ray2', extraClass: 'tdd', resistance: -15 },
      { id: 'ray3', extraClass: 'tdd', resistance: -60 },
      { id: 'veil', extraClass: 'tdd-human', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'tdd' },
      { id: 'base', extraClass: 'tdd', resistance: 140 },
      { id: 'char', extraClass: `tdd standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`,
        resistance: 150, hidden: hideCharImg },
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
        id={'race-parallax'}
        effectsOff={this.props.effectsOff}
        layerInfo={layerInfo}
        renderMisc={miscInfo}
      />
    );
  }
}

export default RaceVisualEffects;
