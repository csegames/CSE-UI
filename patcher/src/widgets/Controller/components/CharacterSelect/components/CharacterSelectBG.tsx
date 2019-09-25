/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css, cx } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import CharacterSelectFX from './CharacterSelectFX';
import NoCharacterSelectFX from './NoCharacterSelectFX';
import { getCharImage, isSpecialClass } from '../../../../../lib/characterImages';
import { SimpleCharacter, Race, Archetype, Faction } from 'gql/interfaces';

const CharTransitionAnim = css`
  -webkit-animation: charTransitionAnim 1s ease forwards;
  animation: charTransitionAnim 1s ease forwards;

  @keyframes charTransitionAnim {
    from {
      left: 10%;
      opacity: 0;
    }
    to {
      left: 15%;
      opacity: 1;
    }
  }
`;

const CharNameTransitionAnim = css`
  -webkit-animation: charTransitionNameAnim 1s ease forwards;
  animation: charTransitionNameAnim 1s ease forwards;

  @keyframes charTransitionNameAnim {
    from {
      left: 41%;
      opacity: 0;
    }
    to {
      left: 38%;
      opacity: 1;
    }
  }
`;

const CharBaseTransitionAnim = css`
  -webkit-animation: charTransitionBaseAnim 1s ease forwards;
  animation: charTransitionBaseAnim 1s ease forwards;

  @keyframes charTransitionBaseAnim {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const CharacterInfoOverlay = styled.div`
  cursor: default;
  display: block;
  position: absolute;
  bottom: 10%;
  z-index: 11;
  color: white;
  left: 41%;
`;

const CharacterName = styled.div`
  font-family: "Caudex";
  font-size: 28px;
`;

const CharacterMetaInfo = styled.div`
  line-height: 20px;
  font-family: "Titillium Web";
  font-size: 17px;
  font-size: 1.1vw;
  opacity:.7;
`;

const CharImg = styled.img`
  position: absolute;
  width: auto;
  z-index: 2;
  bottom: 25px;

  &.websiteImage {
    margin-left: 10%;
  }
`;

const CharBase = styled.div`
  position: absolute;
  background-position: 35% bottom;
  background-size: contain;
  background-repeat: no-repeat;
  height: 20%;
  width: 100%;
  top: auto !important;
  bottom: 0px !important;
  right: 0px;
  z-index: 1;
  &.arthurian {
    background-image: url(/ui/images/visualfx/art/art-base.png);
  }
  &.viking {
    background-image: url(/ui/images/visualfx/vik/vik-base.png);
  }
  &.tdd {
    background-image: url(/ui/images/visualfx/tdd/tdd-base_edit02.png);
  }
