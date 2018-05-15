/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { includes } from 'lodash';
import styled, { css, keyframes, cx } from 'react-emotion';
import { webAPI, Race, Archetype, Gender, Faction } from '@csegames/camelot-unchained';
import CharacterSelectFX from './CharacterSelectFX';
import NoCharacterSelectFX from './NoCharacterSelectFX';
import CharacterImages from '../../../../../lib/characterImages';

const charTransitionAnim = keyframes`
  from {
    left: 10%;
    opacity: 0;
  }

  to {
    left: 15%;
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

const charTransitionBaseAnim = keyframes`
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
  -webkit-animation: ${charTransitionBaseAnim} 1s ease forwards;
  animation: ${charTransitionBaseAnim} 1s ease forwards;
`;

const CharacterInfoOverlay = styled('div')`
  cursor: default;
  display: block;
  position: absolute;
  bottom: 10%;
  z-index: 11;
  color: white;
  left: 41%;
  opacity: ${props => props.opacity};
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

const CharImg = styled('img')`
  left: 10%;
  position: absolute;
  width: auto;
  z-index: 2;
  opacity: ${props => props.opacity};
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
  opacity: ${props => props.opacity};
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
  firstChar: webAPI.SimpleCharacter;
  visualFXChar: webAPI.SimpleCharacter;
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
    if (visualFXChar) {
      const { selectedCharacter } = this.props;
      const { faction, race, gender, archetype } = selectedCharacter;
      const raceString = includes(Race[race].toLowerCase(), 'human') ? webAPI.raceString(race) : Race[race];
      const charImgClass = [`bgelement char`];
      const charBaseClass = [Faction[faction].toLowerCase()];
      const charNameClass = [];
      const charInfo = `${raceString}${Gender[gender]}${Archetype[archetype]}`;

      if (this.state.shouldTransition) {
        charNameClass.push(CharNameTransitionAnim);
        charImgClass.push(CharTransitionAnim);
        charBaseClass.push(CharBaseTransitionAnim);
      }
      let hidden = false;
      if (this.state.visualFXTransition) {
        hidden = true;
      }

      return (
        <div id='char-select-fx'>
          <CharacterSelectFX
            hidden={hidden}
            key={visualFXChar.faction}
            selectedFaction={{ id: visualFXChar.faction }}
            selectedRace={{ id: visualFXChar.race }}
            selectedClass={{ id: visualFXChar.archetype }}
          />
          <CharImg
            className={cx(charImgClass)}
            src={CharacterImages[charInfo]}
            height={selectedCharacter.race === Race.Luchorpan ||
              selectedCharacter.archetype === Archetype.WintersShadow ? 65 : 80}
            opacity={this.state.visualFXChar === null ? 1 : 0}
          />
          <CharBase className={cx(charBaseClass)} opacity={this.state.visualFXChar === null ? 1 : 0} />
          <CharacterInfoOverlay className={cx(charNameClass)} opacity={this.state.visualFXChar === null ? 1 : 0}>
            <CharacterName fontSize={this.state.characterNameFontSize}>{selectedCharacter.name}</CharacterName>
            <CharacterMetaInfo>
              {Archetype[selectedCharacter.archetype]} - {webAPI.raceString(selectedCharacter.race)}
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

  private updateVisualFXChar = (nextChar: webAPI.SimpleCharacter) => {
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
}

export default CharacterSelectBG;
