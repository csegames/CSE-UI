/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Race, Gender } from 'camelot-unchained';
import VisualEffects from '../../../../../components/VisualEffects/VisualEffects';

import dustParticles from '../../../../CharacterCreation/particles/dustParticles';
import snowParticles from '../../../../CharacterCreation/particles/snowParticles';
import glowOrbsParticles from '../../../../CharacterCreation/particles/glowyOrbsParticles';

export interface RaceVisualEffectsProps {
  selectedRace: any;
  selectedFaction: any;
  selectedGender: Gender;
  effectsOff?: boolean;
  fadeClass: string;
}

export interface RaceVisualEffectsState {
}

export class RaceVisualEffects extends React.Component<RaceVisualEffectsProps, RaceVisualEffectsState> {
  public render() {
    const { selectedRace } = this.props;
    const arthurianLayerInfo = [
      { id: 'bg', extraClass: 'arthurian',resistance: 120 },
      { id: 'layer1', extraClass: 'arthurian',resistance: 90},
      { id: 'dust', particleEffect: dustParticles },
      { id: 'ray1', extraClass: 'arthurian',resistance: 40 },
      { id: 'ray2', extraClass: 'arthurian',resistance: -15 },
      { id: 'ray3', extraClass: 'viking', resistance: -60 },
      { id: 'veil', extraClass: 'arthurian', resistance: 10 },
      { id: 'veil2', extraClass: 'arthurian', resistance: 200,  shouldParallaxVertical: true },
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
      { id: 'veil2', extraClass: 'viking', resistance: 200 },
      { id: 'particle', extraClass: 'viking', resistance: -50, shouldParallaxVertical: true },
    ];

    const tddLayerInfo = [
      { id: 'bg', extraClass: 'tdd', resistance: 70 },
      { id: 'layer3', extraClass: 'tdd', resistance: 80 },
      { id: 'glowOrbs', particleEffect: glowOrbsParticles },
      { id: 'layer2', extraClass: 'tdd', resistance: 100 },
      { id: 'ray1', extraClass: 'tdd', resistance: 40 },
      { id: 'ray2', extraClass: 'tdd', resistance: -15 },
      { id: 'ray3', extraClass: 'tdd', resistance: -60 },
      { id: 'veil', extraClass: 'tdd', resistance: 200,  shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'tdd', resistance: 10 },
    ];

    let layerInfo;
    let miscInfo;

    switch (selectedRace.id) {
      case Race.HumanMaleA: {
        layerInfo = arthurianLayerInfo;
        miscInfo = () => <div className='clouds arthurian' />;
        break;
      }
      case Race.Pict: {
        layerInfo = arthurianLayerInfo;
        miscInfo = () => <div className='clouds arthurian' />;
        break;
      }
      case Race.HumanMaleV: {
        layerInfo = vikingLayerInfo;
        miscInfo = () => <div className='clouds viking' />;
        break;
      }
      case Race.Valkyrie: {
        layerInfo = vikingLayerInfo;
        miscInfo = () => <div className='clouds viking' />;
        break;
      } 
      case Race.HumanMaleT: {
        layerInfo = tddLayerInfo;
        miscInfo = () => <div className='clouds tdd' />;
        break;
      } 
      case Race.Luchorpan: {
        layerInfo = tddLayerInfo;
        miscInfo = () => <div className='clouds tdd' />;
        break;
      } 
      default: {
        layerInfo = arthurianLayerInfo;
        miscInfo = () => <div className='clouds arthurian' />;
        break;
      }
    }

    return (
      <div className={this.props.fadeClass || ''}>
        <VisualEffects
          id='character-select-fx-parallax'
          effectsOff={this.props.effectsOff}
          layerInfo={layerInfo}
          renderMisc={miscInfo}
        />
      </div>
    );
  }
}

export default RaceVisualEffects;
