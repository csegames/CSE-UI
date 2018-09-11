/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Faction, Race, Archetype } from '@csegames/camelot-unchained';

import VisualEffects from '../../../../../components/VisualEffects/VisualEffects';
import snowParticles from '../../../../../widgets/CharacterCreation/particles/snowParticles';
import glowyOrbsParticles from '../../../../../widgets/CharacterCreation/particles/glowyOrbsParticles';
import dustParticles from '../../../../../widgets/CharacterCreation/particles/dustParticles';

export interface CharacterSelectEffectsProps {
  selectedRace: { id: Race };
  selectedFaction: { id: Faction };
  selectedClass: { id: Archetype };
  hidden: boolean;
  effectsOff?: boolean;
}

export interface CharacterSelectEffectsState {
}

export class CharacterSelectEffects extends React.Component<CharacterSelectEffectsProps, CharacterSelectEffectsState> {
  public render() {
    const { selectedRace, hidden } = this.props;
    const arthurianLayerInfo = [
      { id: 'bg', extraClass: 'arthurian', resistance: 120 },
      { id: 'layer1', extraClass: 'arthurian',resistance: 90 },
      { id: 'dust', particleEffect: dustParticles },
      { id: 'ray1', extraClass: 'arthurian',resistance: 40 },
      { id: 'ray2', extraClass: 'arthurian',resistance: -15 },
      { id: 'ray3', extraClass: 'arthurian', resistance: -60 },
      { id: 'veil', extraClass: 'arthurian' },
      { id: 'veil2', extraClass: 'arthurian', resistance: 200,  shouldParallaxVertical: true },
      { id: 'particle', extraClass: 'arthurian', resistance: -50, shouldParallaxVertical: true },
    ];

    const arthurianPictLayerInfo = [
      { id: 'bg', extraClass: 'arthurian-pict',resistance: 120 },
      { id: 'layer1', extraClass: 'arthurian-pict',resistance: 90 },
      { id: 'dust', particleEffect: dustParticles },
      { id: 'ray1', extraClass: 'arthurian pict',resistance: 40 },
      { id: 'ray2', extraClass: 'arthurian pict',resistance: -15 },
      { id: 'ray3', extraClass: 'arthurian pict', resistance: -60 },
      { id: 'veil', extraClass: 'arthurian' },
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
      { id: 'veil2', extraClass: 'viking' },
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
      <div style={{ transition: 'opacity .7s linear', opacity: hidden ? 0 : 1 }}>
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

export default CharacterSelectEffects;