`;

export interface CharacterSelectBGProps {
  selectedCharacter: SimpleCharacter;
}

export interface CharacterSelectBGState {
  firstChar: SimpleCharacter;
  visualFXChar: SimpleCharacter;
  shouldTransition: boolean;
  visualFXTransition: boolean;
  characterNameFontSize: number;
}

class CharacterSelectBG extends React.PureComponent<CharacterSelectBGProps, CharacterSelectBGState> {
  private vfxCharTimeout: any;
  private transitionTimeout: any;
  private backgroundTimeout: any;
  private charTimeout: any;

  constructor(props: CharacterSelectBGProps) {
    super(props);
    this.state = {
      firstChar: null,
      visualFXChar: null,
      shouldTransition: false,
      visualFXTransition: false,
      characterNameFontSize: 2,
    };
  }

  public render() {
    const visualFXChar = this.state.visualFXChar || this.state.firstChar;
    const isWebsiteImageClass = this.isWebsiteImage() ? 'websiteImage' : '';
    const { selectedCharacter } = this.props;
    if (selectedCharacter) {
      const { faction } = selectedCharacter;
      let hidden = false;
      if (this.state.visualFXTransition) {
        hidden = true;
      }

      return (
        <div id='char-select-fx'>
          <CharacterSelectFX
            hidden={hidden}
            selectedFaction={{ id: visualFXChar && visualFXChar.faction }}
            selectedRace={{ id: visualFXChar && visualFXChar.race }}
            selectedClass={{ id: visualFXChar && visualFXChar.archetype }}
          />
          <CharImg
            className={cx('bgelement char', this.state.shouldTransition ? CharTransitionAnim : '', isWebsiteImageClass)}
            src={getCharImage(selectedCharacter)}
            style={{
              height: selectedCharacter.race === Race.Luchorpan ||
                selectedCharacter.archetype === Archetype.WintersShadow ? '65%' : '80%',
              opacity: this.state.visualFXChar === null ? 1 : 0,
            }}
          />
          {!isSpecialClass(selectedCharacter.archetype) &&
            <CharBase
              className={cx(Faction[faction].toLowerCase(), this.state.shouldTransition ? CharBaseTransitionAnim : '')}
              style={{ opacity: this.state.visualFXChar === null ? 1 : 0 }}
            />
          }
          <CharacterInfoOverlay
            className={this.state.shouldTransition ? CharNameTransitionAnim : ''}
            style={{
              opacity: this.state.visualFXChar === null ? 1 : 0,
            }}>
            <CharacterName style={{ fontSize: `${this.state.characterNameFontSize}vw` }}>
              {selectedCharacter.name}
            </CharacterName>
            <CharacterMetaInfo>
              {Archetype[selectedCharacter.archetype]} - {selectedCharacter.race}
            </CharacterMetaInfo>
          </CharacterInfoOverlay>
        </div>
      );
    } else {
      return (
        <div id='char-select-fx'>
          <NoCharacterSelectFX />
        </div>
      );
    }
  }

  public componentDidMount() {
    this.setState({ firstChar: this.props.selectedCharacter });
    this.playTransitionAnimation();
  }

  public componentWillReceiveProps(nextProps: CharacterSelectBGProps) {
    if (this.props.selectedCharacter && nextProps.selectedCharacter) {
      if (nextProps.selectedCharacter.name.length > 17) {
        this.setState({ characterNameFontSize: 1.5 });
      } else if (this.state.characterNameFontSize === 1.5 && nextProps.selectedCharacter.name.length < 17) {
        this.setState({ characterNameFontSize: 2 });
      }
      if (this.props.selectedCharacter.id !== nextProps.selectedCharacter.id) {
        this.playTransitionAnimation();
        if ((this.props.selectedCharacter.faction !== nextProps.selectedCharacter.faction) ||
            (this.props.selectedCharacter.race !== nextProps.selectedCharacter.race)) {
          this.updateVisualFXChar(nextProps.selectedCharacter);
        }
      }
    }
  }

  private updateVisualFXChar = (nextChar: SimpleCharacter) => {
    if (this.vfxCharTimeout) {
      clearTimeout(this.vfxCharTimeout);
      this.vfxCharTimeout = null;
    }

    if (this.backgroundTimeout) {
      clearTimeout(this.backgroundTimeout);
      this.backgroundTimeout = null;
    }

    if (this.charTimeout) {
      clearTimeout(this.charTimeout);
      this.charTimeout = null;
    }
    this.vfxCharTimeout = setTimeout(() => {
      this.setState({  visualFXTransition: true });
      this.charTimeout = setTimeout(() => this.setState({ visualFXChar: nextChar }), 700);
      this.backgroundTimeout = setTimeout(() => this.setState({ visualFXTransition: false }), 720);
    }, 299);
  }

  private playTransitionAnimation = () => {
    clearTimeout(this.transitionTimeout);
    this.setState({ shouldTransition: false });
    this.transitionTimeout = setTimeout(() => this.setState({ shouldTransition: true }), 1);
  }

  private isWebsiteImage = () => {
    const { selectedCharacter } = this.props;
    if (!selectedCharacter) return false;

    const archetype = Archetype[selectedCharacter.archetype].toLowerCase();
    if (archetype === 'minstrel' ||
      archetype === 'flamewarden' ||
      archetype === 'darkfool' ||
      archetype === 'druid' ||
      archetype === 'skald' ||
      archetype === 'waveweaver') {
      return true;
    }

    return false;
  }
}

export default CharacterSelectBG;
