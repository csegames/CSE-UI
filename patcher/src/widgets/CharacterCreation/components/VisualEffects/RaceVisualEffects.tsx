/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Race, Gender, Faction } from 'camelot-unchained';

import { RaceInfo } from '../../services/session/races';
import { FactionInfo } from '../../services/session/factions';
import VisualEffects from './VisualEffects';

import snowParticles from './particles/snowParticles';
import leafParticles from './particles/leafParticles';
import snowCloseParticles from './particles/snowCloseParticles';
import glowyOrbsParticles from './particles/glowyOrbsParticles';
import dustParticles from './particles/dustParticles';

declare var particlesJS: any;
declare var $: any;

export interface RaceVisualEffectsProps {
  selectedRace: RaceInfo;
  selectedFaction: FactionInfo;
  selectedGender: Gender;
}

export interface RaceVisualEffectsState {
}

export class RaceVisualEffects extends React.Component<RaceVisualEffectsProps, RaceVisualEffectsState> {
  public render() {
    const { selectedFaction, selectedRace, selectedGender } = this.props;
    
    const arthurianLayerInfo = [
      { id: 'bg', extraClass: 'arthurian',resistance: -90, shouldParallaxVertical: true },
      { id: 'layer3', extraClass: 'arthurian',resistance: 90 },
      { id: 'layer2', extraClass: 'arthurian',resistance: 50 },
      { id: 'layer1', extraClass: 'arthurian',resistance: 60, shouldParallaxVertical: true },
      { id: 'char', extraClass: `standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`, resistance: 70 },
      { id: 'ray1', extraClass: 'arthurian',resistance: 50 },
      { id: 'ray2', extraClass: 'arthurian',resistance: 25 },
      { id: 'ray3', extraClass: 'arthurian',resistance: 70 },
      { id: 'dust', particleEffect: dustParticles },
    ];
    
    const vikingLayerInfo = [
      { id: 'bg', extraClass: 'viking', resistance: -90, shouldParallaxVertical: true },
      { id: 'layer3', extraClass: 'viking', resistance: 90, shouldParallaxVertical: true},
      { id: 'layer2', extraClass: 'viking', resistance: 50 },
      { id: 'layer1', extraClass: 'viking', resistance: 60 },
      { id: `char`, extraClass: `viking standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`, resistance:70 },
      { id: 'ray1', extraClass: 'viking', resistance: 50 },
      { id: 'ray2', extraClass: 'viking', resistance: -25 },
      { id: 'ray3', extraClass: 'viking', resistance: 70 },
      { id: 'particle', extraClass: 'viking', resistance: -20, shouldParallaxVertical: true },
      { id: 'snow', particleEffect: snowParticles },
      { id: 'snow-close', particleEffect: snowCloseParticles },
    ];

    const tddLayerInfo = [
      { id: 'bg', extraClass: 'tdd', resistance: 90 },
      { id: 'layer3', extraClass: 'tdd', resistance: 70 },
      { id: 'layer2', extraClass: 'tdd', resistance: 60 },
      { id: 'layer1', extraClass: 'tdd', resistance: 50 },
      { id: 'char', extraClass: `tdd standing__${Race[selectedRace.id]}--${Gender[selectedGender]}`, resistance: 60 },
      { id: 'ray1', extraClass: 'tdd', resistance: 40 },
      { id: 'ray2', extraClass: 'tdd', resistance: -15 },
      { id: 'ray3', extraClass: 'tdd', resistance: -60 },
      { id: 'particle', extraClass: 'tdd', resistance: -40,  shouldParallaxVertical: true },
      { id: 'glowOrbs', particleEffect: glowyOrbsParticles },
    ];

    let layerInfo;
    let miscInfo;

    switch (Faction[selectedFaction.shortName]) {
      case Faction.Arthurian: {
        layerInfo = arthurianLayerInfo;
        miscInfo = () => <div className='clouds arthurian'></div>;
        break;
      }
      case Faction.Viking: {
        layerInfo = vikingLayerInfo;
        miscInfo = () => <div className='clouds viking'></div>;
        break;
      }
      case Faction.TDD: {
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
        layerInfo={layerInfo}
        renderMisc={miscInfo}
      />
    );
  }
}

export default RaceVisualEffects;
