/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css, keyframes, cx } from 'react-emotion';
import { webAPI, Race, Archetype, Gender, Faction } from 'camelot-unchained';
import CharacterSelectFX from './CharacterSelectFX';
import NoCharacterSelectFX from './NoCharacterSelectFX';

const charTransitionAnim = keyframes`
  from {
    background-position: 25%;
    opacity: 0;
  }

  to {
    background-position: 35%;
    opacity: 1;
  }
`;

const charTransitionNameAnim = keyframes`
  from {
    left: 41%;
    opacity: 0;
  }

  to {
    left: 38%;
    opacity: 1;
  }
`;

const charTransitionBGAnim = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const CharTransitionAnim = css`
  -webkit-animation: ${charTransitionAnim} 1s ease forwards;
  animation: ${charTransitionAnim} 1s ease forwards;
`;

const CharNameTransitionAnim = css`
  -webkit-animation: ${charTransitionNameAnim} 1s ease forwards;
  animation: ${charTransitionNameAnim} 1s ease forwards;
`;

const CharBaseTransitionAnim = css`
  -webkit-animation: ${charTransitionBGAnim} 1s ease forwards;
  animation: ${charTransitionBGAnim} 1s ease forwards;
`;

const CharBGTransitionAnim = css`
  -webkit-animation: ${charTransitionBGAnim} 3s ease forwards;
  animation: ${charTransitionBGAnim} 3s ease forwards;
`;

const CharacterInfoOverlay = styled('div')`
  display: block;
  position: absolute;
  bottom: 10%;
  left: 50%;
  z-index: 11;
  color: white;
`;

const CharacterName = styled('div')`
  font-family: "Caudex";
  font-size: 28px;
  font-size: ${props => props.fontSize}vw;
`;

const CharacterMetaInfo = styled('div')`
  line-height: 20px;
  font-family: "Titillium Web";
  font-size: 17px;
  font-size: 1.1vw;
  opacity:.7;
`;

const CharImg = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-repeat: no-repeat !important;
  background-position: 35% !important;
  background-size: contain !important;
  height: ${props => props.height || 80}%;
  bottom: 25px;
`;

const CharBase = styled('div')`
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
    background-image: url(images/visualfx/art/art-base.png);
  }
  &.viking {
    background-image: url(images/visualfx/vik/vik-base.png);
  }
  &.tdd {
    background-image: url(images/visualfx/tdd/tdd-base_edit02.png);
  } 
`;

export interface CharacterSelectBGProps {
  selectedCharacter: webAPI.SimpleCharacter;
}

export interface CharacterSelectBGState {
  shouldTransition: boolean;
  visualFXTransition: boolean;
  visualFXChar: webAPI.SimpleCharacter;
  characterNameFontSize: number;
}

class CharacterSelectBG extends React.PureComponent<CharacterSelectBGProps, CharacterSelectBGState> {
  private vfxCharTimeout: any;
  private transitionTimeout: any;
  private backgroundTimeout: any;

  constructor(props: CharacterSelectBGProps) {
    super(props);
    this.state = {
      shouldTransition: false,
      visualFXTransition: false,
      visualFXChar: null,
      characterNameFontSize: 2,
    };
  }

  public render() {
    const visualFXChar = this.state.visualFXChar || this.props.selectedCharacter;

    if (visualFXChar) {
      const { selectedCharacter } = this.props;
      const { faction, race, gender } = selectedCharacter;
      const charImgClass = [`bgelement char ${Faction[faction].toLowerCase()} standing__${Race[race]}--${Gender[gender]}`];
      const charBaseClass = [Faction[faction].toLowerCase()];
      const charNameClass = [];
      const charBGClass = [];

      if (this.state.shouldTransition) {
        charNameClass.push(CharNameTransitionAnim);
        charImgClass.push(CharTransitionAnim);
        charBaseClass.push(CharBaseTransitionAnim);
      }

      if (this.state.visualFXTransition) {
        charBGClass.push(CharBGTransitionAnim);
      }

      return (
        <div id='char-select-fx'>
          <CharacterSelectFX
            fadeClass={cx(charBGClass)}
            key={visualFXChar.faction}
            selectedFaction={{ id: visualFXChar.faction }}
            selectedRace={{ id: visualFXChar.race }}
            selectedGender={visualFXChar.gender}
          />
          <CharImg className={cx(charImgClass)} height={selectedCharacter.race === Race.Luchorpan ? 65 : 80} />
          <CharBase className={cx(charBaseClass)} />
          <CharacterInfoOverlay className={cx(charNameClass)}>
            <CharacterName fontSize={this.state.characterNameFontSize}>{selectedCharacter.name}</CharacterName>
            <CharacterMetaInfo>{Archetype[selectedCharacter.archetype]} - {Race[selectedCharacter.race]}</CharacterMetaInfo>
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
            (this.props.selectedCharacter.gender !== nextProps.selectedCharacter.gender)) {
          this.updateVisualFXChar(nextProps.selectedCharacter);
        }
      }
    }
  }

  private updateVisualFXChar = (nextChar: webAPI.SimpleCharacter) => {
    clearTimeout(this.vfxCharTimeout);
    this.vfxCharTimeout = setTimeout(() => {
      if (this.backgroundTimeout) {
        clearTimeout(this.backgroundTimeout);
        this.backgroundTimeout = null;
      }
      this.setState({ visualFXChar: nextChar, visualFXTransition: true });
      this.backgroundTimeout = setTimeout(() => this.setState({ visualFXTransition: false }), 3000);
    }, 299);
  }

  private playTransitionAnimation = () => {
    clearTimeout(this.transitionTimeout);
    this.setState({ shouldTransition: false });
    this.transitionTimeout = setTimeout(() => this.setState({ shouldTransition: true }), 1);
  }
}

export default CharacterSelectBG;
