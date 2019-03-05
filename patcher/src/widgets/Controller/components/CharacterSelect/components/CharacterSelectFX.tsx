/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import VisualEffects from '../../../../../components/VisualEffects/VisualEffects';
import { view } from '../../../../../components/OverlayView';
import snowParticles from '../../../../../widgets/CharacterCreation/particles/snowParticles';
import glowyOrbsParticles from '../../../../../widgets/CharacterCreation/particles/glowyOrbsParticles';
import dustParticles from '../../../../../widgets/CharacterCreation/particles/dustParticles';
import { Race, Faction, Archetype } from 'gql/interfaces';

const Container = styled.div`
  transition: opacity .7s linear;
`;

export interface Props {
  selectedRace: { id: Race };
  selectedFaction: { id: Faction };
  selectedClass: { id: Archetype };
  hidden: boolean;
  effectsOff?: boolean;
}

export interface State {
  disableParallax: boolean;
}

export class CharacterSelectEffects extends React.PureComponent<Props, State> {
  private eventHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      disableParallax: false,
    };
  }

  public render() {
    const { selectedRace, hidden } = this.props;
    const arthurianLayerInfo = [
      { src: 'images/visualfx/art/art-layer2.png', id: 'arthurian', resistance: 120 },
      { src: 'images/visualfx/art/art-layer1.png', id: 'arthurian',resistance: 90 },
      { id: 'dust', particleEffect: dustParticles },
      { src: 'images/visualfx/ray-1.png', id: 'ray1 arthurian',resistance: 40 },
      { src: 'images/visualfx/ray-2.png', id: 'ray2 arthurian',resistance: -15 },
      { src: 'images/visualfx/ray-3.png', id: 'ray3 arthurian', resistance: -60 },
      { src: 'images/visualfx/art/art-veil.png', id: 'veil arthurian' },
      { src: 'images/visualfx/art/art-veil2.png', id: 'veil2 arthurian', resistance: 200 },
      { src: 'images/visualfx/art/art-particle.png', id: 'particle arthurian', resistance: -50 },
    ];

    const arthurianPictLayerInfo = [
      { src: 'images/visualfx/art/pict/art2-bg.png', id: 'bg arthurian-pict',resistance: 120 },
      { src: 'images/visualfx/art/pict/art2-layer1.png', id: 'layer1 arthurian-pict',resistance: 90 },
      { id: 'dust', particleEffect: dustParticles },
      { src: 'images/visualfx/ray-1.png', id: 'ray1 arthurian pict',resistance: 40 },
      { src: 'images/visualfx/ray-2.png', id: 'ray2 arthurian pict',resistance: -15 },
      { src: 'images/visualfx/ray-3.png', id: 'ray3 arthurian pict', resistance: -60 },
      { src: 'images/visualfx/art/art-veil.png', id: 'veil arthurian' },
      { src: 'images/visualfx/art/art-veil2.png', id: 'veil2 arthurian', resistance: 200 },
      { src: 'images/visualfx/art/art-particle.png', id: 'particle arthurian', resistance: -50 },
    ];

    const vikingLayerInfo = [
      { src: 'images/visualfx/vik/vik-bg.png', id: 'bg viking', resistance: 120 },
      { src: 'images/visualfx/vik/vik-layer2.png', id: 'layer2 viking', resistance: 70 },
      { src: 'images/visualfx/vik/vik-layer1.png', id: 'layer1 viking', resistance: 50 },
      { id: 'snow', particleEffect: snowParticles },
      { src: 'images/visualfx/ray-1.png', id: 'ray1 viking', resistance: 40 },
      { src: 'images/visualfx/ray-2.png', id: 'ray2 viking', resistance: -15 },
      { src: 'images/visualfx/ray-3.png', id: 'ray3 viking', resistance: -60 },
      { src: 'images/visualfx/vik/vik-veil.png', id: 'veil viking', resistance: 200 },
      { src: 'images/visualfx/vik/vik-veil2.png', id: 'veil2 viking' },
      { src: 'images/visualfx/vik/vik-particle.png', id: 'particle viking', resistance: -50 },
    ];

    const vikingValkyrieLayerInfo = [
      { src: 'images/visualfx/vik/valkyrie/vik2-bg.png', id: 'bg viking-valkyrie', resistance: 120 },
      { src: 'images/visualfx/vik/valkyrie/vik2-layer2.png', id: 'layer2 viking-valkyrie', resistance: 70 },
      { src: 'images/visualfx/vik/valkyrie/vik2-layer1.png', id: 'layer1 viking-valkyrie', resistance: 50 },
      { id: 'snow', particleEffect: snowParticles },
      { src: 'images/visualfx/ray-1.png', id: 'ray1 viking', resistance: 40 },
      { src: 'images/visualfx/ray-2.png', id: 'ray2 viking', resistance: -15 },
      { src: 'images/visualfx/ray-3.png', id: 'ray3 viking', resistance: -60 },
      { src: 'images/visualfx/vik/vik-veil.png', id: 'veil viking', resistance: 200 },
      { src: 'images/visualfx/vik/vik-veil2.png', id: 'veil2 viking' },
      { src: 'images/visualfx/vik/vik-particle.png', id: 'particle viking', resistance: -50 },
    ];

    const tddLayerInfo = [
      { src: 'images/visualfx/tdd/tdd-bg.png', id: 'bg tdd', resistance: 70 },
      { src: 'images/visualfx/tdd/tdd-layer3.png', id: 'layer3 tdd', resistance: 80 },
      { id: 'glowOrbs', particleEffect: glowyOrbsParticles },
      { src: 'images/visualfx/tdd/tdd-layer2.png', id: 'layer2 tdd', resistance: 100 },
      { src: 'images/visualfx/ray-1.png', id: 'ray1 tdd', resistance: 40 },
      { src: 'images/visualfx/ray-2.png', id: 'ray2 tdd', resistance: -15 },
      { src: 'images/visualfx/ray-3.png', id: 'ray3 tdd', resistance: -60 },
      { src: 'images/visualfx/tdd/tdd-veil.png', id: 'veil tdd', resistance: 200,  shouldParallaxVertical: true },
      { src: 'images/visualfx/tdd/tdd-veil2.png', id: 'veil2 tdd' },
    ];

    const tddHumanLayerInfo = [
      { src: 'images/visualfx/tdd/human/tdd2-bg.png', id: 'bg tdd-human', resistance: 70 },
      { src: 'images/visualfx/tdd/human/tdd2-layer2.png', id: 'layer2 tdd-human', resistance: 80 },
      { id: 'glowOrbs', particleEffect: glowyOrbsParticles },
      { src: 'images/visualfx/tdd/human/tdd2-layer1.png', id: 'layer1 tdd-human', resistance: 100 },
      { src: 'images/visualfx/ray-1.png', id: 'ray1 tdd', resistance: 40 },
      { src: 'images/visualfx/ray-2.png', id: 'ray2 tdd', resistance: -15 },
      { src: 'images/visualfx/ray-3.png', id: 'ray3 tdd', resistance: -60 },
      { src: 'images/visualfx/tdd/human/tdd2-veil.png', id: 'veil tdd-human', resistance: 200 },
      { src: 'images/visualfx/tdd/tdd-veil2.png', id: 'veil2 tdd' },
    ];

    let layerInfo;
    // let miscInfo;

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
      <Container style={{ opacity: hidden ? 0 : 1 }}>
        <VisualEffects
          id='character-select-fx-parallax'
          effectsOff={this.props.effectsOff}
          disableParallax={this.state.disableParallax}
          layerInfo={layerInfo}
          renderMisc={() => null}
        />
      </Container>
    );
  }

  public componentDidMount() {
    this.eventHandle = game.on('view-content', this.handleViewContent);
  }

  public componentWillUnmount() {
    this.eventHandle.clear();
  }

  private handleViewContent = (viewContent: view) => {
    if (viewContent !== view.CHARACTERSELECT && !this.state.disableParallax) {
      this.setState({ disableParallax: true });
    }

    if (viewContent !== view.CHARACTERCREATION && this.state.disableParallax) {
      this.setState({ disableParallax: false });
    }
  }
}

export default CharacterSelectEffects;
